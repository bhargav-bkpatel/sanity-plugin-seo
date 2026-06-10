import { definePlugin } from "sanity";
import { SparklesIcon, DocumentsIcon, ActivityIcon } from "@sanity/icons";
import types from "./schemas/types";
import { PluginConfig } from "./types/PluginConfig";
import { setPluginConfig, setProEnabled, setLicenseValidating } from "./config";
import licenseManager from "./utils/licenseManager";
import SEODashboardPane from "./components/pro/SEODashboardPane";
import BulkSEOPanel from "./components/pro/BulkSEOPanel";
import WorkflowDashboard from "./components/pro/WorkflowDashboard";

const seoMetaFields = definePlugin((config: PluginConfig = {}) => {
  setPluginConfig(config);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tools: any[] = [];

  if (config.proFeature) {
    setLicenseValidating(true);

    const validateAndSetPro = async (): Promise<void> => {
      try {
        const projectId = config.proFeature?.slice(0, 8) ?? "unknown";
        const isValid = await licenseManager.isLicenseValid(config.proFeature!, projectId);
        setProEnabled(isValid);
      } catch (error) {
        setProEnabled(false);
      } finally {
        setLicenseValidating(false);
      }
    };

    setTimeout(validateAndSetPro, 0);

    const revalidationInterval = setInterval(() => {
      if (licenseManager.needsRevalidation()) {
        setLicenseValidating(true);
        validateAndSetPro();
      }
    }, 60000);

    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        clearInterval(revalidationInterval);
      });
    }
  }

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
    tools.push({
      name: "seo-workflow",
      title: "SEO Workflow",
      icon: ActivityIcon,
      component: WorkflowDashboard,
    });
  }

  return {
    name: "sanity-plugin-seo",
    schema: { types },
    tools,
  };
});

export default seoMetaFields;
