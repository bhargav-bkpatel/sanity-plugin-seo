import React, { useState } from "react";
import { Card, Stack, Text, Flex, Button, useTheme } from "@sanity/ui";
import { EarthGlobeIcon } from "@sanity/icons";
import { useFormValue } from "sanity";
import { getPluginConfig } from "../../config";
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

function truncateByPx(text: string, maxPx: number, charWidth: number): string {
  const maxChars = Math.floor(maxPx / charWidth);
  return text.length > maxChars ? `${text.slice(0, maxChars)}…` : text;
}

function getDomainAndPath(baseUrl: string, slug: string): string {
  let domain = baseUrl.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/$/, "");
  if (!domain) domain = "example.com";

  if (!slug || slug === "/") {
    return `https://${domain}`;
  }

  const parts = slug.split("/").filter(Boolean);
  return [`https://${domain}`, ...parts].join(" › ");
}

function getSiteName(baseUrl: string): string {
  const domain = baseUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
  if (!domain || domain === "example.com") return "Website";
  const parts = domain.split(".");
  const rawName = parts[0] || "Website";
  return rawName.charAt(0).toUpperCase() + rawName.slice(1);
}

function Favicon({
  domain,
  colors,
  isDarkMode,
}: {
  domain: string;
  colors: any;
  isDarkMode: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
  const containerSize = 28;
  const iconSize = 18;
  const fallbackFontSize = 18;

  if (failed || !domain || domain === "example.com") {
    return (
      <div
        style={{
          width: containerSize,
          height: containerSize,
          borderRadius: "50%",
          background: colors.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: colors.iconColor,
          flexShrink: 0,
        }}
      >
        <EarthGlobeIcon style={{ fontSize: fallbackFontSize }} />
      </div>
    );
  }

  return (
    <div
      style={{
        width: containerSize,
        height: containerSize,
        borderRadius: "50%",
        background: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <img
        src={faviconUrl}
        alt=""
        onError={() => setFailed(true)}
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: "50%",
          display: "block",
        }}
      />
    </div>
  );
}

function DesktopSERP({
  title,
  description,
  baseUrl,
  slug,
}: {
  title: string;
  description: string;
  baseUrl: string;
  slug: string;
}) {
  const theme = useTheme();
  const isDarkMode =
    theme.sanity.v2?.color._dark ??
    (theme.sanity as unknown as { color: { dark: boolean } }).color.dark;

  const colors = {
    iconBg: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
    iconColor: "var(--card-muted-fg-color)",
    domain: "var(--card-muted-fg-color)",
    siteName: "var(--card-fg-color)",
    title: isDarkMode ? "#8ab4f8" : "#1a0dab",
    description: "var(--card-muted-fg-color)",
  };

  const charWidth = AVG_CHAR_WIDTH_DESKTOP;
  const truncTitle = truncateByPx(title, MAX_TITLE_PX, charWidth);
  const truncDesc = truncateByPx(description, MAX_DESC_PX, charWidth);

  const cleanDomain = baseUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0] || "example.com";
  const siteName = getSiteName(baseUrl);
  const breadcrumb = getDomainAndPath(baseUrl, slug);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: "transparent",
        fontFamily: "Arial, sans-serif",
        width: "100%",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <Favicon domain={cleanDomain} colors={colors} isDarkMode={isDarkMode} />
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: colors.siteName,
              lineHeight: "18px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {siteName}
          </span>
          <span
            style={{
              fontSize: 12,
              color: colors.domain,
              lineHeight: "16px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {breadcrumb}
          </span>
        </div>
      </div>
      <h3
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontSize: 20,
          fontWeight: 400,
          lineHeight: "26px",
          margin: "0 0 6px 0",
          color: colors.title,
          cursor: "pointer",
          textDecoration: hovered ? "underline" : "none",
          wordBreak: "break-word",
        }}
      >
        {truncTitle || "Your page title will appear here"}
      </h3>

      <div
        style={{
          fontSize: 14,
          color: colors.description,
          lineHeight: "22px",
          margin: 0,
          wordBreak: "break-word",
        }}
      >
        {truncDesc ||
          "Your meta description will appear here to tell searchers what your page is about."}
      </div>
    </div>
  );
}

function MobileSERP({
  title,
  description,
  baseUrl,
  slug,
}: {
  title: string;
  description: string;
  baseUrl: string;
  slug: string;
}) {
  const theme = useTheme();
  const isDarkMode =
    theme.sanity.v2?.color._dark ??
    (theme.sanity as unknown as { color: { dark: boolean } }).color.dark;

  const colors = {
    iconBg: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
    iconColor: "var(--card-muted-fg-color)",
    domain: "var(--card-muted-fg-color)",
    siteName: "var(--card-fg-color)",
    title: isDarkMode ? "#8ab4f8" : "#1a0dab",
    description: "var(--card-muted-fg-color)",
  };

  const charWidth = AVG_CHAR_WIDTH_MOBILE;
  const truncTitle = truncateByPx(title, 480, charWidth);
  const truncDesc = truncateByPx(description, 580, charWidth);

  const cleanDomain = baseUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0] || "example.com";
  const siteName = getSiteName(baseUrl);
  const breadcrumb = getDomainAndPath(baseUrl, slug);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: "transparent",
        fontFamily: "Arial, sans-serif",
        width: "100%",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <Favicon domain={cleanDomain} colors={colors} isDarkMode={isDarkMode} />
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flexGrow: 1 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: colors.siteName,
              lineHeight: "18px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {siteName}
          </span>
          <span
            style={{
              fontSize: 12,
              color: colors.domain,
              lineHeight: "16px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {breadcrumb}
          </span>
        </div>
      </div>
      <h3
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontSize: 20,
          fontWeight: 400,
          lineHeight: "26px",
          margin: "0 0 6px 0",
          color: colors.title,
          cursor: "pointer",
          textDecoration: hovered ? "underline" : "none",
          wordBreak: "break-word",
        }}
      >
        {truncTitle || "Your page title will appear here"}
      </h3>

      <div
        style={{
          fontSize: 14,
          color: colors.description,
          lineHeight: "20px",
          margin: 0,
          wordBreak: "break-word",
        }}
      >
        {truncDesc || "Your meta description will appear here."}
      </div>
    </div>
  );
}

export default function SERPPreview({ value }: Props) {
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");
  const { isPro } = useProEnabled();
  const theme = useTheme();
  const isDarkMode =
    theme.sanity.v2?.color._dark ??
    (theme.sanity as unknown as { color: { dark: boolean } }).color.dark;

  const config = getPluginConfig();
  const baseUrl = config.baseUrl || "https://example.com";
  const slugField = config.slugField || "slug";

  const slugVal = useFormValue([slugField]) as { current?: string } | string | undefined;
  const slug = typeof slugVal === "string" ? slugVal : slugVal?.current || "";

  const title = value?.metaTitle || "";
  const description = value?.metaDescription || "";

  return (
    <ProGate feature="Advanced SERP Preview" isPro={isPro}>
      <Card
        padding={4}
        radius={3}
        style={{
          background: "var(--card-bg-color)",
          border: "1px solid var(--card-border-color)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <Stack space={4}>
          <Flex align="center" justify="space-between">
            <Text size={2} weight="bold" style={{ color: "var(--card-fg-color)" }}>
              SERP Preview
            </Text>
            <Flex gap={1}>
              <Button
                mode={mode === "desktop" ? "default" : "ghost"}
                onClick={() => setMode("desktop")}
                text="Desktop"
                fontSize={1}
                padding={2}
                style={{ borderRadius: 6 }}
              />
              <Button
                mode={mode === "mobile" ? "default" : "ghost"}
                onClick={() => setMode("mobile")}
                text="Mobile"
                fontSize={1}
                padding={2}
                style={{ borderRadius: 6 }}
              />
            </Flex>
          </Flex>
          <div
            style={{
              background: isDarkMode ? "rgba(0, 0, 0, 0.12)" : "#f8fafc",
              border: "1px solid var(--card-border-color)",
              borderRadius: 12,
              padding: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            {mode === "desktop" ? (
              <div
                style={{
                  width: "100%",
                  maxWidth: 652,
                  background: "var(--card-bg-color)",
                  border: "1px solid var(--card-border-color)",
                  borderRadius: 12,
                  padding: "20px 24px",
                  boxShadow: isDarkMode
                    ? "0 4px 20px rgba(0, 0, 0, 0.4)"
                    : "0 4px 20px rgba(0, 0, 0, 0.03)",
                  transition: "background-color 0.2s, border-color 0.2s",
                }}
              >
                <DesktopSERP
                  title={title}
                  description={description}
                  baseUrl={baseUrl}
                  slug={slug}
                />
              </div>
            ) : (
              <div
                style={{
                  width: 375,
                  background: "var(--card-bg-color)",
                  border: "1px solid var(--card-border-color)",
                  borderRadius: 16,
                  padding: "16px",
                  boxShadow: isDarkMode
                    ? "0 4px 24px rgba(0, 0, 0, 0.45)"
                    : "0 4px 24px rgba(0, 0, 0, 0.04)",
                  transition: "background-color 0.2s, border-color 0.2s",
                }}
              >
                <MobileSERP title={title} description={description} baseUrl={baseUrl} slug={slug} />
              </div>
            )}
          </div>
        </Stack>
      </Card>
    </ProGate>
  );
}
