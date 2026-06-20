/* eslint-disable @typescript-eslint/no-explicit-any */

const CACHE_PREFIX = "seo-license";
const CACHE_VALID = `${CACHE_PREFIX}-valid`;
const CACHE_TIMESTAMP = `${CACHE_PREFIX}-timestamp`;
const VALIDATION_TTL = 3_600_000;
const API_TIMEOUT = 10_000;

interface ValidateResponse {
  valid: boolean;
  edition?: string;
  reason?: string;
}

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), API_TIMEOUT);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

class LicenseManager {
  private validateUrl: string | null = null;

  private projectId: string | null = null;

  private cacheValid: boolean | null = null;

  private lastValidationTime: number | null = null;

  constructor() {
    this.loadCache();
  }

  configure(options: { validateUrl: string; projectId: string }): void {
    if (options.validateUrl !== this.validateUrl || options.projectId !== this.projectId) {
      this.validateUrl = options.validateUrl;
      this.projectId = options.projectId;
      this.clearCache();
    }
  }

  async isLicenseValid(licenseKey: string): Promise<boolean> {
    if (!licenseKey?.trim()) return false;

    if (!this.validateUrl || !this.projectId) {
      return false;
    }

    if (this.isCacheValid() && this.cacheValid !== null) {
      return this.cacheValid;
    }

    try {
      const response = await fetchWithTimeout(this.validateUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseKey: licenseKey.trim(),
          projectId: this.projectId,
        }),
      });

      if (!response.ok) {
        this.saveCache(false);
        return false;
      }

      const data: ValidateResponse = await response.json();
      const valid = data.valid === true;
      this.saveCache(valid);
      return valid;
    } catch {
      return this.cacheValid ?? false;
    }
  }

  needsRevalidation(): boolean {
    return !this.isCacheValid();
  }

  reset(): void {
    this.clearCache();
  }

  getDebugInfo(): Record<string, any> {
    return {
      validateUrl: this.validateUrl,
      projectId: this.projectId,
      cacheValid: this.cacheValid,
      lastValidation: this.lastValidationTime
        ? new Date(this.lastValidationTime).toISOString()
        : null,
      needsRevalidation: this.needsRevalidation(),
    };
  }

  private isCacheValid(): boolean {
    if (this.cacheValid === null || this.lastValidationTime === null) return false;
    return Date.now() - this.lastValidationTime < VALIDATION_TTL;
  }

  private loadCache(): void {
    try {
      if (typeof localStorage === "undefined") return;
      const cached = localStorage.getItem(CACHE_VALID);
      const ts = localStorage.getItem(CACHE_TIMESTAMP);
      if (cached === "true" || cached === "false") {
        this.cacheValid = cached === "true";
        this.lastValidationTime = ts ? parseInt(ts, 10) : null;
      }
    } catch {
      // localStorage not available in SSR
    }
  }

  private saveCache(valid: boolean): void {
    const now = Date.now();
    this.cacheValid = valid;
    this.lastValidationTime = now;
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(CACHE_VALID, String(valid));
      localStorage.setItem(CACHE_TIMESTAMP, String(now));
    } catch {
      // ignore
    }
  }

  private clearCache(): void {
    this.cacheValid = null;
    this.lastValidationTime = null;
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.removeItem(CACHE_VALID);
      localStorage.removeItem(CACHE_TIMESTAMP);
    } catch {
      // ignore
    }
  }
}

export default new LicenseManager();
