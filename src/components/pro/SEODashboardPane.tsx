import React, { useEffect, useState, useCallback } from "react";
import { useClient } from "sanity";
import { useRouter } from "sanity/router";
import { Stack, Text, Flex, Spinner, Box } from "@sanity/ui";
import { RefreshIcon } from "@sanity/icons";
import useProEnabled from "../../hooks/useProEnabled";
import { computeSEOScore } from "../../utils/seoScore";
import ProGate from "./ProGate";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface DocSEO {
  _id: string;
  _type: string;
  _updatedAt: string;
  docTitle: string;
  seo: Record<string, any> | null;
}

interface ScoredDoc extends DocSEO {
  score: number;
  color: string;
  issues: string[];
}

function getIssues(seo: Record<string, any> | null): string[] {
  if (!seo) return ["No SEO fields configured"];
  const issues: string[] = [];
  if (!seo.metaTitle) issues.push("Missing meta title");
  else if (seo.metaTitle.length < 50 || seo.metaTitle.length > 60)
    issues.push("Title length out of range");
  if (!seo.metaDescription) issues.push("Missing meta description");
  else if (seo.metaDescription.length < 100 || seo.metaDescription.length > 160)
    issues.push("Description length out of range");
  if (!seo.metaImage?.asset) issues.push("Missing meta image");
  if (!seo.canonicalUrl) issues.push("No canonical URL");
  if (!seo.focusKeyword) issues.push("No focus keyword");
  if (!seo.openGraph?.title) issues.push("Open Graph not configured");
  return issues;
}

function scoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Good";
  if (score >= 50) return "Needs Work";
  return "Poor";
}

function ScoreBar({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 80,
            height: 4,
            background: "#1e293b",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 99 }}
          />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 26 }}>{score}</span>
      </div>
      <div style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>{scoreLabel(score)}</div>
    </div>
  );
}

function StatCard({
  value,
  label,
  sub,
  accent,
}: {
  value: number;
  label: string;
  sub: string;
  accent: string;
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: `1px solid ${accent}40`,
        borderTop: `3px solid ${accent}`,
        borderRadius: 12,
        padding: "20px 24px",
        flex: 1,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `${accent}18`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{ fontSize: 40, fontWeight: 900, color: accent, lineHeight: 1, letterSpacing: -1 }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginTop: 10 }}>{label}</div>
      <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{sub}</div>
    </div>
  );
}

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "good", label: "Good" },
  { key: "ok", label: "Needs Work" },
  { key: "poor", label: "Poor" },
] as const;

export default function SEODashboardPane() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const router = useRouter();
  const [docs, setDocs] = useState<ScoredDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "poor" | "ok" | "good">("all");
  const [issueFilter, setIssueFilter] = useState<string>("all");
  const { isPro } = useProEnabled();

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const results: DocSEO[] = await client.fetch(`
        *[defined(seo) && !(_id in path("drafts.**"))] | order(_updatedAt desc) [0...200] {
          _id, _type, _updatedAt,
          "docTitle": coalesce(title, name, slug.current, "Untitled"),
          "seo": seo
        }
      `);

      const initial = results.map((doc) => {
        const result = computeSEOScore(doc.seo || undefined);
        return { ...doc, score: result.score, color: result.color, issues: getIssues(doc.seo) };
      });

      // Detect duplicate meta titles across all fetched docs
      const titleCounts: Record<string, number> = {};
      results.forEach((doc) => {
        if (doc.seo?.metaTitle) {
          titleCounts[doc.seo.metaTitle] = (titleCounts[doc.seo.metaTitle] || 0) + 1;
        }
      });
      const withDupes = initial.map((doc) =>
        doc.seo?.metaTitle && titleCounts[doc.seo.metaTitle] > 1
          ? { ...doc, issues: [...doc.issues, "Duplicate meta title"] }
          : doc,
      );

      setDocs(withDupes);
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const allIssueTypes = Array.from(new Set(docs.flatMap((d) => d.issues))).sort();

  const filtered = docs.filter((d) => {
    if (filter === "poor" && d.color !== "red") return false;
    if (filter === "ok" && d.color !== "orange") return false;
    if (filter === "good" && d.color !== "green") return false;
    if (issueFilter !== "all" && !d.issues.includes(issueFilter)) return false;
    return true;
  });

  const totalDocs = docs.length;
  const goodCount = docs.filter((d) => d.color === "green").length;
  const okCount = docs.filter((d) => d.color === "orange").length;
  const poorCount = docs.filter((d) => d.color === "red").length;
  const avgScore =
    totalDocs > 0 ? Math.round(docs.reduce((s, d) => s + d.score, 0) / totalDocs) : 0;

  if (!isPro) {
    return (
      <ProGate feature="SEO Health Dashboard" isPro={false} variant="page">
        {null}
      </ProGate>
    );
  }

  return (
    <Box style={{ minHeight: "100vh", background: "#070d1a", padding: "32px 40px" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <Stack space={5}>
          {/* Header — matches SEO Optimizer banner style */}
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #0d1f3c 100%)",
              border: "1px solid #1e3a5f",
              borderRadius: 16,
              padding: "28px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#3b82f6",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Pro Feature
              </div>
              <Text size={4} weight="bold" style={{ color: "#f8fafc" }}>
                SEO Health Dashboard
              </Text>
              <div style={{ marginTop: 6 }}>
                <Text size={1} style={{ color: "#64748b" }}>
                  {loading
                    ? "Loading SEO health data…"
                    : `Showing SEO health for ${totalDocs} page${totalDocs !== 1 ? "s" : ""}`}
                </Text>
              </div>
            </div>
            <button
              type="button"
              onClick={fetchDocs}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                background: loading ? "#1e293b" : "#1d4ed8",
                border: "none",
                borderRadius: 10,
                color: loading ? "#475569" : "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                boxShadow: loading ? "none" : "0 0 20px #1d4ed840",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              <RefreshIcon style={{ fontSize: 16 }} />
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>

          {/* Stat cards */}
          <div style={{ display: "flex", gap: 14 }}>
            <StatCard
              value={avgScore}
              label="Avg SEO Score"
              sub="across all pages"
              accent={scoreColor(avgScore)}
            />
            <StatCard value={goodCount} label="Good" sub="score ≥ 80" accent="#22c55e" />
            <StatCard value={okCount} label="Needs Work" sub="score 50–79" accent="#f59e0b" />
            <StatCard value={poorCount} label="Poor" sub="score < 50" accent="#ef4444" />
          </div>

          {/* Filters */}
          <Flex gap={3} align="center" wrap="wrap">
            <div
              style={{
                display: "flex",
                gap: 4,
                padding: "4px",
                background: "#0f172a",
                borderRadius: 8,
                border: "1px solid #1e293b",
              }}
            >
              {FILTER_TABS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: filter === f.key ? 600 : 400,
                    background: filter === f.key ? "#1e3a5f" : "transparent",
                    color: filter === f.key ? "#60a5fa" : "#64748b",
                    transition: "all 0.15s",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <select
              value={issueFilter}
              onChange={(e) => setIssueFilter(e.target.value)}
              style={{
                fontSize: 12,
                padding: "6px 12px",
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 8,
                color: "#94a3b8",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="all">All issues</option>
              {allIssueTypes.map((issue) => (
                <option key={issue} value={issue}>
                  {issue}
                </option>
              ))}
            </select>
          </Flex>

          {/* Table */}
          {loading ? (
            <Flex justify="center" padding={8}>
              <Spinner />
            </Flex>
          ) : (
            <div>
              {/* Column headers */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr 80px 220px 60px",
                  gap: 16,
                  padding: "8px 16px",
                  marginBottom: 4,
                }}
              >
                {["Score", "Page", "Type", "Issues", ""].map((h) => (
                  <div
                    key={h}
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      color: "#475569",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </div>
                ))}
              </div>

              {/* Rows */}
              <Stack space={2}>
                {filtered.length === 0 && (
                  <div
                    style={{
                      padding: "40px 0",
                      textAlign: "center",
                      color: "#475569",
                      fontSize: 14,
                      background: "#0f172a",
                      borderRadius: 10,
                      border: "1px solid #1e293b",
                    }}
                  >
                    No pages match this filter
                  </div>
                )}

                {filtered.map((doc) => (
                  <div
                    key={doc._id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "140px 1fr 80px 220px 60px",
                      gap: 16,
                      alignItems: "center",
                      padding: "14px 16px",
                      background: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: 10,
                      transition: "border-color 0.15s",
                    }}
                  >
                    <ScoreBar score={doc.score} />

                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#e2e8f0",
                          lineHeight: 1.4,
                          marginBottom: 3,
                        }}
                      >
                        {doc.docTitle}
                      </div>
                      <div style={{ fontSize: 11, color: "#475569" }}>
                        Updated {new Date(doc._updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "2px 8px",
                        background: "#1e293b",
                        borderRadius: 99,
                        fontSize: 11,
                        color: "#94a3b8",
                        fontWeight: 500,
                        width: "fit-content",
                      }}
                    >
                      {doc._type}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {doc.issues.length === 0 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#22c55e",
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ fontSize: 12, color: "#22c55e" }}>All checks passed</span>
                        </div>
                      ) : (
                        doc.issues.map((issue) => (
                          <div
                            key={issue}
                            style={{ display: "flex", alignItems: "flex-start", gap: 6 }}
                          >
                            <div
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: "#ef4444",
                                flexShrink: 0,
                                marginTop: 4,
                              }}
                            />
                            <span style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4 }}>
                              {issue}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() =>
                          router.navigate({
                            intent: "edit",
                            params: { id: doc._id, type: doc._type },
                          })
                        }
                        style={{
                          background: "none",
                          border: "none",
                          color: "#3b82f6",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          padding: 0,
                          textDecoration: "underline",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Open →
                      </button>
                    </div>
                  </div>
                ))}
              </Stack>

              <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#475569" }}>
                Showing {filtered.length} of {totalDocs} pages
              </div>
            </div>
          )}
        </Stack>
      </div>
    </Box>
  );
}
