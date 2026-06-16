import React, { useState } from "react";

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
  const [hovered, setHovered] = useState(false);

  let shadow = "0 4px 12px rgba(0, 0, 0, 0.04)";
  if (hovered) {
    shadow = `0 8px 20px rgba(0, 0, 0, 0.1), 0 0 10px ${accent}20`;
  } else if (active) {
    shadow = `0 4px 12px ${accent}15`;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: active
          ? `linear-gradient(135deg, ${accent}12, ${accent}08)`
          : "var(--card-bg-color)",
        borderWidth: "1px 1px 1px 4px",
        borderStyle: "solid",
        borderColor: `var(--card-border-color) var(--card-border-color) var(--card-border-color) ${accent}`,
        borderRadius: 12,
        padding: "20px 24px",
        flex: 1,
        cursor: "pointer",
        textAlign: "left",
        position: "relative",
        overflow: "hidden",
        outline: "none",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: shadow,
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
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
