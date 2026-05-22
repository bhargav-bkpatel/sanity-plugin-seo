import React from "react";
import { scoreColor } from "./types";

function StatCard({
  value,
  label,
  sub,
  accent,
  loaded,
}: {
  value: number;
  label: string;
  sub: string;
  accent: string;
  loaded: boolean;
}) {
  return (
    <div
      style={{
        background: loaded ? "#0f172a" : "#080e1a",
        border: `1px solid ${loaded ? `${accent}40` : "#1e293b"}`,
        borderTop: `3px solid ${loaded ? accent : "#1e293b"}`,
        borderRadius: 12,
        padding: "20px 24px",
        flex: 1,
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow behind number */}
      {loaded && (
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
      )}
      <div
        style={{
          fontSize: 40,
          fontWeight: 900,
          color: loaded ? accent : "#1e293b",
          lineHeight: 1,
          letterSpacing: -1,
          transition: "color 0.3s",
        }}
      >
        {loaded ? value : "—"}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: loaded ? "#f1f5f9" : "#334155",
          marginTop: 10,
          transition: "color 0.3s",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>{sub}</div>
    </div>
  );
}

interface Props {
  avgScore: number;
  titleIssues: number;
  descIssues: number;
  noCanonical: number;
  loaded: boolean;
}

export default function BulkStatCards({
  avgScore,
  titleIssues,
  descIssues,
  noCanonical,
  loaded,
}: Props) {
  return (
    <div style={{ display: "flex", gap: 14 }}>
      <StatCard
        value={avgScore}
        label="Avg SEO Score"
        sub="across scanned pages"
        accent={scoreColor(avgScore || 0)}
        loaded={loaded}
      />
      <StatCard
        value={titleIssues}
        label="Title Issues"
        sub="missing or out of range"
        accent="#ef4444"
        loaded={loaded}
      />
      <StatCard
        value={descIssues}
        label="Description Issues"
        sub="missing or out of range"
        accent="#f59e0b"
        loaded={loaded}
      />
      <StatCard
        value={noCanonical}
        label="No Canonical URL"
        sub="pages need canonical"
        accent="#a78bfa"
        loaded={loaded}
      />
    </div>
  );
}
