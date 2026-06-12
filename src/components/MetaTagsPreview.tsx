import React, { useState } from "react";
import { useWorkspace } from "sanity";
import { Stack, Card, Flex, Text, Button, Code, Box, useTheme } from "@sanity/ui";
import { CodeBlockIcon } from "@sanity/icons";

/* eslint-disable @typescript-eslint/no-explicit-any */

function getImageUrl(
  asset: Record<string, any>,
  projectId: string,
  dataset: string,
): string | null {
  if (!asset) return null;
  if (asset.url) return asset.url;

  if (asset._ref && projectId && dataset) {
    const ref = asset._ref;
    const match = ref.match(/^image-([a-z0-9]+)-(\d+x\d+)-(.+)$/);
    if (match) {
      const [, id, dims, format] = match;
      return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dims}.${format}`;
    }
  }

  return null;
}

function buildMetaTags(
  value: Record<string, any> | undefined,
  projectId: string,
  dataset: string,
): string {
  const v = value || {};
  const lines: string[] = [];

  if (v.metaTitle) lines.push(`<title>${v.metaTitle}</title>`);
  if (v.metaDescription) lines.push(`<meta name="description" content="${v.metaDescription}" />`);

  // Robots
  const robotsParts: string[] = [];
  if (v.nofollowAttributes) robotsParts.push("noindex", "nofollow");
  if (Array.isArray(v.robotsMeta) && v.robotsMeta.length > 0) {
    v.robotsMeta.forEach((r: string) => {
      if (!robotsParts.includes(r)) robotsParts.push(r);
    });
  }
  if (robotsParts.length > 0)
    lines.push(`<meta name="robots" content="${robotsParts.join(", ")}" />`);

  // Keywords
  if (Array.isArray(v.seoKeywords) && v.seoKeywords.length > 0)
    lines.push(`<meta name="keywords" content="${v.seoKeywords.join(", ")}" />`);

  // Open Graph
  const og = v.openGraph || {};
  if (og.title) lines.push(`<meta property="og:title" content="${og.title}" />`);
  if (og.description) lines.push(`<meta property="og:description" content="${og.description}" />`);
  if (og.siteName) lines.push(`<meta property="og:site_name" content="${og.siteName}" />`);

  const ogImageUrl = og.image?.asset ? getImageUrl(og.image.asset, projectId, dataset) : null;
  if (ogImageUrl) {
    lines.push(`<meta property="og:image" content="${ogImageUrl}" />`);
  }

  // Twitter
  const tw = v.twitter || {};
  if (tw.cardType) lines.push(`<meta name="twitter:card" content="${tw.cardType}" />`);
  if (tw.site) lines.push(`<meta name="twitter:site" content="${tw.site}" />`);
  if (tw.creator) lines.push(`<meta name="twitter:creator" content="${tw.creator}" />`);

  // hreflang
  if (Array.isArray(v.hreflang)) {
    v.hreflang.forEach((h: any) => {
      if (h.locale && h.url)
        lines.push(`<link rel="alternate" hreflang="${h.locale}" href="${h.url}" />`);
    });
  }

  // Additional Meta Tags
  if (Array.isArray(v.additionalMetaTags)) {
    v.additionalMetaTags.forEach((tag: any) => {
      if (Array.isArray(tag.metaAttributes)) {
        tag.metaAttributes.forEach((attr: any) => {
          if (attr.attributeKey && attr.attributeValueString) {
            lines.push(
              `<meta name="${attr.attributeKey}" content="${attr.attributeValueString}" />`,
            );
          } else if (attr.attributeKey && attr.attributeValueImage?.asset) {
            const imageUrl = getImageUrl(attr.attributeValueImage.asset, projectId, dataset);
            if (imageUrl) {
              lines.push(`<meta name="${attr.attributeKey}" content="${imageUrl}" />`);
            }
          }
        });
      }
    });
  }

  return lines.join("\n");
}

export default function MetaTagsPreview({ value }: { value: Record<string, any> | undefined }) {
  const { projectId, dataset } = useWorkspace();
  const [open, setOpen] = useState(false);
  const tags = buildMetaTags(value, projectId, dataset);
  const theme = useTheme();
  const isDarkMode =
    theme.sanity.v2?.color._dark ??
    (theme.sanity as unknown as { color: { dark: boolean } }).color.dark;

  return (
    <Card
      padding={4}
      radius={3}
      style={{
        background: "var(--card-bg-color)",
        borderWidth: "1px 1px 1px 4px",
        borderStyle: "solid",
        borderColor: `var(--card-border-color) var(--card-border-color) var(--card-border-color) #64748b`,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <Stack space={4}>
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={3}>
            <CodeBlockIcon style={{ color: "#64748b", fontSize: 20 }} />
            <Text size={2} weight="bold" style={{ color: "var(--card-fg-color)" }}>
              Meta Tags Preview
            </Text>
          </Flex>
          <Button
            mode="ghost"
            tone="default"
            padding={2}
            text={open ? "Hide" : "Show code"}
            onClick={() => setOpen(!open)}
            fontSize={1}
            style={{ borderRadius: 6 }}
          />
        </Flex>

        {open && (
          <Box
            style={{
              background: isDarkMode ? "rgba(0, 0, 0, 0.15)" : "#f8fafc",
              border: "1px solid var(--card-border-color)",
              borderRadius: 8,
              padding: "14px 16px",
              overflow: "auto",
              maxHeight: 320,
            }}
          >
            <Code
              language="html"
              style={{
                fontSize: 12,
                color: "var(--card-code-fg-color)",
                whiteSpace: "pre",
                fontFamily: "monospace",
                lineHeight: 1.5,
              }}
            >
              {tags || "<!-- No SEO fields filled in yet -->"}
            </Code>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
