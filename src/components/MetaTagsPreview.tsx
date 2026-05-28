import React, { useState } from "react";
import { Stack, Card, Flex, Text, Button, Code, Box } from "@sanity/ui";
import { CodeBlockIcon, CopyIcon, LaunchIcon } from "@sanity/icons";

/* eslint-disable @typescript-eslint/no-explicit-any */
function buildMetaTags(value: Record<string, any> | undefined): string {
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
  if (og.image?.asset) lines.push(`<meta property="og:image" content="[image url]" />`);

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
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const tags = buildMetaTags(value);

  const handleCopy = () => {
    navigator.clipboard.writeText(tags).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
          <Stack space={2}>
            <Box
              style={{
                background: "#0f172a",
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
                  color: "#e2e8f0",
                  whiteSpace: "pre",
                  fontFamily: "monospace",
                }}
              >
                {tags || "<!-- No SEO fields filled in yet -->"}
              </Code>
            </Box>
            <Flex gap={2}>
              <Button
                mode="ghost"
                padding={2}
                icon={CopyIcon}
                text={copied ? "Copied!" : "Copy"}
                onClick={handleCopy}
                fontSize={1}
                tone={copied ? "positive" : "default"}
              />
              <Button
                mode="ghost"
                padding={2}
                icon={LaunchIcon}
                text="Rich Results Test"
                as="a"
                href="https://search.google.com/test/rich-results"
                target="_blank"
                rel="noopener noreferrer"
                fontSize={1}
              />
            </Flex>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
