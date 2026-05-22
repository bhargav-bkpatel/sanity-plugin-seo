import React, { useState, useCallback } from "react";
import { Stack, Text, Box } from "@sanity/ui";
import { RefreshIcon, SearchIcon, DownloadIcon } from "@sanity/icons";
import { useClient } from "sanity";
import useProEnabled from "../../hooks/useProEnabled";
import { computeSEOScore } from "../../utils/seoScore";
import ProGate from "./ProGate";
import BulkStatCards from "./bulk/BulkStatCards";
import BulkDocRow from "./bulk/BulkDocRow";
import BulkActions from "./bulk/BulkActions";
import { BulkDoc, RowEdit, BulkTab, getIssues } from "./bulk/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface CsvRow {
  _id: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  focusKeyword: string;
  ogTitle: string;
  ogDescription: string;
  seoStatus: string;
  found: boolean;
}

export default function BulkSEOPanel() {
  const client = useClient({ apiVersion: "2024-01-01" });

  // Document list + per-row state
  const [docs, setDocs] = useState<BulkDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rowEdits, setRowEdits] = useState<Record<string, RowEdit>>({});

  // Bulk action state
  const [bulkTab, setBulkTab] = useState<BulkTab>("canonical");
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkCanonicalBase, setBulkCanonicalBase] = useState("https://yoursite.com");
  const [bulkKeyword, setBulkKeyword] = useState("");
  const [bulkStatus, setBulkStatus] = useState("review");

  // CSV state
  const [csvPreview, setCsvPreview] = useState<CsvRow[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvApplying, setCsvApplying] = useState(false);

  // Operation log
  const [log, setLog] = useState<{ msg: string; ok: boolean }[]>([]);

  // ─── Scan ────────────────────────────────────────────────────────────────────

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    setLog([]);
    setExpandedId(null);
    setRowEdits({});
    setCsvPreview([]);
    setCsvError(null);
    try {
      const results: any[] = await client.fetch(`
        *[defined(seo) && !(_id in path("drafts.**"))] | order(_updatedAt desc) [0...200] {
          _id, _type,
          "docTitle": coalesce(title, name, slug.current, "Untitled"),
          "seo": seo
        }
      `);
      const scored = results.map((d) => ({
        ...d,
        score: computeSEOScore(d.seo || undefined).score,
        issues: getIssues(d.seo),
        selected: false,
      }));
      const withIssues = scored.filter((d) => d.issues.length > 0);
      setDocs(withIssues);

      const edits: Record<string, RowEdit> = {};
      withIssues.forEach((d) => {
        edits[d._id] = {
          metaTitle: d.seo?.metaTitle || "",
          metaDescription: d.seo?.metaDescription || "",
          canonicalUrl: d.seo?.canonicalUrl || "",
          focusKeyword: d.seo?.focusKeyword || "",
          ogTitle: d.seo?.openGraph?.title || "",
          ogDescription: d.seo?.openGraph?.description || "",
          seoStatus: d.seo?.seoStatus || "draft",
          saving: false,
          saved: false,
        };
      });
      setRowEdits(edits);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [client]);

  // ─── Row selection ───────────────────────────────────────────────────────────

  const toggleAll = () => {
    const allSelected = docs.every((d) => d.selected);
    setDocs((prev) => prev.map((d) => ({ ...d, selected: !allSelected })));
  };

  const toggleSelect = (id: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setDocs((prev) => prev.map((d) => (d._id === id ? { ...d, selected: !d.selected } : d)));
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ─── Per-row field editing ───────────────────────────────────────────────────

  const onFieldChange = (
    id: string,
    field: keyof Omit<RowEdit, "saving" | "saved">,
    val: string,
  ) => {
    setRowEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: val, saved: false } }));
  };

  const saveRow = useCallback(
    async (doc: BulkDoc) => {
      const edit = rowEdits[doc._id];
      if (!edit) return;
      setRowEdits((prev) => ({ ...prev, [doc._id]: { ...prev[doc._id], saving: true } }));
      try {
        const patch: Record<string, any> = {
          "seo.seoStatus": edit.seoStatus,
        };
        if (edit.metaTitle) patch["seo.metaTitle"] = edit.metaTitle;
        if (edit.metaDescription) patch["seo.metaDescription"] = edit.metaDescription;
        if (edit.canonicalUrl) patch["seo.canonicalUrl"] = edit.canonicalUrl;
        if (edit.focusKeyword) patch["seo.focusKeyword"] = edit.focusKeyword;
        if (edit.ogTitle) patch["seo.openGraph.title"] = edit.ogTitle;
        if (edit.ogDescription) patch["seo.openGraph.description"] = edit.ogDescription;
        await client.patch(doc._id).set(patch).commit();
        setRowEdits((prev) => ({
          ...prev,
          [doc._id]: { ...prev[doc._id], saving: false, saved: true },
        }));
        setTimeout(fetchDocs, 900);
      } catch (err) {
        setRowEdits((prev) => ({ ...prev, [doc._id]: { ...prev[doc._id], saving: false } }));
        setLog([{ msg: `✗ Failed to save "${doc.docTitle}": ${String(err)}`, ok: false }]);
      }
    },
    [client, rowEdits, fetchDocs],
  );

  // ─── Bulk apply ──────────────────────────────────────────────────────────────

  const runBulk = useCallback(async () => {
    const selected = docs.filter((d) => d.selected);
    if (!selected.length) return;

    let actionLabel = "SEO status";
    if (bulkTab === "canonical") actionLabel = "canonical URL";
    else if (bulkTab === "keyword") actionLabel = "focus keyword";

    setBulkProcessing(true);
    setLog([{ msg: `Applying ${actionLabel} to ${selected.length} page(s)…`, ok: true }]);

    const results = await Promise.allSettled(
      selected.map(async (doc) => {
        if (bulkTab === "canonical") {
          const slug = doc.docTitle
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          const canonical = `${bulkCanonicalBase.replace(/\/$/, "")}/${doc._type}/${slug}`;
          await client.patch(doc._id).set({ "seo.canonicalUrl": canonical }).commit();
          return { docTitle: doc.docTitle, detail: canonical };
        }
        if (bulkTab === "keyword") {
          await client.patch(doc._id).set({ "seo.focusKeyword": bulkKeyword.trim() }).commit();
          return { docTitle: doc.docTitle, detail: bulkKeyword.trim() };
        }
        await client.patch(doc._id).set({ "seo.seoStatus": bulkStatus }).commit();
        return { docTitle: doc.docTitle, detail: bulkStatus };
      }),
    );

    const newLog: { msg: string; ok: boolean }[] = [];
    results.forEach((r) => {
      if (r.status === "fulfilled") {
        newLog.push({ msg: `✓  ${r.value.docTitle}  →  ${r.value.detail}`, ok: true });
      } else {
        newLog.push({ msg: `✗  Failed: ${String(r.reason)}`, ok: false });
      }
    });
    const ok = results.filter((r) => r.status === "fulfilled").length;
    newLog.push({ msg: `Done — ${ok} of ${selected.length} updated.`, ok: true });
    setLog(newLog);
    setBulkProcessing(false);
    fetchDocs();
  }, [docs, client, bulkTab, bulkCanonicalBase, bulkKeyword, bulkStatus, fetchDocs]);

  // ─── CSV export ──────────────────────────────────────────────────────────────

  const exportCSV = useCallback(() => {
    const header =
      "_id,title,type,metaTitle,metaDescription,canonicalUrl,focusKeyword,ogTitle,ogDescription,seoStatus";
    const q = (v: string) => `"${(v || "").replace(/"/g, '""')}"`;
    const rows = docs.map((d) =>
      [
        d._id,
        q(d.docTitle),
        d._type,
        q(d.seo?.metaTitle || ""),
        q(d.seo?.metaDescription || ""),
        q(d.seo?.canonicalUrl || ""),
        q(d.seo?.focusKeyword || ""),
        q(d.seo?.openGraph?.title || ""),
        q(d.seo?.openGraph?.description || ""),
        d.seo?.seoStatus || "draft",
      ].join(","),
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seo-bulk-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [docs]);

  // ─── CSV import ──────────────────────────────────────────────────────────────

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  };

  const handleCSVFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCsvError(null);
      setCsvPreview([]);
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        const lines = text.trim().split(/\r?\n/);
        if (lines.length < 2) {
          setCsvError("CSV must have a header row and at least one data row.");
          return;
        }
        const headers = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase());
        const idIdx = headers.indexOf("_id");
        const mtIdx = headers.indexOf("metatitle");
        const mdIdx = headers.indexOf("metadescription");
        const canonIdx = headers.indexOf("canonicalurl");
        const kwIdx = headers.indexOf("focuskeyword");
        const ogTIdx = headers.indexOf("ogtitle");
        const ogDIdx = headers.indexOf("ogdescription");
        const stIdx = headers.indexOf("seostatus");
        if (idIdx === -1) {
          setCsvError('CSV must include an "_id" column.');
          return;
        }
        const col = (cols: string[], idx: number) => (idx >= 0 ? cols[idx]?.trim() || "" : "");
        const docMap = Object.fromEntries(docs.map((d) => [d._id, d]));
        const preview: CsvRow[] = lines.slice(1).map((line) => {
          const cols = parseCSVLine(line);
          const id = cols[idIdx]?.trim() || "";
          return {
            _id: id,
            title: docMap[id]?.docTitle ?? id,
            metaTitle: col(cols, mtIdx),
            metaDescription: col(cols, mdIdx),
            canonicalUrl: col(cols, canonIdx),
            focusKeyword: col(cols, kwIdx),
            ogTitle: col(cols, ogTIdx),
            ogDescription: col(cols, ogDIdx),
            seoStatus: col(cols, stIdx),
            found: Boolean(docMap[id]),
          };
        });
        setCsvPreview(preview);
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [docs],
  );

  const applyCSV = useCallback(async () => {
    const toApply = csvPreview.filter((r) => r.found);
    if (!toApply.length) return;
    setCsvApplying(true);
    setLog([{ msg: `Applying CSV to ${toApply.length} page(s)…`, ok: true }]);

    const results = await Promise.allSettled(
      toApply.map(async (row) => {
        const patch: Record<string, string> = {};
        if (row.metaTitle) patch["seo.metaTitle"] = row.metaTitle;
        if (row.metaDescription) patch["seo.metaDescription"] = row.metaDescription;
        if (row.canonicalUrl) patch["seo.canonicalUrl"] = row.canonicalUrl;
        if (row.focusKeyword) patch["seo.focusKeyword"] = row.focusKeyword;
        if (row.ogTitle) patch["seo.openGraph.title"] = row.ogTitle;
        if (row.ogDescription) patch["seo.openGraph.description"] = row.ogDescription;
        if (row.seoStatus) patch["seo.seoStatus"] = row.seoStatus;
        await client.patch(row._id).set(patch).commit();
        return { title: row.title };
      }),
    );

    const newLog: { msg: string; ok: boolean }[] = [];
    results.forEach((r) => {
      if (r.status === "fulfilled") {
        newLog.push({ msg: `✓  ${r.value.title}`, ok: true });
      } else {
        newLog.push({ msg: `✗  Failed: ${String(r.reason)}`, ok: false });
      }
    });
    const ok = results.filter((r) => r.status === "fulfilled").length;
    newLog.push({ msg: `Done — ${ok} of ${toApply.length} updated.`, ok: true });
    setLog(newLog);
    setCsvApplying(false);
    setCsvPreview([]);
    fetchDocs();
  }, [csvPreview, client, fetchDocs]);

  // ─── Derived stats ───────────────────────────────────────────────────────────

  const selectedCount = docs.filter((d) => d.selected).length;
  const titleIssues = docs.filter((d) => d.issues.some((i) => i.includes("title"))).length;
  const descIssues = docs.filter((d) => d.issues.some((i) => i.includes("description"))).length;
  const noCanonical = docs.filter((d) => d.issues.includes("No canonical URL")).length;
  const avgScore =
    docs.length > 0 ? Math.round(docs.reduce((s, d) => s + d.score, 0) / docs.length) : 0;

  const { isPro } = useProEnabled();
  const scanLabel = loaded ? "Re-scan Pages" : "Scan Pages";

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <ProGate feature="SEO Optimizer" isPro={isPro} variant="page">
      <Box style={{ minHeight: "100vh", background: "#070d1a", padding: "32px 40px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <Stack space={5}>
            {/* Header */}
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
                  Bulk SEO Management
                </Text>
                <div style={{ marginTop: 6 }}>
                  <Text size={1} style={{ color: "#64748b" }}>
                    {loaded
                      ? `Found ${docs.length} page${
                          docs.length !== 1 ? "s" : ""
                        } with SEO issues — click any row to edit inline`
                      : "Scan all your content at once to find and fix SEO issues in bulk"}
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
                {loading ? (
                  <RefreshIcon style={{ fontSize: 16 }} />
                ) : (
                  <SearchIcon style={{ fontSize: 16 }} />
                )}
                {loading ? "Scanning…" : scanLabel}
              </button>
            </div>

            {/* Stat cards — always visible, dims when not yet scanned */}
            <BulkStatCards
              avgScore={avgScore}
              titleIssues={titleIssues}
              descIssues={descIssues}
              noCanonical={noCanonical}
              loaded={loaded}
            />

            {/* All clear */}
            {loaded && docs.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  background: "#0f172a",
                  borderRadius: 12,
                  border: "1px solid #1e293b",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", marginBottom: 6 }}>
                  All pages look great!
                </div>
                <div style={{ fontSize: 13, color: "#475569" }}>
                  No SEO issues found across your content.
                </div>
              </div>
            )}

            {/* Document table */}
            {docs.length > 0 && (
              <div>
                {/* Column headers */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "36px 90px 1fr 80px 200px 28px",
                    gap: 12,
                    padding: "6px 16px",
                    marginBottom: 4,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={docs.length > 0 && docs.every((d) => d.selected)}
                      onChange={toggleAll}
                      style={{ cursor: "pointer", accentColor: "#60a5fa" }}
                    />
                  </div>
                  {["Score", "Page", "Type", "Issues"].map((h) => (
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
                  <div />
                </div>

                <Stack space={2}>
                  {docs.map((doc) => (
                    <BulkDocRow
                      key={doc._id}
                      doc={doc}
                      edit={
                        rowEdits[doc._id] || {
                          metaTitle: "",
                          metaDescription: "",
                          canonicalUrl: "",
                          focusKeyword: "",
                          ogTitle: "",
                          ogDescription: "",
                          seoStatus: "draft",
                          saving: false,
                          saved: false,
                        }
                      }
                      isOpen={expandedId === doc._id}
                      onToggleExpand={toggleExpand}
                      onToggleSelect={toggleSelect}
                      onFieldChange={onFieldChange}
                      onSave={saveRow}
                    />
                  ))}
                </Stack>

                {/* Footer row: count + export */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 16,
                  }}
                >
                  <span style={{ fontSize: 12, color: "#475569" }}>
                    {docs.length} pages with SEO issues · click a row to edit
                  </span>
                  <button
                    type="button"
                    onClick={exportCSV}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      background: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: 8,
                      color: "#94a3b8",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    <DownloadIcon style={{ fontSize: 14 }} />
                    Export CSV
                  </button>
                </div>
              </div>
            )}

            {/* Bulk actions — only shown when rows are selected */}
            {selectedCount > 0 && (
              <BulkActions
                selectedCount={selectedCount}
                bulkTab={bulkTab}
                onTabChange={setBulkTab}
                bulkCanonicalBase={bulkCanonicalBase}
                onCanonicalBaseChange={setBulkCanonicalBase}
                bulkKeyword={bulkKeyword}
                onKeywordChange={setBulkKeyword}
                bulkStatus={bulkStatus}
                onStatusChange={setBulkStatus}
                bulkProcessing={bulkProcessing}
                onApply={runBulk}
                csvPreview={csvPreview}
                csvError={csvError}
                csvApplying={csvApplying}
                onCSVFile={handleCSVFile}
                onApplyCSV={applyCSV}
              />
            )}

            {/* Operation log */}
            {log.length > 0 && (
              <div
                style={{
                  background: "#020408",
                  border: "1px solid #1e293b",
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "monospace",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#475569",
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Operation Log
                </div>
                <div style={{ maxHeight: 200, overflow: "auto" }}>
                  {log.map((entry, i) => (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      style={{
                        fontSize: 12,
                        color: entry.ok ? "#4ade80" : "#f87171",
                        lineHeight: 1.7,
                        borderBottom: i < log.length - 1 ? "1px solid #0f172a" : "none",
                        paddingBottom: 2,
                      }}
                    >
                      {entry.msg}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Initial empty state */}
            {!loaded && !loading && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  background: "#0f172a",
                  borderRadius: 12,
                  border: "1px dashed #1e293b",
                }}
              >
                <SearchIcon style={{ fontSize: 36, color: "#1e293b", marginBottom: 12 }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc", marginBottom: 6 }}>
                  Scan your content for SEO issues
                </div>
                <div style={{ fontSize: 13, color: "#475569", marginBottom: 20 }}>
                  Click a page row to expand and edit all its SEO fields individually, or select
                  multiple pages for bulk changes
                </div>
                <button
                  type="button"
                  onClick={fetchDocs}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 24px",
                    background: "#1e3a5f",
                    border: "1px solid #2d4a7a",
                    borderRadius: 8,
                    color: "#60a5fa",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <SearchIcon style={{ fontSize: 16 }} />
                  Scan Pages
                </button>
              </div>
            )}
          </Stack>
        </div>
      </Box>
    </ProGate>
  );
}
