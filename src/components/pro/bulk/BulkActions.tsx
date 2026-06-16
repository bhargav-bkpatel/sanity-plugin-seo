import React, { useRef, useState } from "react";
import { DownloadIcon, UploadIcon } from "@sanity/icons";
import { BulkTab } from "./types";

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
  onCSVFile: (fileOrEvent: File | React.ChangeEvent<HTMLInputElement>) => void;
  onApplyCSV: () => void;
  log: LogEntry[];
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

      <div style={{ padding: "16px 20px" }}>
        {bulkTab === "og" && (
          <div>
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 32px 1fr",
                gap: 8,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
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

            <div style={{ fontSize: 11, color: "var(--card-muted-fg-color)", fontStyle: "italic" }}>
              Each page gets its own values — pages without a meta title are skipped.
            </div>
          </div>
        )}

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
  onCSVFile: (fileOrEvent: File | React.ChangeEvent<HTMLInputElement>) => void;
  onApplyCSV: () => void;
}) {
  const matched = csvPreview.filter((r) => r.found).length;
  const unmatched = csvPreview.filter((r) => !r.found).length;
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onCSVFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
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

      <button
        type="button"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => csvFileRef.current?.click()}
        style={{
          border: isDragging
            ? "2px dashed var(--card-link-color)"
            : "2px dashed var(--card-border-color)",
          borderRadius: 10,
          background: isDragging ? "rgba(59, 130, 246, 0.05)" : "var(--card-bg-color)",
          padding: "30px 20px",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 14,
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "inherit",
          outline: "none",
        }}
      >
        <UploadIcon
          style={{
            fontSize: 28,
            color: isDragging ? "var(--card-link-color)" : "var(--card-muted-fg-color)",
            transition: "color 0.2s",
          }}
        />
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--card-link-color)" }}>
            Choose a file
          </span>
          <span style={{ fontSize: 13, color: "var(--card-muted-fg-color)" }}>
            {" "}
            or drag and drop it here
          </span>
        </div>
        <span style={{ fontSize: 11, color: "var(--card-muted-fg-color)" }}>
          CSV template files supported
        </span>

        <input
          ref={csvFileRef}
          type="file"
          accept=".csv,text/csv"
          onChange={onCSVFile}
          style={{ display: "none" }}
          aria-hidden="true"
        />
      </button>

      {csvPreview.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
            borderRadius: 8,
            fontSize: 12,
            color: "#22c55e",
            fontWeight: 600,
            marginBottom: 14,
          }}
        >
          <span>✓</span>
          <span>{csvPreview.length} rows parsed successfully from file</span>
        </div>
      )}
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
                background:
                  csvApplying || matched === 0
                    ? "var(--card-border-color)"
                    : "rgba(34, 197, 94, 0.12)",
                border: "1px solid",
                borderColor:
                  csvApplying || matched === 0
                    ? "var(--card-border-color)"
                    : "rgba(34, 197, 94, 0.25)",
                borderRadius: 8,
                color: csvApplying || matched === 0 ? "var(--card-muted-fg-color)" : "#22c55e",
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
