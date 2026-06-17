import { createHmac, timingSafeEqual } from "crypto";
// eslint-disable-next-line import/no-extraneous-dependencies
import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// ---------------------------------------------------------------------------
// Disable Vercel's default body parser so we can read the raw bytes and
// verify the HMAC-SHA256 signature from Lemon Squeezy.
// ---------------------------------------------------------------------------
export const config = { api: { bodyParser: false } };

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

// ---------------------------------------------------------------------------
// POST /api/webhooks/lemon-squeezy
// ---------------------------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }

  // ---- 1. Read the raw body -------------------------------------------
  let rawBody: Buffer;
  try {
    rawBody = await readRawBody(req);
  } catch {
    return res.status(400).end("Could not read body");
  }

  // ---- 2. Verify signature -------------------------------------------
  const signature = req.headers["x-signature"] as string | undefined;
  if (!signature || !verifySignature(rawBody, signature)) {
    return res.status(401).end("Invalid signature");
  }

  // ---- 3. Parse payload ----------------------------------------------
  let payload: LSWebhookPayload;
  try {
    payload = JSON.parse(rawBody.toString("utf8")) as LSWebhookPayload;
  } catch {
    return res.status(400).end("Invalid JSON");
  }

  const event = payload?.meta?.event_name;

  try {
    switch (event) {
      case "order_created":
        await handleOrderCreated(payload);
        break;

      case "license_key_created":
        await handleLicenseKeyCreated(payload);
        break;

      case "license_key_updated":
        await handleLicenseKeyUpdated(payload);
        break;

      case "license_key_deactivated":
        await handleLicenseKeyDeactivated(payload);
        break;

      default:
        // Acknowledge events we don't handle so LS stops retrying
        break;
    }
  } catch (err) {
    console.error(`[ls-webhook] Error handling ${event}:`, err);
    // Return 500 so Lemon Squeezy retries the delivery
    return res.status(500).end("Handler error");
  }

  return res.status(200).end("OK");
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

async function handleOrderCreated(payload: LSWebhookPayload) {
  const attrs = payload.data?.attributes ?? {};
  const item = attrs.first_order_item ?? {};

  const licenseKey: string | undefined = item.license_key;
  if (!licenseKey) return; // some products have no license key

  await upsertLicense({
    license_key: licenseKey,
    customer_email: attrs.user_email ?? attrs.customer_email ?? null,
    customer_name: attrs.user_name ?? null,
    order_id: String(payload.data?.id ?? ""),
    product_id: String(item.product_id ?? ""),
    status: "active",
    seats_limit: 1, // default; overridden by license_key_created if seats differ
    edition: "pro",
  });
}

async function handleLicenseKeyCreated(payload: LSWebhookPayload) {
  const attrs = payload.data?.attributes ?? {};
  const licenseKey: string | undefined = attrs.key;
  if (!licenseKey) return;

  await upsertLicense({
    license_key: licenseKey,
    order_id: String(attrs.order_id ?? ""),
    product_id: String(attrs.product_id ?? ""),
    status: mapLSStatus(attrs.status),
    seats_limit: attrs.activation_limit ?? 1,
    expires_at: attrs.expires_at ?? null,
    edition: "pro",
  });
}

async function handleLicenseKeyUpdated(payload: LSWebhookPayload) {
  const attrs = payload.data?.attributes ?? {};
  const licenseKey: string | undefined = attrs.key;
  if (!licenseKey) return;

  await supabase
    .from("licenses")
    .update({
      status: mapLSStatus(attrs.status),
      seats_limit: attrs.activation_limit ?? 1,
      expires_at: attrs.expires_at ?? null,
    })
    .eq("license_key", licenseKey);
}

async function handleLicenseKeyDeactivated(payload: LSWebhookPayload) {
  const licenseKey: string | undefined = payload.data?.attributes?.key;
  if (!licenseKey) return;

  await supabase.from("licenses").update({ status: "revoked" }).eq("license_key", licenseKey);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mapLSStatus(lsStatus: string | undefined): "active" | "expired" | "revoked" {
  if (lsStatus === "active" || lsStatus === "inactive") return "active";
  if (lsStatus === "expired") return "expired";
  return "revoked";
}

async function upsertLicense(data: Partial<LicenseRow> & { license_key: string }) {
  await supabase
    .from("licenses")
    .upsert(data, { onConflict: "license_key", ignoreDuplicates: false });
}

function verifySignature(body: Buffer, signature: string): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[ls-webhook] LEMON_SQUEEZY_WEBHOOK_SECRET is not set");
    return false;
  }
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}

function readRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// ---------------------------------------------------------------------------
// Types — minimal shapes we need from the Lemon Squeezy webhook payload
// ---------------------------------------------------------------------------
interface LSWebhookPayload {
  meta?: { event_name?: string; webhook_id?: string };
  data?: {
    id?: string | number;
    type?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributes?: Record<string, any>;
  };
}

interface LicenseRow {
  license_key: string;
  customer_email: string | null;
  customer_name: string | null;
  order_id: string;
  product_id: string;
  edition: string;
  status: "active" | "expired" | "revoked";
  seats_limit: number;
  expires_at: string | null;
}
