/* eslint-disable @typescript-eslint/no-explicit-any, no-console, no-bitwise */

const LS_API = "https://api.lemonsqueezy.com/v1/licenses";
const CACHE_PREFIX = "seo-license";
const CACHE_INSTANCE = `${CACHE_PREFIX}-instance`;
const CACHE_KEY_HASH = `${CACHE_PREFIX}-key-hash`;
const CACHE_STATUS = `${CACHE_PREFIX}-status`;
const CACHE_TIMESTAMP = `${CACHE_PREFIX}-timestamp`;
const VALIDATION_TTL = 3600000;
const API_TIMEOUT = 10000;
const MAX_RETRIES = 2;

interface LicenseActivationResponse {
  activated: boolean;
  instance?: { id: string };
  error?: string;
  activation_limit?: number;
  activation_usage?: number;
}

interface LicenseValidationResponse {
  valid: boolean;
  error?: string;
}

interface LicenseState {
  instanceId: string | null;
  keyHash: string | null;
  status: "active" | "inactive" | "revoked" | null;
  lastValidation: number | null;
}

class LicenseManager {
  private cache: LicenseState = {
    instanceId: null,
    keyHash: null,
    status: null,
    lastValidation: null,
  };

  private isValidating = false;

  private validationPromise: Promise<boolean> | null = null;

  constructor() {
    this.loadCache();
  }

  private static hash(input: string): string {
    let result = 0;
    for (let i = 0; i < input.length; i += 1) {
      const char = input.charCodeAt(i);
      result = (result << 5) - result + char;
      result &= result;
    }
    return Math.abs(result).toString(36);
  }

  private loadCache(): void {
    try {
      if (typeof localStorage === "undefined") return;

      const instanceId = localStorage.getItem(CACHE_INSTANCE);
      const keyHash = localStorage.getItem(CACHE_KEY_HASH);
      const status = localStorage.getItem(CACHE_STATUS);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP);

      this.cache = {
        instanceId,
        keyHash,
        status: (status as any) || null,
        lastValidation: timestamp ? parseInt(timestamp, 10) : null,
      };
    } catch {
      this.cache = { instanceId: null, keyHash: null, status: null, lastValidation: null };
    }
  }

  private saveCache(): void {
    try {
      if (typeof localStorage === "undefined") return;

      if (this.cache.instanceId) {
        localStorage.setItem(CACHE_INSTANCE, this.cache.instanceId);
      } else {
        localStorage.removeItem(CACHE_INSTANCE);
      }

      if (this.cache.keyHash) {
        localStorage.setItem(CACHE_KEY_HASH, this.cache.keyHash);
      } else {
        localStorage.removeItem(CACHE_KEY_HASH);
      }

      if (this.cache.status) {
        localStorage.setItem(CACHE_STATUS, this.cache.status);
      } else {
        localStorage.removeItem(CACHE_STATUS);
      }

      if (this.cache.lastValidation) {
        localStorage.setItem(CACHE_TIMESTAMP, this.cache.lastValidation.toString());
      } else {
        localStorage.removeItem(CACHE_TIMESTAMP);
      }
    } catch {
      // cache unavailable
    }
  }

  private clearCache(): void {
    this.cache = { instanceId: null, keyHash: null, status: null, lastValidation: null };
    this.saveCache();
  }

  private static getKeyHash(licenseKey: string): string {
    return LicenseManager.hash(licenseKey.slice(0, 16));
  }

  private validateKeyMatch(licenseKey: string): boolean {
    const currentHash = LicenseManager.getKeyHash(licenseKey);
    if (!this.cache.keyHash) return true;
    if (this.cache.keyHash !== currentHash) {
      this.clearCache();
      return false;
    }
    return true;
  }

  private isCacheValid(): boolean {
    if (!this.cache.instanceId || !this.cache.status || this.cache.status === "revoked") {
      return false;
    }

    if (!this.cache.lastValidation) {
      return false;
    }

    const now = Date.now();
    const age = now - this.cache.lastValidation;

    return age < VALIDATION_TTL;
  }

  private static getMachineId(): string {
    try {
      if (typeof navigator === "undefined") return "unknown";

      const ua = navigator.userAgent || "unknown";
      const timezone = (() => {
        try {
          return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch {
          return "unknown";
        }
      })();

      return LicenseManager.hash(`${ua}|${timezone}`);
    } catch {
      return "unknown";
    }
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
      if (retries < MAX_RETRIES && error instanceof Error) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 1000);
        });
        return this.fetchWithRetry(url, options, retries + 1);
      }
      throw error;
    }
  }

  private async activate(licenseKey: string, projectId: string): Promise<string | null> {
    try {
      if (!licenseKey || !projectId) return null;

      const machineId = LicenseManager.getMachineId();
      const instanceName = `Sanity Studio — ${projectId}/${machineId}`;

      const response = await this.fetchWithRetry(`${LS_API}/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          license_key: licenseKey,
          instance_name: instanceName,
        }),
      });

      if (!response.ok) {
        console.warn(`[sanity-plugin-seo] Activation HTTP ${response.status}`);
        return null;
      }

      const data: LicenseActivationResponse = await response.json();

      if (!data.activated) {
        console.warn(`[sanity-plugin-seo] Activation rejected: ${data.error}`, {
          limit: data.activation_limit,
          usage: data.activation_usage,
        });
        return null;
      }

      if (!data.instance?.id) {
        console.warn("[sanity-plugin-seo] No instance ID returned");
        return null;
      }

      this.cache.instanceId = data.instance.id;
      this.cache.keyHash = LicenseManager.getKeyHash(licenseKey);
      this.cache.status = "active";
      this.cache.lastValidation = Date.now();
      this.saveCache();

      return data.instance.id;
    } catch (error) {
      console.error(
        "[sanity-plugin-seo] Activation error:",
        error instanceof Error ? error.message : "unknown",
      );
      return null;
    }
  }

  private async validate(licenseKey: string, instanceId: string): Promise<boolean> {
    try {
      if (!licenseKey || !instanceId) return false;

      const response = await this.fetchWithRetry(`${LS_API}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          license_key: licenseKey,
          instance_id: instanceId,
        }),
      });

      if (!response.ok) {
        console.warn(`[sanity-plugin-seo] Validation HTTP ${response.status}`);
        this.cache.status = "revoked";
        this.saveCache();
        return false;
      }

      const data: LicenseValidationResponse = await response.json();

      if (!data.valid) {
        console.warn(`[sanity-plugin-seo] Validation failed: ${data.error}`);
        this.cache.status = "revoked";
        this.saveCache();
        return false;
      }

      this.cache.status = "active";
      this.cache.lastValidation = Date.now();
      this.saveCache();

      return true;
    } catch (error) {
      console.error(
        "[sanity-plugin-seo] Validation error:",
        error instanceof Error ? error.message : "unknown",
      );
      return false;
    }
  }

  async isLicenseValid(licenseKey: string, projectId: string): Promise<boolean> {
    if (!licenseKey?.trim()) {
      return false;
    }

    if (!this.validateKeyMatch(licenseKey)) {
      this.clearCache();
    }

    if (this.isCacheValid()) {
      return true;
    }

    if (this.isValidating && this.validationPromise) {
      return this.validationPromise;
    }

    this.isValidating = true;

    this.validationPromise = (async () => {
      try {
        if (this.cache.instanceId && this.cache.keyHash === LicenseManager.getKeyHash(licenseKey)) {
          const isValid = await this.validate(licenseKey, this.cache.instanceId);
          if (isValid) {
            return true;
          }
          this.clearCache();
        }

        const newInstanceId = await this.activate(licenseKey, projectId);
        if (!newInstanceId) {
          return false;
        }

        const isValid = await this.validate(licenseKey, newInstanceId);
        return isValid;
      } catch (error) {
        console.error(
          "[sanity-plugin-seo] License check error:",
          error instanceof Error ? error.message : "unknown",
        );
        return false;
      } finally {
        this.isValidating = false;
        this.validationPromise = null;
      }
    })();

    return this.validationPromise;
  }

  needsRevalidation(): boolean {
    if (!this.cache.lastValidation) return true;
    if (this.cache.status === "revoked") return true;
    const age = Date.now() - this.cache.lastValidation;
    return age > VALIDATION_TTL;
  }

  getDebugInfo(): Record<string, any> {
    return {
      hasInstance: !!this.cache.instanceId,
      status: this.cache.status,
      lastValidation: this.cache.lastValidation
        ? new Date(this.cache.lastValidation).toISOString()
        : null,
      needsRevalidation: this.needsRevalidation(),
      cacheValid: this.isCacheValid(),
    };
  }

  reset(): void {
    this.clearCache();
  }
}

export default new LicenseManager();
