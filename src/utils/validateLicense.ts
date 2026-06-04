const LS_API = "https://api.lemonsqueezy.com/v1/licenses";
const INSTANCE_KEY = "seo-plugin-ls-instance";
const KEY_FINGERPRINT = "seo-plugin-ls-key";

function getStoredInstanceId(licenseKey: string): string | null {
  try {
    const storedKey = localStorage.getItem(KEY_FINGERPRINT);
    if (storedKey !== licenseKey.slice(0, 16)) {
      // Key changed — wipe the old instance so we activate fresh
      localStorage.removeItem(INSTANCE_KEY);
      localStorage.removeItem(KEY_FINGERPRINT);
      return null;
    }
    return localStorage.getItem(INSTANCE_KEY);
  } catch {
    return null;
  }
}

function storeInstanceId(id: string, licenseKey: string): void {
  try {
    localStorage.setItem(INSTANCE_KEY, id);
    localStorage.setItem(KEY_FINGERPRINT, licenseKey.slice(0, 16));
  } catch {
    // storage may be unavailable
  }
}

async function activateLicense(licenseKey: string, projectId: string): Promise<string | null> {
  try {
    const res = await fetch(`${LS_API}/activate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        license_key: licenseKey,
        instance_name: `Sanity Studio — ${projectId}`,
      }),
    });
    const data = await res.json();
    if (data?.activated && data?.instance?.id) {
      storeInstanceId(data.instance.id, licenseKey);
      return data.instance.id;
    }
    return null;
  } catch {
    return null;
  }
}

async function callValidate(licenseKey: string, instanceId?: string): Promise<boolean> {
  const body: Record<string, string> = { license_key: licenseKey };
  if (instanceId) body.instance_id = instanceId;

  const res = await fetch(`${LS_API}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data?.valid === true;
}

export default async function validateLicense(
  licenseKey: string,
  projectId: string,
): Promise<boolean> {
  if (!licenseKey?.trim()) return false;

  try {
    const instanceId = getStoredInstanceId(licenseKey);

    if (instanceId) {
      const valid = await callValidate(licenseKey, instanceId);
      if (valid) return true;
    }

    // No instance yet — activate first then validate
    const newInstanceId = await activateLicense(licenseKey, projectId);
    if (!newInstanceId) {
      // Try validate without instance (key may already be activated elsewhere)
      return await callValidate(licenseKey);
    }

    storeInstanceId(newInstanceId, licenseKey);
    return await callValidate(licenseKey, newInstanceId);
  } catch {
    return false;
  }
}
