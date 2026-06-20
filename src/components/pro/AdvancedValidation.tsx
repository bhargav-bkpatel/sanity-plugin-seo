import React, { useEffect, useState, useCallback } from "react";
import { useClient, useFormValue, PatchEvent, set } from "sanity";
import { Stack, Card, Flex, Text, Box, useTheme, Badge, Button } from "@sanity/ui";
import useProEnabled from "../../hooks/useProEnabled";
import ProGate from "./ProGate";
import CheckCircleIcon from "../icons/CheckCircleIcon";
import AlertCircleIcon from "../icons/AlertCircleIcon";
import ProgressRing from "../icons/ProgressRing";

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

const CheckRow = ({
  check,
  justFixed,
  isDarkMode,
}: {
  check: CheckResult;
  justFixed: boolean;
  isDarkMode: boolean;
}) => {
  const passColor = "#10b981";

  const hasDescription = !check.pass && !justFixed && (check.description || check.fixHint);
  const showFixButton = !check.pass && !justFixed && check.onFix && check.fixLabel;
  const hasSecondary = hasDescription || showFixButton;

  let Icon = (
    <AlertCircleIcon isDarkMode={isDarkMode} style={hasSecondary ? { marginTop: 2 } : undefined} />
  );
  if (check.pass || justFixed) {
    Icon = (
      <CheckCircleIcon
        isDarkMode={isDarkMode}
        style={hasSecondary ? { marginTop: 2 } : undefined}
      />
    );
  }

  return (
    <Flex
      align={hasSecondary ? "flex-start" : "center"}
      gap={3}
      style={{
        padding: "10px 0",
        borderBottom: "1px solid var(--card-border-color)",
      }}
    >
      {Icon}
      <Flex direction="column" gap={1} style={{ flexGrow: 1 }}>
        <Flex align="center" gap={2}>
          <Text
            size={1}
            weight="semibold"
            style={{
              color: justFixed ? passColor : "var(--card-fg-color)",
            }}
          >
            {check.label}
          </Text>
          {justFixed && (
            <Badge tone="positive" fontSize={0}>
              Fixed!
            </Badge>
          )}
        </Flex>

        {!check.pass && !justFixed && check.description && (
          <Text size={1} muted style={{ color: "var(--card-muted-fg-color)", marginTop: 2 }}>
            {check.description}
          </Text>
        )}

        {!check.pass && !justFixed && check.fixHint && (
          <Text
            size={1}
            muted
            style={{
              color: "var(--card-muted-fg-color)",
              marginTop: 4,
              fontStyle: "italic",
            }}
          >
            {check.fixHint}
          </Text>
        )}
      </Flex>

      {!check.pass && !justFixed && check.onFix && check.fixLabel && (
        <Button
          onClick={check.onFix}
          text={check.fixLabel}
          mode="default"
          tone="primary"
          fontSize={1}
          padding={2}
          style={{ borderRadius: 6, flexShrink: 0 }}
        />
      )}
    </Flex>
  );
};

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

  const theme = useTheme();
  const isDarkMode =
    theme.sanity.v2?.color._dark ??
    (theme.sanity as unknown as { color: { dark: boolean } }).color.dark;

  const markFixed = useCallback((key: string) => {
    setJustFixed((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setJustFixed((prev) => ({ ...prev, [key]: false })), 2500);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function runChecks() {
      const results: CheckResult[] = [];

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

      const hasOgImage: boolean = Boolean(value?.openGraph?.image?.asset);
      results.push({
        key: "ogImage",
        label: "Open Graph image present",
        pass: hasOgImage,
        description: hasOgImage ? undefined : "No OG image — social shares will show no preview.",
        fixHint: hasOgImage ? undefined : "→ Go to Social Sharing tab to add an OG image.",
      });

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
  if (allClear) barColor = "#10b981";
  else if (pct >= 60) barColor = "#f59e0b";

  let badgeTone: "positive" | "caution" | "critical" = "critical";
  let badgeLabel = `${issueCount} issues`;
  if (allClear) {
    badgeTone = "positive";
    badgeLabel = "All clear";
  } else if (issueCount <= 2) {
    badgeTone = "caution";
    badgeLabel = `${issueCount} issue${issueCount !== 1 ? "s" : ""}`;
  } else {
    badgeLabel = `${issueCount} issue${issueCount !== 1 ? "s" : ""}`;
  }

  const fixableChecks = checks.filter((c) => !c.pass && c.onFix);

  return (
    <ProGate feature="Advanced Validation" isPro={isPro}>
      <Card
        padding={4}
        radius={3}
        style={{
          background: "var(--card-bg-color)",
          borderWidth: "1px 1px 1px 4px",
          borderStyle: "solid",
          borderColor: `var(--card-border-color) var(--card-border-color) var(--card-border-color) ${barColor}`,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <Stack space={4}>
          <Flex align="center" gap={4} style={{ marginBottom: 4 }}>
            {checks.length > 0 && (
              <ProgressRing
                value={passCount}
                total={checks.length}
                color={barColor}
                isDarkMode={isDarkMode}
                text={`${passCount}/${checks.length}`}
                fontSize="14px"
              />
            )}

            <Stack space={3} style={{ flexGrow: 1 }}>
              <Text size={2} weight="bold" style={{ color: "var(--card-fg-color)" }}>
                Advanced Validation
              </Text>
              {checks.length > 0 && (
                <Box style={{ alignSelf: "flex-start" }}>
                  <Badge tone={badgeTone} fontSize={1} padding={2}>
                    {badgeLabel}
                  </Badge>
                </Box>
              )}
            </Stack>
          </Flex>

          {fixableChecks.length > 0 && (
            <Button
              type="button"
              onClick={() => {
                fixableChecks.forEach((c) => {
                  c.onFix?.();
                  markFixed(c.key);
                });
              }}
              text={`Fix ${fixableChecks.length} issue${
                fixableChecks.length !== 1 ? "s" : ""
              } automatically`}
              mode="default"
              tone="primary"
              fontSize={1}
              padding={3}
              style={{ width: "100%", borderRadius: 8 }}
            />
          )}

          <Stack space={1} style={{ marginTop: 2 }}>
            {checks.length === 0 ? (
              <Text size={1} muted style={{ padding: "12px 0" }}>
                Running checks…
              </Text>
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
                  isDarkMode={isDarkMode}
                />
              ))
            )}
          </Stack>
        </Stack>
      </Card>
    </ProGate>
  );
}
