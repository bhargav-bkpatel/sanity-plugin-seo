import React, { useEffect, useState, useCallback } from "react";
import { useClient, useFormValue, PatchEvent, set } from "sanity";
import { CheckmarkCircleIcon, WarningOutlineIcon } from "@sanity/icons";
import useProEnabled from "../../hooks/useProEnabled";
import ProGate from "./ProGate";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface CheckResult {
  key: string;
  label: string;
  pass: boolean;
  description?: string;
  onFix?: () => void;
  fixLabel?: string;
  fixHint?: string;
}

function CheckRow({ check, justFixed }: { check: CheckResult; justFixed: boolean }) {
  const passColor = "#22c55e";
  const warnColor = "#f59e0b";
  const color = check.pass || justFixed ? passColor : warnColor;
  const Icon = check.pass || justFixed ? CheckmarkCircleIcon : WarningOutlineIcon;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "8px 0",
        borderBottom: "1px solid var(--card-border-color)",
      }}
    >
      <Icon style={{ fontSize: 16, color, flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: justFixed ? passColor : "var(--card-fg-color)",
          }}
        >
          {check.label}
          {justFixed && (
            <span
              style={{
                marginLeft: 8,
                fontSize: 10,
                fontWeight: 700,
                color: passColor,
                background: "rgba(34, 197, 94, 0.15)",
                padding: "1px 7px",
                borderRadius: 99,
              }}
            >
              Fixed!
            </span>
          )}
        </div>
        {!check.pass && !justFixed && check.description && (
          <div
            style={{
              fontSize: 11,
              color: "var(--card-muted-fg-color)",
              marginTop: 2,
              lineHeight: 1.5,
            }}
          >
            {check.description}
          </div>
        )}
        {!check.pass && !justFixed && check.fixHint && (
          <div
            style={{
              fontSize: 11,
              color: "var(--card-muted-fg-color)",
              marginTop: 4,
              fontStyle: "italic",
              lineHeight: 1.5,
            }}
          >
            {check.fixHint}
          </div>
        )}
      </div>
      {!check.pass && !justFixed && check.onFix && check.fixLabel && (
        <button
          type="button"
          onClick={check.onFix}
          style={{
            padding: "6px 14px",
            background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
            border: "none",
            borderRadius: 7,
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
            boxShadow: "0 2px 8px #1d4ed840",
          }}
        >
          {check.fixLabel}
        </button>
      )}
    </div>
  );
}

interface Props {
  value: Record<string, any> | undefined;
  onChange: (e: any) => void;
}

export default function AdvancedValidation({ value, onChange }: Props) {
  const { isPro } = useProEnabled();
  const client = useClient({ apiVersion: "2024-01-01" });
  const docId: string = (useFormValue(["_id"]) as string) || "";
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [justFixed, setJustFixed] = useState<Record<string, boolean>>({});

  const markFixed = useCallback((key: string) => {
    setJustFixed((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setJustFixed((prev) => ({ ...prev, [key]: false })), 2500);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function runChecks() {
      const results: CheckResult[] = [];

      // 1. Duplicate meta title
      const metaTitle: string = value?.metaTitle || "";
      if (metaTitle) {
        const dupId = await client.fetch<string | null>(
          `*[defined(seo.metaTitle) && seo.metaTitle == $title && _id != $id && !(_id in path("drafts.**"))][0]._id`,
          { title: metaTitle, id: docId },
        );
        results.push({
          key: "dupTitle",
          label: "Unique meta title",
          pass: !dupId,
          description: dupId
            ? "Another published document has the same meta title. Duplicate titles hurt rankings."
            : undefined,
        });
      } else {
        results.push({
          key: "dupTitle",
          label: "Unique meta title",
          pass: false,
          description: "No meta title set — set one in Basic SEO to check uniqueness.",
        });
      }

      // 2. Missing OG image
      const hasOgImage: boolean = Boolean(value?.openGraph?.image?.asset);
      results.push({
        key: "ogImage",
        label: "Open Graph image present",
        pass: hasOgImage,
        description: hasOgImage ? undefined : "No OG image — social shares will show no preview.",
        fixHint: hasOgImage ? undefined : "→ Go to Social Sharing tab to add an OG image.",
      });

      // 4. Missing OG title
      const hasOgTitle: boolean = Boolean(value?.openGraph?.title);
      const fixOgTitle = () => {
        if (value?.metaTitle) {
          onChange(PatchEvent.from(set(value.metaTitle, ["openGraph", "title"])));
        }
      };
      results.push({
        key: "ogTitle",
        label: "Open Graph title set",
        pass: hasOgTitle,
        description: hasOgTitle
          ? undefined
          : "OG title should be explicit — search engines may use a poor fallback.",
        onFix: hasOgTitle ? undefined : fixOgTitle,
        fixLabel: hasOgTitle ? undefined : "Copy from meta title",
      });

      // 5. Focus keyword in meta title
      const focusKeyword: string = (value?.focusKeyword || "").trim().toLowerCase();
      const titleLower: string = metaTitle.toLowerCase();
      const keywordInTitle =
        Boolean(focusKeyword) && Boolean(metaTitle) && titleLower.includes(focusKeyword);
      let focusKeywordDesc: string | undefined;
      if (!keywordInTitle && !(!focusKeyword && !metaTitle)) {
        focusKeywordDesc = focusKeyword
          ? `"${value?.focusKeyword}" not found in meta title — include it for better rankings.`
          : "Set a focus keyword in Basic SEO to enable this check.";
      }
      results.push({
        key: "focusKeyword",
        label: "Focus keyword in meta title",
        pass: keywordInTitle,
        description: focusKeywordDesc,
      });

      // 7. Meta description length
      const metaDesc: string = value?.metaDescription || "";
      const descLen = metaDesc.length;
      const goodDescLen = descLen >= 100 && descLen <= 160;
      results.push({
        key: "descLength",
        label: "Meta description length (100–160 chars)",
        pass: goodDescLen,
        description: (() => {
          if (!goodDescLen && metaDesc) {
            const hint =
              descLen < 100 ? "too short, add more context" : "too long, trim for full display";
            return `Currently ${descLen} chars — ${hint}.`;
          }
          if (!goodDescLen) return "No meta description set — add one in Basic SEO.";
          return undefined;
        })(),
      });

      if (!cancelled) {
        setChecks(results);
      }
    }

    runChecks();

    return () => {
      cancelled = true;
    };
  }, [client, docId, value, onChange, markFixed]);

  const passCount = checks.filter((c) => c.pass).length;
  const issueCount = checks.filter((c) => !c.pass).length;
  const allClear = checks.length > 0 && issueCount === 0;
  const pct = checks.length > 0 ? Math.round((passCount / checks.length) * 100) : 0;

  let barColor = "#ef4444";
  if (allClear) barColor = "#22c55e";
  else if (pct >= 60) barColor = "#f59e0b";

  const fixableChecks = checks.filter((c) => !c.pass && c.onFix);

  return (
    <ProGate feature="Advanced Validation" isPro={isPro}>
      <div
        style={{
          background: "var(--card-bg-color)",
          border: "1px solid var(--card-border-color)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--card-border-color)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--card-fg-color)" }}>
              Advanced Validation
            </div>
            {checks.length > 0 && (
              <div
                style={{
                  padding: "3px 10px",
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 700,
                  // eslint-disable-next-line no-nested-ternary
                  background: allClear
                    ? "rgba(34, 197, 94, 0.15)"
                    : issueCount <= 2
                    ? "rgba(245, 158, 11, 0.15)"
                    : "rgba(239, 68, 68, 0.15)",
                  // eslint-disable-next-line no-nested-ternary
                  color: allClear ? "#22c55e" : issueCount <= 2 ? "#f59e0b" : "#ef4444",
                }}
              >
                {allClear ? "All clear" : `${issueCount} issue${issueCount !== 1 ? "s" : ""}`}
              </div>
            )}
          </div>

          {/* Progress bar */}
          {checks.length > 0 && (
            <div>
              <div
                style={{
                  height: 5,
                  background: "var(--card-border-color)",
                  borderRadius: 99,
                  overflow: "hidden",
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: barColor,
                    borderRadius: 99,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--card-muted-fg-color)",
                  fontFamily: "monospace",
                }}
              >
                {passCount}/{checks.length} checks passing
              </div>
            </div>
          )}
        </div>

        {/* Fix all button */}
        {fixableChecks.length > 0 && (
          <div style={{ padding: "8px 16px", borderBottom: "1px solid var(--card-border-color)" }}>
            <button
              type="button"
              onClick={() => {
                fixableChecks.forEach((c) => {
                  c.onFix?.();
                  markFixed(c.key);
                });
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
              Fix {fixableChecks.length} issue{fixableChecks.length !== 1 ? "s" : ""} automatically
            </button>
          </div>
        )}

        {/* Checks */}
        <div style={{ padding: "4px 16px 8px" }}>
          {checks.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--card-muted-fg-color)", padding: "12px 0" }}>
              Running checks…
            </div>
          ) : (
            checks.map((check) => (
              <CheckRow
                key={check.key}
                check={{
                  ...check,
                  onFix: check.onFix
                    ? () => {
                        check.onFix?.();
                        markFixed(check.key);
                      }
                    : undefined,
                }}
                justFixed={justFixed[check.key] || false}
              />
            ))
          )}
        </div>
      </div>
    </ProGate>
  );
}
