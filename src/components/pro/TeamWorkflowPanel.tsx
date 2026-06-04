import React from "react";
import { PatchEvent, set } from "sanity";
import { CheckmarkCircleIcon, EditIcon, ClockIcon } from "@sanity/icons";
import useProEnabled from "../../hooks/useProEnabled";
import ProGate from "./ProGate";

/* eslint-disable @typescript-eslint/no-explicit-any */

const STATUS_CONFIG = {
  draft: {
    label: "Draft",
    description: "Not yet submitted for SEO review",
    color: "#94a3b8",
    bg: "#1e293b",
    Icon: EditIcon,
  },
  review: {
    label: "Needs SEO Review",
    description: "Submitted and awaiting approval",
    color: "#f59e0b",
    bg: "#422006",
    Icon: ClockIcon,
  },
  approved: {
    label: "SEO Approved",
    description: "Reviewed and cleared for publishing",
    color: "#22c55e",
    bg: "#14532d",
    Icon: CheckmarkCircleIcon,
  },
};

export default function TeamWorkflowPanel({
  value,
  onChange,
}: {
  value: Record<string, any> | undefined;
  onChange: (e: any) => void;
}) {
  const status: keyof typeof STATUS_CONFIG = value?.seoStatus || "draft";
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const StatusIcon = cfg.Icon;

  const { isPro } = useProEnabled();
  const patchStatus = (s: string) => onChange(PatchEvent.from(set(s, ["seoStatus"])));

  return (
    <ProGate feature="Team SEO Workflow" isPro={isPro}>
      <div
        style={{
          background: "var(--card-bg-color)",
          border: "1px solid var(--card-border-color)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--card-border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--card-fg-color)" }}>
            Team SEO Workflow
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 99,
              background: cfg.bg,
              fontSize: 11,
              fontWeight: 700,
              color: cfg.color,
            }}
          >
            <StatusIcon style={{ fontSize: 13 }} />
            {cfg.label}
          </div>
        </div>

        {/* Status description */}
        <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--card-border-color)" }}>
          <div style={{ fontSize: 12, color: "var(--card-muted-fg-color)" }}>{cfg.description}</div>
        </div>

        {/* Status steps */}
        <div
          style={{
            padding: "10px 16px",
            borderBottom: "1px solid var(--card-border-color)",
            display: "flex",
            alignItems: "center",
            gap: 0,
          }}
        >
          {(["draft", "review", "approved"] as const).map((s, i) => {
            const c = STATUS_CONFIG[s];
            const isActive = status === s;
            const isPast =
              (s === "draft" && (status === "review" || status === "approved")) ||
              (s === "review" && status === "approved");

            let dotBg = "var(--card-bg-color)";
            if (isActive) dotBg = c.bg;
            else if (isPast) dotBg = "var(--card-border-color)";

            let dotBorder = "var(--card-border-color)";
            if (isActive) dotBorder = c.color;
            else if (isPast) dotBorder = "var(--card-muted-fg-color)";

            let iconColor = "var(--card-muted-fg-color)";
            if (isActive) iconColor = c.color;
            else if (isPast) iconColor = "var(--card-muted-fg-color)";

            const labelColor = isActive ? c.color : iconColor;
            const connectorActive = isPast || (i === 0 && status === "approved");

            return (
              <React.Fragment key={s}>
                <button
                  type="button"
                  onClick={() => patchStatus(s)}
                  title={`Set status to: ${c.label}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    padding: "6px 8px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: dotBg,
                      border: `2px solid ${dotBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <c.Icon style={{ fontSize: 13, color: iconColor }} />
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: isActive ? 700 : 400,
                      color: labelColor,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.label.split(" ")[0]}
                  </span>
                </button>
                {i < 2 && (
                  <div
                    style={{
                      height: 2,
                      width: 24,
                      background: connectorActive
                        ? "var(--card-muted-fg-color)"
                        : "var(--card-border-color)",
                      flexShrink: 0,
                      marginBottom: 14,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Quick action buttons */}
        <div style={{ padding: "10px 16px", display: "flex", gap: 8 }}>
          {status !== "review" && status !== "approved" && (
            <button
              type="button"
              onClick={() => patchStatus("review")}
              style={{
                flex: 1,
                padding: "8px 0",
                background: "#422006",
                border: "1px solid #92400e",
                borderRadius: 8,
                color: "#f59e0b",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Request Review
            </button>
          )}
          {status !== "approved" && (
            <button
              type="button"
              onClick={() => patchStatus("approved")}
              style={{
                flex: 1,
                padding: "8px 0",
                background: "linear-gradient(135deg, #14532d 0%, #166534 100%)",
                border: "1px solid #166534",
                borderRadius: 8,
                color: "#22c55e",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 8px #22c55e20",
              }}
            >
              Mark Approved
            </button>
          )}
          {status === "approved" && (
            <button
              type="button"
              onClick={() => patchStatus("draft")}
              style={{
                flex: 1,
                padding: "8px 0",
                background: "var(--card-border-color)",
                border: "1px solid var(--card-border-color)",
                borderRadius: 8,
                color: "var(--card-muted-fg-color)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reset to Draft
            </button>
          )}
        </div>
      </div>
    </ProGate>
  );
}
