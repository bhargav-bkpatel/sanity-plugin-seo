import React from "react";
import { Stack, Card, Flex, Text, Badge } from "@sanity/ui";

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
      label: "Meta image present",
      pass: Boolean(v.metaImage?.asset),
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

export default function GEOChecklist({ value }: { value: Record<string, any> | undefined }) {
  const items = buildGEOChecklist(value);
  const passCount = items.filter((i) => i.pass).length;
  const total = items.length;

  return (
    <Card padding={3} radius={2} shadow={1}>
      <Stack space={3}>
        <Flex align="center" justify="space-between">
          <Stack space={1}>
            <Text size={2} weight="semibold">
              GEO Score — AI Search Visibility
            </Text>
            <Text size={1} muted>
              How well this page is optimised for ChatGPT, Perplexity, and Google AI Overviews
            </Text>
          </Stack>
          <Badge tone={badgeTone(passCount, total)} padding={2}>
            {passCount}/{total}
          </Badge>
        </Flex>

        <Stack space={2}>
          {items.map((item) => (
            <Flex key={item.label} align="flex-start" gap={2}>
              <div style={{ paddingTop: 2, flexShrink: 0 }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    backgroundColor: item.pass ? "#43d675" : "#e2e8f0",
                    border: item.pass ? "none" : "2px solid #94a3b8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.pass && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path
                        d="M1 4L3 6L7 2"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <Stack space={1}>
                <Text size={1} weight={item.pass ? "semibold" : "regular"}>
                  {item.label}
                </Text>
                {!item.pass && (
                  <Text size={1} muted>
                    {item.description}
                  </Text>
                )}
              </Stack>
            </Flex>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
