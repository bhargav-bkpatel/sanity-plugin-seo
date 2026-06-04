import React from "react";
import { scoreColor, scoreLabel } from "./types";

export default function ScoreBar({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 72,
            height: 4,
            background: "var(--card-border-color)",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 99 }}
          />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 24 }}>{score}</span>
      </div>
      <div
        style={{
          fontSize: 11,
          fontFamily: "sans-serif",
          fontWeight: "400",
          color: "var(--card-muted-fg-color)",
          marginTop: 3,
        }}
      >
        {scoreLabel(score)}
      </div>
    </div>
  );
}
