import React, { useRef } from "react";
import { DownloadIcon, UploadIcon } from "@sanity/icons";
import { BulkTab, SEO_STATUSES, INPUT_STYLE, FIELD_LABEL } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface CsvRow {
  _id: string;
  title: string;
  canonicalUrl: string;
  focusKeyword: string;
  seoStatus: string;
  found: boolean;
}

interface Props {
  selectedCount: number;
  bulkTab: BulkTab;
  onTabChange: (tab: BulkTab) => void;

  bulkCanonicalBase: string;
  onCanonicalBaseChange: (v: string) => void;

  bulkKeyword: string;
  onKeywordChange: (v: string) => void;

  bulkStatus: string;
  onStatusChange: (v: string) => void;

  bulkProcessing: boolean;
  onApply: () => void;

  csvPreview: CsvRow[];
  csvError: string | null;
  csvApplying: boolean;
  onCSVFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyCSV: () => void;
}

const TAB_LABELS: Record<BulkTab, string> = {
  canonical: "Canonical URLs",
  keyword: "Focus Keyword",
  status: "SEO Status",
  csv: "Import CSV",
};

export default function BulkActions({
  selectedCount,
  bulkTab,
  onTabChange,
  bulkCanonicalBase,
  onCanonicalBaseChange,
  bulkKeyword,
  onKeywordChange,
  bulkStatus,
  onStatusChange,
  bulkProcessing,
  onApply,
  csvPreview,
  csvError,
  csvApplying,
  onCSVFile,
  onApplyCSV,
}: Props) {
  const csvFileRef = useRef<HTMLInputElement>(null);

  const canApply =
    !bulkProcessing &&
    selectedCount > 0 &&
    (bulkTab !== "canonical" || bulkCanonicalBase.trim() !== "") &&
    (bulkTab !== "keyword" || bulkKeyword.trim() !== "");

  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #2d4a7a",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* Header + tabs */}
      <div
        style={{
          padding: "10px 16px",
          background: "#080e1a",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#475569",
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          Bulk Actions
        </span>
        <span
          style={{
            padding: "2px 8px",
            background: "#1e3a5f",
            color: "#60a5fa",
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {selectedCount} selected
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 4 }}>
          {(Object.keys(TAB_LABELS) as BulkTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              style={{
                padding: "5px 13px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: bulkTab === tab ? 600 : 400,
                background: bulkTab === tab ? "#1e3a5f" : "transparent",
                color: bulkTab === tab ? "#60a5fa" : "#64748b",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {tab === "csv" && <UploadIcon style={{ fontSize: 13 }} />}
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Tab body */}
      <div style={{ padding: "16px 20px" }}>
        {/* Canonical URL */}
        {bulkTab === "canonical" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={FIELD_LABEL}>Base URL</span>
              <input
                type="text"
                value={bulkCanonicalBase}
                onChange={(e) => onCanonicalBaseChange(e.target.value)}
                placeholder="https://yoursite.com"
                style={INPUT_STYLE}
              />
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "#475569" }}>
              Generates:{" "}
              <code style={{ color: "#94a3b8" }}>
                {bulkCanonicalBase.replace(/\/$/, "")}/[type]/[title-slug]
              </code>
            </div>
          </>
        )}

        {/* Focus Keyword */}
        {bulkTab === "keyword" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={FIELD_LABEL}>Keyword</span>
              <input
                type="text"
                value={bulkKeyword}
                onChange={(e) => onKeywordChange(e.target.value)}
                placeholder="e.g. sanity cms tutorial"
                style={INPUT_STYLE}
              />
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "#475569" }}>
              Sets the same focus keyword on all selected pages. Useful for topic clusters.
            </div>
          </>
        )}

        {/* SEO Status */}
        {bulkTab === "status" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={FIELD_LABEL}>Set Status</span>
              <select
                value={bulkStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                style={{ ...INPUT_STYLE, flex: "0 0 200px", cursor: "pointer" }}
              >
                {SEO_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "#475569" }}>
              Updates the team workflow status on all selected pages.
            </div>
          </>
        )}

        {/* CSV Import */}
        {bulkTab === "csv" && (
          <CsvImportTab
            csvFileRef={csvFileRef}
            csvPreview={csvPreview}
            csvError={csvError}
            csvApplying={csvApplying}
            onCSVFile={onCSVFile}
            onApplyCSV={onApplyCSV}
          />
        )}

        {/* Apply button — only for non-CSV tabs */}
        {bulkTab !== "csv" && (
          <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onApply}
              disabled={!canApply}
              style={{
                padding: "8px 20px",
                background: canApply ? "#1e3a5f" : "#1e293b",
                border: "1px solid",
                borderColor: canApply ? "#2d4a7a" : "#1e293b",
                borderRadius: 8,
                color: canApply ? "#60a5fa" : "#475569",
                fontSize: 13,
                fontWeight: 600,
                cursor: canApply ? "pointer" : "not-allowed",
                whiteSpace: "nowrap",
              }}
            >
              {bulkProcessing ? "Applying…" : `Apply to ${selectedCount} pages`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CsvImportTab({
  csvFileRef,
  csvPreview,
  csvError,
  csvApplying,
  onCSVFile,
  onApplyCSV,
}: {
  csvFileRef: React.RefObject<HTMLInputElement | null>;
  csvPreview: CsvRow[];
  csvError: string | null;
  csvApplying: boolean;
  onCSVFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyCSV: () => void;
}) {
  const matched = csvPreview.filter((r) => r.found).length;
  const unmatched = csvPreview.filter((r) => !r.found).length;

  return (
    <>
      {/* Instructions */}
      <div
        style={{
          background: "#0a1628",
          border: "1px solid #1e293b",
          borderRadius: 8,
          padding: "12px 14px",
          marginBottom: 14,
          fontSize: 12,
          color: "#64748b",
          lineHeight: 1.7,
        }}
      >
        <div style={{ fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>
          Expected CSV headers (first row):
        </div>
        <code style={{ color: "#60a5fa", fontSize: 11 }}>
          _id, metaTitle, metaDescription, canonicalUrl, focusKeyword, ogTitle, ogDescription,
          seoStatus
        </code>
        <div style={{ marginTop: 6 }}>
          Use{" "}
          <strong style={{ color: "#94a3b8" }}>
            <DownloadIcon style={{ fontSize: 12 }} /> Export CSV
          </strong>{" "}
          below the table to get a pre-filled template with current values — then edit in Excel or
          Google Sheets and re-import here.
        </div>
      </div>

      {/* File picker */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={FIELD_LABEL}>CSV File</span>
        <button
          type="button"
          onClick={() => csvFileRef.current?.click()}
          style={{
            padding: "7px 14px",
            background: "#1e3a5f",
            border: "1px solid #2d4a7a",
            borderRadius: 6,
            color: "#60a5fa",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <UploadIcon style={{ fontSize: 14 }} />
          Choose File
        </button>
        <input
          ref={csvFileRef}
          type="file"
          accept=".csv,text/csv"
          onChange={onCSVFile}
          style={{ display: "none" }}
          aria-hidden="true"
        />
        <span style={{ fontSize: 11, color: "#475569" }}>
          {csvPreview.length > 0 ? `${csvPreview.length} rows parsed` : "No file selected"}
        </span>
      </div>

      {/* Error */}
      {csvError && (
        <div
          style={{
            marginTop: 10,
            padding: "8px 12px",
            background: "#450a0a",
            border: "1px solid #7f1d1d",
            borderRadius: 6,
            fontSize: 12,
            color: "#f87171",
          }}
        >
          {csvError}
        </div>
      )}

      {/* Preview table */}
      {csvPreview.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#475569",
              letterSpacing: 1.2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Preview — {matched} matched / {unmatched} not found
          </div>
          <div
            style={{
              maxHeight: 220,
              overflow: "auto",
              border: "1px solid #1e293b",
              borderRadius: 8,
            }}
          >
            {csvPreview.map((row, i) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "16px 1fr 1fr 1fr 90px",
                  gap: 8,
                  padding: "8px 12px",
                  borderBottom: i < csvPreview.length - 1 ? "1px solid #1e293b" : "none",
                  background: row.found ? "transparent" : "#450a0a22",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: row.found ? "#22c55e" : "#ef4444",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: row.found ? "#e2e8f0" : "#64748b",
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={row.title}
                >
                  {row.title}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={row.canonicalUrl}
                >
                  {row.canonicalUrl || "—"}
                </span>
                <span style={{ fontSize: 11, color: "#64748b" }}>{row.focusKeyword || "—"}</span>
                <span style={{ fontSize: 11, color: "#64748b" }}>{row.seoStatus || "—"}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onApplyCSV}
              disabled={csvApplying || matched === 0}
              style={{
                padding: "8px 20px",
                background: csvApplying || matched === 0 ? "#1e293b" : "#14532d",
                border: "1px solid",
                borderColor: csvApplying || matched === 0 ? "#1e293b" : "#166534",
                borderRadius: 8,
                color: csvApplying || matched === 0 ? "#475569" : "#4ade80",
                fontSize: 13,
                fontWeight: 600,
                cursor: csvApplying || matched === 0 ? "not-allowed" : "pointer",
              }}
            >
              {csvApplying ? "Applying…" : `Apply CSV (${matched} pages)`}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
