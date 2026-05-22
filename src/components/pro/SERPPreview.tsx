import React, { useState } from "react";
import { Card, Stack, Text, Flex } from "@sanity/ui";
import useProEnabled from "../../hooks/useProEnabled";
import ProGate from "./ProGate";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  value: Record<string, any> | undefined;
}

const MAX_TITLE_PX = 600;
const MAX_DESC_PX = 920;
const AVG_CHAR_WIDTH_DESKTOP = 8.5;
const AVG_CHAR_WIDTH_MOBILE = 7.5;

function pxWidth(text: string, charWidth: number) {
  return text.length * charWidth;
}

function truncateByPx(text: string, maxPx: number, charWidth: number): string {
  const maxChars = Math.floor(maxPx / charWidth);
  return text.length > maxChars ? `${text.slice(0, maxChars)}…` : text;
}

function DesktopSERP({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  const charWidth = AVG_CHAR_WIDTH_DESKTOP;
  const titlePx = pxWidth(title, charWidth);
  const descPx = pxWidth(description, charWidth);
  const truncTitle = truncateByPx(title, MAX_TITLE_PX, charWidth);
  const truncDesc = truncateByPx(description, MAX_DESC_PX, charWidth);

  return (
    <Stack space={2}>
      <div style={{ maxWidth: 600, fontFamily: "arial, sans-serif" }}>
        <div style={{ fontSize: 13, color: "#202124", marginBottom: 2 }}>
          <span style={{ color: "#006621" }}>{url || "https://yoursite.com"}</span>
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#1a0dab",
            fontWeight: 400,
            lineHeight: "1.3",
            marginBottom: 4,
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {truncTitle || "No title set"}
        </div>
        <div style={{ fontSize: 14, color: "#4d5156", lineHeight: "1.58" }}>
          {truncDesc || "No description set — search engines will auto-generate one."}
        </div>
      </div>
      <Stack space={1}>
        <PixelBar label="Title" px={titlePx} max={MAX_TITLE_PX} />
        <PixelBar label="Description" px={descPx} max={MAX_DESC_PX} />
      </Stack>
    </Stack>
  );
}

function MobileSERP({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  const charWidth = AVG_CHAR_WIDTH_MOBILE;
  const truncTitle = truncateByPx(title, 400, charWidth);
  const truncDesc = truncateByPx(description, 660, charWidth);

  return (
    <div
      style={{
        maxWidth: 360,
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 16,
        fontFamily: "arial, sans-serif",
        background: "#fff",
      }}
    >
      <div style={{ fontSize: 11, color: "#70757a", marginBottom: 4 }}>
        {url || "https://yoursite.com"}
      </div>
      <div
        style={{
          fontSize: 18,
          color: "#1558d6",
          fontWeight: 400,
          marginBottom: 6,
        }}
      >
        {truncTitle || "No title set"}
      </div>
      <div style={{ fontSize: 13, color: "#3c4043", lineHeight: "1.57" }}>
        {truncDesc || "No description set."}
      </div>
    </div>
  );
}

function PixelBar({ label, px, max }: { label: string; px: number; max: number }) {
  const pct = Math.min(100, (px / max) * 100);
  const over = px > max;
  return (
    <Flex align="center" gap={2}>
      <Text size={1} muted style={{ minWidth: 80 }}>
        {label} ({Math.round(px)}px)
      </Text>
      <div
        style={{
          flex: 1,
          height: 6,
          background: "#e2e8f0",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: over ? "#ef4444" : "#43d675",
            borderRadius: 3,
          }}
        />
      </div>
      <Text size={1} muted style={{ minWidth: 40 }}>
        {over ? "Over" : "OK"}
      </Text>
    </Flex>
  );
}

const TAB_STYLE = (active: boolean) => ({
  padding: "6px 14px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: active ? 600 : 400,
  background: active ? "#1e293b" : "transparent",
  color: active ? "#f8fafc" : "#64748b",
});

export default function SERPPreview({ value }: Props) {
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");
  const { isPro } = useProEnabled();
  const title = value?.metaTitle || "";
  const description = value?.metaDescription || "";
  const url = value?.canonicalUrl || value?.openGraph?.url || "";

  return (
    <ProGate feature="Advanced SERP Preview" isPro={isPro}>
      <Card padding={3} radius={2} shadow={1}>
        <Stack space={3}>
          <Flex align="center" justify="space-between">
            <Text size={2} weight="semibold">
              SERP Preview
            </Text>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                type="button"
                style={TAB_STYLE(mode === "desktop")}
                onClick={() => setMode("desktop")}
              >
                Desktop
              </button>
              <button
                type="button"
                style={TAB_STYLE(mode === "mobile")}
                onClick={() => setMode("mobile")}
              >
                Mobile
              </button>
            </div>
          </Flex>
          <Card
            padding={3}
            radius={2}
            style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
          >
            {mode === "desktop" ? (
              <DesktopSERP title={title} description={description} url={url} />
            ) : (
              <MobileSERP title={title} description={description} url={url} />
            )}
          </Card>
        </Stack>
      </Card>
    </ProGate>
  );
}
