import React from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  value: number;
  label: string;
  sub: string;
  accent: string;
  active: boolean;
  icon?: any;
  onClick: () => void;
}

export default function WorkflowStatCard({
  value,
  label,
  sub,
  accent,
  active,
  icon: Icon,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: active ? `${accent}18` : "var(--card-bg-color)",
        border: `1px solid ${active ? `${accent}60` : `${accent}30`}`,
        borderTop: `3px solid ${active ? accent : `${accent}60`}`,
        borderRadius: 12,
        padding: "20px 24px",
        flex: 1,
        cursor: "pointer",
        textAlign: "left",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.2s",
        outline: "none",
      }}
    >
      {/* Glow */}
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

      {/* Status icon */}
      {Icon && (
        <div style={{ marginBottom: 10 }}>
          <Icon style={{ fontSize: 22, color: active ? accent : `${accent}90` }} />
        </div>
      )}

      <div
        style={{
          fontSize: 40,
          fontWeight: 900,
          color: active ? accent : `${accent}cc`,
          lineHeight: 1,
          letterSpacing: -1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: active ? "var(--card-fg-color)" : "var(--card-muted-fg-color)",
          marginTop: 10,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 11, color: "var(--card-muted-fg-color)", marginTop: 3 }}>{sub}</div>
    </button>
  );
}
