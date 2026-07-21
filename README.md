![Sanity Plugin SEO](https://raw.githubusercontent.com/bhargav-bkpatel/sanity-plugin-seo/main/public/assets/background.png)

## ⚡ Sanity Plugin SEO

[![npm version](https://img.shields.io/badge/npm-v1.4.0-blue)](https://www.npmjs.com/package/sanity-plugin-seo)
[![npm downloads](https://img.shields.io/badge/downloads-22k-brightgreen)](https://www.npmjs.com/package/sanity-plugin-seo)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://www.typescriptlang.org/)

**Sanity Studio Compatibility:**

[![Sanity V3](https://img.shields.io/badge/Sanity%20V3-supported-4e5452?style=flat)](https://www.sanity.io/)
[![Sanity V4](https://img.shields.io/badge/Sanity%20V4-supported-4e5452?style=flat)](https://www.sanity.io/)
[![Sanity V5](https://img.shields.io/badge/Sanity%20V5-supported-4e5452?style=flat)](https://www.sanity.io/)

**Framework Support:**

[![Next.js](https://img.shields.io/badge/Next.js-supported-000000?logo=next.js&logoColor=white&style=flat)](https://nextjs.org/)
[![Astro](https://img.shields.io/badge/Astro-supported-FF5D01?logo=astro&logoColor=white&style=flat)](https://astro.build/)
[![Vue](https://img.shields.io/badge/Vue%203-supported-4FC08D?logo=vue.js&logoColor=white&style=flat)](https://vuejs.org/)

The complete SEO toolkit for Sanity Studio. Empower your team with live SEO scoring, AI-powered content suggestions, team workflows, and comprehensive structured data support.

**Production-Ready:** Free and AI tiers live. Pro features coming soon with team workflows, bulk optimization, and schema management.

## Demo Video

![Demo](https://raw.githubusercontent.com/bhargav-bkpatel/sanity-plugin-seo/main/public/assets/demo-3.gif)

## Complete Feature Set

Everything from basic SEO optimization to advanced team workflows.

| Feature                                                          | Free | AI  | 🔜 Pro |
| ---------------------------------------------------------------- | :--: | :-: | :----: |
| Live SEO Score (0–100)                                           |  ✅  | ✅  |   —    |
| GEO Checklist (AI Overview readiness)                            |  ✅  | ✅  |   —    |
| Meta Tags Preview + HTML snippet                                 |  ✅  | ✅  |   —    |
| Social Preview Cards (X, Facebook, LinkedIn, WhatsApp)           |  ✅  | ✅  |   —    |
| Focus Keyword tracking                                           |  ✅  | ✅  |   —    |
| Robots Meta (noindex, nofollow, noarchive…)                      |  ✅  | ✅  |   —    |
| hreflang / multi-language targeting                              |  ✅  | ✅  |   —    |
| Open Graph & Twitter/X card fields                               |  ✅  | ✅  |   —    |
| Additional meta tags                                             |  ✅  | ✅  |   —    |
| Frontend integration guides (Next.js, Astro, Vue)                |  ✅  | ✅  |   —    |
| Readability score                                                |  ✅  | ✅  |   —    |
| AI Keyword Suggestions                                           |  —   | ✅  |   —    |
| AI Meta Title & Description generation                           |  —   | ✅  |   —    |
| SERP Preview (desktop + mobile)                                  |  —   |  —  |   🔜   |
| Schema.org Wizard (30+ structured data types)                    |  —   |  —  |   🔜   |
| Live JSON-LD preview                                             |  —   |  —  |   🔜   |
| SEO Health Dashboard (site-wide scores)                          |  —   |  —  |   🔜   |
| SEO Optimizer — inline bulk edit, type filter, CSV import/export |  —   |  —  |   🔜   |
| Bulk Open Graph sync                                             |  —   |  —  |   🔜   |
| Advanced Validation (5 checks + auto-fix)                        |  —   |  —  |   🔜   |
| Team Workflow (Draft → Review → Approved)                        |  —   |  —  |   🔜   |
| Workflow Dashboard (site-wide status tracking)                   |  —   |  —  |   🔜   |
| Duplicate meta title detection                                   |  —   |  —  |   🔜   |
| AI Bulk SEO Generation                                           |  —   |  —  |   🔜   |

## What Each Tier Includes

**🎁 Free** — Essential SEO tools built-in. Start optimizing immediately.

**🤖 AI** — Add AI-powered suggestions. Choose from OpenAI, Anthropic, or Groq (free tier available).

**👥 Pro** — Coming Soon. Team workflows, bulk optimization, advanced analytics, and schema management for enterprise teams.

## Table of Contents

- [Quick Start](#quick-start)
- [Configuration Options](#configuration-options)
- [Framework Integration Guides](#framework-integration-guides)
- [GROQ Fragment & Types](#groq-fragment--types)
- [Body Fields](#body-fields-bodyfields)
- [AI Provider Setup](#ai-provider-setup)
- [Pro Features — Coming Soon](#pro-features-coming-soon)
- [Upgrading from v1.3](#upgrading-from-v13-to-v14)

## Quick Start

### 1. Install the plugin

```bash
npm install sanity-plugin-seo
```

**Or with yarn/pnpm:**

```bash
yarn add sanity-plugin-seo    # or
pnpm add sanity-plugin-seo
```

**Compatibility:** Sanity Studio v3, v4, and v5

## 2. Configure in Sanity Studio

### Option A: Free features only

```
// sanity.config.ts
import { defineConfig } from "sanity";
import { seoMetaFields } from "sanity-plugin-seo";

export default defineConfig({
  plugins: [seoMetaFields()],
});
```

### Option B: With AI (OpenAI, Anthropic, or Groq)

Add AI-powered suggestions for meta titles, descriptions, and keywords.

```
import { defineConfig } from "sanity";
import { seoMetaFields } from "sanity-plugin-seo";

export default defineConfig({
  plugins: [
    seoMetaFields({
      aiFeature: {
        provider: "openai", // 'openai' | 'anthropic' | 'groq'
        apiKey: process.env.SANITY_STUDIO_OPENAI_KEY!,
        model: "gpt-4o-mini", // optional
      },
      bodyFields: ["body"], // single field — or pass multiple, see bodyFields docs below
      slugField: "slug",
    }),
  ],
});
```

### Option C: With Pro license (Coming Soon)

Unlock team workflows, bulk optimization, and advanced schema management.

```
seoMetaFields({
  proFeature: process.env.SANITY_STUDIO_SEO_LICENSE!,
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
});
```

| Env variable                | Value                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| `SANITY_STUDIO_SEO_LICENSE` | Your license key from Lemon Squeezy                                                               |
| `SANITY_STUDIO_PROJECT_ID`  | Your Sanity project ID (find it in `sanity.json` or [manage.sanity.io](https://manage.sanity.io)) |

> Sanity Studio env vars must be prefixed with `SANITY_STUDIO_` to be included in the browser bundle.

### Complete Configuration

```
import { defineConfig } from "sanity";
import { seoMetaFields } from "sanity-plugin-seo";

export default defineConfig({
  plugins: [
    seoMetaFields({
      // AI provider (OpenAI, Anthropic, or Groq)
      aiFeature: {
        provider: "openai", // 'openai' | 'anthropic' | 'groq'
        apiKey: process.env.SANITY_STUDIO_OPENAI_KEY!,
        model: "gpt-4o-mini",
      },
      // Body content fields for AI analysis — string, string path, or Sanity path array
      bodyFields: [
        "body",                          // simple field
        "sections[].content",            // array traversal
        ["sections", "columns", "body"], // Sanity native path array
      ],
      slugField: "slug",
      // Show SEO Health + Optimizer in Studio toolbar (default: true)
      dashboard: true,
    }),
  ],
});
```

## 3. Add SEO to Your Documents

Add the `seoMetaFields` type to any document schema in your project:

```
// schemas/page.ts
export default {
  name: "page",
  type: "document",
  fields: [
    { name: "title", type: "string" },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "body", type: "array", of: [{ type: "block" }] },
    { name: "seo", type: "seoMetaFields" },
  ],
};
```

This adds a fully-featured SEO panel with four tabs:

- **Basic SEO** — Meta title, description, keywords
- **Social Sharing** — Open Graph & Twitter cards
- **Advanced** — Robots meta, hreflang, custom tags
- **Schema.org** — 30+ structured data types (Pro)

## Configuration Options

All options are optional. The plugin works great with zero configuration.

| Option               | Type                                | Default          | Description                                                                                                                         |
| -------------------- | ----------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Content Fields**   |
| `bodyField`          | `string`                            | `'body'`         | Single body field name (legacy — prefer `bodyFields`)                                                                               |
| `bodyFields`         | `Array<string \| string[]>`         | —                | One or more body field paths; each item is a string path (`'sections[].content'`) or a Sanity path array (`['sections','content']`) |
| `slugField`          | `string`                            | `'slug'`         | Slug field for URL preview in SERP                                                                                                  |
| **AI Features**      |
| `aiFeature`          | `object`                            | —                | Enable AI keyword and content suggestions                                                                                           |
| `aiFeature.provider` | `'openai' \| 'anthropic' \| 'groq'` | —                | AI provider (OpenAI/Anthropic/Groq)                                                                                                 |
| `aiFeature.apiKey`   | `string`                            | —                | API key from your provider                                                                                                          |
| `aiFeature.model`    | `string`                            | provider default | Model ID (e.g., `gpt-4o-mini`, `claude-haiku-4-5-20251001`)                                                                         |
| **Pro Features**     |
| `proFeature`         | `string`                            | —                | Your Lemon Squeezy license key                                                                                                      |
| `projectId`          | `string`                            | —                | Your Sanity project ID — used for seat-binding (required for Pro)                                                                   |
| **UI**               |
| `dashboard`          | `boolean`                           | `true`           | Show SEO Health & Optimizer in Studio toolbar                                                                                       |

## Framework Integration Guides

Complete copy-paste guides with GROQ queries, TypeScript types, and JSON-LD helpers are on the docs site.

### Next.js

Works with both App Router (`generateMetadata`) and Pages Router (`next-seo`). Includes a `buildMetadata` helper and JSON-LD support.

→ [Full Next.js guide](https://sanity-seo-plugin.bkpatel.com/docs#nextjs)

### Astro

Works with `astro-seo` or native `<head>` tags. Includes Sanity client setup and a `buildJsonLd` helper.

→ [Full Astro guide](https://sanity-seo-plugin.bkpatel.com/docs#astro)

### Vue 3 / Nuxt

Works with Nuxt 3 (`useHead`) and Vue 3 standalone (`@unhead/vue`). Uses `@sanity/client` directly — no `@nuxtjs/sanity` needed.

→ [Full Vue / Nuxt guide](https://sanity-seo-plugin.bkpatel.com/docs#vue-nuxt)

### SvelteKit

Works with SvelteKit's `+page.server.ts` load function and `<svelte:head>` for meta tags.

→ [Full SvelteKit guide](https://sanity-seo-plugin.bkpatel.com/docs#sveltekit)

## GROQ Fragment & Types

Copy and use this GROQ fragment to fetch all SEO fields from your documents:

```
const pageQuery = groq`*[_type == "page" && slug.current == $slug][0]{
  title,
  seo {
    metaTitle, metaDescription, focusKeyword, seoKeywords,
    nofollowAttributes, robotsMeta,
    metaImage { asset->{ url } },
    openGraph { title, description, siteName, image { asset->{ url } } },
    twitter { cardType, site, creator, handle },
    hreflang[] { locale, url },
    schemaOrg {
      schemaType, name, description, url, author,
      datePublished, dateModified,
      price, priceCurrency, availability,
      ratingValue, ratingCount,
      startDate, endDate, location,
      faqItems[] { question, answer }
    },
    seoStatus, seoReviewNotes
  }
}`;
```

| Field                       | Type       | Notes                             |
| --------------------------- | ---------- | --------------------------------- |
| `metaTitle`                 | `string`   | Page title for search engines     |
| `metaDescription`           | `string`   | Page description                  |
| `focusKeyword`              | `string`   | Primary keyword                   |
| `seoKeywords`               | `string[]` | Additional keywords               |
| `nofollowAttributes`        | `boolean`  | Noindex toggle                    |
| `robotsMeta`                | `string[]` | e.g. `['noindex', 'nofollow']`    |
| `metaImage.asset.url`       | `string`   | Fallback OG/Twitter image         |
| `openGraph.title`           | `string`   | OG title                          |
| `openGraph.description`     | `string`   | OG description                    |
| `openGraph.siteName`        | `string`   | OG site name                      |
| `openGraph.image.asset.url` | `string`   | OG image                          |
| `twitter.cardType`          | `string`   | e.g. `summary_large_image`        |
| `twitter.site`              | `string`   | Twitter @account                  |
| `twitter.creator`           | `string`   | Twitter @author                   |
| `hreflang[].locale`         | `string`   | BCP 47 locale code                |
| `hreflang[].url`            | `string`   | Alternate URL for that locale     |
| `schemaOrg.schemaType`      | `string`   | Schema.org type                   |
| `seoStatus`                 | `string`   | `draft` \| `review` \| `approved` |
| `seoReviewNotes`            | `string`   | Reviewer notes                    |

## Body Fields (`bodyFields`)

`bodyFields` accepts an array where each item is either a **string path** or a **Sanity path array**:

```ts
seoMetaFields({
  bodyFields: [
    "body", // simple field
    "excerpt", // plain string or Portable Text
    "sections[].content", // string with '[]. ' array traversal
    "sections[].columns[].body", // nested array traversal
    ["sections", "columns", "content"], // Sanity native path array
  ],
});
```

**Path formats**

| Item                              | Resolves to                                                  |
| --------------------------------- | ------------------------------------------------------------ |
| `"body"`                          | `document.body`                                              |
| `"sections[].content"`            | `.content` from every item in `document.sections`            |
| `"sections[].columns[].body"`     | nested array traversal                                       |
| `["sections", "columns", "body"]` | `document.sections.columns.body` (direct path, no iteration) |

Fields are resolved in order — earlier fields are higher priority when the AI prompt trims to 2000 characters.

> `bodyField: "body"` (single string) still works and is kept for backwards compatibility. `bodyFields` takes precedence when both are set.

## Free Features

### Readability Score

Calculates a Flesch-Kincaid Grade Level for your content and shows it with color-coded feedback directly beneath the body field.

| Grade | Meaning                                    |
| ----- | ------------------------------------------ |
| 1–6   | Very easy — general public                 |
| 7–8   | Easy — ideal for most blog posts           |
| 9–12  | Average — acceptable for technical content |
| 13+   | Difficult — academic/specialist            |

Green = Grade ≤ 8, Amber = 9–12, Red = 13+.

## Pro Features (Coming Soon)

Team workflows, bulk optimization, SERP preview, Schema.org wizard, advanced validation, and site-wide dashboards — all in development.

> Star the [GitHub repo](https://github.com/bhargav-bkpatel/sanity-plugin-seo) to get notified when Pro launches.

## AI Provider Setup

Three AI providers supported. Choose based on your needs and budget.

### OpenAI (Paid)

```
seoMetaFields({
  aiFeature: {
    provider: "openai",
    apiKey: process.env.SANITY_STUDIO_OPENAI_KEY!,
    model: "gpt-4o-mini",
  },
  bodyFields: ["body"],
});
```

Recommended: `gpt-4o-mini` (fast), `gpt-4o` (better quality)

### Anthropic (Paid)

```
seoMetaFields({
  aiFeature: {
    provider: "anthropic",
    apiKey: process.env.SANITY_STUDIO_ANTHROPIC_KEY!,
    model: "claude-haiku-4-5-20251001",
  },
  bodyFields: ["body"],
});
```

**Recommended models:** `claude-haiku-4-5-20251001` (fast & cheap), `claude-sonnet-4-6` (best quality)

### Groq (Free)

```
seoMetaFields({
  aiFeature: {
    provider: "groq",
    apiKey: process.env.SANITY_STUDIO_GROQ_KEY!,
    model: "llama-3.3-70b-versatile",
  },
  bodyFields: ["body"],
});
```

**Free API:** Sign up at [console.groq.com](https://console.groq.com)  
**Recommended models:** `llama-3.3-70b-versatile`, `mixtral-8x7b-32768`

> ⚠️ **Security Note:** API keys are bundled in the browser. Always use restricted API keys with minimal permissions, and prefix env vars with `SANITY_STUDIO_`.

## Upgrading from v1.3 to v1.4

**Good news:** No schema migrations needed. All existing SEO fields continue to work. Just update your config.

### What Changed

The basic setup works exactly the same:

```
// v1.3 and v1.4 — no changes needed
plugins: [seoMetaFields()];
```

**New in v1.4:** AI and Pro features are now available with renamed config keys:

| Feature        | Config Key (v1.4) |
| -------------- | ----------------- |
| AI suggestions | `aiFeature`       |
| Pro license    | `proFeature`      |

See [AI Provider Setup](#ai-provider-setup) and [Pro License Setup](#pro-license-setup--coming-soon) for configuration examples.

### New Fields in v1.4

These new schema fields are optional and automatically included:

| Field                | Type       | Purpose                                                    |
| -------------------- | ---------- | ---------------------------------------------------------- |
| `focusKeyword`       | `string`   | Primary target keyword for tracking                        |
| `robotsMeta`         | `string[]` | Indexing control (noindex, nofollow, noarchive, nosnippet) |
| `hreflang`           | `array`    | Alternate language/regional URLs                           |
| `additionalMetaTags` | `array`    | Custom name/content meta tag pairs                         |
| `schemaOrg`          | `object`   | Schema.org structured data (Pro feature)                   |
| `seoStatus`          | `string`   | Workflow status: draft, review, approved (Pro feature)     |
| `seoReviewNotes`     | `string`   | Reviewer feedback and notes (Pro feature)                  |

Existing documents work fine without these new fields — they're completely optional.

## TypeScript Types

```
interface SeoData {
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  seoKeywords?: string[];
  nofollowAttributes?: boolean;
  robotsMeta?: string[];
  metaImage?: { asset: { url: string } };
  openGraph?: {
    title?: string;
    description?: string;
    siteName?: string;
    image?: { asset: { url: string } };
  };
  twitter?: {
    cardType?: string;
    site?: string;
    creator?: string;
    handle?: string;
  };
  hreflang?: { locale: string; url: string }[];
  schemaOrg?: {
    schemaType?: string;
    name?: string;
    description?: string;
    url?: string;
    author?: string;
    datePublished?: string;
    dateModified?: string;
    price?: string;
    priceCurrency?: string;
    availability?: string;
    ratingValue?: string;
    ratingCount?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    faqItems?: { question: string; answer: string }[];
  };
  seoStatus?: "draft" | "review" | "approved";
  seoReviewNotes?: string;
}
```

## Support & Community

- **Bug Reports:** [GitHub Issues](https://github.com/bhargav-bkpatel/sanity-plugin-seo/issues)
- **NPM Package:** [sanity-plugin-seo](https://www.npmjs.com/package/sanity-plugin-seo)

## Creator

Built by [Bhargav Patel](https://bkpatel.com/)

## License

MIT — Free and AI features are open source. Pro coming soon.
