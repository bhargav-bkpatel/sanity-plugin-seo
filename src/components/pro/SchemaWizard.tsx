import React, { useState } from "react";
import { Card, Stack, Text, Select, Button, TextInput } from "@sanity/ui";
import { PatchEvent, set } from "sanity";
import useProEnabled from "../../hooks/useProEnabled";
import ProGate from "./ProGate";
import { SCHEMA_TYPES, FIELDS_BY_TYPE } from "../../constants/schemaTypes";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function SchemaWizard({
  value,
  onChange,
}: {
  value: any;
  onChange: (e: any) => void;
}) {
  const { isPro } = useProEnabled();
  const schemaOrg = value?.schemaOrg || {};
  const originalType = schemaOrg.schemaType || "";
  const [selectedType, setSelectedType] = useState(originalType);
  const [faqItems, setFaqItems] = useState<{ question: string; answer: string }[]>(
    schemaOrg.faqItems || [{ question: "", answer: "" }],
  );

  const fields = FIELDS_BY_TYPE[selectedType] || [];

  const patch = (fieldName: string, fieldValue: any) => {
    onChange(PatchEvent.from(set({ ...schemaOrg, [fieldName]: fieldValue }, ["schemaOrg"])));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setSelectedType(newType);
    // Only emit change if type is different from original saved state
    if (newType !== originalType) {
      // Preserve all existing data, only change the type
      onChange(PatchEvent.from(set({ ...schemaOrg, schemaType: newType }, ["schemaOrg"])));
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

  return (
    <ProGate feature="Schema.org Wizard (30+ Types)" isPro={isPro}>
      <Card padding={3} radius={2} shadow={1}>
        <Stack space={4}>
          <Text size={2} weight="semibold">
            Schema.org Structured Data
          </Text>

          <Stack space={2}>
            <Text size={1} muted>
              Schema Type
            </Text>
            <Select value={selectedType} onChange={handleTypeChange}>
              {SCHEMA_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.title}
                </option>
              ))}
            </Select>
          </Stack>

          {selectedType === "FAQPage" && (
            <Stack space={3}>
              <Text size={1} weight="semibold">
                FAQ Items
              </Text>
              {faqItems.map((item, i) => (
                <Card
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  padding={2}
                  radius={2}
                  style={{ border: "1px solid var(--card-border-color)" }}
                >
                  <Stack space={2}>
                    <Text size={1} muted>
                      Question {i + 1}
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
                </Card>
              ))}
              <Button mode="ghost" text="+ Add FAQ Item" onClick={addFaq} fontSize={1} />
            </Stack>
          )}

          {fields.map((field) => (
            <Stack key={field.name} space={2}>
              <Text size={1} muted>
                {field.label}
              </Text>
              <TextInput
                value={schemaOrg[field.name] || ""}
                onChange={(e) => patch(field.name, (e.target as HTMLInputElement).value)}
                placeholder={field.placeholder || ""}
              />
            </Stack>
          ))}

          {selectedType && (
            <Text size={1} muted>
              Schema.org JSON-LD will be generated automatically from these fields.
            </Text>
          )}
        </Stack>
      </Card>
    </ProGate>
  );
}
