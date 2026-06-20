import React from "react";
import { Stack, Card, Flex, Text, Box, useTheme, Badge } from "@sanity/ui";
import { SEOScoreResult } from "../utils/seoScore";
import CheckCircleIcon from "./icons/CheckCircleIcon";
import AlertCircleIcon from "./icons/AlertCircleIcon";
import ErrorCircleIcon from "./icons/ErrorCircleIcon";
import ProgressRing from "./icons/ProgressRing";

const DOT_COLORS: Record<string, string> = {
  green: "#10b981",
  orange: "#f59e0b",
  red: "#ef4444",
};

interface Props {
  result: SEOScoreResult;
}

const CheckRow = ({
  check,
  isDarkMode,
}: {
  check: SEOScoreResult["checks"][0];
  isDarkMode: boolean;
}) => {
  const hasDescription = Boolean(check.hint);
  let Icon = (
    <ErrorCircleIcon
      isDarkMode={isDarkMode}
      style={hasDescription ? { marginTop: 2 } : undefined}
    />
  );
  if (check.pass === true) {
    Icon = (
      <CheckCircleIcon
        isDarkMode={isDarkMode}
        style={hasDescription ? { marginTop: 2 } : undefined}
      />
    );
  } else if (check.pass === "partial") {
    Icon = (
      <AlertCircleIcon
        isDarkMode={isDarkMode}
        style={hasDescription ? { marginTop: 2 } : undefined}
      />
    );
  }

  return (
    <Flex align={hasDescription ? "flex-start" : "center"} gap={3} style={{ padding: "6px 0" }}>
      {Icon}
      <Flex direction="column" gap={1}>
        <Text size={1} weight="semibold" style={{ color: "var(--card-fg-color)" }}>
          {check.name}
        </Text>
        {hasDescription && (
          <Text size={1} muted style={{ color: "var(--card-muted-fg-color)", marginTop: 2 }}>
            {check.hint}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default function SEOScoreDisplay({ result }: Props) {
  const { score, color, label, checks } = result;
  const theme = useTheme();
  const isDarkMode =
    theme.sanity.v2?.color._dark ??
    (theme.sanity as unknown as { color: { dark: boolean } }).color.dark;

  const barColor = DOT_COLORS[color];

  let badgeTone: "positive" | "caution" | "critical" = "critical";
  if (color === "green") {
    badgeTone = "positive";
  } else if (color === "orange") {
    badgeTone = "caution";
  }

  return (
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
          <ProgressRing
            value={score}
            total={100}
            color={barColor}
            isDarkMode={isDarkMode}
            text={String(score)}
            fontSize="18px"
          />

          <Stack space={3} style={{ flexGrow: 1 }}>
            <Text size={2} weight="bold" style={{ color: "var(--card-fg-color)" }}>
              SEO Score
            </Text>
            <Box style={{ alignSelf: "flex-start" }}>
              <Badge tone={badgeTone} fontSize={1} padding={2}>
                {label}
              </Badge>
            </Box>
          </Stack>
        </Flex>

        <Stack space={3} style={{ marginTop: 4 }}>
          {checks.map((c) => (
            <CheckRow key={c.name} check={c} isDarkMode={isDarkMode} />
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
