import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@sanity/icons";

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function Pagination({
  page,
  total,
  pageSize,
  onPage,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const isFirst = page === 0;
  const isLast = page >= totalPages - 1;

  if (total === 0) return null;

  const navStyle = (disabled: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    borderRadius: 8,
    border: "1px solid var(--card-border-color)",
    background: "var(--card-bg-color)",
    color: "var(--card-link-color)",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
    flexShrink: 0,
    opacity: disabled ? 0.4 : 1,
    outline: "none",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
        padding: "12px 18px",
        background: "var(--card-bg-color)",
        border: "1px solid var(--card-border-color)",
        borderRadius: 12,
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "var(--card-muted-fg-color)" }}>Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPage(0);
            }}
            style={{
              padding: "4px 8px",
              borderRadius: 6,
              background: "var(--card-bg-color)",
              border: "1px solid var(--card-border-color)",
              color: "var(--card-fg-color)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              outline: "none",
            }}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span style={{ fontSize: 12, color: "var(--card-muted-fg-color)" }}>per page</span>
        </div>

        <span style={{ fontSize: 12, color: "var(--card-muted-fg-color)" }}>
          Showing{" "}
          <span style={{ color: "var(--card-link-color)", fontWeight: 600 }}>
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)}
          </span>{" "}
          of <span style={{ color: "var(--card-fg-color)" }}>{total}</span> items
        </span>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            type="button"
            onClick={() => onPage(Math.max(0, page - 1))}
            disabled={isFirst}
            style={navStyle(isFirst)}
          >
            <ChevronLeftIcon style={{ fontSize: 18 }} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {Array.from({ length: totalPages }).map((_, i) => {
              if (totalPages > 6 && i !== 0 && i !== totalPages - 1 && Math.abs(page - i) > 1) {
                if (i === 1 && page > 2) {
                  return (
                    <span
                      key="dots-start"
                      style={{
                        fontSize: 12,
                        color: "var(--card-muted-fg-color)",
                        padding: "0 4px",
                      }}
                    >
                      ...
                    </span>
                  );
                }
                if (i === totalPages - 2 && page < totalPages - 3) {
                  return (
                    <span
                      key="dots-end"
                      style={{
                        fontSize: 12,
                        color: "var(--card-muted-fg-color)",
                        padding: "0 4px",
                      }}
                    >
                      ...
                    </span>
                  );
                }
                return null;
              }

              const isCurrent = page === i;
              return (
                <button
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  type="button"
                  onClick={() => onPage(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: isCurrent ? "none" : "1px solid var(--card-border-color)",
                    background: isCurrent ? "var(--card-link-color)" : "var(--card-bg-color)",
                    color: isCurrent ? "#fff" : "var(--card-muted-fg-color)",
                    fontSize: 12,
                    fontWeight: isCurrent ? 700 : 500,
                    cursor: "pointer",
                    boxShadow: isCurrent ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                    outline: "none",
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onPage(Math.min(totalPages - 1, page + 1))}
            disabled={isLast}
            style={navStyle(isLast)}
          >
            <ChevronRightIcon style={{ fontSize: 18 }} />
          </button>
        </div>
      )}
    </div>
  );
}
