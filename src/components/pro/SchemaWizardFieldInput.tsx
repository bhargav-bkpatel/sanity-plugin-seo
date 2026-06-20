import React, { useState } from "react";
import { ObjectInputProps, PatchEvent, set } from "sanity";
import { Select, Button, Stack } from "@sanity/ui";
import useProEnabled from "../../hooks/useProEnabled";
import ProGate from "./ProGate";
import { SCHEMA_TYPES, FIELDS_BY_TYPE } from "../../constants/schemaTypes";

import CalendarIcon from "../icons/CalendarIcon";
import TrashIcon from "../icons/TrashIcon";

/* eslint-disable @typescript-eslint/no-explicit-any */

const FIELD_INPUT: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  background: "var(--card-bg-color)",
  border: "1px solid var(--card-border-color)",
  borderRadius: 8,
  color: "var(--card-fg-color)",
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const isFullWidthField = (fieldName: string) => {
  return [
    "name",
    "description",
    "reviewBody",
    "image",
    "thumbnailUrl",
    "url",
    "sameAs",
    "location",
    "license",
    "provider",
    "hiringOrganization",
    "headline",
  ].includes(fieldName);
};

function buildJsonLd(schemaOrg: Record<string, any>): Record<string, any> | null {
  if (!schemaOrg.schemaType) return null;

  const ld: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": schemaOrg.schemaType,
  };

  if (schemaOrg.schemaType === "FAQPage" && Array.isArray(schemaOrg.faqItems)) {
    ld.mainEntity = schemaOrg.faqItems.map((item: { question: string; answer: string }) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    }));
    return ld;
  }

  const fields = FIELDS_BY_TYPE[schemaOrg.schemaType] || [];
  const allowedFieldNames = new Set(fields.map((f) => f.name));

  fields.forEach((f) => {
    if (schemaOrg[f.name]) {
      ld[f.name] = schemaOrg[f.name];
    }
  });

  const typeAllowsRating =
    allowedFieldNames.has("ratingValue") || allowedFieldNames.has("ratingCount");
  if (typeAllowsRating && (schemaOrg.ratingValue || schemaOrg.ratingCount)) {
    ld.aggregateRating = {
      "@type": "AggregateRating",
      ...(schemaOrg.ratingValue ? { ratingValue: schemaOrg.ratingValue } : {}),
      ...(schemaOrg.ratingCount ? { reviewCount: schemaOrg.ratingCount } : {}),
    };
    delete ld.ratingValue;
    delete ld.ratingCount;
  }

  const typeAllowsPrice =
    allowedFieldNames.has("price") ||
    allowedFieldNames.has("priceCurrency") ||
    allowedFieldNames.has("availability");
  if (typeAllowsPrice && (schemaOrg.price || schemaOrg.priceCurrency)) {
    ld.offers = {
      "@type": "Offer",
      ...(schemaOrg.price ? { price: schemaOrg.price } : {}),
      ...(schemaOrg.priceCurrency ? { priceCurrency: schemaOrg.priceCurrency } : {}),
      ...(schemaOrg.availability
        ? { availability: `https://schema.org/${schemaOrg.availability}` }
        : {}),
    };
    delete ld.price;
    delete ld.priceCurrency;
    delete ld.availability;
  }

  const typeAllowsAuthor = allowedFieldNames.has("author");
  if (typeAllowsAuthor && schemaOrg.author) {
    ld.author = { "@type": "Person", name: schemaOrg.author };
  }

  Object.keys(ld).forEach((key) => {
    if (key !== "@context" && key !== "@type") {
      if (!ld[key] || (typeof ld[key] === "string" && ld[key].trim() === "")) {
        delete ld[key];
      }
    }
  });

  return ld;
}

export default function SchemaWizardFieldInput({ value, onChange }: ObjectInputProps) {
  const { isPro } = useProEnabled();
  const schemaOrg = (value as Record<string, any>) || {};
  const originalType = schemaOrg.schemaType || "";
  const [showPreview, setShowPreview] = useState(false);
  const [selectedType, setSelectedType] = useState(originalType);
  const [faqItems, setFaqItems] = useState<{ question: string; answer: string }[]>(
    schemaOrg.faqItems || [{ question: "", answer: "" }],
  );
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const fields = FIELDS_BY_TYPE[selectedType] || [];
  const filledCount = fields.filter((f) => schemaOrg[f.name]).length;
  const totalCount = fields.length;

  const patch = (fieldName: string, fieldValue: any) => {
    onChange(PatchEvent.from(set({ ...schemaOrg, [fieldName]: fieldValue })));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setSelectedType(newType);
    if (newType !== originalType) {
      onChange(PatchEvent.from(set({ ...schemaOrg, schemaType: newType })));
    }
    if (newType !== "FAQPage") {
      setFaqItems([{ question: "", answer: "" }]);
    } else if (!Array.isArray(schemaOrg.faqItems)) {
      setFaqItems([{ question: "", answer: "" }]);
    }
  };

  const addFaq = () => setFaqItems((prev) => [...prev, { question: "", answer: "" }]);

  const removeFaq = (i: number) => {
    const updated = faqItems.filter((_, idx) => idx !== i);
    const final = updated.length > 0 ? updated : [{ question: "", answer: "" }];
    setFaqItems(final);
    patch("faqItems", final);
  };

  const updateFaq = (i: number, field: "question" | "answer", val: string) => {
    const updated = faqItems.map((item, idx) => (idx === i ? { ...item, [field]: val } : item));
    setFaqItems(updated);
    patch("faqItems", updated);
  };

  const getFieldStyle = (fieldName: string) => {
    const isFocused = focusedField === fieldName;
    return {
      ...FIELD_INPUT,
      borderColor: isFocused ? "var(--card-link-color)" : "var(--card-border-color)",
      boxShadow: isFocused ? "0 0 0 2px rgba(29, 78, 216, 0.15)" : "none",
    };
  };

  const jsonLd = buildJsonLd(schemaOrg);
  const jsonLdStr = jsonLd ? JSON.stringify(jsonLd, null, 2) : null;

  return (
    <ProGate feature="Schema.org Wizard (30+ Types)" isPro={isPro}>
      <div
        style={{
          background: "var(--card-bg-color)",
          border: "1px solid var(--card-border-color)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <style>{`
          .schema-date-input::-webkit-calendar-picker-indicator {
            background: transparent;
            bottom: 0;
            color: transparent;
            cursor: pointer;
            height: auto;
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
            width: auto;
          }
        `}</style>

        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--card-border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--card-fg-color)" }}>
              Structured Data (JSON-LD)
            </div>
            <div style={{ fontSize: 11, color: "var(--card-muted-fg-color)", marginTop: 2 }}>
              30+ schema types supported · Google Rich Results eligible
            </div>
          </div>
          {selectedType && totalCount > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 99,
                background:
                  filledCount === totalCount
                    ? "rgba(34, 197, 94, 0.15)"
                    : "var(--card-border-color)",
                fontSize: 11,
                fontWeight: 700,
                color: filledCount === totalCount ? "#22c55e" : "var(--card-muted-fg-color)",
              }}
            >
              {filledCount}/{totalCount} fields
            </div>
          )}
        </div>

        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--card-border-color)" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--card-muted-fg-color)",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 3,
                height: 12,
                borderRadius: 2,
                background: "#a78bfa",
                flexShrink: 0,
              }}
            />
            Schema Type
          </div>
          <Select value={selectedType} onChange={handleTypeChange} style={{ borderRadius: 8 }}>
            {SCHEMA_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.title}
              </option>
            ))}
          </Select>
        </div>

        {selectedType === "FAQPage" && (
          <div
            style={{
              padding: "16px 20px 24px",
              borderBottom: "1px solid var(--card-border-color)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--card-muted-fg-color)",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 12,
                  borderRadius: 2,
                  background: "#3b82f6",
                  flexShrink: 0,
                }}
              />
              FAQ Items
            </div>
            <Stack space={3}>
              {faqItems.map((item, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  style={{
                    padding: "16px",
                    background: "rgba(120, 120, 120, 0.03)",
                    border: "1px solid var(--card-border-color)",
                    borderRadius: 10,
                    position: "relative",
                  }}
                >
                  {faqItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFaq(i)}
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        background: "transparent",
                        border: "none",
                        color: "var(--card-muted-fg-color)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 4,
                        borderRadius: 4,
                        transition: "color 0.15s, background-color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#ef4444";
                        e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--card-muted-fg-color)";
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      title="Remove item"
                    >
                      <TrashIcon />
                    </button>
                  )}
                  <Stack space={3}>
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--card-muted-fg-color)",
                          marginBottom: 6,
                          letterSpacing: 0.3,
                        }}
                      >
                        Question {i + 1}
                      </div>
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => updateFaq(i, "question", e.target.value)}
                        placeholder="What is…?"
                        onFocus={() => setFocusedField(`faq-q-${i}`)}
                        onBlur={() => setFocusedField(null)}
                        style={getFieldStyle(`faq-q-${i}`)}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--card-muted-fg-color)",
                          marginBottom: 6,
                          letterSpacing: 0.3,
                        }}
                      >
                        Answer
                      </div>
                      <textarea
                        value={item.answer}
                        onChange={(e) => updateFaq(i, "answer", e.target.value)}
                        placeholder="The answer is…"
                        onFocus={() => setFocusedField(`faq-a-${i}`)}
                        onBlur={() => setFocusedField(null)}
                        rows={2}
                        style={{
                          ...getFieldStyle(`faq-a-${i}`),
                          resize: "vertical",
                          minHeight: 60,
                          lineHeight: 1.5,
                        }}
                      />
                    </div>
                  </Stack>
                </div>
              ))}
              <Button
                mode="ghost"
                text="+ Add FAQ Item"
                onClick={addFaq}
                fontSize={1}
                style={{ borderRadius: 8 }}
              />
            </Stack>
          </div>
        )}

        {fields.length > 0 && (
          <div
            style={{
              padding: "16px 20px 24px",
              borderBottom: "1px solid var(--card-border-color)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--card-muted-fg-color)",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 12,
                  borderRadius: 2,
                  background: "#3b82f6",
                  flexShrink: 0,
                }}
              />
              Schema Fields
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px 14px",
              }}
            >
              {fields.map((field) => {
                const isDate = field.type === "date";
                const isDatetime = field.type === "datetime";
                const isDescription = field.name === "description" || field.name === "reviewBody";
                const fullWidth = isFullWidthField(field.name);

                return (
                  <div key={field.name} style={fullWidth ? { gridColumn: "1 / -1" } : undefined}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 6,
                        gap: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--card-muted-fg-color)",
                          letterSpacing: 0.3,
                        }}
                      >
                        {field.label.replace(" (REQUIRED)", "")}
                        {field.label.includes("(REQUIRED)") && (
                          <span
                            style={{
                              fontSize: 10,
                              color: "#ef4444",
                              fontWeight: 700,
                              marginLeft: 2,
                            }}
                          >
                            *
                          </span>
                        )}
                      </span>
                      {schemaOrg[field.name] && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#22c55e",
                            background: "rgba(34, 197, 94, 0.12)",
                            padding: "2px 6px",
                            borderRadius: 99,
                          }}
                        >
                          ✓ Filled
                        </span>
                      )}
                    </div>

                    {isDate && (
                      <div style={{ position: "relative" }}>
                        <input
                          type="date"
                          value={schemaOrg[field.name] || ""}
                          onChange={(e) => patch(field.name, e.target.value)}
                          onFocus={() => setFocusedField(field.name)}
                          onBlur={() => setFocusedField(null)}
                          className="schema-date-input"
                          style={{
                            ...getFieldStyle(field.name),
                            paddingRight: "36px",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            display: "flex",
                            alignItems: "center",
                            color: "var(--card-muted-fg-color)",
                          }}
                        >
                          <CalendarIcon />
                        </div>
                      </div>
                    )}

                    {isDatetime && (
                      <div style={{ position: "relative" }}>
                        <input
                          type="datetime-local"
                          value={schemaOrg[field.name] || ""}
                          onChange={(e) => patch(field.name, e.target.value)}
                          onFocus={() => setFocusedField(field.name)}
                          onBlur={() => setFocusedField(null)}
                          className="schema-date-input"
                          style={{
                            ...getFieldStyle(field.name),
                            paddingRight: "36px",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            display: "flex",
                            alignItems: "center",
                            color: "var(--card-muted-fg-color)",
                          }}
                        >
                          <CalendarIcon />
                        </div>
                      </div>
                    )}

                    {isDescription && (
                      <textarea
                        value={schemaOrg[field.name] || ""}
                        onChange={(e) => patch(field.name, e.target.value)}
                        placeholder={field.placeholder || ""}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => setFocusedField(null)}
                        rows={3}
                        style={{
                          ...getFieldStyle(field.name),
                          resize: "vertical",
                          minHeight: 80,
                          lineHeight: 1.5,
                        }}
                      />
                    )}

                    {!isDate && !isDatetime && !isDescription && (
                      <input
                        type="text"
                        value={schemaOrg[field.name] || ""}
                        onChange={(e) => patch(field.name, e.target.value)}
                        placeholder={field.placeholder || ""}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => setFocusedField(null)}
                        style={getFieldStyle(field.name)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {jsonLdStr && (
          <div style={{ padding: "16px 20px" }}>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                marginBottom: showPreview ? 10 : 0,
                fontSize: 11,
                fontWeight: 600,
                color: "#3b82f6",
              }}
            >
              <span>{showPreview ? "▾" : "▸"}</span>
              {showPreview ? "Hide JSON-LD Preview" : "Preview JSON-LD Output"}
            </button>
            {showPreview && (
              <pre
                style={{
                  margin: 0,
                  padding: "12px 14px",
                  background: "var(--card-border-color)",
                  border: "1px solid var(--card-border-color)",
                  borderRadius: 8,
                  fontSize: 11,
                  color: "#3b82f6",
                  lineHeight: 1.6,
                  overflowX: "auto",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {`<script type="application/ld+json">\n${jsonLdStr}\n</script>`}
              </pre>
            )}
            {!showPreview && (
              <div style={{ fontSize: 11, color: "var(--card-muted-fg-color)" }}>
                JSON-LD ready · Copy into your page&apos;s{" "}
                <code style={{ color: "var(--card-muted-fg-color)" }}>&lt;head&gt;</code> or inject
                via your framework
              </div>
            )}
          </div>
        )}

        {!selectedType && (
          <div style={{ padding: "20px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "var(--card-muted-fg-color)" }}>
              Select a schema type above to get started.
              <br />
              Correctly structured data unlocks Google Rich Results.
            </div>
          </div>
        )}
      </div>
    </ProGate>
  );
}
