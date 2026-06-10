/* eslint-disable @typescript-eslint/no-explicit-any */

const LS_API = "https://api.lemonsqueezy.com/v1/licenses";
const CACHE_PREFIX = "seo-license";
const CACHE_VALID = `${CACHE_PREFIX}-valid`;
const CACHE_TIMESTAMP = `${CACHE_PREFIX}-timestamp`;
const VALIDATION_TTL = 3600000;
const API_TIMEOUT = 10000;

interface LicenseResponse {
  valid?: boolean;
  error?: string;
  [key: string]: any;
}

class LicenseManager {
  private cacheValid: boolean | null = null;

  private lastValidationTime: number | null = null;

  constructor() {
    this.loadCache();
  }

  private loadCache(): void {
    try {
      if (typeof localStorage === "undefined") return;

      const cached = localStorage.getItem(CACHE_VALID);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP);

      if (cached === "true") {
        this.cacheValid = true;
        this.lastValidationTime = timestamp ? parseInt(timestamp, 10) : null;
      } else if (cached === "false") {
        this.cacheValid = false;
        this.lastValidationTime = timestamp ? parseInt(timestamp, 10) : null;
      }
    } catch {
      this.cacheValid = null;
    }
  }

  private saveCache(isValid: boolean): void {
    try {
      if (typeof localStorage === "undefined") return;

      const now = Date.now();
      localStorage.setItem(CACHE_VALID, String(isValid));
      localStorage.setItem(CACHE_TIMESTAMP, String(now));

      this.cacheValid = isValid;
      this.lastValidationTime = now;
    } catch {
      // cache unavailable
    }
  }

  private clearCache(): void {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.removeItem(CACHE_VALID);
      localStorage.removeItem(CACHE_TIMESTAMP);
      this.cacheValid = null;
      this.lastValidationTime = null;
    } catch {
      // cache unavailable
    }
  }

  private isCacheValid(): boolean {
    if (this.cacheValid === null || this.lastValidationTime === null) {
      return false;
    }

    const age = Date.now() - this.lastValidationTime;
    return age < VALIDATION_TTL;
  }

  private async fetchWithRetry(url: string, options: RequestInit, retries = 0): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (retries < 2) {
        const delay = 1000 * 2 ** retries;
        await new Promise<void>((resolve) => {
          setTimeout(resolve, delay);
        });
        return this.fetchWithRetry(url, options, retries + 1);
      }
      throw error;
    }
  }

  async isLicenseValid(licenseKey: string): Promise<boolean> {
    if (!licenseKey?.trim()) {
      return false;
    }

    // Check cache first
    if (this.isCacheValid() && this.cacheValid !== null) {
      return this.cacheValid;
    }

    try {
      const response = await this.fetchWithRetry(`${LS_API}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          license_key: licenseKey,
        }),
      });

      if (!response.ok) {
        this.saveCache(false);
        return false;
      }

      const data: LicenseResponse = await response.json();

      const isValid = data.valid === true;
      this.saveCache(isValid);
      return isValid;
    } catch {
      return false;
    }
  }

  needsRevalidation(): boolean {
    return !this.isCacheValid();
  }

  getDebugInfo(): Record<string, any> {
    return {
      cacheValid: this.cacheValid,
      lastValidation: this.lastValidationTime
        ? new Date(this.lastValidationTime).toISOString()
        : null,
      needsRevalidation: this.needsRevalidation(),
    };
  }

  reset(): void {
    this.clearCache();
  }
}

export default new LicenseManager();
