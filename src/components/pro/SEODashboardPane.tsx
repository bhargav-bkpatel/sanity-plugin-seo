import React, { useEffect, useState, useCallback } from "react";
import { useClient } from "sanity";
import { IntentLink } from "sanity/router";
import { Stack, Text, Flex, Spinner, Box } from "@sanity/ui";
import { RefreshIcon, ActivityIcon, ChevronLeftIcon, ChevronRightIcon } from "@sanity/icons";
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

// ---------------------------------------------------------------------------
// Two-layer cache:
//   1. Module-level variable  — zero-cost on navigation (no JSON parse)
//   2. localStorage           — survives full page reloads
// ---------------------------------------------------------------------------
interface ScanCache {
  docs: ScoredDoc[];
  timestamp: number;
}
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const DASHBOARD_LS_KEY = "seo-plugin__dashboard-scan";
let scanCache: ScanCache | null = null;

function readDashboardLS(): ScanCache | null {
  try {
    const raw = localStorage.getItem(DASHBOARD_LS_KEY);
    if (!raw) return null;
    const parsed: ScanCache = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(DASHBOARD_LS_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function getCached(): ScoredDoc[] | null {
  const hit = scanCache ?? readDashboardLS();
  if (!hit) return null;
  if (Date.now() - hit.timestamp > CACHE_TTL_MS) {
    scanCache = null;
    localStorage.removeItem(DASHBOARD_LS_KEY);
    return null;
  }
  if (!scanCache) scanCache = hit;
  return hit.docs;
}

function setCache(docs: ScoredDoc[]): void {
  const data: ScanCache = { docs, timestamp: Date.now() };
  scanCache = data;
  try {
    localStorage.setItem(DASHBOARD_LS_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — in-memory layer still works
  }
}

function clearDashboardCache(): void {
  scanCache = null;
  try {
    localStorage.removeItem(DASHBOARD_LS_KEY);
  } catch {
    // ignore
  }
}

function getCacheAge(): string | null {
  const hit = scanCache ?? readDashboardLS();
  if (!hit) return null;
  const secs = Math.floor((Date.now() - hit.timestamp) / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
}
// ---------------------------------------------------------------------------

function getIssues(seo: Record<string, any> | null): string[] {
  if (!seo) return ["No SEO data — open this document and fill in SEO fields"];
  const issues: string[] = [];
  if (!seo.metaTitle) issues.push("Missing meta title");
  else if (seo.metaTitle.length < 50 || seo.metaTitle.length > 60)
    issues.push("Title length out of range");
  if (!seo.metaDescription) issues.push("Missing meta description");
  else if (seo.metaDescription.length < 100 || seo.metaDescription.length > 160)
    issues.push("Description length out of range");
  if (!seo.metaImage?.asset) issues.push("Missing meta image");
  if (!seo.focusKeyword) issues.push("No focus keyword");
  if (!seo.openGraph?.title) issues.push("Open Graph not configured");
  return issues;
}

function scoreColorHex(score: number): string {
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
  const color = scoreColorHex(score);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 80,
            height: 6,
            background: "var(--card-border-color)",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: score === 0 ? 3 : `${score}%`,
              height: "100%",
              background: color,
              borderRadius: 99,
            }}
          />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 26 }}>{score}</span>
      </div>
      <div style={{ fontSize: 10, color: "var(--card-muted-fg-color)", marginTop: 3 }}>
        {scoreLabel(score)}
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  sub,
  accent,
}: {
  value: number | string;
  label: string;
  sub: string;
  accent: string;
}) {
  return (
    <div
      style={{
        background: "var(--card-bg-color)",
        border: `1px solid ${accent}40`,
        borderTop: `3px solid ${accent}`,
        borderRadius: 12,
        padding: "20px 24px",
        flex: 1,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow behind number */}
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
        style={{
          fontSize: 40,
          fontWeight: 900,
          color: accent,
          lineHeight: 1,
          letterSpacing: -1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--card-fg-color)", marginTop: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 11, color: "var(--card-muted-fg-color)", marginTop: 3 }}>{sub}</div>
    </div>
  );
}

// Score distribution strip — shows proportion of good / needs work / poor
function DistributionStrip({
  good,
  ok,
  poor,
  total,
}: {
  good: number;
  ok: number;
  poor: number;
  total: number;
}) {
  if (total === 0) return null;
  const pct = (n: number) => `${Math.round((n / total) * 100)}%`;
  return (
    <div>
      <div
        style={{
          display: "flex",
          height: 8,
          borderRadius: 99,
          overflow: "hidden",
          background: "var(--card-border-color)",
          gap: 1,
        }}
      >
        {good > 0 && <div style={{ flex: good, background: "#22c55e", transition: "flex 0.4s" }} />}
        {ok > 0 && <div style={{ flex: ok, background: "#f59e0b", transition: "flex 0.4s" }} />}
        {poor > 0 && <div style={{ flex: poor, background: "#ef4444", transition: "flex 0.4s" }} />}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
        {[
          { count: good, color: "#22c55e", label: "Good" },
          { count: ok, color: "#f59e0b", label: "Needs Work" },
          { count: poor, color: "#ef4444", label: "Poor" },
        ].map(({ count, color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
            <span style={{ fontSize: 11, color: "var(--card-muted-fg-color)" }}>
              {label}: {count} ({pct(count)})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pagination({
  page,
  total,
  pageSize,
  onPage,
}: {
  page: number;
  total: number;
  pageSize: number;
  onPage: (n: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  const isFirst = page === 0;
  const isLast = page >= totalPages - 1;

  const navStyle = (disabled: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 10,
    border: `1px solid var(--card-border-color)`,
    background: "var(--card-bg-color)",
    color: "var(--card-link-color)",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.15s",
    flexShrink: 0,
    opacity: disabled ? "0.5" : "",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
        padding: "12px 16px",
        background: "var(--card-bg-color)",
        border: "1px solid var(--card-border-color)",
        borderRadius: 12,
      }}
    >
      <span style={{ fontSize: 12, color: "var(--card-muted-fg-color)" }}>
        <span style={{ color: "var(--card-link-color)", fontWeight: 600 }}>
          {Math.min(page * pageSize + 1, total)}–{Math.min((page + 1) * pageSize, total)}
        </span>{" "}
        of <span style={{ color: "var(--card-fg-color)" }}>{total}</span> pages
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button
          type="button"
          onClick={() => onPage(Math.max(0, page - 1))}
          disabled={isFirst}
          style={navStyle(isFirst)}
        >
          <ChevronLeftIcon style={{ fontSize: 18 }} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              type="button"
              onClick={() => onPage(i)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 10,
                border: page === i ? "none" : "1px solid var(--card-border-color)",
                background: page === i ? "var(--card-link-color)" : "var(--card-bg-color)",
                color: page === i ? "#fff" : "var(--card-muted-fg-color)",
                fontSize: 13,
                fontWeight: page === i ? 700 : 400,
                cursor: "pointer",
                boxShadow: page === i ? "0 0 12px #2563eb50" : "none",
                transition: "all 0.15s",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onPage(Math.min(totalPages - 1, page + 1))}
          disabled={isLast}
          style={navStyle(isLast)}
        >
          <ChevronRightIcon style={{ fontSize: 18 }} />
        </button>
      </div>
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
  // Initialise directly from cache — no loading flash when navigating back
  const [docs, setDocs] = useState<ScoredDoc[]>(() => getCached() ?? []);
  const [loading, setLoading] = useState(() => getCached() === null);
  const [cacheAge, setCacheAge] = useState<string | null>(() => getCacheAge());
  const [filter, setFilter] = useState<"all" | "poor" | "ok" | "good">("all");
  const [issueFilter, setIssueFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 5;
  const { isPro } = useProEnabled();

  const fetchDocs = useCallback(
    async (bust = false) => {
      if (bust) clearDashboardCache();
      // If valid cache exists and this is not a forced refresh, skip the network call
      const cached = getCached();
      if (cached) {
        setDocs(cached);
        setCacheAge(getCacheAge());
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Include ANY published document that has a slug or seo field — catches
        // content pages that haven't had their SEO tab touched yet (score = 0).
        const results: DocSEO[] = await client.fetch(`
        *[!(_id in path("drafts.**")) && (defined(seo) || defined(slug))]
          | order(_updatedAt desc) [0...200] {
          _id, _type, _updatedAt,
          "docTitle": coalesce(title, name, slug.current, "Untitled"),
          "seo": seo
        }
      `);

        const initial = results.map((doc) => {
          const result = computeSEOScore(doc.seo || undefined);
          return { ...doc, score: result.score, color: result.color, issues: getIssues(doc.seo) };
        });

        // Flag duplicate meta titles
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

        setCache(withDupes);
        setDocs(withDupes);
        setCacheAge(getCacheAge());
      } finally {
        setLoading(false);
      }
    },
    [client],
  );

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
  // Health-specific: coverage metrics across ALL pages (not just problem pages)
  const duplicateTitles = docs.filter((d) => d.issues.includes("Duplicate meta title")).length;
  const noOpenGraph = docs.filter((d) => d.issues.includes("Open Graph not configured")).length;

  if (!isPro) {
    return (
      <ProGate feature="SEO Health Dashboard" isPro={false} variant="page">
        {null}
      </ProGate>
    );
  }

  return (
    <Box style={{ minHeight: "100vh", background: "var(--card-bg-color)", padding: "32px 40px" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <Stack space={5}>
          {/* Header — analytics / monitoring identity */}
          <div
            style={{
              background: "var(--card-bg-color)",
              border: "1px solid var(--card-border-color)",
              borderRadius: 16,
              padding: "28px 32px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <ActivityIcon style={{ fontSize: 16, color: "var(--card-link-color)" }} />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--card-link-color)",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  SEO Analytics
                </span>
              </div>
              <Text size={4} weight="bold" style={{ color: "var(--card-fg-color)" }}>
                SEO Health Dashboard
              </Text>
              <div style={{ marginTop: 14, marginBottom: loading ? 0 : 20 }}>
                <Text size={1} style={{ color: "var(--card-muted-fg-color)" }}>
                  {loading
                    ? "Loading SEO health data…"
                    : `Monitoring ${totalDocs} page${
                        totalDocs !== 1 ? "s" : ""
                      } across your content`}
                </Text>
                {!loading && cacheAge && (
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#22c55e",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 11, color: "var(--card-muted-fg-color)" }}>
                      Last scanned {cacheAge} · cached
                    </span>
                  </div>
                )}
              </div>
              {!loading && totalDocs > 0 && (
                <DistributionStrip
                  good={goodCount}
                  ok={okCount}
                  poor={poorCount}
                  total={totalDocs}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => fetchDocs(true)}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                background: loading ? "var(--card-border-color)" : "var(--card-link-color)",
                border: "none",
                borderRadius: 10,
                color: loading ? "var(--card-muted-fg-color)" : "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                flexShrink: 0,
                marginTop: 4,
              }}
            >
              <RefreshIcon style={{ fontSize: 15 }} />
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>

          {/* Stat cards */}
          <div style={{ display: "flex", gap: 12 }}>
            <StatCard
              value={totalDocs}
              label="Pages Monitored"
              sub="total pages scanned"
              accent="#38bdf8"
            />
            <StatCard
              value={avgScore}
              label="Avg SEO Score"
              sub="overall health score"
              accent={scoreColorHex(avgScore)}
            />
            <StatCard value={poorCount} label="Poor Health" sub="score below 50" accent="#ef4444" />
            <StatCard
              value={noOpenGraph}
              label="No Open Graph"
              sub="social sharing not set up"
              accent="#f97316"
            />
            <StatCard
              value={duplicateTitles}
              label="Duplicate Titles"
              sub="SEO penalty risk"
              accent="#a78bfa"
            />
          </div>

          {/* Filters — uniform 36px height for tabs and dropdown */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {/* Tab group */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                padding: "3px",
                height: 36,
                background: "var(--card-bg-color)",
                borderRadius: 8,
                border: "1px solid var(--card-border-color)",
                boxSizing: "border-box",
              }}
            >
              {FILTER_TABS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => {
                    setFilter(f.key);
                    setPage(0);
                  }}
                  style={{
                    height: 28,
                    padding: "0 14px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: filter === f.key ? 600 : 400,
                    background: filter === f.key ? "var(--card-border-color)" : "transparent",
                    color:
                      filter === f.key ? "var(--card-link-color)" : "var(--card-muted-fg-color)",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Issue dropdown — same 36px height */}
            <div
              style={{
                height: 36,
                fontSize: 12,
                padding: "0 12px",
                background: "var(--card-bg-color)",
                border: "1px solid var(--card-border-color)",
                borderRadius: 8,
                color: "var(--card-link-color)",
                cursor: "pointer",
                outline: "none",
                boxSizing: "border-box",
              }}
            >
              <select
                value={issueFilter}
                onChange={(e) => {
                  setIssueFilter(e.target.value);
                  setPage(0);
                }}
                style={{
                  height: 36,
                  fontSize: 12,
                  padding: "0",
                  background: "transparent",
                  border: "transparent",
                  borderRadius: 8,
                  color: "var(--card-link-color)",
                  cursor: "pointer",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              >
                <option value="all">All issues</option>
                {allIssueTypes.map((issue) => (
                  <option key={issue} value={issue}>
                    {issue}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
                      color: "var(--card-muted-fg-color)",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </div>
                ))}
              </div>

              <Stack space={2}>
                {filtered.length === 0 && (
                  <div
                    style={{
                      padding: "40px 0",
                      textAlign: "center",
                      color: "var(--card-muted-fg-color)",
                      fontSize: 14,
                      background: "var(--card-bg-color)",
                      borderRadius: 10,
                      border: "1px solid var(--card-border-color)",
                    }}
                  >
                    No pages match this filter
                  </div>
                )}

                {filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((doc) => (
                  <div
                    key={doc._id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "140px 1fr 80px 220px 60px",
                      gap: 16,
                      alignItems: "center",
                      padding: "14px 16px",
                      background: "var(--card-bg-color)",
                      border: "1px solid var(--card-border-color)",
                      borderRadius: 10,
                    }}
                  >
                    <ScoreBar score={doc.score} />

                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--card-fg-color)",
                          lineHeight: 1.4,
                          marginBottom: 3,
                        }}
                      >
                        {doc.docTitle}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--card-muted-fg-color)" }}>
                        Updated {new Date(doc._updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "3px 10px",
                        background: "var(--card-border-color)",
                        border: "1px solid var(--card-border-color)",
                        borderRadius: 99,
                        fontSize: 11,
                        color: "var(--card-link-color)",
                        fontWeight: 500,
                        width: "fit-content",
                      }}
                    >
                      {doc._type}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
                          <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>
                            All checks passed
                          </span>
                        </div>
                      ) : (
                        doc.issues.map((issue) => (
                          <div
                            key={issue}
                            style={{ display: "flex", alignItems: "flex-start", gap: 6 }}
                          >
                            <div
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background:
                                  doc.score === 0 ? "var(--card-muted-fg-color)" : "#ef4444",
                                flexShrink: 0,
                                marginTop: 3,
                              }}
                            />
                            <span
                              style={{
                                fontSize: 11,
                                color: "var(--card-fg-color)",
                                lineHeight: 1.5,
                              }}
                            >
                              {issue}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <IntentLink
                        intent="edit"
                        params={{ id: doc._id, type: doc._type }}
                        style={{
                          color: "var(--card-link-color)",
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: "none",
                          padding: "4px 10px",
                          border: "1px solid var(--card-border-color)",
                          borderRadius: 6,
                          background: "var(--card-bg-color)",
                          whiteSpace: "nowrap",
                          display: "inline-block",
                        }}
                      >
                        Open →
                      </IntentLink>
                    </div>
                  </div>
                ))}
              </Stack>

              {/* Pagination */}
              <Pagination
                page={page}
                total={filtered.length}
                pageSize={PAGE_SIZE}
                onPage={setPage}
              />
            </div>
          )}
        </Stack>
      </div>
    </Box>
  );
}
