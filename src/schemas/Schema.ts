import { defineType } from "sanity";
import SEOTitleFeedback from "../components/SEOTitleFeedback";
import SEODescriptionFeedback from "../components/SEODescriptionFeedback";
import SEOMetaFieldsWrapper from "../components/SEOMetaFieldsWrapper";
import SchemaWizardFieldInput from "../components/pro/SchemaWizardFieldInput";

const schema = defineType({
  title: "Seo MetaFields",
  name: "seoMetaFields",
  type: "object",
  components: {
    input: SEOMetaFieldsWrapper,
  },
  groups: [
    { name: "basic", title: "Basic SEO", default: true },
    { name: "social", title: "Social Sharing" },
    { name: "advanced", title: "Advanced" },
    { name: "schema", title: "Schema.org" },
  ],
  fields: [
    // ── Basic SEO ──────────────────────────────────────────
    {
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      group: "basic",
      components: { input: SEOTitleFeedback },
      description: "Recommended: 50–60 characters",
    },
    {
      name: "metaDescription",
      title: "Meta Description",
      type: "string",
      group: "basic",
      components: { input: SEODescriptionFeedback },
      description: "Recommended: 100–160 characters",
    },
    {
      name: "metaImage",
      title: "Meta Image",
      type: "image",
      group: "basic",
      description: "Used as fallback for Open Graph and Twitter images",
    },
    {
      name: "focusKeyword",
      title: "Focus Keyword",
      type: "string",
      group: "basic",
      description: "The primary keyword this page should rank for",
    },
    {
      name: "seoKeywords",
      title: "Additional Keywords",
      type: "array",
      group: "basic",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    },
    // ── Robots ────────────────────────────────────────────
    {
      name: "nofollowAttributes",
      title: "Noindex",
      type: "boolean",
      group: "basic",
      initialValue: false,
      description: "Hide this page from search engines.",
    },
    {
      name: "robotsMeta",
      title: "Robots Meta Tags",
      type: "array",
      group: "advanced",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "noindex — hide from search results", value: "noindex" },
          { title: "nofollow — do not follow links", value: "nofollow" },
          { title: "noarchive — no cached copy", value: "noarchive" },
          { title: "nosnippet — no text snippet", value: "nosnippet" },
          { title: "max-snippet:160", value: "max-snippet:160" },
          {
            title: "max-image-preview:large",
            value: "max-image-preview:large",
          },
        ],
        layout: "grid",
      },
    },
    // ── Social ────────────────────────────────────────────
    {
      name: "openGraph",
      title: "Open Graph",
      type: "openGraph",
      group: "social",
    },
    {
      name: "twitter",
      title: "Twitter / X",
      type: "twitter",
      group: "social",
    },
    // ── hreflang ─────────────────────────────────────────
    {
      name: "hreflang",
      title: "Multi-Language (hreflang)",
      type: "array",
      group: "advanced",
      of: [{ type: "hreflangEntry" }],
      description: "Add alternate language versions of this page for international SEO",
    },
    // ── Additional meta tags ──────────────────────────────
    {
      name: "additionalMetaTags",
      title: "Additional Meta Tags",
      type: "array",
      group: "advanced",
      of: [{ type: "metaTag" }],
    },
    // ── Schema.org ────────────────────────────────────────
    {
      name: "schemaOrg",
      title: "Schema.org Structured Data",
      type: "object",
      group: "schema",
      components: { input: SchemaWizardFieldInput },
      fields: [
        {
          name: "schemaType",
          title: "Schema Type",
          type: "string",
          options: {
            list: [
              { title: "Article / Blog Post", value: "Article" },
              { title: "Product", value: "Product" },
              { title: "FAQ Page", value: "FAQPage" },
              { title: "Local Business", value: "LocalBusiness" },
              { title: "Event", value: "Event" },
              { title: "Organization", value: "Organization" },
              { title: "Web Page", value: "WebPage" },
              { title: "Video", value: "VideoObject" },
              { title: "Recipe", value: "Recipe" },
              { title: "Person / Author", value: "Person" },
              { title: "Course", value: "Course" },
              { title: "Job Posting", value: "JobPosting" },
              { title: "Breadcrumb", value: "BreadcrumbList" },
              { title: "Software / App", value: "SoftwareApplication" },
            ],
          },
        },
        // Universal fields — shown for all types once a type is selected
        {
          name: "name",
          title: "Name",
          type: "string",
          hidden: ({ parent }: { parent: Record<string, string> }) => !parent?.schemaType,
        },
        {
          name: "description",
          title: "Description",
          type: "string",
          hidden: ({ parent }: { parent: Record<string, string> }) => !parent?.schemaType,
        },
        {
          name: "url",
          title: "URL",
          type: "url",
          hidden: ({ parent }: { parent: Record<string, string> }) =>
            !parent?.schemaType || parent.schemaType === "FAQPage",
        },
        // Article / Blog / Video / Recipe / Course / Job fields
        {
          name: "author",
          title: "Author",
          type: "string",
          hidden: ({ parent }: { parent: Record<string, string> }) =>
            !["Article", "Recipe", "Course", "Person", "VideoObject"].includes(parent?.schemaType),
        },
        {
          name: "datePublished",
          title: "Date Published",
          type: "string",
          description: "Format: YYYY-MM-DD",
          hidden: ({ parent }: { parent: Record<string, string> }) =>
            !["Article", "Event", "VideoObject", "Recipe", "JobPosting"].includes(
              parent?.schemaType,
            ),
        },
        {
          name: "dateModified",
          title: "Date Modified",
          type: "string",
          description: "Format: YYYY-MM-DD",
          hidden: ({ parent }: { parent: Record<string, string> }) =>
            !["Article", "VideoObject"].includes(parent?.schemaType),
        },
        // Product / App fields
        {
          name: "price",
          title: "Price",
          type: "string",
          placeholder: "29.99",
          hidden: ({ parent }: { parent: Record<string, string> }) =>
            !["Product", "SoftwareApplication"].includes(parent?.schemaType),
        },
        {
          name: "priceCurrency",
          title: "Currency",
          type: "string",
          description: "ISO 4217 code, e.g. USD, EUR, GBP",
          hidden: ({ parent }: { parent: Record<string, string> }) =>
            !["Product", "SoftwareApplication"].includes(parent?.schemaType),
        },
        {
          name: "availability",
          title: "Availability",
          type: "string",
          options: {
            list: [
              { title: "In Stock", value: "InStock" },
              { title: "Out of Stock", value: "OutOfStock" },
              { title: "Pre-Order", value: "PreOrder" },
              { title: "Discontinued", value: "Discontinued" },
            ],
          },
          hidden: ({ parent }: { parent: Record<string, string> }) =>
            parent?.schemaType !== "Product",
        },
        // Rating fields — Product, App, Recipe, Course
        {
          name: "ratingValue",
          title: "Rating (0–5)",
          type: "string",
          placeholder: "4.8",
          hidden: ({ parent }: { parent: Record<string, string> }) =>
            !["Product", "SoftwareApplication", "Recipe", "Course"].includes(parent?.schemaType),
        },
        {
          name: "ratingCount",
          title: "Number of Reviews",
          type: "string",
          placeholder: "124",
          hidden: ({ parent }: { parent: Record<string, string> }) =>
            !["Product", "SoftwareApplication", "Recipe", "Course"].includes(parent?.schemaType),
        },
        // Event / Course date fields
        {
          name: "startDate",
          title: "Start Date",
          type: "string",
          description: "Format: YYYY-MM-DDTHH:MM:SS",
          hidden: ({ parent }: { parent: Record<string, string> }) =>
            !["Event", "Course"].includes(parent?.schemaType),
        },
        {
          name: "endDate",
          title: "End Date",
          type: "string",
          description: "Format: YYYY-MM-DDTHH:MM:SS",
          hidden: ({ parent }: { parent: Record<string, string> }) =>
            !["Event", "Course"].includes(parent?.schemaType),
        },
        // Location — Event, LocalBusiness, JobPosting
        {
          name: "location",
          title: "Location / Address",
          type: "string",
          placeholder: "123 Main St, City, Country",
          hidden: ({ parent }: { parent: Record<string, string> }) =>
            !["Event", "LocalBusiness", "JobPosting"].includes(parent?.schemaType),
        },
        // FAQ items — FAQPage only
        {
          name: "faqItems",
          title: "FAQ Items",
          type: "array",
          hidden: ({ parent }: { parent: Record<string, string> }) =>
            parent?.schemaType !== "FAQPage",
          of: [
            {
              type: "object",
              fields: [
                { name: "question", title: "Question", type: "string" },
                { name: "answer", title: "Answer", type: "text" },
              ],
            },
          ],
        },
      ],
    },
    // ── Workflow status (managed from Workflow Dashboard, hidden in document editor) ──
    {
      name: "seoStatus",
      title: "SEO Status",
      type: "string",
      hidden: true,
      initialValue: "draft",
    },
    {
      name: "seoReviewNotes",
      title: "Review Notes",
      type: "text",
      hidden: true,
    },
  ],
});

export default schema;
