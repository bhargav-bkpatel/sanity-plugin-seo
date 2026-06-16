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
        <div
          style={{
            background: "var(--card-bg-color)",
            borderWidth: "1px 1px 1px 6px",
            borderStyle: "solid",
            borderColor:
              "var(--card-border-color) var(--card-border-color) var(--card-border-color) #7c3aed",
            borderRadius: 20,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.16)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "40px 48px 38px" }}>
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
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(59, 130, 246, 0.08))",
                  border: "4px solid #7c3aed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow:
                    "0 0 20px rgba(124, 58, 237, 0.35), inset 0 0 12px rgba(124, 58, 237, 0.2)",
                }}
              >
                <LockIcon style={{ fontSize: 32, color: "#a78bfa" }} />
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 16px",
                    background: "rgba(124, 58, 237, 0.1)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    borderRadius: 99,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#a78bfa",
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
                    background: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: 99,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#60a5fa",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  Coming Soon
                </span>
              </div>
            </div>

            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "var(--card-fg-color)",
                marginBottom: 10,
                lineHeight: 1.2,
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              {feature}
            </div>

            <div
              style={{
                fontSize: 15,
                color: "var(--card-muted-fg-color)",
                marginBottom: 28,
                lineHeight: 1.7,
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              This feature is part of{" "}
              <span style={{ color: "var(--card-fg-color)", fontWeight: 600 }}>
                sanity-plugin-seo Pro
              </span>
              . We&apos;re working on making it available — add your license key below when ready.
            </div>

            <div
              style={{
                background: "rgba(124, 58, 237, 0.02)",
                border: "1px solid var(--card-border-color)",
                borderRadius: 14,
                padding: "24px 28px",
                marginBottom: 24,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px 28px",
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
                  marginBottom: 4,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                What&apos;s included with Pro
              </div>
              {PRO_FEATURES.map((item) => (
                <div
                  key={item.label}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{ flexShrink: 0, marginTop: 2 }}
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="9"
                      fill="rgba(124, 58, 237, 0.15)"
                      stroke="#7c3aed"
                      strokeWidth="2"
                    />
                    <path
                      d="M6 10L9 13L14 7"
                      stroke="#7c3aed"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 650,
                        color: "var(--card-fg-color)",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--card-muted-fg-color)",
                        marginTop: 3,
                        lineHeight: 1.4,
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                Already have a key?
              </div>
              <code
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: "#a78bfa",
                  background: "rgba(124, 58, 237, 0.05)",
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid rgba(124, 58, 237, 0.15)",
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
        borderWidth: "1px 1px 1px 4px",
        borderStyle: "solid",
        borderColor:
          "var(--card-border-color) var(--card-border-color) var(--card-border-color) #7c3aed",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(59, 130, 246, 0.08))",
            border: "3.5px solid #7c3aed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 0 15px rgba(124, 58, 237, 0.25), inset 0 0 10px rgba(124, 58, 237, 0.15)",
          }}
        >
          <LockIcon style={{ fontSize: 24, color: "#a78bfa" }} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--card-fg-color)",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              {feature}
            </span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 9px",
                  background: "rgba(124, 58, 237, 0.1)",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  borderRadius: 99,
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#a78bfa",
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
                  background: "rgba(59, 130, 246, 0.1)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: 99,
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#60a5fa",
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                }}
              >
                Coming Soon
              </span>
            </div>
          </div>

          <div
            style={{
              fontSize: 13,
              color: "var(--card-muted-fg-color)",
              lineHeight: 1.6,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            This feature is part of the Pro plan. Add your license key to{" "}
            <code
              style={{
                fontSize: 12,
                color: "#a78bfa",
                background: "rgba(124, 58, 237, 0.05)",
                padding: "2px 6px",
                borderRadius: 4,
                border: "1px solid rgba(124, 58, 237, 0.15)",
                fontFamily: "monospace",
              }}
            >
              proFeature
            </code>{" "}
            in your plugin config to unlock it.
          </div>
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
