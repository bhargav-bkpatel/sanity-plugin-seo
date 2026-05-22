import React from "react";
import { SparklesIcon, LaunchIcon, LockIcon } from "@sanity/icons";

// TODO: replace with your Lemon Squeezy checkout URL
// Find it in: app.lemonsqueezy.com → Products → Sanity SEO Pro → Share button
const CHECKOUT_URL =
  "https://themejam.lemonsqueezy.com/checkout/buy/f2e069ff-cfaf-43a0-8dc2-2b46185e7f24";

interface Props {
  feature: string;
  children: React.ReactNode;
  isPro: boolean;
  variant?: "page" | "card";
}

function PageGate({ feature }: { feature: string }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070d1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        {/* Lock icon */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)",
            marginBottom: 24,
            boxShadow: "0 0 40px #1d4ed830",
          }}
        >
          <LockIcon style={{ fontSize: 28, color: "#93c5fd" }} />
        </div>

        {/* PRO badge */}
        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 12px",
              background: "linear-gradient(90deg, #1e3a5f, #1d4ed8)",
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 800,
              color: "#93c5fd",
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            <SparklesIcon style={{ fontSize: 12 }} />
            Pro Feature
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#f8fafc",
            marginBottom: 12,
            lineHeight: 1.2,
          }}
        >
          {feature}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 14,
            color: "#64748b",
            marginBottom: 32,
            lineHeight: 1.7,
          }}
        >
          This feature is included in the{" "}
          <strong style={{ color: "#94a3b8" }}>sanity-plugin-seo Pro</strong> license. Upgrade to
          unlock bulk editing, health dashboards, SERP previews, Schema.org wizard, and more.
        </div>

        {/* Feature list */}
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 28,
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#475569",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            What&apos;s included with Pro
          </div>
          {[
            "SEO Health Dashboard — score all pages at a glance",
            "SEO Optimizer — bulk edit meta fields across all pages",
            "SERP Preview — pixel-accurate desktop + mobile preview",
            "Schema.org Wizard — 13 structured data types",
            "Team Workflow — Draft → Review → Approved statuses",
            "CSV Export / Import — bulk update via spreadsheet",
          ].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#3b82f6",
                  flexShrink: 0,
                  marginTop: 5,
                }}
              />
              <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <a
          href={CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "13px 32px",
            background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
            border: "none",
            borderRadius: 10,
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            textDecoration: "none",
            boxShadow: "0 0 30px #1d4ed840",
            transition: "opacity 0.2s",
          }}
        >
          <LaunchIcon style={{ fontSize: 15 }} />
          Get Pro License
        </a>

        <div style={{ marginTop: 14, fontSize: 11, color: "#334155" }}>
          Already have a key? Add{" "}
          <code style={{ color: "#475569" }}>proFeature: process.env.SEO_PRO_LICENSE_KEY</code> to
          your plugin config.
        </div>
      </div>
    </div>
  );
}

function CardGate({ feature }: { feature: string }) {
  return (
    <div
      style={{
        background: "#0a111f",
        border: "1px dashed #1e3a5f",
        borderRadius: 12,
        padding: "20px 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <SparklesIcon style={{ color: "#3b82f6", fontSize: 16 }} />
        <span
          style={{
            padding: "2px 10px",
            background: "#1e3a5f",
            borderRadius: 99,
            fontSize: 10,
            fontWeight: 800,
            color: "#60a5fa",
            letterSpacing: 1.2,
            textTransform: "uppercase",
          }}
        >
          PRO
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#93c5fd" }}>{feature}</span>
      </div>
      <div style={{ fontSize: 12, color: "#475569", marginBottom: 14 }}>
        Upgrade to sanity-plugin-seo Pro to unlock this feature.
      </div>
      <a
        href={CHECKOUT_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 16px",
          background: "#1d4ed8",
          border: "none",
          borderRadius: 7,
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        <LaunchIcon style={{ fontSize: 13 }} />
        Get Pro License
      </a>
    </div>
  );
}

export default function ProGate({ feature, children, isPro, variant = "card" }: Props) {
  if (isPro) return children as React.ReactElement;
  if (variant === "page") return <PageGate feature={feature} />;
  return <CardGate feature={feature} />;
}
