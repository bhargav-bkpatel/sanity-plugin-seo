// eslint-disable-next-line import/no-extraneous-dependencies
import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(204).end();
  }

  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method !== "POST") {
    return res.status(405).json({ valid: false, reason: "Method not allowed" });
  }

  const { licenseKey, projectId } = (req.body ?? {}) as {
    licenseKey?: string;
    projectId?: string;
  };

  if (!licenseKey?.trim() || !projectId?.trim()) {
    return res.status(400).json({ valid: false, reason: "licenseKey and projectId are required" });
  }

  const key = licenseKey.trim();
  const pid = projectId.trim();
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] ?? null;

  const { data: license, error: licErr } = await supabase
    .from("licenses")
    .select("id, status, seats_limit, expires_at, edition")
    .eq("license_key", key)
    .single();

  if (licErr || !license) {
    await log(key, pid, ip, false, "License not found");
    return res.status(200).json({ valid: false, reason: "License not found" });
  }

  if (license.status !== "active") {
    await log(key, pid, ip, false, `License is ${license.status}`);
    return res.status(200).json({ valid: false, reason: `License is ${license.status}` });
  }
  if (license.expires_at && new Date(license.expires_at) < new Date()) {
    await supabase.from("licenses").update({ status: "expired" }).eq("id", license.id);
    await log(key, pid, ip, false, "License expired");
    return res.status(200).json({ valid: false, reason: "License has expired" });
  }
  const { data: existingBinding } = await supabase
    .from("license_projects")
    .select("id")
    .eq("license_key", key)
    .eq("project_id", pid)
    .single();

  if (!existingBinding) {
    const { count } = await supabase
      .from("license_projects")
      .select("id", { count: "exact", head: true })
      .eq("license_key", key);

    const used = count ?? 0;
    const limit = license.seats_limit ?? 1;

    if (used >= limit) {
      await log(key, pid, ip, false, "Seat limit exceeded");
      return res.status(200).json({
        valid: false,
        reason: "Seat limit exceeded. Remove an existing project or purchase more seats.",
      });
    }

    const { error: insertErr } = await supabase
      .from("license_projects")
      .insert({ license_key: key, project_id: pid });

    if (insertErr && insertErr.code !== "23505") {
      await log(key, pid, ip, false, "Failed to bind project");
      return res.status(500).json({ valid: false, reason: "Internal error binding project" });
    }
  }

  await log(key, pid, ip, true, null);
  return res.status(200).json({ valid: true, edition: license.edition });
}

async function log(
  licenseKey: string,
  projectId: string,
  ip: string | null,
  valid: boolean,
  reason: string | null,
) {
  await supabase.from("usage_logs").insert({
    license_key: licenseKey,
    project_id: projectId,
    ip_address: ip,
    valid,
    reason,
  });
}
