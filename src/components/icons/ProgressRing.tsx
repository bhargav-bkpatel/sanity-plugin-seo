import React from "react";

interface ProgressRingProps {
  value: number;
  total: number;
  color: string;
  isDarkMode: boolean;
  text: string;
  fontSize?: string;
}

export default function ProgressRing({
  value,
  total,
  color,
  isDarkMode,
  text,
  fontSize = "18px",
}: ProgressRingProps) {
  const radius = 28;
  const strokeWidth = 5.5;
  const circumference = 2 * Math.PI * radius; // 175.929
  const percentage = total > 0 ? value / total : 0;
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <svg width="68" height="68" viewBox="0 0 68 68" style={{ flexShrink: 0 }}>
      <circle
        cx="34"
        cy="34"
        r={radius}
        fill="transparent"
        stroke={isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"}
        strokeWidth={strokeWidth}
      />
      <circle
        cx="34"
        cy="34"
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90 34 34)"
        style={{
          transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          filter: `drop-shadow(0 0 4px ${color}30)`,
        }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="var(--card-fg-color)"
        style={{
          fontSize,
          fontWeight: 800,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {text}
      </text>
    </svg>
  );
}
