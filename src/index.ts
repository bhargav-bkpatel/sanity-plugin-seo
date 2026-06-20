import seoMetaFields from "./plugin";

export default seoMetaFields;
export { seoMetaFields };

export * from "./types/Types";
export type {
  PluginConfig,
  AIConfig,
  AutomationConfig,
  WorkflowConfig,
} from "./types/PluginConfig";

export { default as SEODashboardPane } from "./components/pro/SEODashboardPane";
