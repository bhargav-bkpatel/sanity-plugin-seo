export interface AIConfig {
  provider: "openai" | "anthropic" | "groq";
  apiKey: string;
  model?: string;
}

export interface AutomationConfig {
  autoCanonical?: boolean;
  autoOgImage?: boolean;
  autoAltText?: boolean;
  autoDescription?: boolean;
}

export interface WorkflowConfig {
  requireSeoApproval?: boolean;
  reviewers?: string[];
}

export interface PluginConfig {
  proFeature?: string;
  projectId?: string;
  validateUrl?: string;
  aiFeature?: AIConfig;
  bodyField?: string;
  slugField?: string;
  defaultFetchType?: string;
  dashboard?: boolean;
  automation?: AutomationConfig;
  workflow?: WorkflowConfig;
  documentTypes?: string[];
  baseUrl?: string;
}
