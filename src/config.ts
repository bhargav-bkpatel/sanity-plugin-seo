import { PluginConfig } from "./types/PluginConfig";

export const SEO_PRO_EVENT = "seo-plugin-pro-changed";

interface PluginState {
  config: PluginConfig;
  proEnabled: boolean;
  licenseValidating: boolean;
}

const state: PluginState = {
  config: {},
  proEnabled: false,
  licenseValidating: false,
};

export const setPluginConfig = (config: PluginConfig): void => {
  state.config = config;
};

export const getPluginConfig = (): PluginConfig => state.config;

export const setProEnabled = (enabled: boolean): void => {
  state.proEnabled = enabled;
  try {
    window.dispatchEvent(new CustomEvent(SEO_PRO_EVENT, { detail: { enabled } }));
  } catch {
    // not in browser context
  }
};

export const isProEnabled = (): boolean => state.proEnabled;

export const setLicenseValidating = (validating: boolean): void => {
  state.licenseValidating = validating;
  try {
    window.dispatchEvent(new CustomEvent(SEO_PRO_EVENT, { detail: { enabled: state.proEnabled } }));
  } catch {
    // not in browser context
  }
};

export const isLicenseValidating = (): boolean => state.licenseValidating;
