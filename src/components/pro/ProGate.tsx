import React from "react";
import { SparklesIcon, LockIcon } from "@sanity/icons";

interface Props {
  feature: string;
  children: React.ReactNode;
  isPro: boolean;
  variant?: "page" | "card";
}

const PRO_FEATURES = [
  { label: "SEO Health Dashboard", desc: "Score all pages at a glance" },
  { label: "SEO Optimizer", desc: "Bulk edit meta fields across all pages" },
  { label: "SERP Preview", desc: "Pixel-accurate desktop + mobile preview" },
  { label: "Schema.org Wizard", desc: "13 structured data types" },
  { label: "CSV Export / Import", desc: "Bulk update via spreadsheet" },
];

function PageGate({ feature }: { feature: string }) {
  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        background: "var(--card-bg-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 680, width: "100%" }}>
        {/* Card */}
        <div
          style={{
            background: "var(--card-bg-color)",
            border: "1px solid var(--card-border-color)",
            borderRadius: 24,
            overflow: "hidden",
          }}
        >
          {/* Top accent bar */}
          <div
            style={{ height: 4, background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)" }}
          />

          <div style={{ padding: "40px 48px 38px" }}>
            {/* Icon + badges row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  background: "var(--card-bg-color)",
                  border: "1px solid var(--card-border-color)",
                }}
              >
                <LockIcon style={{ fontSize: 26, color: "var(--card-link-color)" }} />
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 16px",
                    background: "var(--card-bg-color)",
                    border: "1px solid var(--card-border-color)",
                    borderRadius: 99,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--card-link-color)",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  <SparklesIcon style={{ fontSize: 13 }} />
                  Pro
                </span>
                <span
                  style={{
                    padding: "7px 16px",
                    background: "linear-gradient(90deg, #7c3aed22, #3b82f622)",
                    border: "1px solid #7c3aed50",
                    borderRadius: 99,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#a78bfa",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  Coming Soon
                </span>
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "var(--card-fg-color)",
                marginBottom: 10,
                lineHeight: 1.2,
              }}
            >
              {feature}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: 15,
                color: "var(--card-muted-fg-color)",
                marginBottom: 28,
                lineHeight: 1.7,
              }}
            >
              This feature is part of{" "}
              <span style={{ color: "var(--card-fg-color)", fontWeight: 600 }}>
                sanity-plugin-seo Pro
              </span>
              . We&apos;re working on making it available — add your license key below when ready.
            </div>

            {/* Two-column feature list */}
            <div
              style={{
                background: "var(--card-bg-color)",
                border: "1px solid var(--card-border-color)",
                borderRadius: 14,
                padding: "20px 24px",
                marginBottom: 20,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px 28px",
              }}
            >
              <div
                style={{
                  gridColumn: "1 / -1",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--card-muted-fg-color)",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                What&apos;s included with Pro
              </div>
              {PRO_FEATURES.map((item) => (
                <div
                  key={item.label}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#3b82f6",
                      flexShrink: 0,
                      marginTop: 5,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--card-fg-color)" }}>
                      {item.label}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "var(--card-muted-fg-color)", marginTop: 2 }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* License key hint */}
            <div
              style={{
                background: "var(--card-bg-color)",
                border: "1px solid var(--card-border-color)",
                borderRadius: 12,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--card-muted-fg-color)",
                  flexShrink: 0,
                }}
              >
                Already have a key?
              </div>
              <code
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: "var(--card-link-color)",
                  background: "var(--card-bg-color)",
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--card-border-color)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                proFeature: process.env.SEO_PRO_LICENSE_KEY
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardGate({ feature }: { feature: string }) {
  return (
    <div
      style={{
        background: "var(--card-bg-color)",
        border: "1px solid var(--card-border-color)",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      {/* Top accent */}
      <div
        style={{
          height: 2,
          background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
        }}
      />
      <div style={{ padding: "20px 22px" }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "var(--card-bg-color)",
                border: "1px solid var(--card-border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LockIcon style={{ fontSize: 13, color: "var(--card-link-color)" }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--card-fg-color)" }}>
              {feature}
            </span>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 9px",
                background: "var(--card-bg-color)",
                border: "1px solid var(--card-border-color)",
                borderRadius: 99,
                fontSize: 10,
                fontWeight: 700,
                color: "var(--card-link-color)",
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              <SparklesIcon style={{ fontSize: 10 }} />
              Pro
            </span>
            <span
              style={{
                padding: "3px 9px",
                background: "linear-gradient(90deg, #7c3aed22, #3b82f622)",
                border: "1px solid #7c3aed50",
                borderRadius: 99,
                fontSize: 10,
                fontWeight: 700,
                color: "#a78bfa",
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              Coming Soon
            </span>
          </div>
        </div>

        <div style={{ fontSize: 12, color: "var(--card-muted-fg-color)", lineHeight: 1.6 }}>
          This feature is part of the Pro plan. Add your license key to{" "}
          <code style={{ fontSize: 11, color: "var(--card-muted-fg-color)" }}>proFeature</code> in
          your plugin config to unlock it.
        </div>
      </div>
    </div>
  );
}

export default function ProGate({ feature, children, isPro, variant = "card" }: Props) {
  if (isPro) return children as React.ReactElement;
  if (variant === "page") return <PageGate feature={feature} />;
  return <CardGate feature={feature} />;
}
