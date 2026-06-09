import React, { useState } from "react";
import { ObjectInputProps, PatchEvent, set } from "sanity";
import { Select, Button, TextInput, Stack, Text } from "@sanity/ui";
import useProEnabled from "../../hooks/useProEnabled";
import ProGate from "./ProGate";

/* eslint-disable @typescript-eslint/no-explicit-any */

const SCHEMA_TYPES = [
  { value: "", title: "— Select schema type —" },
  { value: "Article", title: "Article / Blog Post" },
  { value: "Product", title: "Product" },
  { value: "FAQPage", title: "FAQ Page" },
  { value: "LocalBusiness", title: "Local Business" },
  { value: "Event", title: "Event" },
  { value: "Organization", title: "Organization" },
  { value: "WebPage", title: "Web Page" },
  { value: "VideoObject", title: "Video" },
  { value: "Recipe", title: "Recipe" },
  { value: "Person", title: "Person / Author" },
  { value: "Course", title: "Course" },
  { value: "JobPosting", title: "Job Posting" },
  { value: "BreadcrumbList", title: "Breadcrumb" },
  { value: "BlogPosting", title: "Blog Post" },
  { value: "NewsArticle", title: "News Article" },
  { value: "HowTo", title: "How-To Guide" },
  { value: "Review", title: "Review" },
  { value: "SoftwareApplication", title: "Software / App" },
  { value: "Book", title: "Book" },
  { value: "Movie", title: "Movie / Film" },
  { value: "Service", title: "Service" },
  { value: "ProfessionalService", title: "Professional Service" },
  { value: "MedicalCondition", title: "Medical Condition" },
  { value: "Dataset", title: "Dataset" },
  { value: "Podcast", title: "Podcast" },
  { value: "PodcastEpisode", title: "Podcast Episode" },
  { value: "TouristAttraction", title: "Tourist Attraction" },
  { value: "Accommodation", title: "Accommodation / Hotel" },
  { value: "SportsTeam", title: "Sports Team" },
  { value: "CollectionPage", title: "Collection Page" },
  { value: "AboutPage", title: "About Page" },
];

const FIELDS_BY_TYPE: Record<string, { name: string; label: string; placeholder?: string }[]> = {
  Article: [
    { name: "name", label: "Article Title", placeholder: "How to Build a Website" },
    { name: "author", label: "Author Name", placeholder: "Jane Smith" },
    { name: "datePublished", label: "Date Published", placeholder: "2026-01-15" },
    { name: "dateModified", label: "Date Modified", placeholder: "2026-05-01" },
    { name: "description", label: "Article Description" },
  ],
  Product: [
    { name: "name", label: "Product Name" },
    { name: "description", label: "Product Description" },
    { name: "price", label: "Price", placeholder: "29.99" },
    { name: "priceCurrency", label: "Currency", placeholder: "USD" },
    { name: "availability", label: "Availability", placeholder: "InStock" },
    { name: "ratingValue", label: "Rating (0–5)", placeholder: "4.8" },
    { name: "ratingCount", label: "Review Count", placeholder: "124" },
  ],
  LocalBusiness: [
    { name: "name", label: "Business Name" },
    { name: "description", label: "Description" },
    { name: "location", label: "Address", placeholder: "123 Main St, City, Country" },
    { name: "url", label: "Website URL" },
  ],
  Event: [
    { name: "name", label: "Event Name" },
    { name: "description", label: "Event Description" },
    { name: "startDate", label: "Start Date", placeholder: "2026-06-01T09:00:00" },
    { name: "endDate", label: "End Date", placeholder: "2026-06-01T17:00:00" },
    { name: "location", label: "Location / URL" },
  ],
  Organization: [
    { name: "name", label: "Organization Name" },
    { name: "description", label: "Description" },
    { name: "url", label: "Website URL" },
  ],
  WebPage: [
    { name: "name", label: "Page Name" },
    { name: "description", label: "Page Description" },
    { name: "url", label: "Page URL" },
  ],
  VideoObject: [
    { name: "name", label: "Video Title" },
    { name: "description", label: "Video Description" },
    { name: "url", label: "Video URL" },
    { name: "datePublished", label: "Upload Date", placeholder: "2026-01-15" },
  ],
  Recipe: [
    { name: "name", label: "Recipe Name" },
    { name: "description", label: "Recipe Description" },
    { name: "author", label: "Author Name" },
    { name: "datePublished", label: "Date Published" },
  ],
  Person: [
    { name: "name", label: "Full Name" },
    { name: "description", label: "Bio / Description" },
    { name: "url", label: "Profile URL" },
  ],
  Course: [
    { name: "name", label: "Course Name" },
    { name: "description", label: "Course Description" },
    { name: "author", label: "Provider / Instructor" },
    { name: "url", label: "Course URL" },
  ],
  JobPosting: [
    { name: "name", label: "Job Title" },
    { name: "description", label: "Job Description" },
    { name: "location", label: "Location" },
    { name: "datePublished", label: "Date Posted", placeholder: "2026-05-01" },
  ],
  BreadcrumbList: [
    { name: "name", label: "Page Name" },
    { name: "url", label: "Page URL" },
  ],
  FAQPage: [],
  BlogPosting: [
    { name: "name", label: "Article Title", placeholder: "How to Build a Website" },
    { name: "author", label: "Author Name", placeholder: "Jane Smith" },
    { name: "datePublished", label: "Date Published", placeholder: "2026-01-15" },
    { name: "dateModified", label: "Date Modified", placeholder: "2026-05-01" },
    { name: "description", label: "Article Description" },
  ],
  NewsArticle: [
    { name: "name", label: "Article Title", placeholder: "Breaking: Example Headline" },
    { name: "author", label: "Author Name", placeholder: "Jane Smith" },
    { name: "datePublished", label: "Date Published", placeholder: "2026-01-15" },
    { name: "dateModified", label: "Date Modified", placeholder: "2026-05-01" },
    { name: "description", label: "Article Description" },
  ],
  HowTo: [
    { name: "name", label: "How-To Title" },
    { name: "description", label: "Description" },
    { name: "author", label: "Author Name" },
    { name: "datePublished", label: "Date Published", placeholder: "2026-01-15" },
    { name: "url", label: "Page URL" },
  ],
  Review: [
    { name: "name", label: "Item Being Reviewed" },
    { name: "description", label: "Review Summary" },
    { name: "author", label: "Reviewer Name" },
    { name: "ratingValue", label: "Rating (0–5)", placeholder: "4.5" },
    { name: "datePublished", label: "Date Published", placeholder: "2026-01-15" },
  ],
  SoftwareApplication: [
    { name: "name", label: "App Name" },
    { name: "description", label: "App Description" },
    { name: "url", label: "App URL" },
    { name: "operatingSystem", label: "Operating System", placeholder: "Windows, macOS, iOS" },
    { name: "applicationCategory", label: "Category", placeholder: "GameApplication" },
    { name: "ratingValue", label: "Rating (0–5)", placeholder: "4.8" },
    { name: "ratingCount", label: "Review Count", placeholder: "124" },
  ],
  Book: [
    { name: "name", label: "Book Title" },
    { name: "description", label: "Description" },
    { name: "author", label: "Author Name" },
    { name: "url", label: "Book URL" },
    { name: "isbn", label: "ISBN" },
  ],
  Movie: [
    { name: "name", label: "Movie Title" },
    { name: "description", label: "Description" },
    { name: "datePublished", label: "Release Date", placeholder: "2026-01-15" },
    { name: "url", label: "Movie URL" },
    { name: "director", label: "Director" },
  ],
  Service: [
    { name: "name", label: "Service Name" },
    { name: "description", label: "Service Description" },
    { name: "url", label: "Service URL" },
    { name: "areaServed", label: "Area Served", placeholder: "United States" },
  ],
  ProfessionalService: [
    { name: "name", label: "Business Name" },
    { name: "description", label: "Description" },
    { name: "url", label: "Website URL" },
    { name: "location", label: "Address", placeholder: "123 Main St, City, Country" },
  ],
  MedicalCondition: [
    { name: "name", label: "Condition Name" },
    { name: "description", label: "Description" },
    { name: "url", label: "Page URL" },
  ],
  Dataset: [
    { name: "name", label: "Dataset Name" },
    { name: "description", label: "Description" },
    { name: "url", label: "Dataset URL" },
    { name: "license", label: "License URL" },
  ],
  Podcast: [
    { name: "name", label: "Podcast Name" },
    { name: "description", label: "Description" },
    { name: "url", label: "Podcast URL" },
    { name: "author", label: "Host / Creator" },
  ],
  PodcastEpisode: [
    { name: "name", label: "Episode Title" },
    { name: "description", label: "Episode Description" },
    { name: "datePublished", label: "Publish Date", placeholder: "2026-01-15" },
    { name: "url", label: "Episode URL" },
    { name: "episodeNumber", label: "Episode Number" },
  ],
  TouristAttraction: [
    { name: "name", label: "Attraction Name" },
    { name: "description", label: "Description" },
    { name: "location", label: "Address", placeholder: "123 Main St, City, Country" },
    { name: "url", label: "Website URL" },
  ],
  Accommodation: [
    { name: "name", label: "Property Name" },
    { name: "description", label: "Description" },
    { name: "location", label: "Address", placeholder: "123 Main St, City, Country" },
    { name: "url", label: "Website URL" },
    { name: "numberOfRooms", label: "Number of Rooms" },
  ],
  SportsTeam: [
    { name: "name", label: "Team Name" },
    { name: "description", label: "Description" },
    { name: "url", label: "Team URL" },
    { name: "location", label: "Home City / Venue" },
  ],
  CollectionPage: [
    { name: "name", label: "Collection Name" },
    { name: "description", label: "Description" },
    { name: "url", label: "Page URL" },
  ],
  AboutPage: [
    { name: "name", label: "Page Name" },
    { name: "description", label: "Description" },
    { name: "url", label: "Page URL" },
  ],
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
  fields.forEach((f) => {
    if (schemaOrg[f.name]) ld[f.name] = schemaOrg[f.name];
  });

  if (schemaOrg.ratingValue || schemaOrg.ratingCount) {
    ld.aggregateRating = {
      "@type": "AggregateRating",
      ...(schemaOrg.ratingValue ? { ratingValue: schemaOrg.ratingValue } : {}),
      ...(schemaOrg.ratingCount ? { reviewCount: schemaOrg.ratingCount } : {}),
    };
    delete ld.ratingValue;
    delete ld.ratingCount;
  }

  if (schemaOrg.price || schemaOrg.priceCurrency) {
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

  if (schemaOrg.author) {
    ld.author = { "@type": "Person", name: schemaOrg.author };
    delete ld.author;
    ld.author = { "@type": "Person", name: schemaOrg.author };
  }

  return ld;
}

export default function SchemaWizardFieldInput({ value, onChange }: ObjectInputProps) {
  const { isPro } = useProEnabled();
  const schemaOrg = (value as Record<string, any>) || {};
  const [showPreview, setShowPreview] = useState(false);
  const [faqItems, setFaqItems] = useState<{ question: string; answer: string }[]>(
    schemaOrg.faqItems || [{ question: "", answer: "" }],
  );

  const selectedType = schemaOrg.schemaType || "";
  const fields = FIELDS_BY_TYPE[selectedType] || [];
  const filledCount = fields.filter((f) => schemaOrg[f.name]).length;
  const totalCount = fields.length;

  const patch = (fieldName: string, fieldValue: any) => {
    onChange(PatchEvent.from(set({ ...schemaOrg, [fieldName]: fieldValue })));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    patch("schemaType", e.target.value);
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
              {fields.map((field) => (
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
                  <TextInput
                    value={schemaOrg[field.name] || ""}
                    onChange={(e) => patch(field.name, (e.target as HTMLInputElement).value)}
                    placeholder={field.placeholder || ""}
                  />
                </div>
              ))}
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
