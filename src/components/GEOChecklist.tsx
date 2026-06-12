import React from "react";
import { Stack, Card, Flex, Text, useTheme } from "@sanity/ui";
import CheckCircleIcon from "./icons/CheckCircleIcon";
import EmptyCircleIcon from "./icons/EmptyCircleIcon";
import ProgressRing from "./icons/ProgressRing";

interface GEOItem {
  label: string;
  pass: boolean;
  description: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function buildGEOChecklist(value: Record<string, any> | undefined): GEOItem[] {
  const v = value || {};
  const kw = (v.focusKeyword || "").toLowerCase().trim();

  return [
    {
      label: "Structured data configured",
      pass: true,
      description: "Plugin generates JSON-LD automatically",
    },
    {
      label: "Description is answer-ready",
      pass: (v.metaDescription || "").length >= 100 && (v.metaDescription || "").length <= 160,
      description: "Optimal length for AI snippet extraction (100–160 chars)",
    },
    {
      label: "OG image present",
      pass: Boolean(v.openGraph?.image?.asset),
      description: "AI visual search and social sharing require an image",
    },
    {
      label: "Keyword in title and description",
      pass: kw
        ? v.metaTitle?.toLowerCase().includes(kw) && v.metaDescription?.toLowerCase().includes(kw)
        : false,
      description: "Keyword consistency signals topical relevance to AI crawlers",
    },
    {
      label: "Open Graph fully configured",
      pass: Boolean(v.openGraph?.title && v.openGraph?.description && v.openGraph?.image?.asset),
      description: "Required for social sharing and AI citation previews",
    },
  ];
}

function badgeTone(passCount: number, total: number): "positive" | "caution" | "critical" {
  if (passCount === total) return "positive";
  if (passCount >= total / 2) return "caution";
  return "critical";
}

function getStatusColor(tone: "positive" | "caution" | "critical"): string {
  if (tone === "positive") return "#10b981";
  if (tone === "caution") return "#f59e0b";
  return "#ef4444";
}

export default function GEOChecklist({ value }: { value: Record<string, any> | undefined }) {
  const items = buildGEOChecklist(value);
  const passCount = items.filter((i) => i.pass).length;
  const total = items.length;

  const theme = useTheme();
  const isDarkMode =
    theme.sanity.v2?.color._dark ??
    (theme.sanity as unknown as { color: { dark: boolean } }).color.dark;

  const tone = badgeTone(passCount, total);
  const statusColor = getStatusColor(tone);

  return (
    <Card
      padding={4}
      radius={3}
      style={{
        background: "var(--card-bg-color)",
        borderWidth: "1px 1px 1px 4px",
        borderStyle: "solid",
        borderColor: `var(--card-border-color) var(--card-border-color) var(--card-border-color) ${statusColor}`,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <Stack space={4}>
        <Flex align="center" gap={4} style={{ marginBottom: 4 }}>
          {/* Progress Ring (Graphical Representation) */}
          <ProgressRing
            value={passCount}
            total={total}
            color={statusColor}
            isDarkMode={isDarkMode}
            text={`${passCount}/${total}`}
            fontSize="14px"
          />

          <Stack space={2} style={{ flexGrow: 1 }}>
            <Text size={2} weight="bold" style={{ color: "var(--card-fg-color)" }}>
              GEO Score AI Search Visibility
            </Text>
            <Text size={1} muted style={{ color: "var(--card-muted-fg-color)", lineHeight: 1.4 }}>
              How well this page is optimised for ChatGPT, Perplexity, and Google AI Overviews
            </Text>
          </Stack>
        </Flex>

        <Stack space={3} style={{ marginTop: 4 }}>
          {items.map((item) => {
            const Icon = item.pass ? (
              <CheckCircleIcon isDarkMode={isDarkMode} style={{ marginTop: 2 }} />
            ) : (
              <EmptyCircleIcon isDarkMode={isDarkMode} style={{ marginTop: 2 }} />
            );

            return (
              <Flex key={item.label} align="flex-start" gap={3} style={{ padding: "6px 0" }}>
                {Icon}
                <Flex direction="column" gap={1}>
                  <Text
                    size={1}
                    weight={item.pass ? "semibold" : "medium"}
                    style={{ color: "var(--card-fg-color)" }}
                  >
                    {item.label}
                  </Text>
                  {!item.pass && (
                    <Text
                      size={1}
                      muted
                      style={{ color: "var(--card-muted-fg-color)", marginTop: 2 }}
                    >
                      {item.description}
                    </Text>
                  )}
                </Flex>
              </Flex>
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
}
