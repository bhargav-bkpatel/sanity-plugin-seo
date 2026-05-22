import React, { useState } from "react";
import { Card, Stack, Text, Select, Button, TextInput } from "@sanity/ui";
import { PatchEvent, set } from "sanity";
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

export default function SchemaWizard({
  value,
  onChange,
}: {
  value: any;
  onChange: (e: any) => void;
}) {
  const { isPro } = useProEnabled();
  const schemaOrg = value?.schemaOrg || {};
  const [faqItems, setFaqItems] = useState<{ question: string; answer: string }[]>(
    schemaOrg.faqItems || [{ question: "", answer: "" }],
  );

  const selectedType = schemaOrg.schemaType || "";
  const fields = FIELDS_BY_TYPE[selectedType] || [];

  const patch = (fieldName: string, fieldValue: any) => {
    onChange(PatchEvent.from(set({ ...schemaOrg, [fieldName]: fieldValue }, ["schemaOrg"])));
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
                  style={{ border: "1px solid #e2e8f0" }}
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
