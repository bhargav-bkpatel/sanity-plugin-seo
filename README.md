![Sanity Plugin SEO](https://github.com/bhargav-bkpatel/sanity-plugin-seo/blob/main/public/assets/background.png)

## ⚡ Sanity Plugin SEO

[![npm version](https://img.shields.io/badge/npm-v1.4.0-blue)](https://www.npmjs.com/package/sanity-plugin-seo)
[![npm downloads](https://img.shields.io/badge/downloads-22k-brightgreen)](https://www.npmjs.com/package/sanity-plugin-seo)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://www.typescriptlang.org/)
[![Built with Sanity](https://img.shields.io/badge/Built%20With-Sanity-8a2be2?logo=sanity&logoColor=white)](https://www.sanity.io/)
[![Sanity V3](https://img.shields.io/badge/Sanity%20V3%20Plugin-4e5452)](https://www.sanity.io/)
[![Sanity V4](https://img.shields.io/badge/Sanity%20V4%20Plugin-4e5452)](https://www.sanity.io/)
[![Sanity V5](https://img.shields.io/badge/Sanity%20V5%20Plugin-4e5452)](https://www.sanity.io/)

SEO plugin for Sanity Studio. Adds a live SEO score, GEO checklist, AI suggestions, social previews, Schema.org wizard, and ready-to-use integration code for Next.js, Astro, and Vue/Nuxt.

**Free** and **AI** tiers are live. **Pro is coming soon.**

![Demo](https://github.com/bhargav-bkpatel/sanity-plugin-seo/blob/main/public/assets/demo-1.gif)

---

## What's included

| Feature | Free | AI | 🔜 Pro |
|---|:---:|:---:|:---:|
| Live SEO Score (0–100) | ✅ | ✅ | — |
| GEO Checklist (AI Overview readiness) | ✅ | ✅ | — |
| Meta Tags Preview + HTML snippet | ✅ | ✅ | — |
| Social Preview Cards (X, Facebook, LinkedIn, WhatsApp) | ✅ | ✅ | — |
| Focus Keyword tracking | ✅ | ✅ | — |
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
| Bulk Open Graph sync | — | — | 🔜 |
| Advanced Validation (5 checks + auto-fix) | — | — | 🔜 |
| Team Workflow (Draft → Review → Approved) | — | — | 🔜 |
| Workflow Dashboard (site-wide status tracking) | — | — | 🔜 |
| Duplicate meta title detection | — | — | 🔜 |
| AI Bulk SEO Generation | — | — | 🔜 |

---

## Table of Contents

- [Installation](#installation)
- [Studio Setup](#studio-setup)
- [Add SEO to a Document](#add-seo-to-a-document)
- [Config Options](#config-options)
- [Next.js Integration](#nextjs-integration)
- [Astro Integration](#astro-integration)
- [Vue 3 / Nuxt Integration](#vue-3--nuxt-integration)
- [GROQ Fragment](#groq-fragment)
- [Pro Features — Coming Soon](#pro-features--coming-soon)
- [Pro License Setup — Coming Soon](#pro-license-setup--coming-soon)
- [AI Setup](#ai-setup)
- [Upgrading from v1.3](#upgrading-from-v13)

---

## Installation

```bash
npm install sanity-plugin-seo
# or
yarn add sanity-plugin-seo
# or
pnpm add sanity-plugin-seo
```

Works with Sanity Studio v3, v4, and v5.

---

## Studio Setup

### Free features only

```ts
// sanity.config.ts
import { defineConfig } from 'sanity'
import { seoMetaFields } from 'sanity-plugin-seo'

export default defineConfig({
  plugins: [seoMetaFields()],
})
```

### With AI (OpenAI, Anthropic, or Groq)

```ts
import { seoMetaFields } from 'sanity-plugin-seo'

seoMetaFields({
  aiFeature: {
    provider: 'openai',                         // 'openai' | 'anthropic' | 'groq'
    apiKey: process.env.SANITY_STUDIO_OPENAI_KEY!,
    model: 'gpt-4o-mini',                       // optional
  },
  bodyField: 'body',
  slugField: 'slug',
})
```

### With Pro license (Coming Soon)

```ts
seoMetaFields({
  proFeature: process.env.SANITY_STUDIO_SEO_LICENSE, // reserved — Pro not yet available
  bodyField: 'body',
  slugField: 'slug',
})
```

### Full config

```ts
seoMetaFields({
  aiFeature: {
    provider: 'openai',
    apiKey: process.env.SANITY_STUDIO_OPENAI_KEY!,
    model: 'gpt-4o-mini',
  },
  bodyField: 'body',
  slugField: 'slug',
  dashboard: true, // default: true — shows SEO Health + Optimizer in the toolbar
})
```

---

## Add SEO to a Document

Add `seoMetaFields` as a field type in any document schema:

```ts
// schemas/page.ts
export default {
  name: 'page',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'body', type: 'array', of: [{ type: 'block' }] },
    { name: 'seo', type: 'seoMetaFields' },
  ],
}
```

This adds a tabbed SEO panel with **Basic SEO**, **Social Sharing**, **Advanced**, and **Schema.org** tabs.

---

## Config Options

| Option | Type | Default | Description |
|---|---|---|---|
| `proFeature` | `string` | — | Pro license key — coming soon |
| `aiFeature` | `AIConfig` | — | AI provider config |
| `aiFeature.provider` | `'openai' \| 'anthropic' \| 'groq'` | — | Which AI provider to use |
| `aiFeature.apiKey` | `string` | — | API key for the provider |
| `aiFeature.model` | `string` | provider default | e.g. `gpt-4o-mini`, `claude-haiku-4-5-20251001` |
| `bodyField` | `string` | `'body'` | Portable Text field name for AI analysis |
| `slugField` | `string` | `'slug'` | Slug field name |
| `dashboard` | `boolean` | `true` | Show SEO Health and Optimizer in Studio toolbar |

---

## Next.js Integration

### 1. Sanity client + GROQ fragment

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

export const SEO_GROQ = `seo {
  metaTitle, metaDescription, focusKeyword,
  nofollowAttributes, robotsMeta, seoKeywords,
  seoStatus, seoReviewNotes,
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
  }
}`
```

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://your-site.com
```

### 2. SEO helpers

```ts
// app/_seo.ts
import type { Metadata } from 'next'

export type SeoField = {
  metaTitle?: string
  metaDescription?: string
  nofollowAttributes?: boolean
  robotsMeta?: string[]
  seoKeywords?: string[]
  seoStatus?: 'draft' | 'review' | 'approved'
  seoReviewNotes?: string
  metaImage?: { asset?: { url?: string } }
  openGraph?: { title?: string; description?: string; siteName?: string; image?: { asset?: { url?: string } } }
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
  const canonical = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/${slug}`
  const ogImage = s.openGraph?.image?.asset?.url ?? s.metaImage?.asset?.url
  const robots: string[] = []
  if (s.nofollowAttributes) robots.push('noindex', 'nofollow')
  s.robotsMeta?.forEach((r) => { if (!robots.includes(r)) robots.push(r) })
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
      url: canonical,
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

### 3. App Router

> Next.js 15: `params` is a Promise — `await` it first.

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
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: buildJsonLd(page.seo, page.title) }} />
      <main><h1>{page.title}</h1></main>
    </>
  )
}
```

### Pages Router

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
  const canonical = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/${page.slug}`
  const ogImage = seo.openGraph?.image?.asset?.url ?? seo.metaImage?.asset?.url

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
        noindex={!!(seo.nofollowAttributes || seo.robotsMeta?.includes('noindex'))}
        nofollow={!!(seo.nofollowAttributes || seo.robotsMeta?.includes('nofollow'))}
        additionalMetaTags={seo.seoKeywords?.length ? [{ name: 'keywords', content: seo.seoKeywords.join(', ') }] : []}
        additionalLinkTags={seo.hreflang?.map(({ locale, url }) => ({ rel: 'alternate', hrefLang: locale, href: url })) ?? []}
        openGraph={{
          title: seo.openGraph?.title ?? seo.metaTitle,
          description: seo.openGraph?.description ?? seo.metaDescription,
          url: canonical,
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

### 1. Install + configure

```bash
npm install @sanity/client astro-seo
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
export default defineConfig({ output: 'server' })
```

```bash
# .env
PUBLIC_SANITY_PROJECT_ID=your-project-id
PUBLIC_SANITY_DATASET=production
PUBLIC_SITE_URL=https://your-site.com
```

### 2. Sanity client

```ts
// src/lib/sanity.ts
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
})

export const SEO_GROQ = `seo {
  metaTitle, metaDescription, focusKeyword,
  nofollowAttributes, robotsMeta, seoKeywords,
  seoStatus, seoReviewNotes,
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
  }
}`

export type SeoField = {
  metaTitle?: string; metaDescription?: string
  nofollowAttributes?: boolean; robotsMeta?: string[]; seoKeywords?: string[]
  seoStatus?: string; seoReviewNotes?: string
  metaImage?: { asset?: { url?: string } }
  openGraph?: { title?: string; description?: string; siteName?: string; image?: { asset?: { url?: string } } }
  twitter?: { cardType?: string; site?: string; creator?: string; handle?: string }
  hreflang?: { locale: string; url: string }[]
  schemaOrg?: { schemaType?: string; faqItems?: { question: string; answer: string }[]; [key: string]: unknown }
}

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

### 3. Page route

```astro
---
// src/pages/[slug].astro
import { SEO } from 'astro-seo'
import { client, SEO_GROQ, buildJsonLd } from '../lib/sanity'

export const prerender = false

const { slug } = Astro.params
const page = await client.fetch(
  `*[_type == "page" && slug.current == $slug][0]{ title, description, ${SEO_GROQ} }`,
  { slug },
)
if (!page) return Astro.redirect('/404')

const seo = page.seo ?? {}
const pageUrl = `${import.meta.env.PUBLIC_SITE_URL ?? ''}/${slug}`
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
      canonical={pageUrl}
      noindex={seo.robotsMeta?.includes('noindex') ?? false}
      nofollow={seo.nofollowAttributes ?? false}
      openGraph={{
        basic: { title: seo.openGraph?.title ?? title, type: 'website', image: ogImage ?? '', url: pageUrl },
        optional: { description: seo.openGraph?.description ?? description, siteName: seo.openGraph?.siteName },
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
        link: seo.hreflang?.map((h: { locale: string; url: string }) => ({ rel: 'alternate', hreflang: h.locale, href: h.url })) ?? [],
      }}
    />
    {jsonLd && <script type="application/ld+json" set:html={jsonLd} />}
  </head>
  <body>
    <main><h1>{page.title}</h1></main>
  </body>
</html>
```

<details>
<summary>Without astro-seo (native head tags)</summary>

```astro
---
import { client, SEO_GROQ, buildJsonLd } from '../lib/sanity'
export const prerender = false

const { slug } = Astro.params
const page = await client.fetch(
  `*[_type == "page" && slug.current == $slug][0]{ title, description, ${SEO_GROQ} }`,
  { slug },
)
if (!page) return Astro.redirect('/404')

const seo = page.seo ?? {}
const pageUrl = `${import.meta.env.PUBLIC_SITE_URL ?? ''}/${slug}`
const title = seo.metaTitle ?? page.title
const description = seo.metaDescription ?? page.description ?? ''
const ogImage = seo.openGraph?.image?.asset?.url ?? seo.metaImage?.asset?.url
const jsonLd = buildJsonLd(seo.schemaOrg, title, description)
---

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={pageUrl} />
    <meta name="robots" content={seo.robotsMeta?.join(', ') ?? 'index,follow'} />
    {seo.seoKeywords?.length && <meta name="keywords" content={seo.seoKeywords.join(', ')} />}
    <meta property="og:title" content={seo.openGraph?.title ?? title} />
    <meta property="og:description" content={seo.openGraph?.description ?? description} />
    <meta property="og:url" content={pageUrl} />
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

> Don't use `@nuxtjs/sanity` — it pulls in React packages and breaks hydration. Use `@sanity/client` directly.

### Nuxt 3

```bash
npm install @sanity/client
```

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

> If you get CORS errors after client-side navigation, add `http://localhost:3000` to your project's CORS settings at [sanity.io/manage](https://sanity.io/manage).

**`composables/useSanityFetch.ts`**

```ts
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

**`composables/useSeo.ts`**

```ts
export type SeoField = {
  metaTitle?: string
  metaDescription?: string
  nofollowAttributes?: boolean
  robotsMeta?: string[]
  seoKeywords?: string[]
  seoStatus?: string
  seoReviewNotes?: string
  metaImage?: { asset?: { url?: string } }
  openGraph?: { title?: string; description?: string; siteName?: string; image?: { asset?: { url?: string } } }
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
  nofollowAttributes, robotsMeta, seoKeywords,
  seoStatus, seoReviewNotes,
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
  }
}`

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

**`pages/[slug].vue`**

```vue
<script setup lang="ts">
import { SEO_GROQ, buildJsonLd, type SeoField } from '~/composables/useSeo'

const route = useRoute()
const slug = route.params.slug as string
const siteUrl = useRuntimeConfig().public.siteUrl

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
    { property: 'og:url', content: pageUrl },
    ...(ogImage.value ? [{ property: 'og:image', content: ogImage.value }] : []),
    ...(seo.value?.openGraph?.siteName ? [{ property: 'og:site_name', content: seo.value.openGraph.siteName }] : []),
    { name: 'twitter:card', content: seo.value?.twitter?.cardType ?? 'summary_large_image' },
    ...(seo.value?.twitter?.site ? [{ name: 'twitter:site', content: seo.value.twitter.site }] : []),
    ...(seo.value?.twitter?.creator ?? seo.value?.twitter?.handle
      ? [{ name: 'twitter:creator', content: seo.value?.twitter?.creator ?? seo.value?.twitter?.handle ?? '' }]
      : []),
  ],
  link: [
    { rel: 'canonical', href: pageUrl },
    ...(seo.value?.hreflang?.map(({ locale, url }) => ({ rel: 'alternate', hreflang: locale, href: url })) ?? []),
  ],
  script: jsonLd.value ? [{ type: 'application/ld+json', innerHTML: jsonLd.value }] : [],
})
</script>

<template>
  <main>
    <h1>{{ page?.title }}</h1>
  </main>
</template>
```

### Vue 3 standalone (Vite + @unhead/vue)

```bash
npm install @sanity/client @unhead/vue
```

```ts
// src/composables/useSeo.ts
import { createClient } from '@sanity/client'
import { useHead } from '@unhead/vue'

const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET ?? 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
})

type SeoField = {
  metaTitle?: string; metaDescription?: string
  nofollowAttributes?: boolean; robotsMeta?: string[]; seoKeywords?: string[]
  metaImage?: { asset?: { url?: string } }
  openGraph?: { title?: string; description?: string; siteName?: string; image?: { asset?: { url?: string } } }
  twitter?: { cardType?: string; site?: string; creator?: string; handle?: string }
  hreflang?: { locale: string; url: string }[]
  schemaOrg?: { schemaType?: string; faqItems?: { question: string; answer: string }[]; [key: string]: unknown }
}

export async function useSanityPage(slug: string) {
  const page = await client.fetch<{ title: string; seo?: SeoField } | null>(
    `*[_type == "page" && slug.current == $slug][0]{
      title,
      seo {
        metaTitle, metaDescription, nofollowAttributes, robotsMeta, seoKeywords,
        metaImage { asset->{ url } },
        openGraph { title, description, siteName, image { asset->{ url } } },
        twitter { cardType, site, creator, handle },
        hreflang[] { locale, url },
        schemaOrg { schemaType, name, description, url, faqItems[] { question, answer } }
      }
    }`,
    { slug },
  )

  const seo = page?.seo ?? {}
  const canonical = `${import.meta.env.VITE_SITE_URL ?? ''}/${slug}`
  const ogImage = seo.openGraph?.image?.asset?.url ?? seo.metaImage?.asset?.url

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
      { property: 'og:url', content: canonical },
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

---

## GROQ Fragment

```ts
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
}`
```

| Field | Type | Notes |
|---|---|---|
| `metaTitle` | `string` | Page title for search engines |
| `metaDescription` | `string` | Page description |
| `focusKeyword` | `string` | Primary keyword |
| `seoKeywords` | `string[]` | Additional keywords |
| `nofollowAttributes` | `boolean` | Noindex toggle |
| `robotsMeta` | `string[]` | e.g. `['noindex', 'nofollow']` |
| `metaImage.asset.url` | `string` | Fallback OG/Twitter image |
| `openGraph.title` | `string` | OG title |
| `openGraph.description` | `string` | OG description |
| `openGraph.siteName` | `string` | OG site name |
| `openGraph.image.asset.url` | `string` | OG image |
| `twitter.cardType` | `string` | e.g. `summary_large_image` |
| `twitter.site` | `string` | Twitter @account |
| `twitter.creator` | `string` | Twitter @author |
| `hreflang[].locale` | `string` | BCP 47 locale code |
| `hreflang[].url` | `string` | Alternate URL for that locale |
| `schemaOrg.schemaType` | `string` | Schema.org type |
| `seoStatus` | `string` | `draft` \| `review` \| `approved` |
| `seoReviewNotes` | `string` | Reviewer notes |

---

## Free Features

### Readability Score

Calculates a Flesch-Kincaid Grade Level for your content and shows it with color-coded feedback directly beneath the body field.

| Grade | Meaning |
|---|---|
| 1–6 | Very easy — general public |
| 7–8 | Easy — ideal for most blog posts |
| 9–12 | Average — acceptable for technical content |
| 13+ | Difficult — academic/specialist |

Green = Grade ≤ 8, Amber = 9–12, Red = 13+.

---

## Pro Features — Coming Soon

> Not launched yet. Star the repo or watch the [npm package](https://www.npmjs.com/package/sanity-plugin-seo) to get notified.

### SERP Preview

Desktop and mobile Google search mockup with pixel-accurate title/description truncation.

### Schema.org Wizard

Guided form for 30 structured data types. Fills out only the fields relevant to the selected type and shows a live JSON-LD preview as you type.

Supported types: Article, Blog Post, Product, FAQ Page, Local Business, Event, Organization, Web Page, Video, Recipe, Person, Course, Job Posting, Breadcrumb, News Article, How-To Guide, Review, Software/App, Book, Movie, Service, Professional Service, Medical Condition, Dataset, Podcast, Podcast Episode, Tourist Attraction, Accommodation, Sports Team, Collection Page, About Page.

### Advanced Validation

5 checks with one-click fixes where possible:

| Check | Auto-fixable |
|---|:---:|
| Unique meta title (GROQ query) | — |
| Open Graph image present | — |
| Open Graph title set | ✅ Copy from meta title |
| Focus keyword in meta title | — |
| Meta description length (100–160 chars) | — |

Progress bar + "Fix all" button. Each auto-fix shows a 2.5-second inline confirmation.

### Team Workflow

Three-status pipeline: **Draft → Needs SEO Review → SEO Approved**

- Click any step to jump to it
- Quick-action buttons (Request Review / Mark Approved / Reset to Draft)
- Review Notes field for feedback between team members
- `seoStatus` and `seoReviewNotes` stored on the document, queryable via GROQ

### SEO Health Dashboard

Site-wide score overview for all documents.

- Stat cards with average score, issue counts, pages missing OG
- Filter by score range (Poor / Needs Work / Good) or issue type
- Paginated list with score bar, type badge, and last-updated date
- Click any row to open the document

### SEO Optimizer

Fix queue for all documents with SEO issues.

- Inline editing — expand a row to edit meta title, description, focus keyword, OG title, OG description
- Type filter dropdown
- **Sync Open Graph** bulk action — copies meta title/description to OG fields for selected pages
- **Import/Export CSV** — edit in a spreadsheet and re-import
- Inline result log after every bulk operation

### Workflow Dashboard

Top-level tool that shows every document's review status in one place.

- Stat cards (All / Draft / Needs Review / Approved) — click to filter
- Inline status actions per row — no need to open the document
- Expand a row to see SEO issues and add review notes
- Direct link to open any document in the editor

### AI Bulk SEO Generation — Coming Soon

Generate meta titles and descriptions for every page using your configured AI provider. Pick a target field in the SEO Optimizer, select pages, and let it run.

---

## Pro License Setup — Coming Soon

> Not available yet. Watch the [npm package](https://www.npmjs.com/package/sanity-plugin-seo) for launch.

When it launches:

1. Purchase a license (link shared on launch)
2. Add the key to your env file:

```bash
SANITY_STUDIO_SEO_LICENSE=your-license-key-here
```

3. Pass it to the plugin:

```ts
seoMetaFields({
  proFeature: process.env.SANITY_STUDIO_SEO_LICENSE,
})
```

> Sanity Studio env vars must be prefixed with `SANITY_STUDIO_` to be included in the browser bundle.

---

## AI Setup

### OpenAI

```ts
seoMetaFields({
  aiFeature: {
    provider: 'openai',
    apiKey: process.env.SANITY_STUDIO_OPENAI_KEY!,
    model: 'gpt-4o-mini',
  },
  bodyField: 'body',
})
```

Recommended: `gpt-4o-mini` (fast), `gpt-4o` (better quality)

### Anthropic

```ts
seoMetaFields({
  aiFeature: {
    provider: 'anthropic',
    apiKey: process.env.SANITY_STUDIO_ANTHROPIC_KEY!,
    model: 'claude-haiku-4-5-20251001',
  },
  bodyField: 'body',
})
```

Recommended: `claude-haiku-4-5-20251001` (fast), `claude-sonnet-4-6` (better quality)

### Groq (free tier)

```ts
seoMetaFields({
  aiFeature: {
    provider: 'groq',
    apiKey: process.env.SANITY_STUDIO_GROQ_KEY!,
    model: 'llama-3.3-70b-versatile',
  },
  bodyField: 'body',
})
```

Free API at [console.groq.com](https://console.groq.com). Recommended: `llama-3.3-70b-versatile`, `mixtral-8x7b-32768`.

> API keys go through the browser bundle. Use restricted keys and prefix with `SANITY_STUDIO_`.

---

## Upgrading from v1.3

No schema migration needed. Existing fields all still work.

### Config key renames

| Old (v1.3) | New (v1.4) |
|---|---|
| `license` | `proFeature` |
| `ai` | `aiFeature` |

```ts
// Before
seoMetaFields({ license: '...', ai: { provider: 'openai', apiKey: '...' } })

// After
seoMetaFields({ proFeature: '...', aiFeature: { provider: 'openai', apiKey: '...' } })
```

### New fields in v1.4

| Field | Description |
|---|---|
| `focusKeyword` | Primary keyword for rank tracking |
| `robotsMeta` | noindex, nofollow, noarchive, nosnippet checkboxes |
| `hreflang` | Locale + URL pairs |
| `additionalMetaTags` | Freeform name/content meta tags |
| `schemaOrg` | Schema.org wizard |
| `seoStatus` | Draft / Needs Review / Approved |
| `seoReviewNotes` | Reviewer notes |

---

## TypeScript Types

```ts
interface SeoData {
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  seoKeywords?: string[]
  nofollowAttributes?: boolean
  robotsMeta?: string[]
  metaImage?: { asset: { url: string } }
  openGraph?: {
    title?: string
    description?: string
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

MIT — free features are open source. Pro is coming soon.
