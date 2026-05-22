import React, { useState } from "react";
import { useClient } from "sanity";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  value: Record<string, any> | undefined;
}

function refToUrl(ref: string, projectId: string, dataset: string): string {
  const parts = ref.replace(/^image-/, "").split("-");
  const ext = parts.pop();
  const dimensions = parts.pop();
  const id = parts.join("-");
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${ext}`;
}

function ImageSlot({ url }: { url: string | null }) {
  return (
    <div
      style={{
        width: "100%",
        height: 220,
        background: "#0d1117",
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
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#334155"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span style={{ fontSize: 11, color: "#334155" }}>No image uploaded</span>
        </div>
      )}
    </div>
  );
}

function TwitterCard({ og, imageUrl }: { og: any; imageUrl: string | null }) {
  const siteName = og?.siteName ? `${og.siteName.toLowerCase().replace(/\s/g, "")}.com` : null;
  let domain = "yoursite.com";
  if (og?.url) domain = new URL(og.url).hostname.replace("www.", "");
  else if (siteName) domain = siteName;

  return (
    <div
      style={{
        border: "1px solid #2f3336",
        borderRadius: 16,
        overflow: "hidden",
        background: "#16181c",
        maxWidth: 504,
        fontFamily: "TwitterChirp, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <ImageSlot url={imageUrl} />
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontSize: 13, color: "#71767b", marginBottom: 2 }}>{domain}</div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#e7e9ea",
            lineHeight: 1.3,
            marginBottom: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {og?.title || "Page title not set"}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#71767b",
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {og?.description || "No description set"}
        </div>
      </div>
    </div>
  );
}

function FacebookCard({ og, imageUrl }: { og: any; imageUrl: string | null }) {
  return (
    <div
      style={{
        border: "1px solid #3a3b3c",
        borderRadius: 8,
        overflow: "hidden",
        background: "#242526",
        maxWidth: 504,
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      <ImageSlot url={imageUrl} />
      <div style={{ padding: "10px 12px 14px" }}>
        <div
          style={{
            fontSize: 11,
            color: "#b0b3b8",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 4,
          }}
        >
          {og?.siteName || "yoursite.com"}
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#e4e6eb",
            lineHeight: 1.3,
            marginBottom: 4,
          }}
        >
          {og?.title || "Page title not set"}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#b0b3b8",
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {og?.description || "No description set"}
        </div>
      </div>
    </div>
  );
}

function LinkedInCard({ og, imageUrl }: { og: any; imageUrl: string | null }) {
  return (
    <div
      style={{
        borderRadius: 8,
        overflow: "hidden",
        background: "#1b1f23",
        border: "1px solid #2d3748",
        maxWidth: 504,
      }}
    >
      <ImageSlot url={imageUrl} />
      <div style={{ padding: "12px 16px 14px" }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#e2e8f0",
            lineHeight: 1.4,
            marginBottom: 6,
          }}
        >
          {og?.title || "Page title not set"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 2,
              background: "#0a66c2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 9, color: "#fff", fontWeight: 800 }}>in</span>
          </div>
          <span style={{ fontSize: 12, color: "#64748b" }}>{og?.siteName || "yoursite.com"}</span>
        </div>
      </div>
    </div>
  );
}

function WhatsAppCard({ og, imageUrl }: { og: any; imageUrl: string | null }) {
  return (
    <div style={{ maxWidth: 380 }}>
      <div
        style={{
          background: "#1f2c34",
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
              color: "#e9edef",
              lineHeight: 1.35,
              marginBottom: 4,
            }}
          >
            {og?.title || "Page title not set"}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#8696a0",
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
          <div style={{ fontSize: 12, color: "#00a884", fontWeight: 500 }}>
            {og?.siteName || "yoursite.com"}
          </div>
        </div>
      </div>
    </div>
  );
}

const PLATFORMS = [
  { label: "X / Twitter", color: "#e7e9ea" },
  { label: "Facebook", color: "#1877f2" },
  { label: "LinkedIn", color: "#0a66c2" },
  { label: "WhatsApp", color: "#25d366" },
];

export default function SocialPreviewCard({ value: og }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const client = useClient({ apiVersion: "2024-01-01" });
  const { projectId, dataset } = client.config();

  const imageRef = og?.image?.asset?._ref;
  const imageUrl = imageRef && projectId && dataset ? refToUrl(imageRef, projectId, dataset) : null;

  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: "1px solid #1e293b",
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
          stroke="#60a5fa"
          strokeWidth="2"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: 1 }}>
          SOCIAL SHARE PREVIEW
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#080e1a", borderBottom: "1px solid #1e293b" }}>
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
              color: activeTab === i ? p.color : "#475569",
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
      <div style={{ padding: 20, background: "#060d18" }}>
        {activeTab === 0 && <TwitterCard og={og} imageUrl={imageUrl} />}
        {activeTab === 1 && <FacebookCard og={og} imageUrl={imageUrl} />}
        {activeTab === 2 && <LinkedInCard og={og} imageUrl={imageUrl} />}
        {activeTab === 3 && <WhatsAppCard og={og} imageUrl={imageUrl} />}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "7px 16px",
          borderTop: "1px solid #1e293b",
          background: "#080e1a",
          fontSize: 11,
          color: "#334155",
        }}
      >
        Preview is approximate — actual appearance varies by platform.
      </div>
    </div>
  );
}
