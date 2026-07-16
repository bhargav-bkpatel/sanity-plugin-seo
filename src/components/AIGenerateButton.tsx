import React, { useState, useCallback } from "react";
import { Flex, Button, Text, Stack, Card } from "@sanity/ui";
import { SparklesIcon } from "@sanity/icons";
import { useFormValue } from "sanity";
import { getPluginConfig } from "../config";
import { generateSEOContent, AIField } from "../utils/aiGenerate";
import { resolveBodyContent, getBodyFieldPaths } from "../utils/resolveBodyContent";

interface Props {
  field: AIField;
  focusKeyword?: string;
  onGenerate: (value: string) => void;
}

export default function AIGenerateButton({ field, focusKeyword = "", onGenerate }: Props) {
  const config = getPluginConfig();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const docValue = useFormValue([]);
  const bodyFieldPaths = getBodyFieldPaths(config.bodyFields, config.bodyField);
  const bodyText = resolveBodyContent(docValue, bodyFieldPaths);

  const handleGenerate = useCallback(async () => {
    if (!config.aiFeature) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateSEOContent(field, bodyText, focusKeyword, config.aiFeature);
      onGenerate(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "AI generation failed. Check your API key.");
    } finally {
      setLoading(false);
    }
  }, [config.aiFeature, field, bodyText, focusKeyword, onGenerate]);

  if (!config.aiFeature) return null;

  return (
    <Stack space={1}>
      <Flex align="center" gap={2}>
        <Button
          mode="ghost"
          tone="primary"
          padding={2}
          icon={SparklesIcon}
          text={loading ? "Generating…" : `Generate with AI`}
          onClick={handleGenerate}
          disabled={loading}
          fontSize={1}
        />
        {!bodyText && (
          <Text size={1} muted>
            (Add body content for better results)
          </Text>
        )}
      </Flex>
      {error && (
        <Card padding={2} tone="critical" radius={2}>
          <Text size={1}>{error}</Text>
        </Card>
      )}
    </Stack>
  );
}
