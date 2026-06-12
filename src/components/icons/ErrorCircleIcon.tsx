import React from "react";

interface Props {
  isDarkMode?: boolean;
  style?: React.CSSProperties;
}

export default function ErrorCircleIcon({ isDarkMode = false, style }: Props) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, ...style }}>
      <circle
        cx="10"
        cy="10"
        r="9"
        fill={isDarkMode ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.08)"}
        stroke="#ef4444"
        strokeWidth="2"
      />
      <path
        d="M7 7L13 13M13 7L7 13"
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
