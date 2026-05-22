import type { CSSProperties } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface BulkDoc {
  _id: string;
  _type: string;
  docTitle: string;
  seo: Record<string, any> | null;
  score: number;
  issues: string[];
  selected: boolean;
}

export interface RowEdit {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  focusKeyword: string;
  ogTitle: string;
  ogDescription: string;
  seoStatus: string;
  saving: boolean;
  saved: boolean;
}

export type BulkTab = "canonical" | "keyword" | "status" | "csv";

export const SEO_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "Needs Review" },
  { value: "approved", label: "SEO Approved" },
];

export function getIssues(seo: Record<string, any> | null): string[] {
  if (!seo) return ["No SEO data"];
  const issues: string[] = [];
  if (!seo.metaTitle) issues.push("Missing title");
  else if (seo.metaTitle.length < 50 || seo.metaTitle.length > 60)
    issues.push("Title length out of range");
  if (!seo.metaDescription) issues.push("Missing description");
  else if (seo.metaDescription.length < 100 || seo.metaDescription.length > 160)
    issues.push("Description length out of range");
  if (!seo.canonicalUrl) issues.push("No canonical URL");
  if (!seo.metaImage?.asset) issues.push("No meta image");
  if (!seo.focusKeyword) issues.push("No focus keyword");
  return issues;
}

export function scoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export function scoreLabel(score: number): string {
  if (score >= 80) return "Good";
  if (score >= 50) return "Needs Work";
  return "Poor";
}

export const INPUT_STYLE: CSSProperties = {
  flex: 1,
  padding: "7px 10px",
  background: "#070d1a",
  border: "1px solid #334155",
  borderRadius: 6,
  color: "#e2e8f0",
  fontSize: 12,
  outline: "none",
  fontFamily: "inherit",
};

export const FIELD_LABEL: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: "#475569",
  letterSpacing: 1,
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  width: 120,
  flexShrink: 0,
};
