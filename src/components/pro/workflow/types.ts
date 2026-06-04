import { EditIcon, ClockIcon, CheckmarkCircleIcon } from "@sanity/icons";

/* eslint-disable @typescript-eslint/no-explicit-any */

export type WorkflowStatus = "draft" | "review" | "approved";

export interface WorkflowDoc {
  _id: string;
  _type: string;
  _updatedAt: string;
  docTitle: string;
  seoStatus: WorkflowStatus;
  reviewNotes: string;
  score: number;
  issues: string[];
  seo: Record<string, any> | null;
}

export const STATUS_CFG: Record<
  WorkflowStatus,
  { label: string; color: string; bg: string; border: string; Icon: any }
> = {
  draft: {
    label: "Draft",
    color: "var(--card-muted-fg-color)",
    bg: "var(--card-border-color)",
    border: "var(--card-border-color)",
    Icon: EditIcon,
  },
  review: {
    label: "Needs Review",
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.25)",
    Icon: ClockIcon,
  },
  approved: {
    label: "Approved",
    color: "#22c55e",
    bg: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.25)",
    Icon: CheckmarkCircleIcon,
  },
};

export function buildIssues(seo: Record<string, any> | null): string[] {
  if (!seo) return ["No SEO data"];
  const issues: string[] = [];
  if (!seo.metaTitle) issues.push("Missing meta title");
  else if (seo.metaTitle.length < 50 || seo.metaTitle.length > 60)
    issues.push("Meta title length out of range (50–60 chars)");
  if (!seo.metaDescription) issues.push("Missing meta description");
  else if (seo.metaDescription.length < 100 || seo.metaDescription.length > 160)
    issues.push("Meta description length out of range (100–160 chars)");
  if (!seo.metaImage?.asset) issues.push("No meta image");
  if (!seo.focusKeyword) issues.push("No focus keyword");
  if (!seo.openGraph?.title) issues.push("No Open Graph title");
  return issues;
}
