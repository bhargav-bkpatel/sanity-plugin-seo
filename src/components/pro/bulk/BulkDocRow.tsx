import React from "react";
import { ChevronDownIcon, CheckmarkCircleIcon, EditIcon } from "@sanity/icons";
import { BulkDoc, RowEdit } from "./types";
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 5,
          gap: 4,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#94a3b8",
            letterSpacing: 0.3,
          }}
        >
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

  return (
    <div
      style={{
        background: doc.selected ? "#0d1f3c" : "#0f172a",
        border: doc.selected ? "1px solid #2d4a7a" : "1px solid #1e293b",
        borderRadius: 10,
        overflow: "hidden",
        transition: "background 0.1s, border-color 0.1s",
      }}
    >
      {/* Summary row */}
      <div
        role="row"
        tabIndex={0}
        onClick={() => onToggleExpand(doc._id)}
        onKeyDown={(e) => e.key === "Enter" && onToggleExpand(doc._id)}
        style={{
          display: "grid",
          gridTemplateColumns: "36px 90px 1fr 80px 200px 28px",
          gap: 12,
          alignItems: "center",
          padding: "14px 16px",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={doc.selected}
            onChange={(e) => onToggleSelect(doc._id, e as any)}
            onClick={(e) => e.stopPropagation()}
            style={{ cursor: "pointer", accentColor: "#60a5fa" }}
          />
        </div>

        <ScoreBar score={doc.score} />

        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.4 }}>
            {doc.docTitle}
          </div>
          {edit.metaTitle && edit.metaTitle !== doc.docTitle && (
            <div
              style={{
                fontSize: 10,
                color: "#475569",
                marginTop: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              SEO: {edit.metaTitle}
            </div>
          )}
        </div>

        <div
          style={{
            display: "inline-flex",
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
          {doc.issues.map((issue) => (
            <div key={issue} style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
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
              <span style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4 }}>{issue}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            color: "#475569",
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

      {/* Expanded edit panel */}
      {isOpen && (
        <div
          style={{
            borderTop: "1px solid #1e293b",
            padding: "20px 20px 22px",
            background: "#070d1a",
          }}
        >
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
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#60a5fa",
                letterSpacing: 0.5,
              }}
            >
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

          {/* ── Core SEO ── */}
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
                <span style={{ fontSize: 10, color: "#475569" }}>
                  Ideal length: 50–60 characters
                </span>
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

            <FieldBlock label="Meta Description" required>
              <textarea
                value={edit.metaDescription}
                onChange={handleChange("metaDescription")}
                placeholder="Short description shown under the page title in search results"
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
                <span style={{ fontSize: 10, color: "#475569" }}>
                  Ideal length: 100–160 characters
                </span>
                <CharBadge length={edit.metaDescription.length} min={100} max={160} />
              </div>
            </FieldBlock>

            <FieldBlock label="Canonical URL" hint="Preferred URL for this page">
              <input
                type="url"
                value={edit.canonicalUrl}
                onChange={handleChange("canonicalUrl")}
                placeholder="https://yoursite.com/blog/page-slug"
                style={FIELD_INPUT}
              />
            </FieldBlock>
          </div>

          {/* ── Social Preview ── */}
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
      )}
    </div>
  );
}
