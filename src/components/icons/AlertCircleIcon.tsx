import React from "react";

interface Props {
  isDarkMode?: boolean;
  style?: React.CSSProperties;
}

export default function AlertCircleIcon({ isDarkMode = false, style }: Props) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, ...style }}>
      <circle
        cx="10"
        cy="10"
        r="9"
        fill={isDarkMode ? "rgba(245, 158, 11, 0.15)" : "rgba(245, 158, 11, 0.08)"}
        stroke="#f59e0b"
        strokeWidth="2"
      />
      <path d="M10 6V11" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="10" cy="14" r="1.25" fill="#f59e0b" />
    </svg>
  );
}
