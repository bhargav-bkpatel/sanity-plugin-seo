import React from "react";

interface Props {
  isDarkMode?: boolean;
  style?: React.CSSProperties;
}

export default function CheckCircleIcon({ isDarkMode = false, style }: Props) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, ...style }}>
      <circle
        cx="10"
        cy="10"
        r="9"
        fill={isDarkMode ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.08)"}
        stroke="#10b981"
        strokeWidth="2"
      />
      <path
        d="M6 10L9 13L14 7"
        stroke="#10b981"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
