import React, { useState, useCallback, useEffect } from "react";
import { useClient } from "sanity";
import { Box, Stack, Text, Spinner } from "@sanity/ui";
import { RefreshIcon, ActivityIcon, EditIcon, ClockIcon, CheckmarkCircleIcon } from "@sanity/icons";
import useProEnabled from "../../hooks/useProEnabled";
import { computeSEOScore } from "../../utils/seoScore";
import { scoreColor } from "./bulk/types";
import ProGate from "./ProGate";
import WorkflowStatCard from "./workflow/WorkflowStatCard";
import WorkflowRow from "./workflow/WorkflowRow";
import { WorkflowDoc, WorkflowStatus, STATUS_CFG, buildIssues } from "./workflow/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function WorkflowDashboard() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const { isPro } = useProEnabled();

  const [docs, setDocs] = useState<WorkflowDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<WorkflowStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [patching, setPatching] = useState<Record<string, boolean>>({});

  // ── Data fetching ───────────────────────────────────────────────────────────

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const results: any[] = await client.fetch(`
        *[!(_id in path("drafts.**")) && defined(seo)] | order(_updatedAt desc) [0...300] {
          _id, _type, _updatedAt,
          "docTitle": coalesce(title, name, slug.current, "Untitled"),
          "seoStatus": coalesce(seo.seoStatus, "draft"),
          "reviewNotes": coalesce(seo.seoReviewNotes, ""),
          "seo": seo
        }
      `);
      setDocs(
        results.map((d) => ({
          ...d,
          score: computeSEOScore(d.seo || undefined).score,
          issues: buildIssues(d.seo),
          reviewNotes: d.reviewNotes || "",
        })),
      );
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  // ── Mutations ───────────────────────────────────────────────────────────────

  const patchStatus = useCallback(
    async (doc: WorkflowDoc, newStatus: WorkflowStatus) => {
      setPatching((p) => ({ ...p, [doc._id]: true }));
      try {
        await client.patch(doc._id).set({ "seo.seoStatus": newStatus }).commit();
        setDocs((prev) =>
          prev.map((d) => (d._id === doc._id ? { ...d, seoStatus: newStatus } : d)),
        );
      } finally {
        setPatching((p) => ({ ...p, [doc._id]: false }));
      }
    },
    [client],
  );

  const patchNotes = useCallback(
    async (doc: WorkflowDoc, notes: string) => {
      await client.patch(doc._id).set({ "seo.seoReviewNotes": notes }).commit();
      setDocs((prev) => prev.map((d) => (d._id === doc._id ? { ...d, reviewNotes: notes } : d)));
    },
    [client],
  );

  // ── Derived values ──────────────────────────────────────────────────────────

  const draftCount = docs.filter((d) => d.seoStatus === "draft").length;
  const reviewCount = docs.filter((d) => d.seoStatus === "review").length;
  const approvedCount = docs.filter((d) => d.seoStatus === "approved").length;
  const avgScore =
    docs.length > 0 ? Math.round(docs.reduce((s, d) => s + d.score, 0) / docs.length) : 0;

  const docTypes = Array.from(new Set(docs.map((d) => d._type))).sort();

  const visible = docs.filter((d) => {
    if (filter !== "all" && d.seoStatus !== filter) return false;
    if (typeFilter !== "all" && d._type !== typeFilter) return false;
    return true;
  });

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <ProGate feature="SEO Workflow Dashboard" isPro={isPro} variant="page">
      <Box style={{ minHeight: "100vh", background: "#070d1a", padding: "32px 40px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <Stack space={5}>
            <Header
              loading={loading}
              loaded={loaded}
              docCount={docs.length}
              avgScore={avgScore}
              onRefresh={fetchDocs}
            />

            {/* Stat cards */}
            <div style={{ display: "flex", gap: 14 }}>
              <WorkflowStatCard
                value={docs.length}
                label="All Documents"
                sub="with SEO data"
                accent={scoreColor(avgScore)}
                active={filter === "all"}
                icon={ActivityIcon}
                onClick={() => setFilter("all")}
              />
              <WorkflowStatCard
                value={draftCount}
                label="Draft"
                sub="not yet submitted"
                accent="#94a3b8"
                active={filter === "draft"}
                icon={EditIcon}
                onClick={() => setFilter("draft")}
              />
              <WorkflowStatCard
                value={reviewCount}
                label="Needs Review"
                sub="awaiting approval"
                accent="#f59e0b"
                active={filter === "review"}
                icon={ClockIcon}
                onClick={() => setFilter("review")}
              />
              <WorkflowStatCard
                value={approvedCount}
                label="Approved"
                sub="SEO cleared"
                accent="#22c55e"
                active={filter === "approved"}
                icon={CheckmarkCircleIcon}
                onClick={() => setFilter("approved")}
              />
            </div>

            {/* Loading state */}
            {loading && !loaded && (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <Spinner muted />
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 12 }}>
                  Scanning documents…
                </div>
              </div>
            )}

            {/* Document list */}
            {loaded && (
              <div>
                <FilterBar
                  docs={docs}
                  filter={filter}
                  typeFilter={typeFilter}
                  docTypes={docTypes}
                  visible={visible}
                  onFilterChange={setFilter}
                  onTypeFilterChange={setTypeFilter}
                />

                {visible.length === 0 && <EmptyState filter={filter} />}

                <Stack space={3}>
                  {visible.map((doc) => (
                    <WorkflowRow
                      key={doc._id}
                      doc={doc}
                      isOpen={expandedId === doc._id}
                      onToggle={() => setExpandedId((prev) => (prev === doc._id ? null : doc._id))}
                      patching={!!patching[doc._id]}
                      onPatch={patchStatus}
                      onSaveNotes={patchNotes}
                    />
                  ))}
                </Stack>

                {visible.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>
                      {visible.length === docs.length
                        ? `${docs.length} document${docs.length !== 1 ? "s" : ""}`
                        : `${visible.length} of ${docs.length} documents`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </Stack>
        </div>
      </Box>
    </ProGate>
  );
}

// ── Local layout components ──────────────────────────────────────────────────

function Header({
  loading,
  loaded,
  docCount,
  avgScore,
  onRefresh,
}: {
  loading: boolean;
  loaded: boolean;
  docCount: number;
  avgScore: number;
  onRefresh: () => void;
}) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0d1a2e 0%, #111f38 60%, #0a1628 100%)",
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <ActivityIcon style={{ fontSize: 16, color: "#60a5fa" }} />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#60a5fa",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            SEO Workflow
          </span>
        </div>
        <Text size={4} weight="bold" style={{ color: "#f0f9ff" }}>
          Workflow Dashboard
        </Text>
        <div style={{ marginTop: 6 }}>
          <Text size={1} style={{ color: "#94a3b8" }}>
            {loaded
              ? `${docCount} document${
                  docCount !== 1 ? "s" : ""
                } — avg score ${avgScore} — click a card to filter, expand a row to see issues`
              : "Loading your content workflow…"}
          </Text>
        </div>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 24px",
          background: loading ? "#0d1a2e" : "#1e3a5f",
          border: `1px solid ${loading ? "#1e3a5f" : "#2d4a7a"}`,
          borderRadius: 10,
          color: loading ? "#4b5563" : "#93c5fd",
          fontSize: 14,
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          whiteSpace: "nowrap",
          boxShadow: loading ? "none" : "0 0 20px #2d4a7a50",
          transition: "all 0.2s",
          flexShrink: 0,
        }}
      >
        <RefreshIcon style={{ fontSize: 16 }} />
        {loading ? "Loading…" : "Refresh"}
      </button>
    </div>
  );
}

function FilterBar({
  docs,
  filter,
  typeFilter,
  docTypes,
  visible,
  onFilterChange,
  onTypeFilterChange,
}: {
  docs: WorkflowDoc[];
  filter: WorkflowStatus | "all";
  typeFilter: string;
  docTypes: string[];
  visible: WorkflowDoc[];
  onFilterChange: (f: WorkflowStatus | "all") => void;
  onTypeFilterChange: (t: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      {/* Status filter tabs */}
      <div style={{ display: "flex", gap: 4 }}>
        {(["all", "draft", "review", "approved"] as const).map((f) => {
          const isActive = filter === f;
          const cfg = f !== "all" ? STATUS_CFG[f] : null;
          const count = f === "all" ? docs.length : docs.filter((d) => d.seoStatus === f).length;
          return (
            <button
              key={f}
              type="button"
              onClick={() => onFilterChange(f)}
              style={{
                padding: "5px 13px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: isActive ? 700 : 400,
                background: isActive ? cfg?.bg ?? "#1e3a5f" : "transparent",
                color: isActive ? cfg?.color ?? "#60a5fa" : "#64748b",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {cfg && <cfg.Icon style={{ fontSize: 14 }} />}
              {f === "all" ? "All" : STATUS_CFG[f as WorkflowStatus].label}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "1px 5px",
                  borderRadius: 99,
                  background: isActive ? "rgba(255,255,255,0.15)" : "#1e293b",
                  color: isActive ? cfg?.color ?? "#60a5fa" : "#94a3b8",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Document type dropdown */}
      {docTypes.length > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Type:
          </span>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            style={{
              height: 32,
              fontSize: 12,
              padding: "0 10px",
              background: "#0a1020",
              border: "1px solid #1a2a40",
              borderRadius: 8,
              color: "#7dd3fc",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="all">All types ({docs.length})</option>
            {docTypes.map((t) => (
              <option key={t} value={t}>
                {t} ({docs.filter((d) => d._type === t).length})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

function EmptyState({ filter }: { filter: WorkflowStatus | "all" }) {
  const titles: Record<string, string> = {
    review: "Nothing waiting for review",
    approved: "No approved documents yet",
    all: "No documents match this filter",
    draft: "No documents match this filter",
  };
  const subs: Record<string, string> = {
    review: "When a document is submitted for review it will appear here.",
    approved: "Mark a document as Approved to see it here.",
    all: "Try a different filter.",
    draft: "Try a different filter.",
  };
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 0",
        background: "#0f172a",
        borderRadius: 12,
        border: "1px solid #1e293b",
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 10 }}>{filter === "approved" ? "🎉" : "📭"}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc", marginBottom: 6 }}>
        {titles[filter] ?? "No documents match this filter"}
      </div>
      <div style={{ fontSize: 12, color: "#64748b" }}>
        {subs[filter] ?? "Try a different filter."}
      </div>
    </div>
  );
}
