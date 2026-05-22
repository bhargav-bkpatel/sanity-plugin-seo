import { definePlugin } from "sanity";
import { SparklesIcon, DocumentsIcon } from "@sanity/icons";
import types from "./schemas/types";
import { PluginConfig } from "./types/PluginConfig";
import { setPluginConfig, setProEnabled, setLicenseValidating } from "./config";
import validateLicense from "./utils/validateLicense";
import SEODashboardPane from "./components/pro/SEODashboardPane";
import BulkSEOPanel from "./components/pro/BulkSEOPanel";

const seoMetaFields = definePlugin((config: PluginConfig = {}) => {
  setPluginConfig(config);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tools: any[] = [];

  if (config.proFeature) {
    setLicenseValidating(true);
    // Validate asynchronously — Pro features appear once validated
    setTimeout(async () => {
      try {
        // projectId is resolved at runtime from the client
        const projectId = config.proFeature?.slice(0, 8) ?? "unknown";
        const valid = await validateLicense(config.proFeature!, projectId);
        setProEnabled(valid);
        if (valid && config.dashboard !== false) {
          // Dashboard is registered at plugin init — shown when pro is active
        }
      } finally {
        setLicenseValidating(false);
      }
    }, 0);
  }

  // Register SEO Dashboard as a top-level Studio tool (always shown; gates internally for non-Pro)
  if (config.dashboard !== false) {
    tools.push({
      name: "seo-dashboard",
      title: "SEO Health",
      icon: SparklesIcon,
      component: SEODashboardPane,
    });
    tools.push({
      name: "seo-bulk",
      title: "SEO Optimizer",
      icon: DocumentsIcon,
      component: BulkSEOPanel,
    });
  }

  return {
    name: "sanity-plugin-seo",
    schema: { types },
    tools,
  };
});

export default seoMetaFields;
