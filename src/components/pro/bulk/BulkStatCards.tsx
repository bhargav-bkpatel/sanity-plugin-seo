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
        background: loaded ? "var(--card-bg-color)" : "var(--card-border-color)",
        border: `1px solid ${loaded ? `${accent}40` : "var(--card-border-color)"}`,
        borderTop: `3px solid ${loaded ? accent : "var(--card-border-color)"}`,
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
          color: loaded ? accent : "var(--card-muted-fg-color)",
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
          color: loaded ? "var(--card-fg-color)" : "var(--card-muted-fg-color)",
          marginTop: 10,
          transition: "color 0.3s",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 11, color: "var(--card-muted-fg-color)", marginTop: 3 }}>{sub}</div>
    </div>
  );
}

interface Props {
  pagesWithIssues: number;
  totalIssues: number;
  missingKeywords: number;
  noMetaImage: number;
  avgScore: number;
  loaded: boolean;
}

export default function BulkStatCards({
  pagesWithIssues,
  totalIssues,
  missingKeywords,
  noMetaImage,
  avgScore,
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
        value={pagesWithIssues}
        label="Pages with Issues"
        sub="need attention"
        accent="#ef4444"
        loaded={loaded}
      />
      <StatCard
        value={totalIssues}
        label="Total Issues"
        sub="across all pages"
        accent="#f59e0b"
        loaded={loaded}
      />
      <StatCard
        value={missingKeywords}
        label="Missing Keywords"
        sub="no focus keyword set"
        accent="#f97316"
        loaded={loaded}
      />
      <StatCard
        value={noMetaImage}
        label="No Meta Image"
        sub="missing OG / social image"
        accent="#a78bfa"
        loaded={loaded}
      />
    </div>
  );
}
