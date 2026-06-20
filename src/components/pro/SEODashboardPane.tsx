import React, { useEffect, useState, useCallback } from "react";
import { useClient } from "sanity";
import { IntentLink } from "sanity/router";
import { Stack, Text, Flex, Spinner, Box } from "@sanity/ui";
import { RefreshIcon, ActivityIcon } from "@sanity/icons";
import useProEnabled from "../../hooks/useProEnabled";
import { computeSEOScore } from "../../utils/seoScore";
import ProGate from "./ProGate";
import Pagination from "./Pagination";

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

interface ScanCache {
  docs: ScoredDoc[];
  timestamp: number;
}
const CACHE_TTL_MS = 5 * 60 * 1000;
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

function getIssues(seo: Record<string, any> | null): string[] {
  if (!seo) return ["No SEO data — open this document and fill in SEO fields"];
  const issues: string[] = [];
  if (!seo.metaTitle) issues.push("Missing meta title");
  else if (seo.metaTitle.length < 50 || seo.metaTitle.length > 60)
    issues.push("Title length out of range");
  if (!seo.metaDescription) issues.push("Missing meta description");
  else if (seo.metaDescription.length < 100 || seo.metaDescription.length > 160)
    issues.push("Description length out of range");
  if (!seo.openGraph?.image?.asset) issues.push("Missing OG image");
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

function getDocColor(score: number): "green" | "orange" | "red" {
  if (score >= 80) return "green";
  if (score >= 50) return "orange";
  return "red";
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
        borderWidth: "1px 1px 1px 4px",
        borderStyle: "solid",
        borderColor: `var(--card-border-color) var(--card-border-color) var(--card-border-color) ${accent}`,
        borderRadius: 12,
        padding: "20px 24px",
        flex: 1,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
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

function DashboardRow({ doc }: { doc: ScoredDoc }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "140px 1fr 80px 220px 60px",
        gap: 16,
        alignItems: "center",
        padding: "14px 16px",
        background: "var(--card-bg-color)",
        border: `1px solid ${hovered ? "var(--card-link-color)" : "var(--card-border-color)"}`,
        borderRadius: 10,
        boxShadow: hovered ? "0 4px 12px rgba(0, 0, 0, 0.04)" : "none",
        transform: hovered ? "translateY(-1px)" : "none",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
            <div key={issue} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: doc.score === 0 ? "var(--card-muted-fg-color)" : "#ef4444",
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
            color: hovered ? "#fff" : "var(--card-link-color)",
            fontSize: 12,
            fontWeight: 600,
            textDecoration: "none",
            padding: "5px 12px",
            border: hovered ? "none" : "1px solid var(--card-border-color)",
            borderRadius: 6,
            background: hovered ? "var(--card-link-color)" : "var(--card-bg-color)",
            whiteSpace: "nowrap",
            display: "inline-block",
            transition: "all 0.2s ease",
            boxShadow: hovered ? "0 2px 6px rgba(0, 0, 0, 0.15)" : "none",
          }}
        >
          Open →
        </IntentLink>
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
  const [docs, setDocs] = useState<ScoredDoc[]>(() => getCached() ?? []);
  const [loading, setLoading] = useState(() => getCached() === null);
  const [cacheAge, setCacheAge] = useState<string | null>(() => getCacheAge());
  const [filter, setFilter] = useState<"all" | "poor" | "ok" | "good">("all");
  const [issueFilter, setIssueFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const { isPro } = useProEnabled();
  const [refreshHovered, setRefreshHovered] = useState(false);

  const fetchDocs = useCallback(
    async (bust = false) => {
      if (bust) clearDashboardCache();
      const cached = getCached();
      if (cached) {
        setDocs(cached);
        setCacheAge(getCacheAge());
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const results: DocSEO[] = await client.fetch(
          `*[!(_id in path("drafts.**")) && defined(seo)]
          | order(_updatedAt desc) [0...200] {
          _id, _type, _updatedAt,
          "docTitle": coalesce(title, name, slug.current, _type, "Untitled"),
          "seo": seo
        }`,
          { _ts: Date.now() },
        );

        const initial = results.map((doc) => {
          const result = computeSEOScore(doc.seo || undefined);
          let color: "green" | "orange" | "red" = "red";
          if (result.score >= 80) {
            color = "green";
          } else if (result.score >= 50) {
            color = "orange";
          }
          return { ...doc, score: result.score, color, issues: getIssues(doc.seo) };
        });

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
    const docColor = getDocColor(d.score);
    if (filter === "poor" && docColor !== "red") return false;
    if (filter === "ok" && docColor !== "orange") return false;
    if (filter === "good" && docColor !== "green") return false;
    if (issueFilter !== "all" && !d.issues.includes(issueFilter)) return false;
    return true;
  });

  const totalDocs = docs.length;
  const goodCount = docs.filter((d) => getDocColor(d.score) === "green").length;
  const okCount = docs.filter((d) => getDocColor(d.score) === "orange").length;
  const poorCount = docs.filter((d) => getDocColor(d.score) === "red").length;
  const avgScore =
    totalDocs > 0 ? Math.round(docs.reduce((s, d) => s + d.score, 0) / totalDocs) : 0;
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
          <div
            style={{
              background: "var(--card-bg-color)",
              border: "1px solid var(--card-border-color)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
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
                padding: "12px 24px",
                background: loading ? "var(--card-border-color)" : "var(--card-bg-color)",
                border: "1px solid var(--card-border-color)",
                borderRadius: 10,
                color: loading ? "var(--card-muted-fg-color)" : "var(--card-link-color)",
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                flexShrink: 0,
                marginTop: 4,
                boxShadow: refreshHovered && !loading ? "0 4px 12px rgba(0, 0, 0, 0.08)" : "none",
                transform: refreshHovered && !loading ? "translateY(-1px)" : "none",
              }}
              onMouseEnter={() => setRefreshHovered(true)}
              onMouseLeave={() => setRefreshHovered(false)}
            >
              <RefreshIcon style={{ fontSize: 15 }} />
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>

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

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
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

          {loading ? (
            <Flex justify="center" padding={8}>
              <Spinner />
            </Flex>
          ) : (
            <div>
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

                {filtered.slice(page * pageSize, (page + 1) * pageSize).map((doc) => (
                  <DashboardRow doc={doc} key={doc._id} />
                ))}
              </Stack>

              <Pagination
                page={page}
                total={filtered.length}
                pageSize={pageSize}
                onPage={setPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          )}
        </Stack>
      </div>
    </Box>
  );
}
