/* eslint-disable @typescript-eslint/no-explicit-any */
import licenseManager from "./licenseManager";

export default async function validateLicense(
  licenseKey: string,
  projectId: string,
): Promise<boolean> {
  return licenseManager.isLicenseValid(licenseKey, projectId);
}

export function needsRevalidation(): boolean {
  return licenseManager.needsRevalidation();
}

export function getActivationDebugInfo(): Record<string, any> {
  return licenseManager.getDebugInfo();
}
