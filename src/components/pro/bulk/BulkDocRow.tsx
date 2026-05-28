import React from "react";
import { ChevronDownIcon, CheckmarkCircleIcon, EditIcon } from "@sanity/icons";
import { BulkDoc, RowEdit, scoreColor } from "./types";
import ScoreBar from "./ScoreBar";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  doc: BulkDoc;
  edit: RowEdit;
  isOpen: boolean;
  onToggleExpand: (id: string) => void;
  onToggleSelect: (id: string, e: React.MouseEvent | React.KeyboardEvent) => void;
  onFieldChange: (id: string, field: keyof Omit<RowEdit, "saving" | "saved">, val: string) => void;
  onSave: (doc: BulkDoc) => void;
}

const FIELD_INPUT: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  background: "#0a111f",
  border: "1px solid #2d3f55",
  borderRadius: 8,
  color: "#e2e8f0",
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const SECTION_HEADER: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: "#475569",
  letterSpacing: 1.5,
  textTransform: "uppercase",
  marginBottom: 10,
  marginTop: 4,
  display: "flex",
  alignItems: "center",
  gap: 6,
};

function CharBadge({ length, min, max }: { length: number; min: number; max: number }) {
  if (length === 0) return null;
  const ok = length >= min && length <= max;
  return (
    <span
      style={{
        display: "inline-block",
        marginLeft: 8,
        padding: "1px 7px",
        borderRadius: 99,
        fontSize: 10,
        fontWeight: 700,
        background: ok ? "#14532d" : "#451a00",
        color: ok ? "#4ade80" : "#fb923c",
      }}
    >
      {length} / {max}
    </span>
  );
}

function FieldBlock({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 5, gap: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 0.3 }}>
          {label}
        </span>
        {required && <span style={{ fontSize: 10, color: "#ef4444", fontWeight: 700 }}>*</span>}
      </div>
      {children}
      {hint && <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

export default function BulkDocRow({
  doc,
  edit,
  isOpen,
  onToggleExpand,
  onToggleSelect,
  onFieldChange,
  onSave,
}: Props) {
  const handleChange =
    (field: keyof Omit<RowEdit, "saving" | "saved">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      onFieldChange(doc._id, field, e.target.value);
    };

  const issueCount = doc.issues.length;
  const color = scoreColor(doc.score);

  return (
    <div
      style={{
        background: doc.selected ? "#0d1f3c" : "#0f172a",
        border: `1px solid ${doc.selected ? "#2d4a7a" : "#1e293b"}`,
        borderRadius: 10,
        overflow: "hidden",
        transition: "background 0.1s, border-color 0.1s",
      }}
    >
      {/* Summary row — fixed height, always uniform */}
      <div
        role="row"
        tabIndex={0}
        onClick={() => onToggleExpand(doc._id)}
        onKeyDown={(e) => e.key === "Enter" && onToggleExpand(doc._id)}
        style={{
          display: "grid",
          gridTemplateColumns: "36px 100px 1fr auto auto 32px",
          gap: 16,
          alignItems: "center",
          padding: "12px 16px",
          cursor: "pointer",
        }}
      >
        {/* Checkbox */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={doc.selected}
            onChange={(e) => onToggleSelect(doc._id, e as any)}
            onClick={(e) => e.stopPropagation()}
            style={{ cursor: "pointer", accentColor: "#60a5fa" }}
          />
        </div>

        {/* Score */}
        <ScoreBar score={doc.score} />

        {/* Page title + meta title */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#e2e8f0",
              lineHeight: 1.4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {doc.docTitle}
          </div>
          {edit.metaTitle && edit.metaTitle !== doc.docTitle && (
            <div
              style={{
                fontSize: 11,
                color: "#475569",
                marginTop: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {edit.metaTitle}
            </div>
          )}
        </div>

        {/* Type badge */}
        <div
          style={{
            padding: "3px 10px",
            background: "#111d35",
            border: "1px solid #1e3a5f",
            borderRadius: 99,
            fontSize: 11,
            color: "#60a5fa",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {doc._type}
        </div>

        {/* Issue count badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 10px",
            borderRadius: 99,
            background: issueCount === 0 ? "#052e16" : "#1a0a00",
            border: `1px solid ${issueCount === 0 ? "#166534" : `${color}30`}`,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: issueCount === 0 ? "#22c55e" : color,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: issueCount === 0 ? "#22c55e" : color,
              whiteSpace: "nowrap",
            }}
          >
            {issueCount === 0 ? "Good" : `${issueCount} issue${issueCount !== 1 ? "s" : ""}`}
          </span>
        </div>

        {/* Chevron */}
        <div
          style={{
            color: "#334155",
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronDownIcon style={{ fontSize: 18 }} />
        </div>
      </div>

      {/* Expanded panel */}
      {isOpen && (
        <div
          style={{
            borderTop: "1px solid #1e293b",
            background: "#070d1a",
          }}
        >
          {/* Issue list */}
          {issueCount > 0 && (
            <div
              style={{
                padding: "10px 20px",
                borderBottom: "1px solid #1e293b",
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
              }}
            >
              {doc.issues.map((issue) => (
                <span
                  key={issue}
                  style={{
                    fontSize: 11,
                    color: "#f87171",
                    background: "#1a0808",
                    border: "1px solid #7f1d1d40",
                    borderRadius: 99,
                    padding: "2px 10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {issue}
                </span>
              ))}
            </div>
          )}

          {/* Edit fields */}
          <div style={{ padding: "20px 20px 22px" }}>
            {/* Panel header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
                paddingBottom: 14,
                borderBottom: "1px solid #1e293b",
              }}
            >
              <EditIcon style={{ color: "#3b82f6", fontSize: 14 }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", letterSpacing: 0.5 }}>
                Edit SEO Fields
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#334155",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                — {doc.docTitle}
              </span>
            </div>

            {/* Core SEO */}
            <div style={SECTION_HEADER}>
              <div
                style={{
                  width: 3,
                  height: 12,
                  borderRadius: 2,
                  background: "#3b82f6",
                  flexShrink: 0,
                }}
              />
              Core SEO
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FieldBlock label="Meta Title" required>
                <input
                  type="text"
                  value={edit.metaTitle}
                  onChange={handleChange("metaTitle")}
                  placeholder="Page title for search results"
                  style={FIELD_INPUT}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                >
                  <span style={{ fontSize: 10, color: "#475569" }}>Ideal: 50–60 characters</span>
                  <CharBadge length={edit.metaTitle.length} min={50} max={60} />
                </div>
              </FieldBlock>

              <FieldBlock label="Focus Keyword" hint="Primary keyword for this page">
                <input
                  type="text"
                  value={edit.focusKeyword}
                  onChange={handleChange("focusKeyword")}
                  placeholder="e.g. sanity cms tutorial"
                  style={FIELD_INPUT}
                />
              </FieldBlock>

              <div style={{ gridColumn: "1 / -1" }}>
                <FieldBlock label="Meta Description" required>
                  <textarea
                    value={edit.metaDescription}
                    onChange={handleChange("metaDescription")}
                    placeholder="Short description shown under the title in search results"
                    rows={3}
                    style={{ ...FIELD_INPUT, resize: "vertical" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 4,
                    }}
                  >
                    <span style={{ fontSize: 10, color: "#475569" }}>Ideal: 100–160 characters</span>
                    <CharBadge length={edit.metaDescription.length} min={100} max={160} />
                  </div>
                </FieldBlock>
              </div>
            </div>

            {/* Social Preview */}
            <div style={{ ...SECTION_HEADER, marginTop: 20 }}>
              <div
                style={{
                  width: 3,
                  height: 12,
                  borderRadius: 2,
                  background: "#a78bfa",
                  flexShrink: 0,
                }}
              />
              Social Preview (Open Graph)
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <FieldBlock label="OG Title" hint="Title shown when shared on social">
                <input
                  type="text"
                  value={edit.ogTitle}
                  onChange={handleChange("ogTitle")}
                  placeholder="Defaults to meta title if empty"
                  style={FIELD_INPUT}
                />
              </FieldBlock>

              <FieldBlock label="OG Description" hint="Description shown on social cards">
                <textarea
                  value={edit.ogDescription}
                  onChange={handleChange("ogDescription")}
                  placeholder="Defaults to meta description if empty"
                  rows={3}
                  style={{ ...FIELD_INPUT, resize: "vertical" }}
                />
              </FieldBlock>
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: 20,
                paddingTop: 16,
                borderTop: "1px solid #1e293b",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 10,
              }}
            >
              {edit.saved && (
                <span
                  style={{
                    fontSize: 12,
                    color: "#22c55e",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <CheckmarkCircleIcon style={{ fontSize: 14 }} />
                  Saved
                </span>
              )}
              <button
                type="button"
                onClick={() => onSave(doc)}
                disabled={edit.saving}
                style={{
                  padding: "9px 22px",
                  background: edit.saving ? "#1e293b" : "#1d4ed8",
                  border: "none",
                  borderRadius: 8,
                  color: edit.saving ? "#475569" : "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: edit.saving ? "not-allowed" : "pointer",
                  boxShadow: edit.saving ? "none" : "0 0 16px #1d4ed840",
                }}
              >
                {edit.saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
