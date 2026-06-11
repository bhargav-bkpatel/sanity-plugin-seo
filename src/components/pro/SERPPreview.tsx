import React, { useState } from "react";
import { Card, Stack, Text, Flex } from "@sanity/ui";
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

const COLORS = {
  light: {
    iconBg: "#f1f3f4",
    iconColor: "#70757a",
    domain: "#4d5156",
    siteName: "#202124",
    title: "#1a0dab",
    description: "#4d5156",
    border: "#dadce0",
    bg: "#ffffff",
  },
  dark: {
    iconBg: "#303134",
    iconColor: "#9aa0a6",
    domain: "#bdc1c6",
    siteName: "#e8eaed",
    title: "#8ab4f8",
    description: "#bdc1c6",
    border: "#303134",
    bg: "#202124",
  },
};

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
        background: isDarkMode ? "#303134" : "#f1f3f4",
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
  const isDarkMode =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
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
        background: colors.bg,
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
          margin: "0 0 4px 0",
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
  const isDarkMode =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  const charWidth = AVG_CHAR_WIDTH_MOBILE;
  const truncTitle = truncateByPx(title, 480, charWidth);
  const truncDesc = truncateByPx(description, 580, charWidth);

  const cleanDomain = baseUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0] || "example.com";
  const siteName = getSiteName(baseUrl);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: colors.bg,
        fontFamily: "Arial, sans-serif",
        width: "100%",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <Favicon domain={cleanDomain} colors={colors} isDarkMode={isDarkMode} />
        <span
          style={{
            fontSize: 12,
            color: colors.siteName,
            lineHeight: "18px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span style={{ fontWeight: 400, fontSize: 14, color: colors.siteName }}>{siteName}</span>
          {slug && (
            <>
              <span style={{ color: colors.domain, fontSize: 12 }}>›</span>
              <span
                style={{
                  color: colors.domain,
                  fontSize: 12,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {slug.split("/").filter(Boolean).join(" › ")}
              </span>
            </>
          )}
        </span>
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

const TAB_STYLE = (active: boolean) => ({
  padding: "6px 14px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: active ? 600 : 400,
  background: active ? "var(--card-border-color)" : "transparent",
  color: active ? "var(--card-fg-color)" : "var(--card-muted-fg-color)",
});

export default function SERPPreview({ value }: Props) {
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");
  const { isPro } = useProEnabled();

  const config = getPluginConfig();
  const baseUrl = config.baseUrl || "https://example.com";
  const slugField = config.slugField || "slug";

  const slugVal = useFormValue([slugField]) as { current?: string } | string | undefined;
  const slug = typeof slugVal === "string" ? slugVal : slugVal?.current || "";

  const title = value?.metaTitle || "";
  const description = value?.metaDescription || "";

  const isDarkMode =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

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
          <div
            style={{
              background: "var(--card-bg-color)",
              border: "1px solid var(--card-border-color)",
              borderRadius: 8,
              padding: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 180,
            }}
          >
            {mode === "desktop" ? (
              <div
                style={{
                  width: "100%",
                  maxWidth: 652,
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 12,
                  padding: "20px 24px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
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
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 16,
                  padding: "16px",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
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
