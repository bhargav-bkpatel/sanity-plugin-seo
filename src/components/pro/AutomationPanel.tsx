import React, { useState, useCallback } from "react";
import { useFormValue, PatchEvent, set } from "sanity";
import { SparklesIcon } from "@sanity/icons";
import { getPluginConfig } from "../../config";
import useProEnabled from "../../hooks/useProEnabled";
import ProGate from "./ProGate";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  value: Record<string, any> | undefined;
  onChange: (e: any) => void;
}

interface ActionRowProps {
  label: string;
  description: string;
  alreadySet: boolean;
  currentValue?: string;
  onAction: () => void;
  justApplied?: boolean;
}

function ActionRow({
  label,
  description,
  alreadySet,
  currentValue,
  onAction,
  justApplied,
}: ActionRowProps) {
  const truncated =
    currentValue && currentValue.length > 45 ? `${currentValue.slice(0, 45)}…` : currentValue;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid #1e293b",
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 2 }}>
          {label}
          {justApplied && (
            <span
              style={{
                marginLeft: 8,
                fontSize: 10,
                fontWeight: 700,
                color: "#22c55e",
                background: "#14532d",
                padding: "1px 7px",
                borderRadius: 99,
              }}
            >
              Applied!
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{description}</div>
        {alreadySet && truncated && !justApplied && (
          <div style={{ fontSize: 11, color: "#475569", marginTop: 3, fontStyle: "italic" }}>
            {truncated}
          </div>
        )}
      </div>
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
        }}
      >
        <button
          type="button"
          onClick={onAction}
          style={{
            padding: "7px 14px",
            // eslint-disable-next-line no-nested-ternary
            background: justApplied
              ? "#14532d"
              : alreadySet
              ? "#0f172a"
              : "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
            border: alreadySet && !justApplied ? "1px solid #1e3a5f" : "none",
            borderRadius: 8,
            // eslint-disable-next-line no-nested-ternary
            color: justApplied ? "#22c55e" : alreadySet ? "#475569" : "#fff",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: !alreadySet ? "0 2px 8px #1d4ed840" : "none",
          }}
        >
          {/* eslint-disable-next-line no-nested-ternary */}
          {justApplied ? "Applied ✓" : alreadySet ? "Re-apply" : label}
        </button>
      </div>
    </div>
  );
}

export default function AutomationPanel({ value, onChange }: Props) {
  const { isPro } = useProEnabled();
  const config = getPluginConfig();
  const slugField = config.slugField || "slug";
  const [justApplied, setJustApplied] = useState<Record<string, boolean>>({});

  const slugRaw = useFormValue([slugField]) as any;
  const slugValue: string = typeof slugRaw === "string" ? slugRaw : slugRaw?.current ?? "";

  const siteUrl: string =
    (typeof process !== "undefined" && process.env?.SANITY_STUDIO_SITE_URL) ||
    "https://yoursite.com";

  const markApplied = useCallback((key: string) => {
    setJustApplied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setJustApplied((prev) => ({ ...prev, [key]: false })), 2500);
  }, []);

  const handleAutoCanonical = () => {
    const canonical = slugValue ? `${siteUrl}/${slugValue}` : siteUrl;
    onChange(PatchEvent.from(set(canonical, ["canonicalUrl"])));
    markApplied("canonical");
  };

  const handleCopyMetaToOg = () => {
    if (value?.metaTitle) {
      onChange(PatchEvent.from(set(value.metaTitle, ["openGraph", "title"])));
    }
    if (value?.metaDescription) {
      onChange(PatchEvent.from(set(value.metaDescription, ["openGraph", "description"])));
    }
    markApplied("og");
  };

  const handleAutoFocusKeyword = () => {
    const title: string = value?.metaTitle || "";
    const words = title.split(/\s+/).filter((w) => w.length > 4);
    if (words.length === 0) return;
    const longest = words.reduce((a, b) => (a.length >= b.length ? a : b));
    onChange(PatchEvent.from(set(longest, ["focusKeyword"])));
    markApplied("keyword");
  };

  const canonicalAlreadySet = Boolean(value?.canonicalUrl);
  const ogAlreadySet = Boolean(value?.openGraph?.title) && Boolean(value?.openGraph?.description);
  const focusKeywordAlreadySet = Boolean(value?.focusKeyword);

  const pendingCount = [!canonicalAlreadySet, !ogAlreadySet, !focusKeywordAlreadySet].filter(
    Boolean,
  ).length;

  return (
    <ProGate feature="SEO Automation" isPro={isPro}>
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #1e293b",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <SparklesIcon style={{ fontSize: 14, color: "#3b82f6" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>
                SEO Automation
              </span>
            </div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
              One-click actions that fill missing SEO fields automatically
            </div>
          </div>
          {pendingCount > 0 && (
            <div
              style={{
                padding: "3px 10px",
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 700,
                background: "#422006",
                color: "#f59e0b",
              }}
            >
              {pendingCount} pending
            </div>
          )}
          {pendingCount === 0 && (
            <div
              style={{
                padding: "3px 10px",
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 700,
                background: "#14532d",
                color: "#22c55e",
              }}
            >
              All set
            </div>
          )}
        </div>

        {/* Apply all button */}
        {pendingCount > 0 && (
          <div style={{ padding: "8px 16px", borderBottom: "1px solid #1e293b" }}>
            <button
              type="button"
              onClick={() => {
                handleAutoCanonical();
                handleCopyMetaToOg();
                handleAutoFocusKeyword();
              }}
              style={{
                width: "100%",
                padding: "8px 0",
                background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
                border: "none",
                borderRadius: 8,
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 12px #1d4ed840",
              }}
            >
              Apply all {pendingCount} automation{pendingCount !== 1 ? "s" : ""}
            </button>
          </div>
        )}

        {/* Action rows */}
        <div style={{ padding: "0 16px" }}>
          <ActionRow
            label="Auto Canonical URL"
            description={`Builds canonical URL from slug: ${siteUrl}/${slugValue || "<slug>"}`}
            alreadySet={canonicalAlreadySet}
            currentValue={value?.canonicalUrl}
            onAction={handleAutoCanonical}
            justApplied={justApplied.canonical}
          />

          <ActionRow
            label="Copy Meta → Open Graph"
            description="Copies meta title and description into OG fields when empty."
            alreadySet={ogAlreadySet}
            currentValue={ogAlreadySet ? value?.openGraph?.title : undefined}
            onAction={handleCopyMetaToOg}
            justApplied={justApplied.og}
          />

          <div style={{ borderBottom: "none" }}>
            <ActionRow
              label="Auto Focus Keyword"
              description="Extracts the most prominent word from your meta title as the focus keyword."
              alreadySet={focusKeywordAlreadySet}
              currentValue={focusKeywordAlreadySet ? value?.focusKeyword : undefined}
              onAction={handleAutoFocusKeyword}
              justApplied={justApplied.keyword}
            />
          </div>
        </div>
      </div>
    </ProGate>
  );
}
