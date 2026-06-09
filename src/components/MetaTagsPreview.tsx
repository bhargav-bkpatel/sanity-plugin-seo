import React, { useState } from "react";
import { useWorkspace } from "sanity";
import { Stack, Card, Flex, Text, Button, Code, Box } from "@sanity/ui";
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

  return lines.join("\n");
}

export default function MetaTagsPreview({ value }: { value: Record<string, any> | undefined }) {
  const { projectId, dataset } = useWorkspace();
  const [open, setOpen] = useState(false);
  const tags = buildMetaTags(value, projectId, dataset);

  return (
    <Card padding={3} radius={2} shadow={1}>
      <Stack space={3}>
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={2}>
            <CodeBlockIcon style={{ color: "#64748b" }} />
            <Text size={2} weight="semibold">
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
          />
        </Flex>

        {open && (
          <Box
            style={{
              background: "var(--card-code-bg-color)",
              borderRadius: 6,
              padding: 12,
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
