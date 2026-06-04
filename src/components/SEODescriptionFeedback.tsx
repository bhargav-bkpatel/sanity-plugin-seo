import React, { useEffect, useCallback } from "react";
import { StringInputProps, useFormValue, useClient, set } from "sanity";
import { Stack, Text, Flex } from "@sanity/ui";
import AIGenerateButton from "./AIGenerateButton";
import { getReadabilityScore } from "../utils/readability";

const DOT = (color: string) => (
  <div
    style={{
      width: 10,
      height: 10,
      borderRadius: "50%",
      backgroundColor: color,
      flexShrink: 0,
    }}
  />
);

function readabilityColor(c: "green" | "orange" | "red"): string {
  if (c === "green") return "#43d675";
  if (c === "orange") return "#f59e0b";
  return "#ef4444";
}

const SEODescriptionFeedback = ({
  value,
  onChange,
  renderDefault,
  path,
  ...rest
}: StringInputProps) => {
  const client = useClient({ apiVersion: "2021-06-07" });

  const parentPath = path.slice(0, -1);
  const parent = useFormValue(parentPath) as { focusKeyword?: string };
  const focusKeyword = parent?.focusKeyword || "";

  useEffect(() => {
    if (value) return;
    const fetchData = async () => {
      const data = await client.fetch(`*[_type=='homePage'][0]{'description':seo.metaDescription}`);
      if (data?.description && !value) onChange(set(data.description));
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, onChange, value]);

  const handleAIGenerate = useCallback((generated: string) => onChange(set(generated)), [onChange]);

  const text = value || "";
  const len = text.length;
  const items: { text: string; color: string }[] = [];

  if (!text.trim()) {
    items.push({
      text: "No description. Search engines will auto-generate one — usually poorly.",
      color: "#ef4444",
    });
  } else if (len < 100) {
    items.push({
      text: `Too short (${len}/100–160 chars). Expand it.`,
      color: "#f59e0b",
    });
  } else if (len > 160) {
    items.push({
      text: `Too long (${len}/160 chars max). It will be cut off in results.`,
      color: "#ef4444",
    });
  } else {
    items.push({
      text: `Description length (${len}) is perfect.`,
      color: "#43d675",
    });
  }

  if (focusKeyword && text) {
    if (text.toLowerCase().includes(focusKeyword.toLowerCase())) {
      items.push({
        text: `Focus keyword "${focusKeyword}" found in description.`,
        color: "#43d675",
      });
    } else {
      items.push({
        text: `Focus keyword "${focusKeyword}" not in description.`,
        color: "#ef4444",
      });
    }
  }

  const readability = text.length > 50 ? getReadabilityScore(text) : null;
  if (readability) {
    items.push({
      text: `Readability: ${readability.label}`,
      color: readabilityColor(readability.color),
    });
  }

  const props = { value, onChange, renderDefault, path, ...rest };

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <AIGenerateButton
        field="description"
        focusKeyword={focusKeyword}
        onGenerate={handleAIGenerate}
      />
      <Stack space={2}>
        {items.map((item) => (
          <Flex key={item.text} align="center" gap={2}>
            {DOT(item.color)}
            <Text size={1} muted>
              {item.text}
            </Text>
          </Flex>
        ))}
      </Stack>
    </Stack>
  );
};

export default SEODescriptionFeedback;
