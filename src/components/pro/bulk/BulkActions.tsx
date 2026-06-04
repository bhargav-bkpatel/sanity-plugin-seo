import React, { useRef } from "react";
import { DownloadIcon, UploadIcon } from "@sanity/icons";
import { BulkTab, FIELD_LABEL } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface CsvRow {
  _id: string;
  title: string;
  focusKeyword: string;
  found: boolean;
}

interface LogEntry {
  msg: string;
  ok: boolean;
}

interface Props {
  selectedCount: number;
  bulkTab: BulkTab;
  onTabChange: (tab: BulkTab) => void;

  bulkProcessing: boolean;
  onApply: () => void;

  csvPreview: CsvRow[];
  csvError: string | null;
  csvApplying: boolean;
  onCSVFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyCSV: () => void;

  /** Log entries from the last bulk operation — rendered inside the panel */
  log: LogEntry[];
  /** How many selected pages have no meta title (OG sync will skip them) */
  selectedMissingTitle: number;
}

const TAB_LABELS: Record<BulkTab, string> = {
  og: "Sync Open Graph",
  csv: "Import CSV",
};

export default function BulkActions({
  selectedCount,
  bulkTab,
  onTabChange,
  bulkProcessing,
  onApply,
  csvPreview,
  csvError,
  csvApplying,
  onCSVFile,
  onApplyCSV,
  log,
  selectedMissingTitle,
}: Props) {
  const csvFileRef = useRef<HTMLInputElement>(null);

  const canApply = !bulkProcessing && selectedCount > 0;

  return (
    <div
      style={{
        background: "var(--card-bg-color)",
        border: "1px solid var(--card-border-color)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* Header + tabs */}
      <div
        style={{
          padding: "10px 16px",
          background: "var(--card-bg-color)",
          borderBottom: "1px solid var(--card-border-color)",
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
            color: "var(--card-muted-fg-color)",
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          Bulk Actions
        </span>
        <span
          style={{
            padding: "2px 8px",
            background: "var(--card-border-color)",
            color: "var(--card-link-color)",
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
                background: bulkTab === tab ? "var(--card-border-color)" : "transparent",
                color: bulkTab === tab ? "var(--card-link-color)" : "var(--card-muted-fg-color)",
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
        {/* Sync Open Graph */}
        {bulkTab === "og" && (
          <div>
            {/* Pre-warning: selected pages with no meta title will be skipped */}
            {selectedMissingTitle > 0 && (
              <div
                style={{
                  marginBottom: 12,
                  padding: "9px 12px",
                  background: "rgba(249, 115, 22, 0.15)",
                  border: "1px solid rgba(249, 115, 22, 0.3)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#f97316",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span>
                  <strong>{selectedMissingTitle}</strong> of your selected page
                  {selectedMissingTitle !== 1 ? "s have" : " has"} no Meta Title — those will be
                  skipped. Set a Meta Title first by expanding the row below.
                </span>
              </div>
            )}
            {/* Why this matters */}
            <div
              style={{
                fontSize: 12,
                color: "var(--card-muted-fg-color)",
                marginBottom: 12,
                lineHeight: 1.6,
              }}
            >
              When someone shares your page on{" "}
              <span style={{ color: "var(--card-fg-color)" }}>Twitter, LinkedIn, WhatsApp</span> or
              any social platform, they see the{" "}
              <span style={{ color: "var(--card-fg-color)" }}>Open Graph title</span> — not the meta
              title. If OG is empty, social platforms guess a title which often looks broken.
            </div>

            {/* Visual: what this does */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 32px 1fr",
                gap: 8,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              {/* Before */}
              <div
                style={{
                  padding: "10px 12px",
                  background: "var(--card-bg-color)",
                  border: "1px solid var(--card-border-color)",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: "var(--card-muted-fg-color)",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Each page has
                </div>
                <div style={{ fontSize: 11, color: "var(--card-link-color)", marginBottom: 3 }}>
                  ✓ Meta Title
                </div>
                <div style={{ fontSize: 11, color: "var(--card-link-color)", marginBottom: 3 }}>
                  ✓ Meta Description
                </div>
                <div style={{ fontSize: 11, color: "#ef4444" }}>✗ OG Title (empty)</div>
                <div style={{ fontSize: 11, color: "#ef4444" }}>✗ OG Description (empty)</div>
              </div>

              {/* Arrow */}
              <div
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  color: "var(--card-muted-fg-color)",
                  fontWeight: 700,
                }}
              >
                →
              </div>

              {/* After */}
              <div
                style={{
                  padding: "10px 12px",
                  background: "rgba(34, 197, 94, 0.15)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#22c55e",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  After applying
                </div>
                <div style={{ fontSize: 11, color: "var(--card-link-color)", marginBottom: 3 }}>
                  ✓ Meta Title
                </div>
                <div style={{ fontSize: 11, color: "var(--card-link-color)", marginBottom: 3 }}>
                  ✓ Meta Description
                </div>
                <div style={{ fontSize: 11, color: "#4ade80", marginBottom: 3 }}>
                  ✓ OG Title (synced)
                </div>
                <div style={{ fontSize: 11, color: "#4ade80" }}>✓ OG Description (synced)</div>
              </div>
            </div>

            {/* Footer note */}
            <div style={{ fontSize: 11, color: "var(--card-muted-fg-color)", fontStyle: "italic" }}>
              Each page gets its own values — pages without a meta title are skipped.
            </div>
          </div>
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
                background: canApply ? "var(--card-border-color)" : "var(--card-border-color)",
                border: "1px solid",
                borderColor: canApply ? "var(--card-border-color)" : "var(--card-border-color)",
                borderRadius: 8,
                color: canApply ? "var(--card-link-color)" : "var(--card-muted-fg-color)",
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

        {/* Inline operation log */}
        {log.length > 0 && (
          <div
            style={{
              marginTop: 14,
              background: "var(--card-bg-color)",
              border: "1px solid var(--card-border-color)",
              borderRadius: 8,
              padding: "10px 14px",
              fontFamily: "monospace",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--card-muted-fg-color)",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Result
            </div>
            <div style={{ maxHeight: 180, overflow: "auto" }}>
              {log.map((entry, i) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  style={{
                    fontSize: 12,
                    color: entry.ok ? "#4ade80" : "#f87171",
                    lineHeight: 1.7,
                    borderBottom:
                      i < log.length - 1 ? "1px solid var(--card-border-color)" : "none",
                    paddingBottom: 2,
                  }}
                >
                  {entry.msg}
                </div>
              ))}
            </div>
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
          background: "var(--card-bg-color)",
          border: "1px solid var(--card-border-color)",
          borderRadius: 8,
          padding: "12px 14px",
          marginBottom: 14,
          fontSize: 12,
          color: "var(--card-muted-fg-color)",
          lineHeight: 1.7,
        }}
      >
        <div style={{ fontWeight: 600, color: "var(--card-muted-fg-color)", marginBottom: 4 }}>
          Expected CSV headers (first row):
        </div>
        <code style={{ color: "var(--card-link-color)", fontSize: 11 }}>
          _id, metaTitle, metaDescription, focusKeyword, ogTitle, ogDescription
        </code>
        <div style={{ marginTop: 6 }}>
          Use{" "}
          <strong style={{ color: "var(--card-muted-fg-color)" }}>
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
            background: "var(--card-bg-color)",
            border: "1px solid var(--card-border-color)",
            borderRadius: 6,
            color: "var(--card-link-color)",
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
        <span style={{ fontSize: 11, color: "var(--card-muted-fg-color)" }}>
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
              color: "var(--card-muted-fg-color)",
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
              border: "1px solid var(--card-border-color)",
              borderRadius: 8,
            }}
          >
            {csvPreview.map((row, i) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "16px 1fr 1fr",
                  gap: 8,
                  padding: "8px 12px",
                  borderBottom:
                    i < csvPreview.length - 1 ? "1px solid var(--card-border-color)" : "none",
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
                    color: row.found ? "var(--card-fg-color)" : "var(--card-muted-fg-color)",
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={row.title}
                >
                  {row.title}
                </span>
                <span style={{ fontSize: 11, color: "var(--card-muted-fg-color)" }}>
                  {row.focusKeyword || "—"}
                </span>
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
                background: csvApplying || matched === 0 ? "var(--card-border-color)" : "#14532d",
                border: "1px solid",
                borderColor: csvApplying || matched === 0 ? "var(--card-border-color)" : "#166534",
                borderRadius: 8,
                color: csvApplying || matched === 0 ? "var(--card-muted-fg-color)" : "#4ade80",
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
