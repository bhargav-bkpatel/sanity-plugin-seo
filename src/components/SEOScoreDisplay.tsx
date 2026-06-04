import React from "react";
import { Stack, Card, Flex, Text, Box } from "@sanity/ui";
import { SEOScoreResult } from "../utils/seoScore";

const DOT_COLORS: Record<string, string> = {
  green: "#43d675",
  orange: "#f59e0b",
  red: "#ef4444",
};

interface Props {
  result: SEOScoreResult;
}

function dotColor(pass: boolean | "partial"): string {
  if (pass === true) return "green";
  if (pass === "partial") return "orange";
  return "#94a3b8";
}

const CheckRow = ({ check }: { check: SEOScoreResult["checks"][0] }) => {
  const color = dotColor(check.pass);

  return (
    <Flex align="center" gap={2}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
      <Text size={1} muted>
        {check.name}: {check.hint}
      </Text>
    </Flex>
  );
};

function cardTone(color: string): "positive" | "caution" | "critical" {
  if (color === "green") return "positive";
  if (color === "orange") return "caution";
  return "critical";
}

export default function SEOScoreDisplay({ result }: Props) {
  const { score, color, label, checks } = result;
  const barColor = DOT_COLORS[color];

  return (
    <Card padding={3} radius={2} shadow={1} tone={cardTone(color)}>
      <Stack space={3}>
        <Flex align="center" justify="space-between">
          <Text size={2} weight="semibold">
            SEO Score
          </Text>
          <Flex align="center" gap={2}>
            <Text size={4} weight="bold" style={{ color: barColor }}>
              {score}
            </Text>
            <Text size={1} muted>
              / 100
            </Text>
            <Box
              style={{
                background: "#e2e8f0",
                borderRadius: 100,
                padding: "6px 8px",
                backgroundColor: `${barColor}22`,
              }}
            >
              <Text weight="semibold" style={{ color: barColor }}>
                {label}
              </Text>
            </Box>
          </Flex>
        </Flex>

        {/* Progress bar */}
        <div
          style={{
            height: 6,
            background: "#e2e8f0",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${score}%`,
              background: barColor,
              borderRadius: 3,
              transition: "width 0.4s ease",
            }}
          />
        </div>

        <Stack space={4}>
          {checks.map((c) => (
            <CheckRow key={c.name} check={c} />
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
