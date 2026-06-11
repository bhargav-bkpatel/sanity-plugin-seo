import React, { useState } from "react";
import { useWorkspace } from "sanity";
import { getPluginConfig } from "../config";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  value: Record<string, any> | undefined;
}

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

function ImageSlot({ url }: { url: string | null }) {
  return (
    <div
      style={{
        width: "100%",
        height: 180,
        background: "#e0e0e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {url ? (
        <img
          src={url}
          alt="preview"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      )}
    </div>
  );
}

function TwitterCard({
  og,
  imageUrl,
  domain,
}: {
  og: any;
  imageUrl: string | null;
  domain: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
        maxWidth: 500,
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <ImageSlot url={imageUrl} />
      <div style={{ padding: "12px 16px" }}>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>{domain}</div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#000",
            lineHeight: 1.4,
            marginBottom: 4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {og?.title || "Page title"}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#666",
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {og?.description || "Page description"}
        </div>
      </div>
    </div>
  );
}

function FacebookCard({
  og,
  imageUrl,
  domain,
}: {
  og: any;
  imageUrl: string | null;
  domain: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        overflow: "hidden",
        background: "#fff",
        maxWidth: 500,
        fontFamily: "Helvetica, Arial, sans-serif",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <ImageSlot url={imageUrl} />
      <div style={{ padding: "12px" }}>
        <div
          style={{
            fontSize: 11,
            color: "#999",
            marginBottom: 4,
          }}
        >
          {domain}
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#000",
            lineHeight: 1.4,
            marginBottom: 4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {og?.title || "Page title"}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#666",
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {og?.description || "Page description"}
        </div>
      </div>
    </div>
  );
}

function LinkedInCard({
  og,
  imageUrl,
  domain,
}: {
  og: any;
  imageUrl: string | null;
  domain: string;
}) {
  return (
    <div
      style={{
        borderRadius: 8,
        overflow: "hidden",
        background: "#fff",
        border: "1px solid #ddd",
        maxWidth: 500,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <ImageSlot url={imageUrl} />
      <div style={{ padding: "12px 16px" }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#000",
            lineHeight: 1.4,
            marginBottom: 4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {og?.title || "Page title"}
        </div>
        <div style={{ fontSize: 12, color: "#666" }}>{domain}</div>
      </div>
    </div>
  );
}

function WhatsAppCard({
  og,
  imageUrl,
  domain,
}: {
  og: any;
  imageUrl: string | null;
  domain: string;
}) {
  return (
    <div style={{ maxWidth: 380 }}>
      <div
        style={{
          background: "var(--card-bg-color)",
          borderRadius: 8,
          overflow: "hidden",
          borderLeft: "4px solid #00a884",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <ImageSlot url={imageUrl} />
        <div style={{ padding: "10px 14px 12px" }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--card-fg-color)",
              lineHeight: 1.35,
              marginBottom: 4,
            }}
          >
            {og?.title || "Page title not set"}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--card-muted-fg-color)",
              lineHeight: 1.4,
              marginBottom: 6,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {og?.description || "No description"}
          </div>
          <div style={{ fontSize: 12, color: "#00a884", fontWeight: 500 }}>{domain}</div>
        </div>
      </div>
    </div>
  );
}

const PLATFORMS = [
  { label: "X / Twitter", color: "var(--card-fg-color)" },
  { label: "Facebook", color: "#1877f2" },
  { label: "LinkedIn", color: "#0a66c2" },
  { label: "WhatsApp", color: "#25d366" },
];

export default function SocialPreviewCard({ value: og }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const { projectId, dataset } = useWorkspace();

  const config = getPluginConfig();
  const baseUrl = config.baseUrl || "https://example.com";
  const domain = baseUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0] || "example.com";

  const imageUrl = og?.image?.asset ? getImageUrl(og.image.asset, projectId, dataset) : null;

  return (
    <div
      style={{
        background: "var(--card-bg-color)",
        border: "1px solid var(--card-border-color)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: "1px solid var(--card-border-color)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--card-link-color)"
          strokeWidth="2"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--card-muted-fg-color)",
            letterSpacing: 1,
          }}
        >
          SOCIAL SHARE PREVIEW
        </span>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          background: "var(--card-bg-color)",
          borderBottom: "1px solid var(--card-border-color)",
        }}
      >
        {PLATFORMS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setActiveTab(i)}
            style={{
              flex: 1,
              padding: "10px 4px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: activeTab === i ? 700 : 400,
              color: activeTab === i ? p.color : "var(--card-muted-fg-color)",
              borderBottom: activeTab === i ? `2px solid ${p.color}` : "2px solid transparent",
              marginBottom: -1,
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div style={{ padding: 20, background: "var(--card-bg-color)" }}>
        {activeTab === 0 && <TwitterCard og={og} imageUrl={imageUrl} domain={domain} />}
        {activeTab === 1 && <FacebookCard og={og} imageUrl={imageUrl} domain={domain} />}
        {activeTab === 2 && <LinkedInCard og={og} imageUrl={imageUrl} domain={domain} />}
        {activeTab === 3 && <WhatsAppCard og={og} imageUrl={imageUrl} domain={domain} />}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "7px 16px",
          borderTop: "1px solid var(--card-border-color)",
          background: "var(--card-bg-color)",
          fontSize: 11,
          color: "var(--card-muted-fg-color)",
        }}
      >
        Preview is approximate — actual appearance varies by platform.
      </div>
    </div>
  );
}
