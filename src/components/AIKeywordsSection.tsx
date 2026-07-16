import React, { useState, useCallback } from "react";
import { Stack, Card, Flex, Text, Button } from "@sanity/ui";
import { SparklesIcon } from "@sanity/icons";
import { useFormValue } from "sanity";
import { getPluginConfig } from "../config";
import { generateSEOContent } from "../utils/aiGenerate";
import { resolveBodyContent, getBodyFieldPaths } from "../utils/resolveBodyContent";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  value: Record<string, any> | undefined;
  onChange: (keywords: string[]) => void;
}

export default function AIKeywordsSection({ value, onChange }: Props) {
  const config = getPluginConfig();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const docValue = useFormValue([]);
  const bodyFieldPaths = getBodyFieldPaths(config.bodyFields, config.bodyField);
  const bodyText = resolveBodyContent(docValue, bodyFieldPaths);
  const focusKeyword = value?.focusKeyword || "";
  const existing: string[] = value?.seoKeywords || [];

  const handleSuggest = useCallback(async () => {
    if (!config.aiFeature) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateSEOContent("keywords", bodyText, focusKeyword, config.aiFeature);
      const parsed = result
        .split(",")
        .map((k: string) => k.trim())
        .filter(Boolean);
      setSuggestions(parsed);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Keyword generation failed");
    } finally {
      setLoading(false);
    }
  }, [config.aiFeature, bodyText, focusKeyword]);

  const addKeyword = (kw: string) => {
    if (!existing.includes(kw)) onChange([...existing, kw]);
    setSuggestions((prev) => prev.filter((s) => s !== kw));
  };

  if (!config.aiFeature) return null;

  return (
    <Card padding={3} radius={2} shadow={1}>
      <Stack space={3}>
        <Flex align="center" justify="space-between">
          <Text size={2} weight="semibold">
            AI Keyword Suggestions
          </Text>
          <Button
            mode="ghost"
            tone="primary"
            padding={2}
            icon={SparklesIcon}
            text={loading ? "Thinking…" : "Suggest Keywords"}
            onClick={handleSuggest}
            disabled={loading}
            fontSize={1}
          />
        </Flex>
        {error && (
          <Card padding={2} tone="critical" radius={2}>
            <Text size={1}>{error}</Text>
          </Card>
        )}
        {suggestions.length > 0 && (
          <Stack space={2}>
            <Text size={1} muted>
              Click a keyword to add it:
            </Text>
            <Flex gap={2} wrap="wrap">
              {suggestions.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => addKeyword(kw)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 20,
                    border: "1px solid var(--card-border-color)",
                    background: "var(--card-border-color)",
                    color: "var(--card-fg-color)",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  + {kw}
                </button>
              ))}
            </Flex>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
