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
  /**
   * Your Lemon Squeezy license key.
   * Example: "XXXX-XXXX-XXXX-XXXX"
   */
  proFeature?: string;

  /**
   * Your Sanity project ID — required for seat-binding.
   * Find it in sanity.json or pass `import { projectId } from 'sanity:client'`.
   * Example: "abc123de"
   */
  projectId?: string;

  /**
   * Full URL of your deployed Vercel validate-license endpoint.
   * Example: "https://your-domain.vercel.app/api/validate-license"
   * Defaults to the SANITY_SEO_VALIDATE_URL env var when not provided.
   */
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
