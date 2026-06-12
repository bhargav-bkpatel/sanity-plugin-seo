import React from "react";

interface Props {
  isDarkMode?: boolean;
  style?: React.CSSProperties;
}

export default function EmptyCircleIcon({ isDarkMode = false, style }: Props) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, ...style }}>
      <circle
        cx="10"
        cy="10"
        r="9"
        fill={isDarkMode ? "rgba(148, 163, 184, 0.12)" : "rgba(148, 163, 184, 0.05)"}
        stroke="#94a3b8"
        strokeWidth="2"
      />
      <circle cx="10" cy="10" r="2" fill="#94a3b8" />
    </svg>
  );
}
