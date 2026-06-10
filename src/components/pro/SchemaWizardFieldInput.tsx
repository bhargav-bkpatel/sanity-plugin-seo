import React, { useState } from "react";
import { ObjectInputProps, PatchEvent, set } from "sanity";
import { Select, Button, TextInput, Stack, Text } from "@sanity/ui";
import useProEnabled from "../../hooks/useProEnabled";
import ProGate from "./ProGate";
import { SCHEMA_TYPES, FIELDS_BY_TYPE } from "../../constants/schemaTypes";

/* eslint-disable @typescript-eslint/no-explicit-any */

function buildJsonLd(schemaOrg: Record<string, any>): Record<string, any> | null {
  if (!schemaOrg.schemaType) return null;

  const ld: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": schemaOrg.schemaType,
  };

  // Special handling for FAQPage
  if (schemaOrg.schemaType === "FAQPage" && Array.isArray(schemaOrg.faqItems)) {
    ld.mainEntity = schemaOrg.faqItems.map((item: { question: string; answer: string }) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    }));
    return ld;
  }

  // Get allowed fields for this schema type
  const fields = FIELDS_BY_TYPE[schemaOrg.schemaType] || [];
  const allowedFieldNames = new Set(fields.map((f) => f.name));

  // Only add fields that are allowed for this type AND have values
  fields.forEach((f) => {
    if (schemaOrg[f.name]) {
      ld[f.name] = schemaOrg[f.name];
    }
  });

  // Only transform fields if they're allowed for this type
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

  // Only add author if this type allows it
  const typeAllowsAuthor = allowedFieldNames.has("author");
  if (typeAllowsAuthor && schemaOrg.author) {
    ld.author = { "@type": "Person", name: schemaOrg.author };
  }

  // Clean up any remaining empty values
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

  const fields = FIELDS_BY_TYPE[selectedType] || [];
  const filledCount = fields.filter((f) => schemaOrg[f.name]).length;
  const totalCount = fields.length;

  const patch = (fieldName: string, fieldValue: any) => {
    onChange(PatchEvent.from(set({ ...schemaOrg, [fieldName]: fieldValue })));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setSelectedType(newType);
    // Only emit change if type is different from original saved state
    if (newType !== originalType) {
      onChange(PatchEvent.from(set({ ...schemaOrg, schemaType: newType })));
    }
    // Keep FAQ items if switching to FAQPage, otherwise reset
    if (newType !== "FAQPage") {
      setFaqItems([{ question: "", answer: "" }]);
    } else if (!Array.isArray(schemaOrg.faqItems)) {
      setFaqItems([{ question: "", answer: "" }]);
    }
  };

  const addFaq = () => setFaqItems((prev) => [...prev, { question: "", answer: "" }]);

  const updateFaq = (i: number, field: "question" | "answer", val: string) => {
    const updated = faqItems.map((item, idx) => (idx === i ? { ...item, [field]: val } : item));
    setFaqItems(updated);
    patch("faqItems", updated);
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
        {/* Header */}
        <div
          style={{
            padding: "12px 16px",
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

        {/* Type selector */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--card-border-color)" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--card-muted-fg-color)",
              marginBottom: 6,
            }}
          >
            SCHEMA TYPE
          </div>
          <Select value={selectedType} onChange={handleTypeChange}>
            {SCHEMA_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.title}
              </option>
            ))}
          </Select>
        </div>

        {/* FAQ items */}
        {selectedType === "FAQPage" && (
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--card-border-color)" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--card-muted-fg-color)",
                marginBottom: 10,
              }}
            >
              FAQ ITEMS
            </div>
            <Stack space={3}>
              {faqItems.map((item, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  style={{ padding: 10, background: "var(--card-border-color)", borderRadius: 8 }}
                >
                  <Stack space={2}>
                    <Text size={1} muted>
                      {`Question ${i + 1}`}
                    </Text>
                    <TextInput
                      value={item.question}
                      onChange={(e) =>
                        updateFaq(i, "question", (e.target as HTMLInputElement).value)
                      }
                      placeholder="What is…?"
                    />
                    <Text size={1} muted>
                      Answer
                    </Text>
                    <TextInput
                      value={item.answer}
                      onChange={(e) => updateFaq(i, "answer", (e.target as HTMLInputElement).value)}
                      placeholder="The answer is…"
                    />
                  </Stack>
                </div>
              ))}
              <Button mode="ghost" text="+ Add FAQ Item" onClick={addFaq} fontSize={1} />
            </Stack>
          </div>
        )}

        {/* Dynamic fields */}
        {fields.length > 0 && (
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--card-border-color)" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--card-muted-fg-color)",
                marginBottom: 10,
              }}
            >
              FIELDS
            </div>
            <Stack space={3}>
              {fields.map((field) => {
                const isDate = field.type === "date";
                const isDatetime = field.type === "datetime";
                const inputStyle = {
                  width: "100%",
                  padding: "8px 10px",
                  fontSize: 13,
                  border: "1px solid var(--card-border-color)",
                  borderRadius: 6,
                  background: "var(--card-bg-color)",
                  color: "var(--card-fg-color)",
                  fontFamily: "inherit",
                };

                return (
                  <div key={field.name}>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--card-muted-fg-color)",
                        marginBottom: 4,
                        fontWeight: 500,
                      }}
                    >
                      {field.label}
                      {schemaOrg[field.name] && (
                        <span style={{ color: "#22c55e", marginLeft: 6 }}>✓</span>
                      )}
                    </div>
                    {isDate && (
                      <input
                        type="date"
                        value={schemaOrg[field.name] || ""}
                        onChange={(e) => patch(field.name, e.target.value)}
                        style={inputStyle as any}
                      />
                    )}
                    {isDatetime && (
                      <input
                        type="datetime-local"
                        value={schemaOrg[field.name] || ""}
                        onChange={(e) => patch(field.name, e.target.value)}
                        style={inputStyle as any}
                      />
                    )}
                    {!isDate && !isDatetime && (
                      <TextInput
                        value={schemaOrg[field.name] || ""}
                        onChange={(e) => patch(field.name, (e.target as HTMLInputElement).value)}
                        placeholder={field.placeholder || ""}
                      />
                    )}
                  </div>
                );
              })}
            </Stack>
          </div>
        )}

        {/* JSON-LD Preview */}
        {jsonLdStr && (
          <div style={{ padding: "12px 16px" }}>
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
          <div style={{ padding: "16px", textAlign: "center" }}>
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
