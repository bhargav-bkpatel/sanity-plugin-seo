![Sanity Plugin SEO](https://github.com/bhargav-bkpatel/sanity-plugin-seo/blob/main/public/assets/background.png)

## ⚡ Sanity Plugin SEO

[![npm version](https://img.shields.io/badge/npm-v1.4.0-blue)](https://www.npmjs.com/package/sanity-plugin-seo)
[![npm downloads](https://img.shields.io/badge/downloads-22k-brightgreen)](https://www.npmjs.com/package/sanity-plugin-seo)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://www.typescriptlang.org/)
[![Built with Sanity](https://img.shields.io/badge/Built%20With-Sanity-8a2be2?logo=sanity&logoColor=white)](https://www.sanity.io/)
[![Sanity V3](https://img.shields.io/badge/Sanity%20V3%20Plugin-4e5452)](https://www.sanity.io/)
[![Sanity V4](https://img.shields.io/badge/Sanity%20V4%20Plugin-4e5452)](https://www.sanity.io/)
[![Sanity V5](https://img.shields.io/badge/Sanity%20V5%20Plugin-4e5452)](https://www.sanity.io/)

The most complete SEO plugin for Sanity Studio — live SEO score, GEO checklist, AI-powered suggestions, SERP preview, Schema.org wizard (30+ types), social previews, advanced validation, team workflow, and integration guides for **Next.js**, **Astro**, and **Vue / Nuxt**.

**Free** and **AI** features are available now. **Pro features are coming soon.**

![Demo](https://github.com/bhargav-bkpatel/sanity-plugin-seo/blob/main/public/assets/demo-1.gif)

---

## Feature Comparison

| Feature | Free | AI | 🔜 Pro |
|---|:---:|:---:|:---:|
| Live SEO Score (0–100) | ✅ | ✅ | — |
| GEO Checklist (AI Overview readiness) | ✅ | ✅ | — |
| Meta Tags Preview + HTML snippet | ✅ | ✅ | — |
| Social Preview Cards (X, Facebook, LinkedIn, WhatsApp) | ✅ | ✅ | — |
| Focus Keyword tracking | ✅ | ✅ | — |
| Canonical URL field | ✅ | ✅ | — |
| Robots Meta (noindex, nofollow, noarchive…) | ✅ | ✅ | — |
| hreflang / multi-language targeting | ✅ | ✅ | — |
| Open Graph & Twitter/X card fields | ✅ | ✅ | — |
| Additional meta tags | ✅ | ✅ | — |
| Frontend integration guides (Next.js, Astro, Vue) | ✅ | ✅ | — |
| Readability score | ✅ | ✅ | — |
| AI Keyword Suggestions | — | ✅ | — |
| AI Meta Title & Description generation | — | ✅ | — |
| SERP Preview (desktop + mobile) | — | — | 🔜 |
| Schema.org Wizard (30+ structured data types) | — | — | 🔜 |
| Live JSON-LD preview | — | — | 🔜 |
| SEO Health Dashboard (site-wide scores) | — | — | 🔜 |
| SEO Optimizer — inline bulk edit, type filter, CSV import/export | — | — | 🔜 |
| Bulk Canonical URL generation (base URL + slug) | — | — | 🔜 |
| Bulk Open Graph sync (copy meta → OG per page) | — | — | 🔜 |
| Advanced Validation (7 checks + auto-fix) | — | — | 🔜 |
| Team Workflow (Draft → Review → Approved) | — | — | 🔜 |
| Duplicate meta title detection (GROQ) | — | — | 🔜 |
| AI Bulk SEO Generation (title + description for all pages) | — | — | 🔜 |

---

## Table of Contents

- [Installation](#installation)
- [Sanity Studio Setup](#sanity-studio-setup)
- [Add SEO to a Document](#add-seo-to-a-document)
- [Configuration Reference](#configuration-reference)
- [Next.js Integration](#nextjs-integration)
- [Astro Integration](#astro-integration)
- [Vue 3 / Nuxt Integration](#vue-3--nuxt-integration)
- [GROQ Fragment](#groq-fragment)
- [Pro Features — Coming Soon](#pro-features--coming-soon)
- [Pro License Setup — Coming Soon](#pro-license-setup--coming-soon)
- [AI Setup](#ai-setup)
- [Upgrading from Earlier Versions](#upgrading-from-earlier-versions)

---

## Installation

Install in your **Sanity Studio** project:

```bash
npm install sanity-plugin-seo
# or
yarn add sanity-plugin-seo
# or
pnpm add sanity-plugin-seo
```

Works with **Sanity Studio v3, v4, and v5**.

Your frontend (Next.js, Astro, Vue, Nuxt, etc.) fetches SEO data from Sanity via a GROQ query and renders it using the framework's own head/metadata tools — see the integration examples below.

---

## Sanity Studio Setup

### Minimal setup (free features only)

```ts
// sanity.config.ts
import { defineConfig } from 'sanity'
import { seoMetaFields } from 'sanity-plugin-seo'

export default defineConfig({
  plugins: [
    seoMetaFields(),
  ],
})
```

### With AI suggestions (OpenAI, Anthropic, or Groq)

```ts
import { defineConfig } from 'sanity'
import { seoMetaFields } from 'sanity-plugin-seo'

export default defineConfig({
  plugins: [
    seoMetaFields({
      aiFeature: {
        provider: 'openai',                          // 'openai' | 'anthropic' | 'groq'
        apiKey: process.env.SANITY_STUDIO_OPENAI_KEY!,
        model: 'gpt-4o-mini',                        // optional, provider default used if omitted
      },
      bodyField: 'body',   // your Portable Text field name
      slugField: 'slug',   // your slug field name
    }),
  ],
})
```

### With Pro license (Coming Soon)

> **Pro features are coming soon.** The `proFeature` config key is reserved for the upcoming license system.

```ts
import { defineConfig } from 'sanity'
import { seoMetaFields } from 'sanity-plugin-seo'

export default defineConfig({
  plugins: [
    seoMetaFields({
      proFeature: process.env.SANITY_STUDIO_SEO_LICENSE, // reserved — Pro coming soon
      bodyField: 'body',
      slugField: 'slug',
    }),
  ],
})
```

### Full setup (AI + Pro — Coming Soon)

```ts
import { defineConfig } from 'sanity'
import { seoMetaFields } from 'sanity-plugin-seo'

export default defineConfig({
  // Pro license key — coming soon, reserve the env var now
  // proFeature: process.env.SANITY_STUDIO_SEO_LICENSE,

  plugins: [
    seoMetaFields({
      // AI-powered title, description, and keyword generation
      aiFeature: {
        provider: 'openai',                          // 'openai' | 'anthropic' | 'groq'
        apiKey: process.env.SANITY_STUDIO_OPENAI_KEY!,
        model: 'gpt-4o-mini',                        // optional
      },

      // Source fields for AI and automation
      bodyField: 'body',   // Portable Text field for content analysis
      slugField: 'slug',   // Slug field for canonical URL auto-generation

      // SEO Health Dashboard and Bulk Optimizer top-level tools
      dashboard: true,     // default: true

    }),
  ],
})
```

---

## Add SEO to a Document

Add the `seoMetaFields` type to any document schema:

```ts
// schemas/page.ts
export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seoMetaFields',
    },
  ],
}
```

The plugin automatically renders a tabbed SEO panel with **Basic SEO**, **Social Sharing**, **Advanced**, **Schema.org**, and **Workflow** tabs.

---

## Configuration Reference

| Option | Type | Default | Description |
|---|---|---|---|
| `proFeature` | `string` | — | Pro license key — **coming soon**, reserve the env var now |
| `aiFeature` | `AIConfig` | — | AI provider config for keyword/title/description generation |
| `aiFeature.provider` | `'openai' \| 'anthropic' \| 'groq'` | — | AI provider |
| `aiFeature.apiKey` | `string` | — | API key for the chosen provider |
| `aiFeature.model` | `string` | provider default | Model name (e.g. `gpt-4o-mini`, `claude-haiku-4-5-20251001`, `llama-3.3-70b-versatile`) |
| `bodyField` | `string` | `'body'` | Portable Text field name for AI content analysis |
| `slugField` | `string` | `'slug'` | Slug field name for canonical URL auto-generation |
| `dashboard` | `boolean` | `true` | Show SEO Health and Bulk Optimizer in the Studio toolbar |

---

## Next.js Integration

Fetch SEO data from Sanity and pipe it into the Next.js `Metadata` API (App Router) or `next-seo` (Pages Router). All examples below are copy-paste ready.

### 1. Install and configure the Sanity client

```bash
npm install @sanity/client
```

```ts
// lib/sanity.ts
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
})

// Full SEO GROQ fragment — paste this into any query that needs SEO fields
export const SEO_GROQ = `seo {
  metaTitle, metaDescription, focusKeyword,
  canonicalUrl, nofollowAttributes, robotsMeta, seoKeywords,
  seoStatus, seoReviewNotes,
  metaImage { asset->{ url } },
  openGraph { title, description, url, siteName, image { asset->{ url } } },
  twitter { cardType, site, creator, handle },
  hreflang[] { locale, url },
  schemaOrg {
    schemaType, name, description, url, author,
    datePublished, dateModified,
    price, priceCurrency, availability,
    ratingValue, ratingCount,
    startDate, endDate, location,
    faqItems[] { question, answer }
  }
}`
```

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://your-site.com
```

### 2. Create shared SEO helpers

```ts
// app/_seo.ts
import type { Metadata } from 'next'

export type SeoField = {
  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string
  nofollowAttributes?: boolean
  robotsMeta?: string[]
  seoKeywords?: string[]
  seoStatus?: 'draft' | 'review' | 'approved'
  seoReviewNotes?: string
  metaImage?: { asset?: { url?: string } }
  openGraph?: { title?: string; description?: string; url?: string; siteName?: string; image?: { asset?: { url?: string } } }
  twitter?: { cardType?: string; site?: string; creator?: string; handle?: string }
  hreflang?: { locale: string; url: string }[]
  schemaOrg?: {
    schemaType?: string; name?: string; description?: string; url?: string; author?: string
    datePublished?: string; dateModified?: string
    faqItems?: { question: string; answer: string }[]
    [key: string]: unknown
  }
}

export function buildMetadata(seo: SeoField | undefined, fallbackTitle: string | undefined, slug: string): Metadata {
  const s = seo ?? {}
  const canonical = s.canonicalUrl ?? `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/${slug}`
  const ogImage = s.openGraph?.image?.asset?.url ?? s.metaImage?.asset?.url

  const robots: string[] = []
  if (s.nofollowAttributes) robots.push('noindex', 'nofollow')
  s.robotsMeta?.forEach((r) => { if (!robots.includes(r)) robots.push(r) })

  // Build hreflang map for alternates
  const languages: Record<string, string> = {}
  s.hreflang?.forEach(({ locale, url }) => { languages[locale] = url })

  return {
    title: s.metaTitle ?? fallbackTitle,
    description: s.metaDescription,
    ...(s.seoKeywords?.length && { keywords: s.seoKeywords.join(', ') }),
    ...(robots.length && { robots: robots.join(', ') }),
    alternates: {
      canonical,
      ...(Object.keys(languages).length && { languages }),
    },
    openGraph: {
      title: s.openGraph?.title ?? s.metaTitle ?? fallbackTitle,
      description: s.openGraph?.description ?? s.metaDescription,
      url: s.openGraph?.url ?? canonical,
      siteName: s.openGraph?.siteName,
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: (s.twitter?.cardType as 'summary' | 'summary_large_image') ?? 'summary_large_image',
      site: s.twitter?.site,
      creator: s.twitter?.creator ?? s.twitter?.handle,
    },
  }
}

// Builds JSON-LD — handles FAQPage, any generic schemaType, and WebPage fallback
export function buildJsonLd(seo: SeoField | undefined, fallbackTitle?: string): string {
  const schema = seo?.schemaOrg
  if (!schema?.schemaType) {
    return JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: seo?.metaTitle ?? fallbackTitle, description: seo?.metaDescription })
  }
  if (schema.schemaType === 'FAQPage' && schema.faqItems?.length) {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: schema.faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    })
  }
  const { schemaType, faqItems, ...rest } = schema
  return JSON.stringify({ '@context': 'https://schema.org', '@type': schemaType, ...rest })
}
```

### 3. App Router — `[slug]/page.tsx`

> **Next.js 15 note:** `params` is a `Promise` — always `await` it before reading.

```tsx
// app/[slug]/page.tsx
import type { Metadata } from 'next'
import { client, SEO_GROQ } from '@/lib/sanity'
import { buildMetadata, buildJsonLd } from '@/app/_seo'

const query = `*[_type == "page" && slug.current == $slug][0]{ title, ${SEO_GROQ} }`

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await client.fetch(query, { slug })
  return buildMetadata(page?.seo, page?.title, slug)
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const page = await client.fetch(query, { slug })

  if (!page) return <main><p>Page not found.</p></main>

  const jsonLd = buildJsonLd(page.seo, page.title)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <main>
        <h1>{page.title}</h1>
      </main>
    </>
  )
}
```

---

### Pages Router — `pages/[slug].tsx` with `next-seo`

```bash
npm install next-seo
```

```tsx
// pages/[slug].tsx
import { NextSeo } from 'next-seo'
import { GetStaticProps } from 'next'
import { client, SEO_GROQ } from '@/lib/sanity'
import type { SeoField } from '@/app/_seo'

type Props = { page: { title: string; slug: string; seo?: SeoField } }

export default function Page({ page }: Props) {
  const seo = page?.seo ?? {}
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const canonical = seo.canonicalUrl ?? `${siteUrl}/${page.slug}`
  const ogImage = seo.openGraph?.image?.asset?.url ?? seo.metaImage?.asset?.url

  const noindex = !!(seo.nofollowAttributes || seo.robotsMeta?.includes('noindex'))
  const nofollow = !!(seo.nofollowAttributes || seo.robotsMeta?.includes('nofollow'))

  // JSON-LD — FAQPage, generic schemaType, or WebPage fallback
  const schema = seo.schemaOrg
  let jsonLd: string | null = null
  if (schema?.schemaType === 'FAQPage' && schema.faqItems?.length) {
    jsonLd = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: schema.faqItems.map((i) => ({
        '@type': 'Question', name: i.question,
        acceptedAnswer: { '@type': 'Answer', text: i.answer },
      })),
    })
  } else if (schema?.schemaType) {
    const { schemaType, faqItems, ...rest } = schema
    jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@type': schemaType, ...rest })
  }

  return (
    <>
      <NextSeo
        title={seo.metaTitle}
        description={seo.metaDescription}
        canonical={canonical}
        noindex={noindex}
        nofollow={nofollow}
        additionalMetaTags={[
          ...(seo.seoKeywords?.length ? [{ name: 'keywords', content: seo.seoKeywords.join(', ') }] : []),
        ]}
        additionalLinkTags={
          seo.hreflang?.map(({ locale, url }) => ({ rel: 'alternate', hrefLang: locale, href: url })) ?? []
        }
        openGraph={{
          title: seo.openGraph?.title ?? seo.metaTitle,
          description: seo.openGraph?.description ?? seo.metaDescription,
          url: seo.openGraph?.url ?? canonical,
          siteName: seo.openGraph?.siteName,
          images: ogImage ? [{ url: ogImage }] : [],
        }}
        twitter={{
          cardType: seo.twitter?.cardType ?? 'summary_large_image',
          site: seo.twitter?.site,
          handle: seo.twitter?.handle ?? seo.twitter?.creator,
        }}
      />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
      <main><h1>{page.title}</h1></main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const page = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{ title, "slug": slug.current, ${SEO_GROQ} }`,
    { slug: params?.slug },
  )
  return { props: { page }, revalidate: 60 }
}

export async function getStaticPaths() {
  const slugs = await client.fetch(`*[_type == "page"].slug.current`)
  return { paths: slugs.map((slug: string) => ({ params: { slug } })), fallback: 'blocking' }
}
```

---

## Astro Integration

Fetch SEO data server-side in each `.astro` page and render it into `<head>`. Works with native Astro head tags or the `astro-seo` component.

### 1. Configure Astro for SSR and install dependencies

Dynamic routes need server-side rendering so each page can fetch its own slug at request time.

```bash
npm install @sanity/client astro-seo
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  output: 'server', // required for dynamic routes
})
```

```bash
# .env
PUBLIC_SANITY_PROJECT_ID=your-project-id
PUBLIC_SANITY_DATASET=production
PUBLIC_SITE_URL=https://your-site.com
```

### 2. Create a Sanity client and shared helpers

```ts
// src/lib/sanity.ts
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
})

// Full SEO GROQ fragment — paste into any query
export const SEO_GROQ = `seo {
  metaTitle, metaDescription, focusKeyword,
  canonicalUrl, nofollowAttributes, robotsMeta, seoKeywords,
  seoStatus, seoReviewNotes,
  metaImage { asset->{ url } },
  openGraph { title, description, url, siteName, image { asset->{ url } } },
  twitter { cardType, site, creator, handle },
  hreflang[] { locale, url },
  schemaOrg {
    schemaType, name, description, url, author,
    datePublished, dateModified,
    price, priceCurrency, availability,
    ratingValue, ratingCount,
    startDate, endDate, location,
    faqItems[] { question, answer }
  }
}`

export type SeoField = {
  metaTitle?: string; metaDescription?: string; canonicalUrl?: string
  nofollowAttributes?: boolean; robotsMeta?: string[]; seoKeywords?: string[]
  seoStatus?: string; seoReviewNotes?: string
  metaImage?: { asset?: { url?: string } }
  openGraph?: { title?: string; description?: string; url?: string; siteName?: string; image?: { asset?: { url?: string } } }
  twitter?: { cardType?: string; site?: string; creator?: string; handle?: string }
  hreflang?: { locale: string; url: string }[]
  schemaOrg?: { schemaType?: string; faqItems?: { question: string; answer: string }[]; [key: string]: unknown }
}

// Builds JSON-LD string — handles FAQPage, generic schemaType, and WebPage fallback
export function buildJsonLd(schema: SeoField['schemaOrg'], fallbackTitle?: string, fallbackDesc?: string): string | null {
  if (!schema?.schemaType) {
    return JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: fallbackTitle, description: fallbackDesc })
  }
  if (schema.schemaType === 'FAQPage' && schema.faqItems?.length) {
    return JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: schema.faqItems.map((item) => ({
        '@type': 'Question', name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    })
  }
  const { schemaType, faqItems, ...rest } = schema
  return JSON.stringify({ '@context': 'https://schema.org', '@type': schemaType, ...rest })
}
```

### 3. Dynamic route — `src/pages/[slug].astro`

```astro
---
// src/pages/[slug].astro
import { SEO } from 'astro-seo'
import { client, SEO_GROQ, buildJsonLd } from '../lib/sanity'

export const prerender = false // required for every dynamic SSR route in Astro

const { slug } = Astro.params
const page = await client.fetch(
  `*[_type == "page" && slug.current == $slug][0]{ title, description, ${SEO_GROQ} }`,
  { slug },
)
if (!page) return Astro.redirect('/404')

const seo = page.seo ?? {}
const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? ''
const pageUrl = `${siteUrl}/${slug}`
const title = seo.metaTitle ?? page.title
const description = seo.metaDescription ?? page.description ?? ''
const ogImage = seo.openGraph?.image?.asset?.url ?? seo.metaImage?.asset?.url
const jsonLd = buildJsonLd(seo.schemaOrg, title, description)
---

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <SEO
      title={title}
      description={description}
      canonical={seo.canonicalUrl ?? pageUrl}
      noindex={seo.robotsMeta?.includes('noindex') ?? false}
      nofollow={seo.nofollowAttributes ?? false}
      openGraph={{
        basic: {
          title: seo.openGraph?.title ?? title,
          type: 'website',
          image: ogImage ?? '',
          url: seo.openGraph?.url ?? pageUrl,
        },
        optional: {
          description: seo.openGraph?.description ?? description,
          siteName: seo.openGraph?.siteName,
        },
      }}
      twitter={{
        card: (seo.twitter?.cardType ?? 'summary_large_image') as any,
        site: seo.twitter?.site,
        creator: seo.twitter?.creator ?? seo.twitter?.handle,
      }}
      extend={{
        meta: [
          { name: 'robots', content: seo.robotsMeta?.join(', ') ?? 'index,follow' },
          ...(seo.seoKeywords?.length ? [{ name: 'keywords', content: seo.seoKeywords.join(', ') }] : []),
        ],
        link: seo.hreflang?.map((h: { locale: string; url: string }) => ({
          rel: 'alternate', hreflang: h.locale, href: h.url,
        })) ?? [],
      }}
    />

    {jsonLd && <script type="application/ld+json" set:html={jsonLd} />}
  </head>
  <body>
    <main>
      <h1>{page.title}</h1>
    </main>
  </body>
</html>
```

<details>
<summary>Option B — native Astro head tags (no astro-seo)</summary>

```astro
---
// src/pages/[slug].astro
import { client, SEO_GROQ, buildJsonLd } from '../lib/sanity'

export const prerender = false

const { slug } = Astro.params
const page = await client.fetch(
  `*[_type == "page" && slug.current == $slug][0]{ title, description, ${SEO_GROQ} }`,
  { slug },
)
if (!page) return Astro.redirect('/404')

const seo = page.seo ?? {}
const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? ''
const pageUrl = `${siteUrl}/${slug}`
const title = seo.metaTitle ?? page.title
const description = seo.metaDescription ?? page.description ?? ''
const ogImage = seo.openGraph?.image?.asset?.url ?? seo.metaImage?.asset?.url
const robots = seo.robotsMeta?.join(', ') ?? 'index,follow'
const jsonLd = buildJsonLd(seo.schemaOrg, title, description)
---

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={seo.canonicalUrl ?? pageUrl} />
    <meta name="robots" content={robots} />
    {seo.seoKeywords?.length && <meta name="keywords" content={seo.seoKeywords.join(', ')} />}
    <meta property="og:title" content={seo.openGraph?.title ?? title} />
    <meta property="og:description" content={seo.openGraph?.description ?? description} />
    <meta property="og:url" content={seo.openGraph?.url ?? pageUrl} />
    <meta property="og:type" content="website" />
    {ogImage && <meta property="og:image" content={ogImage} />}
    {seo.openGraph?.siteName && <meta property="og:site_name" content={seo.openGraph.siteName} />}
    <meta name="twitter:card" content={seo.twitter?.cardType ?? 'summary_large_image'} />
    {seo.twitter?.site && <meta name="twitter:site" content={seo.twitter.site} />}
    {(seo.twitter?.creator ?? seo.twitter?.handle) && (
      <meta name="twitter:creator" content={seo.twitter.creator ?? seo.twitter.handle} />
    )}
    {seo.hreflang?.map((h: { locale: string; url: string }) => (
      <link rel="alternate" hreflang={h.locale} href={h.url} />
    ))}
    {jsonLd && <script type="application/ld+json" set:html={jsonLd} />}
  </head>
  <body>
    <main><h1>{page.title}</h1></main>
  </body>
</html>
```

</details>

---

## Vue 3 / Nuxt Integration

Fetch SEO data from Sanity using a custom `useSanityFetch` composable and apply it with Nuxt's built-in `useHead`.

> **Do not use `@nuxtjs/sanity`** — it pulls in React-based Sanity packages that conflict with Vite's module graph and cause a `react-compiler-runtime` 500 error on page hydration. Use `@sanity/client` directly instead.

### Nuxt 3

#### 1. Install dependencies

```bash
npm install @sanity/client
```

#### 2. Configure Nuxt and environment

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      sanityProjectId: process.env.NUXT_PUBLIC_SANITY_PROJECT_ID ?? '',
      sanityDataset: process.env.NUXT_PUBLIC_SANITY_DATASET ?? 'production',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? '',
    },
  },
})
```

```bash
# .env
NUXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NUXT_PUBLIC_SANITY_DATASET=production
NUXT_PUBLIC_SITE_URL=https://your-site.com
```

> **CORS:** If you get a 500 or network error after client-side navigation, add your dev origin to the Sanity project's [CORS settings](https://sanity.io/manage) (e.g. `http://localhost:3000`). Server-side rendering doesn't need it, but browser fetches during SPA navigation do.

#### 3. Create composables (Nuxt auto-imports `composables/`)

**`composables/useSanityFetch.ts`** — wraps `@sanity/client` with `useAsyncData` so SSR-fetched data is reused on the client instead of re-fetched (prevents the hydration-time CORS 500):

```ts
// composables/useSanityFetch.ts
import { createClient } from '@sanity/client'

let _client: ReturnType<typeof createClient> | null = null

function getSanityClient() {
  if (_client) return _client
  const config = useRuntimeConfig()
  _client = createClient({
    projectId: config.public.sanityProjectId,
    dataset: config.public.sanityDataset,
    useCdn: false,
    apiVersion: '2024-01-01',
  })
  return _client
}

export function useSanityFetch<T>(query: string, params?: Record<string, unknown>) {
  const key = query + (params ? JSON.stringify(params) : '')
  return useAsyncData<T>(key, () => getSanityClient().fetch<T>(query, params ?? {}))
}
```

**`composables/useSeo.ts`** — shared SEO types, the full GROQ fragment, and a JSON-LD builder:

```ts
// composables/useSeo.ts
export type SeoField = {
  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string
  nofollowAttributes?: boolean
  robotsMeta?: string[]
  seoKeywords?: string[]
  seoStatus?: string
  seoReviewNotes?: string
  metaImage?: { asset?: { url?: string } }
  openGraph?: { title?: string; description?: string; url?: string; siteName?: string; image?: { asset?: { url?: string } } }
  twitter?: { cardType?: string; site?: string; creator?: string; handle?: string }
  hreflang?: { locale: string; url: string }[]
  schemaOrg?: {
    schemaType?: string; name?: string; description?: string; url?: string; author?: string
    datePublished?: string; dateModified?: string
    faqItems?: { question: string; answer: string }[]
    [key: string]: unknown
  }
}

export const SEO_GROQ = `seo {
  metaTitle, metaDescription, focusKeyword,
  canonicalUrl, nofollowAttributes, robotsMeta, seoKeywords,
  seoStatus, seoReviewNotes,
  metaImage { asset->{ url } },
  openGraph { title, description, url, siteName, image { asset->{ url } } },
  twitter { cardType, site, creator, handle },
  hreflang[] { locale, url },
  schemaOrg {
    schemaType, name, description, url, author,
    datePublished, dateModified,
    price, priceCurrency, availability,
    ratingValue, ratingCount,
    startDate, endDate, location,
    faqItems[] { question, answer }
  }
}`

// Builds JSON-LD — handles FAQPage, generic schemaType, and WebPage fallback
export function buildJsonLd(
  schema: SeoField['schemaOrg'],
  fallbackTitle?: string,
  fallbackDesc?: string,
): string | null {
  if (!schema?.schemaType) {
    return JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: fallbackTitle, description: fallbackDesc })
  }
  if (schema.schemaType === 'FAQPage' && schema.faqItems?.length) {
    return JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: schema.faqItems.map((item) => ({
        '@type': 'Question', name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    })
  }
  const { schemaType, faqItems, ...rest } = schema
  return JSON.stringify({ '@context': 'https://schema.org', '@type': schemaType, ...rest })
}
```

#### 4. Dynamic route — `pages/[slug].vue`

```vue
<!-- pages/[slug].vue -->
<script setup lang="ts">
import { SEO_GROQ, buildJsonLd, type SeoField } from '~/composables/useSeo'

const route = useRoute()
const slug = route.params.slug as string
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl

type Page = { title: string; slug: string; description?: string; seo?: SeoField }

const { data: page } = await useSanityFetch<Page | null>(
  `*[_type == "page" && slug.current == $slug][0]{ title, "slug": slug.current, description, ${SEO_GROQ} }`,
  { slug },
)

if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found' })

const seo = computed(() => page.value?.seo)
const pageUrl = `${siteUrl}/${slug}`
const title = computed(() => seo.value?.metaTitle ?? page.value?.title ?? '')
const description = computed(() => seo.value?.metaDescription ?? page.value?.description ?? '')
const ogImage = computed(() => seo.value?.openGraph?.image?.asset?.url ?? seo.value?.metaImage?.asset?.url)
const jsonLd = computed(() => buildJsonLd(seo.value?.schemaOrg, title.value, description.value))

useHead({
  title: title.value,
  meta: [
    { name: 'description', content: description.value },
    { name: 'robots', content: seo.value?.robotsMeta?.join(', ') ?? 'index,follow' },
    ...(seo.value?.seoKeywords?.length ? [{ name: 'keywords', content: seo.value.seoKeywords.join(', ') }] : []),
    { property: 'og:title', content: seo.value?.openGraph?.title ?? title.value },
    { property: 'og:description', content: seo.value?.openGraph?.description ?? description.value },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: seo.value?.openGraph?.url ?? pageUrl },
    ...(ogImage.value ? [{ property: 'og:image', content: ogImage.value }] : []),
    ...(seo.value?.openGraph?.siteName ? [{ property: 'og:site_name', content: seo.value.openGraph.siteName }] : []),
    { name: 'twitter:card', content: seo.value?.twitter?.cardType ?? 'summary_large_image' },
    ...(seo.value?.twitter?.site ? [{ name: 'twitter:site', content: seo.value.twitter.site }] : []),
    ...(seo.value?.twitter?.creator ?? seo.value?.twitter?.handle
      ? [{ name: 'twitter:creator', content: seo.value?.twitter?.creator ?? seo.value?.twitter?.handle ?? '' }]
      : []),
  ],
  link: [
    { rel: 'canonical', href: seo.value?.canonicalUrl ?? pageUrl },
    ...(seo.value?.hreflang?.map(({ locale, url }) => ({ rel: 'alternate', hreflang: locale, href: url })) ?? []),
  ],
  script: jsonLd.value ? [{ type: 'application/ld+json', innerHTML: jsonLd.value }] : [],
})
</script>

<template>
  <main>
    <h1>{{ page?.title }}</h1>
    <p>{{ page?.description }}</p>
  </main>
</template>
```

---

### Vue 3 standalone (Vite + @unhead/vue)

For Vue 3 apps that don't use Nuxt, install `@unhead/vue` for head management and `@sanity/client` for data fetching.

```bash
npm install @sanity/client @unhead/vue
```

```ts
// src/composables/useSeo.ts — same helpers as the Nuxt version above
import { createClient } from '@sanity/client'
import { useHead } from '@unhead/vue'

const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET ?? 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
})

type SeoField = {
  metaTitle?: string; metaDescription?: string; canonicalUrl?: string
  nofollowAttributes?: boolean; robotsMeta?: string[]; seoKeywords?: string[]
  metaImage?: { asset?: { url?: string } }
  openGraph?: { title?: string; description?: string; url?: string; siteName?: string; image?: { asset?: { url?: string } } }
  twitter?: { cardType?: string; site?: string; creator?: string; handle?: string }
  hreflang?: { locale: string; url: string }[]
  schemaOrg?: { schemaType?: string; faqItems?: { question: string; answer: string }[]; [key: string]: unknown }
}

export async function useSanityPage(slug: string) {
  const page = await client.fetch<{ title: string; seo?: SeoField } | null>(
    `*[_type == "page" && slug.current == $slug][0]{
      title,
      seo {
        metaTitle, metaDescription, canonicalUrl, nofollowAttributes, robotsMeta, seoKeywords,
        metaImage { asset->{ url } },
        openGraph { title, description, url, siteName, image { asset->{ url } } },
        twitter { cardType, site, creator, handle },
        hreflang[] { locale, url },
        schemaOrg { schemaType, name, description, url, faqItems[] { question, answer } }
      }
    }`,
    { slug },
  )

  const seo = page?.seo ?? {}
  const siteUrl = import.meta.env.VITE_SITE_URL ?? ''
  const canonical = seo.canonicalUrl ?? `${siteUrl}/${slug}`
  const ogImage = seo.openGraph?.image?.asset?.url ?? seo.metaImage?.asset?.url

  // JSON-LD — FAQPage, generic schemaType, or null
  let jsonLd: string | null = null
  const schema = seo.schemaOrg
  if (schema?.schemaType === 'FAQPage' && schema.faqItems?.length) {
    jsonLd = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: schema.faqItems.map((i) => ({
        '@type': 'Question', name: i.question,
        acceptedAnswer: { '@type': 'Answer', text: i.answer },
      })),
    })
  } else if (schema?.schemaType) {
    const { schemaType, faqItems, ...rest } = schema
    jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@type': schemaType, ...rest })
  }

  useHead({
    title: seo.metaTitle,
    meta: [
      { name: 'description', content: seo.metaDescription },
      { name: 'robots', content: seo.robotsMeta?.join(', ') ?? 'index,follow' },
      ...(seo.seoKeywords?.length ? [{ name: 'keywords', content: seo.seoKeywords.join(', ') }] : []),
      { property: 'og:title', content: seo.openGraph?.title ?? seo.metaTitle },
      { property: 'og:description', content: seo.openGraph?.description ?? seo.metaDescription },
      { property: 'og:url', content: seo.openGraph?.url ?? canonical },
      ...(seo.openGraph?.siteName ? [{ property: 'og:site_name', content: seo.openGraph.siteName }] : []),
      ...(ogImage ? [{ property: 'og:image', content: ogImage }] : []),
      { name: 'twitter:card', content: seo.twitter?.cardType ?? 'summary_large_image' },
      ...(seo.twitter?.site ? [{ name: 'twitter:site', content: seo.twitter.site }] : []),
      ...(seo.twitter?.creator ?? seo.twitter?.handle
        ? [{ name: 'twitter:creator', content: seo.twitter.creator ?? seo.twitter.handle }]
        : []),
    ],
    link: [
      { rel: 'canonical', href: canonical },
      ...(seo.hreflang?.map(({ locale, url }) => ({ rel: 'alternate', hreflang: locale, href: url })) ?? []),
    ],
    script: jsonLd ? [{ type: 'application/ld+json', innerHTML: jsonLd }] : [],
  })

  return { page }
}
```

```vue
<!-- src/views/PageView.vue -->
<script setup lang="ts">
import { useSanityPage } from '@/composables/useSeo'
const props = defineProps<{ slug: string }>()
const { page } = await useSanityPage(props.slug)
</script>

<template>
  <main>
    <h1>{{ page?.title }}</h1>
  </main>
</template>
```

---

## GROQ Fragment

Copy this GROQ projection into your frontend query to fetch all SEO fields at once.

```ts
// lib/sanity/queries.ts — copy the seo { } block into your query
const pageQuery = groq`*[_type == "page" && slug.current == $slug][0]{
  title,
  seo {
    metaTitle,
    metaDescription,
    focusKeyword,
    seoKeywords,
    canonicalUrl,
    nofollowAttributes,
    robotsMeta,
    metaImage { asset->{ url } },
    openGraph {
      title,
      description,
      url,
      siteName,
      image { asset->{ url } }
    },
    twitter {
      cardType,
      site,
      creator,
      handle
    },
    hreflang[] { locale, url },
    schemaOrg {
      schemaType,
      name,
      description,
      url,
      author,
      datePublished,
      dateModified,
      price,
      priceCurrency,
      availability,
      ratingValue,
      ratingCount,
      startDate,
      endDate,
      location,
      faqItems[] { question, answer }
    },
    seoStatus,
    seoReviewNotes
  }
}`
```

All available fields and their types:

| Field | Type | Notes |
|---|---|---|
| `metaTitle` | `string` | Page title for search engines |
| `metaDescription` | `string` | Page description for search engines |
| `focusKeyword` | `string` | Primary keyword |
| `seoKeywords` | `string[]` | Additional keywords |
| `canonicalUrl` | `string` | Canonical URL |
| `nofollowAttributes` | `boolean` | Legacy noindex toggle |
| `robotsMeta` | `string[]` | e.g. `['noindex', 'nofollow']` |
| `metaImage.asset.url` | `string` | Fallback OG/Twitter image URL |
| `openGraph.title` | `string` | OG title |
| `openGraph.description` | `string` | OG description |
| `openGraph.url` | `string` | OG URL |
| `openGraph.siteName` | `string` | OG site name |
| `openGraph.image.asset.url` | `string` | OG image URL |
| `twitter.cardType` | `string` | e.g. `summary_large_image` |
| `twitter.site` | `string` | Twitter @account |
| `twitter.creator` | `string` | Twitter @author |
| `hreflang[].locale` | `string` | BCP 47 locale code |
| `hreflang[].url` | `string` | Alternate URL for that locale |
| `schemaOrg.schemaType` | `string` | Schema.org type (e.g. `Article`) |
| `schemaOrg.*` | various | Type-specific fields |
| `seoStatus` | `string` | `draft` \| `review` \| `approved` |
| `seoReviewNotes` | `string` | Reviewer notes |

---

## Free Features

### Readability Score

The plugin calculates a **Flesch-Kincaid Grade Level** score for your content and displays it with color-coded feedback.

The Flesch-Kincaid formula scores how easy your text is to read based on two things: average sentence length and average number of syllables per word. The result maps to a U.S. school grade level:

| Grade | Meaning | Target audience |
|---|---|---|
| 1–6 | Very easy | General public, children |
| 7–8 | Easy | Most online readers (ideal for blog posts and landing pages) |
| 9–12 | Average | High school level — acceptable for technical content |
| 13+ | Difficult | Academic or specialist audiences |

**Why it matters for SEO:** Google favors content that matches how real people read. Most web visitors read at a Grade 6–8 level. Shorter sentences and simpler words improve dwell time, reduce bounce rate, and increase the chance your content is featured in AI Overviews and featured snippets.

The plugin shows the grade score as a color indicator directly beneath the content field — green (Grade ≤ 8), amber (Grade 9–12), red (Grade 13+) — so writers can adjust tone without leaving the Studio.

---

## Pro Features — Coming Soon

> Pro features are coming soon. Watch the [npm package](https://www.npmjs.com/package/sanity-plugin-seo) or star the repository to get notified when they launch.

### SERP Preview

Shows a live Google search result mockup in both **desktop** and **mobile** view — toggled with a tab switcher. Title and description are pixel-width-truncated to match how Google actually cuts them off, so you see exactly what searchers will see before you publish.

### Schema.org Wizard

A guided form for 30 structured data types, all eligible for Google Rich Results:

Article / Blog Post, Product, FAQ Page, Local Business, Event, Organization, Web Page, Video, Recipe, Person / Author, Course, Job Posting, Breadcrumb, Blog Post, News Article, How-To Guide, Review, Software / App, Book, Movie / Film, Service, Professional Service, Medical Condition, Dataset, Podcast, Podcast Episode, Tourist Attraction, Accommodation / Hotel, Sports Team, Collection Page, About Page

Each type shows only the fields relevant to it. The output is a live **JSON-LD preview** — the exact `<script type="application/ld+json">` block that will render on your page — updated in real time as you type.

### Advanced Validation

Runs 7 checks on the current document and surfaces one-click fix buttons for the issues that can be auto-resolved:

| Check | Auto-fixable |
|---|:---:|
| Unique meta title (cross-document GROQ query) | — |
| No noindex + canonical conflict | — |
| Open Graph image present | — |
| Open Graph title set | ✅ Copy from meta title |
| Canonical URL set | ✅ Auto-fill from slug |
| Focus keyword in meta title | — |
| Meta description length (100–160 chars) | — |

A progress bar tracks how many checks pass. An issue count badge (e.g. "3 issues") turns green when all checks clear. A **"Fix all"** button applies every auto-fixable patch in one click — each fix shows a 2.5-second "Fixed!" confirmation inline.

### Team Workflow

Visual pipeline with three statuses: **Draft → Needs SEO Review → SEO Approved**

- Clickable step indicators — click any status to jump directly to it
- Quick-action buttons that change based on current status:
  - **Request Review** — moves Draft → Needs SEO Review
  - **Mark Approved** — moves any status → SEO Approved
  - **Reset to Draft** — moves Approved → Draft
- **Review Notes** field — a text area for leaving feedback or instructions for content editors
- `seoStatus` and `seoReviewNotes` are stored on the document and queryable via GROQ

### SEO Health Dashboard

A top-level Studio tool showing site-wide SEO scores across all documents at a glance.

- **Stat cards**: average score, poor / needs work / good page counts, duplicate title count, pages missing Open Graph
- **Score filter**: view all pages or filter by Poor (< 50), Needs Work (50–79), or Good (≥ 80)
- **Issue filter**: dropdown listing every distinct issue type found — filter to show only pages with a specific problem (e.g. "Missing description")
- Paginated document list with score bar, type badge, issue tags, and last-updated date
- Click any row to open that document directly in the Studio editor

### SEO Optimizer (Bulk Edit)

Scans all documents for SEO issues and presents them as a fix queue. Stat cards show average score, total issues, missing keywords, and missing OG images across the entire site.

**Per-document inline editing** — expand any row to edit all SEO fields (meta title, description, canonical URL, focus keyword, OG title, OG description) without leaving the Optimizer. Character counters flag title and description lengths in real time. Each collapsed row shows an issue count badge so you can prioritise at a glance.

**Type filter** — a dropdown filters the table by document type so you can select-all and bulk-apply to one content type (e.g. all `post` documents) without touching others.

**Bulk actions** — select one or more documents and apply changes across all of them in one click:

| Action | What it does |
|---|---|
| **Canonical URLs** | Generates `{base-url}/{slug}` for every selected page — you set the base URL once |
| **Sync Open Graph** | Copies each page's own meta title and description into its OG fields — pages missing a meta title show a warning before you apply |
| **Import CSV** | Upload a CSV exported from the Optimizer; matched rows are previewed before applying |

After every bulk operation a **result log appears inline** inside the panel — no scrolling needed. Each page shows whether it was updated or skipped and why. The table re-scans automatically after applying.

**Export CSV** — downloads the current table as a spreadsheet pre-filled with all current SEO values. Edit in Excel or Google Sheets and re-import via the CSV tab.

### AI Bulk SEO Generation — Coming Soon

Generate optimised meta titles and descriptions for every page in one operation — powered by your configured AI provider (OpenAI, Anthropic, or Groq). Select pages in the SEO Optimizer, choose a target field, and the AI writes unique, keyword-aware copy for each document individually.

---

## Pro License Setup — Coming Soon

> **Pro is not yet available.** It is coming soon — star the repository or watch the [npm package](https://www.npmjs.com/package/sanity-plugin-seo) to be notified on launch.

When Pro launches, setup will be:

1. Purchase a Pro license (link will be shared on launch)
2. You will receive a license key by email
3. Add the key to your environment file:

```bash
# .env.local  (for Next.js)
# .env        (for Astro, Vue, or Nuxt)
SANITY_STUDIO_SEO_LICENSE=your-license-key-here
```

4. Pass it to the plugin config:

```ts
seoMetaFields({
  proFeature: process.env.SANITY_STUDIO_SEO_LICENSE,
})
```

The license will be validated silently on Studio load. Pro features unlock automatically once the key is verified. The validated state is cached in the browser so it does not re-validate on every page load.

> **Note:** Environment variables exposed to Sanity Studio must be prefixed with `SANITY_STUDIO_` to be available in the browser bundle.

---

## AI Setup

The plugin supports **OpenAI**, **Anthropic**, and **Groq** for AI-powered keyword suggestions, meta title generation, and meta description generation.

### OpenAI

```ts
seoMetaFields({
  aiFeature: {
    provider: 'openai',
    apiKey: process.env.SANITY_STUDIO_OPENAI_KEY!,
    model: 'gpt-4o-mini', // optional — defaults to gpt-4o-mini
  },
  bodyField: 'body',
})
```

Recommended models: `gpt-4o-mini` (fast, cheap), `gpt-4o` (higher quality)

### Anthropic

```ts
seoMetaFields({
  aiFeature: {
    provider: 'anthropic',
    apiKey: process.env.SANITY_STUDIO_ANTHROPIC_KEY!,
    model: 'claude-haiku-4-5-20251001', // optional
  },
  bodyField: 'body',
})
```

Recommended models: `claude-haiku-4-5-20251001` (fast), `claude-sonnet-4-6` (higher quality)

### Groq (free tier available)

```ts
seoMetaFields({
  aiFeature: {
    provider: 'groq',
    apiKey: process.env.SANITY_STUDIO_GROQ_KEY!,
    model: 'llama-3.3-70b-versatile', // optional
  },
  bodyField: 'body',
})
```

Groq offers a free API tier at [console.groq.com](https://console.groq.com). Recommended models: `llama-3.3-70b-versatile`, `mixtral-8x7b-32768`

> **Note:** AI API keys are exposed to the browser via Sanity Studio. Use a restricted key scoped only to the AI provider API and prefix the env variable with `SANITY_STUDIO_` to ensure it is included in the Studio bundle.

---

## Upgrading from Earlier Versions

This release is fully backward-compatible. All existing `seoMetaFields` schema fields continue to work with no migration needed.

### Config key changes (v1.3 → v1.4)

The plugin config keys were renamed to make their purpose explicit:

| Old key | New key |
|---|---|
| `license` | `proFeature` |
| `ai` | `aiFeature` |

```ts
// Before (v1.3 and earlier)
seoMetaFields({
  license: process.env.SANITY_STUDIO_SEO_LICENSE_KEY,
  ai: { provider: 'openai', apiKey: '...' },
})

// After (v1.4+)
seoMetaFields({
  proFeature: process.env.SANITY_STUDIO_SEO_LICENSE,
  aiFeature: { provider: 'openai', apiKey: '...' },
})
```

### New fields added in v1.4

The following fields were added to the `seoMetaFields` schema type. They are stored alongside existing fields and are fully backward-compatible:

| Field | Group | Description |
|---|---|---|
| `focusKeyword` | Basic SEO | Primary keyword for rank tracking |
| `robotsMeta` | Advanced | Checkbox grid (noindex, nofollow, noarchive, nosnippet…) |
| `canonicalUrl` | Advanced | Validated canonical URL |
| `hreflang` | Advanced | Array of locale + URL pairs |
| `additionalMetaTags` | Advanced | Freeform name/content meta tag pairs |
| `schemaOrg` | Schema.org | Schema.org wizard (30+ types) |
| `seoStatus` | Workflow | Draft / Needs Review / Approved |
| `seoReviewNotes` | Workflow | Reviewer notes textarea |

### Zero-argument call still works

```ts
// Still works with no configuration
seoMetaFields()
```

---

## TypeScript Types

Copy the `SeoData` interface below into your frontend project — it describes the shape of the `seo` object returned by your GROQ query.

`SeoData` — full shape of a fetched `seo` object:

```ts
interface SeoData {
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  seoKeywords?: string[]
  canonicalUrl?: string
  nofollowAttributes?: boolean
  robotsMeta?: string[]
  metaImage?: { asset: { url: string } }
  openGraph?: {
    title?: string
    description?: string
    url?: string
    siteName?: string
    image?: { asset: { url: string } }
  }
  twitter?: {
    cardType?: string
    site?: string
    creator?: string
    handle?: string
  }
  hreflang?: { locale: string; url: string }[]
  schemaOrg?: {
    schemaType?: string
    name?: string
    description?: string
    url?: string
    author?: string
    datePublished?: string
    dateModified?: string
    price?: string
    priceCurrency?: string
    availability?: string
    ratingValue?: string
    ratingCount?: string
    startDate?: string
    endDate?: string
    location?: string
    faqItems?: { question: string; answer: string }[]
  }
  seoStatus?: 'draft' | 'review' | 'approved'
  seoReviewNotes?: string
}
```

---

## Demo

| | Link |
|---|---|
| Frontend (Pages Router) | [sanity-nextjs-seo-boilerplate.vercel.app](https://sanity-nextjs-seo-boilerplate.vercel.app/) |
| Frontend (App Router) | [sanity-nextjs-with-app-router-seo-boilerplate.vercel.app](https://sanity-nextjs-with-app-router-seo-boilerplate.vercel.app/) |
| Sanity Studio | [sanity-nextjs-seo-boilerplate.vercel.app/studio](https://sanity-nextjs-seo-boilerplate.vercel.app/studio/) |

---

## Author

Built by [Bhargav Patel](https://bkpatel.com/)

## License

MIT — free tier features are fully open source. Pro features are coming soon — watch the repository for launch announcements.
