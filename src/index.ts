// Plugin
import seoMetaFields from "./plugin";

export default seoMetaFields;
export { seoMetaFields };

// Types — Seo is re-exported via Types, avoid duplicate named exports
export * from "./types/Types";
export type {
  PluginConfig,
  AIConfig,
  AutomationConfig,
  WorkflowConfig,
} from "./types/PluginConfig";

// Pro dashboard (exported so users can optionally add it to structure)
export { default as SEODashboardPane } from "./components/pro/SEODashboardPane";
