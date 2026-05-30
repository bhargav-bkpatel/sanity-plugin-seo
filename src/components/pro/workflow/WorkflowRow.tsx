import React from "react";
import { IntentLink } from "sanity/router";
import { Spinner } from "@sanity/ui";
import {
  EditIcon,
  CheckmarkCircleIcon,
  LaunchIcon,
  ChevronDownIcon,
  WarningOutlineIcon,
} from "@sanity/icons";
import { scoreColor, scoreLabel } from "../bulk/types";
import { WorkflowDoc, WorkflowStatus, STATUS_CFG } from "./types";

interface Props {
  doc: WorkflowDoc;
  isOpen: boolean;
  onToggle: () => void;
  patching: boolean;
  onPatch: (doc: WorkflowDoc, status: WorkflowStatus) => void;
  onSaveNotes: (doc: WorkflowDoc, notes: string) => Promise<void>;
}

export default function WorkflowRow({
  doc,
  isOpen,
  onToggle,
  patching,
  onPatch,
  onSaveNotes,
}: Props) {
  const cfg = STATUS_CFG[doc.seoStatus] || STATUS_CFG.draft;
  const StatusIcon = cfg.Icon;
  const issueCount = doc.issues.length;
  const scoreCol = scoreColor(doc.score);

  const [notes, setNotes] = React.useState(doc.reviewNotes || "");
  const [savingNotes, setSavingNotes] = React.useState(false);
  const [notesSaved, setNotesSaved] = React.useState(false);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    setNotesSaved(false);
    await onSaveNotes(doc, notes);
    setSavingNotes(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  return (
    <div
      style={{
        background: "#0f172a",
        border: `1px solid ${isOpen ? "#2d4a7a" : "#1e293b"}`,
        borderRadius: 10,
        overflow: "hidden",
        transition: "border-color 0.15s",
      }}
    >
      {/* ── Collapsed summary row ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => e.key === "Enter" && onToggle()}
        style={{
          display: "grid",
          gridTemplateColumns: "90px 1fr 100px 160px auto",
          gap: 14,
          alignItems: "center",
          padding: "13px 16px",
          cursor: "pointer",
        }}
      >
        {/* Score bar */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 56,
                height: 4,
                background: "#1e293b",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${doc.score}%`,
                  height: "100%",
                  background: scoreCol,
                  borderRadius: 99,
                }}
              />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: scoreCol }}>{doc.score}</span>
          </div>
          <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
            {scoreLabel(doc.score)}
          </div>
        </div>

        {/* Title + date + issue count */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#e2e8f0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginBottom: 3,
            }}
          >
            {doc.docTitle}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: "#64748b" }}>
              {new Date(doc._updatedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {issueCount > 0 && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: scoreCol,
                  background: `${scoreCol}15`,
                  border: `1px solid ${scoreCol}30`,
                  borderRadius: 99,
                  padding: "1px 7px",
                }}
              >
                {issueCount} issue{issueCount !== 1 ? "s" : ""}
              </span>
            )}
            {issueCount === 0 && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#22c55e",
                  background: "#14532d40",
                  border: "1px solid #16653440",
                  borderRadius: 99,
                  padding: "1px 7px",
                }}
              >
                No issues
              </span>
            )}
          </div>
        </div>

        {/* Type badge */}
        <span
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
        </span>

        {/* Status badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 99,
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            whiteSpace: "nowrap",
            width: "fit-content",
          }}
        >
          <StatusIcon style={{ fontSize: 14, color: cfg.color, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
        </div>

        {/* Chevron */}
        <div
          style={{
            color: "#64748b",
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ChevronDownIcon style={{ fontSize: 18 }} />
        </div>
      </div>

      {/* ── Expanded panel ── */}
      {isOpen && (
        <div style={{ borderTop: "1px solid #1e293b", background: "#070d1a" }}>
          {/* SEO issues */}
          <IssuesSection issues={doc.issues} />

          {/* Review notes */}
          <NotesSection
            notes={notes}
            seoStatus={doc.seoStatus}
            savedNotes={doc.reviewNotes}
            savingNotes={savingNotes}
            notesSaved={notesSaved}
            onNotesChange={setNotes}
            onSaveNotes={handleSaveNotes}
          />

          {/* Workflow actions */}
          <ActionsSection doc={doc} patching={patching} onPatch={onPatch} />
        </div>
      )}
    </div>
  );
}

// ── Sub-sections ─────────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  sub,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  title: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: "#94a3b8",
        letterSpacing: 1.5,
        textTransform: "uppercase",
        marginBottom: 10,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Icon style={{ fontSize: 14, flexShrink: 0 }} />
      {title}
      {sub && (
        <span style={{ fontSize: 10, color: "#64748b", fontWeight: 400, letterSpacing: 0 }}>
          {sub}
        </span>
      )}
    </div>
  );
}

function IssuesSection({ issues }: { issues: string[] }) {
  return (
    <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e293b" }}>
      <SectionHeader icon={WarningOutlineIcon} title="SEO Issues to Review" />
      {issues.length === 0 ? (
        <div
          style={{ fontSize: 12, color: "#22c55e", display: "flex", alignItems: "center", gap: 6 }}
        >
          <CheckmarkCircleIcon style={{ fontSize: 15 }} />
          All SEO checks pass — this document is ready to approve.
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {issues.map((issue) => (
            <span
              key={issue}
              style={{
                fontSize: 11,
                color: "#f87171",
                background: "#1a0808",
                border: "1px solid #7f1d1d40",
                borderRadius: 99,
                padding: "3px 10px",
              }}
            >
              {issue}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function NotesSection({
  notes,
  seoStatus,
  savedNotes,
  savingNotes,
  notesSaved,
  onNotesChange,
  onSaveNotes,
}: {
  notes: string;
  seoStatus: WorkflowStatus;
  savedNotes: string;
  savingNotes: boolean;
  notesSaved: boolean;
  onNotesChange: (v: string) => void;
  onSaveNotes: () => void;
}) {
  const isDisabled = savingNotes || notes === savedNotes;
  return (
    <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e293b" }}>
      <SectionHeader
        icon={EditIcon}
        title="Review Notes"
        sub="— what needs to be improved before approval"
      />
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder={
          seoStatus === "review"
            ? "Describe what needs to be fixed before this can be approved (e.g. meta title too short, missing OG image)…"
            : "Add notes for the team about this document's SEO status…"
        }
        rows={3}
        style={{
          width: "100%",
          padding: "10px 12px",
          background: "#0a111f",
          border: "1px solid #2d3f55",
          borderRadius: 8,
          color: "#e2e8f0",
          fontSize: 13,
          outline: "none",
          fontFamily: "inherit",
          resize: "vertical",
          boxSizing: "border-box",
          lineHeight: 1.5,
        }}
      />
      <div
        style={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        {notesSaved && (
          <span
            style={{
              fontSize: 12,
              color: "#22c55e",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <CheckmarkCircleIcon style={{ fontSize: 13 }} />
            Notes saved
          </span>
        )}
        <button
          type="button"
          onClick={onSaveNotes}
          disabled={isDisabled}
          style={{
            padding: "6px 16px",
            background: isDisabled ? "#1e293b" : "#1d4ed8",
            border: "none",
            borderRadius: 7,
            color: isDisabled ? "#64748b" : "#fff",
            fontSize: 12,
            fontWeight: 700,
            cursor: isDisabled ? "not-allowed" : "pointer",
            boxShadow: isDisabled ? "none" : "0 0 12px #1d4ed840",
          }}
        >
          {savingNotes ? "Saving…" : "Save Notes"}
        </button>
      </div>
    </div>
  );
}

function ActionsSection({
  doc,
  patching,
  onPatch,
}: {
  doc: WorkflowDoc;
  patching: boolean;
  onPatch: (doc: WorkflowDoc, status: WorkflowStatus) => void;
}) {
  return (
    <div
      style={{
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      {/* Context hint */}
      <div style={{ fontSize: 12, color: "#94a3b8" }}>
        {doc.seoStatus === "draft" && "Submit this document for SEO review when ready."}
        {doc.seoStatus === "review" && (
          <span>
            <strong style={{ color: "#f59e0b" }}>
              {doc.issues.length} issue{doc.issues.length !== 1 ? "s" : ""}
            </strong>{" "}
            to fix — open the editor, then mark as Approved when done.
          </span>
        )}
        {doc.seoStatus === "approved" && (
          <span style={{ color: "#22c55e" }}>
            ✓ SEO approved — reset to Draft if changes are needed.
          </span>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        {patching ? (
          <Spinner muted />
        ) : (
          <>
            <IntentLink
              intent="edit"
              params={{ id: doc._id, type: doc._type }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "7px 14px",
                borderRadius: 8,
                background: "#1e3a5f",
                border: "1px solid #2d4a7a",
                color: "#60a5fa",
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <LaunchIcon style={{ fontSize: 14 }} />
              Open Editor
            </IntentLink>

            {doc.seoStatus === "draft" && (
              <ActionBtn
                label="Request Review"
                color="#f59e0b"
                bg="#422006"
                border="#92400e"
                onClick={() => onPatch(doc, "review")}
              />
            )}
            {doc.seoStatus === "review" && (
              <>
                <ActionBtn
                  label="Reset to Draft"
                  color="#94a3b8"
                  bg="#1e293b"
                  border="#334155"
                  onClick={() => onPatch(doc, "draft")}
                />
                <ActionBtn
                  label="Mark Approved"
                  color="#22c55e"
                  bg="#14532d"
                  border="#166534"
                  onClick={() => onPatch(doc, "approved")}
                />
              </>
            )}
            {doc.seoStatus === "approved" && (
              <ActionBtn
                label="Reset to Draft"
                color="#94a3b8"
                bg="#1e293b"
                border="#334155"
                onClick={() => onPatch(doc, "draft")}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ActionBtn({
  label,
  color,
  bg,
  border,
  onClick,
}: {
  label: string;
  color: string;
  bg: string;
  border: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        padding: "7px 16px",
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 8,
        color,
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
