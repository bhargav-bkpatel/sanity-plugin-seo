![Sanity Plugin SEO](https://github.com/bhargav-bkpatel/sanity-plugin-seo/blob/main/public/assets/background.png)

## ⚡ Sanity Plugin SEO

[![npm version](https://img.shields.io/badge/npm-v1.4.0-blue)](https://www.npmjs.com/package/sanity-plugin-seo)
[![npm downloads](https://img.shields.io/badge/downloads-22k-brightgreen)](https://www.npmjs.com/package/sanity-plugin-seo)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://www.typescriptlang.org/)
[![Built with Sanity](https://img.shields.io/badge/Built%20With-Sanity-8a2be2?logo=sanity&logoColor=white)](https://www.sanity.io/)
[![Sanity V3](https://img.shields.io/badge/Sanity%20V3%20Plugin-4e5452)](https://www.sanity.io/)
[![Sanity V4](https://img.shields.io/badge/Sanity%20V4%20Plugin-4e5452)](https://www.sanity.io/)
[![Sanity V5](https://img.shields.io/badge/Sanity%20V5%20Plugin-4e5452)](https://www.sanity.io/)

The most complete SEO plugin for Sanity Studio — live SEO score, GEO checklist, AI-powered suggestions, SERP preview, Schema.org wizard (30+ types), social previews, advanced validation, team workflow, and integration guides for **Next.js**, **Astro**, and **Vue / Nuxt**. Free core features, optional Pro unlock.

![Demo](https://github.com/bhargav-bkpatel/sanity-plugin-seo/blob/main/public/assets/demo-1.gif)

---

## Feature Comparison

| Feature | Free | Pro | AI |
|---|:---:|:---:|:---:|
| Live SEO Score (0–100) | ✅ | ✅ | ✅ |
| GEO Checklist (AI Overview readiness) | ✅ | ✅ | ✅ |
| Meta Tags Preview + HTML snippet | ✅ | ✅ | ✅ |
| Social Preview Cards (X, Facebook, LinkedIn, WhatsApp) | ✅ | ✅ | ✅ |
| Focus Keyword tracking | ✅ | ✅ | ✅ |
| Canonical URL field | ✅ | ✅ | ✅ |
| Robots Meta (noindex, nofollow, noarchive…) | ✅ | ✅ | ✅ |
| hreflang / multi-language targeting | ✅ | ✅ | ✅ |
| Open Graph & Twitter/X card fields | ✅ | ✅ | ✅ |
| Additional meta tags | ✅ | ✅ | ✅ |
| Frontend integration guides (Next.js, Astro, Vue) | ✅ | ✅ | ✅ |
| Readability score | ✅ | ✅ | ✅ |
| AI Keyword Suggestions | — | — | ✅ |
| AI Meta Title & Description generation | — | — | ✅ |
| SERP Preview (desktop + mobile) | — | ✅ | ✅ |
| Schema.org Wizard (30+ structured data types) | — | ✅ | ✅ |
| Live JSON-LD preview | — | ✅ | ✅ |
| SEO Health Dashboard (site-wide scores) | — | ✅ | ✅ |
| SEO Optimizer (bulk edit across documents) | — | ✅ | ✅ |
| Advanced Validation (7 checks + auto-fix) | — | ✅ | ✅ |
| SEO Automation (canonical, OG, focus keyword) | — | ✅ | ✅ |
| Team Workflow (Draft → Review → Approved) | — | ✅ | ✅ |
| Duplicate meta title detection (GROQ) | — | ✅ | ✅ |

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
- [Pro Features](#pro-features)
- [Pro License Setup](#pro-license-setup)
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

### With Pro license

```ts
import { defineConfig } from 'sanity'
import { seoMetaFields } from 'sanity-plugin-seo'

export default defineConfig({
  plugins: [
    seoMetaFields({
      proFeature: process.env.SANITY_STUDIO_SEO_LICENSE,
      bodyField: 'body',
      slugField: 'slug',
    }),
  ],
})
```

### Full setup (Pro + AI)

```ts
import { defineConfig } from 'sanity'
import { seoMetaFields } from 'sanity-plugin-seo'

export default defineConfig({
  plugins: [
    seoMetaFields({
      // Pro license key — unlocks SERP preview, Schema.org wizard,
      // advanced validation, automation, team workflow, and dashboards
      proFeature: process.env.SANITY_STUDIO_SEO_LICENSE,

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
| `proFeature` | `string` | — | Pro license key from Lemon Squeezy |
| `aiFeature` | `AIConfig` | — | AI provider config for keyword/title/description generation |
| `aiFeature.provider` | `'openai' \| 'anthropic' \| 'groq'` | — | AI provider |
| `aiFeature.apiKey` | `string` | — | API key for the chosen provider |
| `aiFeature.model` | `string` | provider default | Model name (e.g. `gpt-4o-mini`, `claude-haiku-4-5-20251001`, `llama-3.3-70b-versatile`) |
| `bodyField` | `string` | `'body'` | Portable Text field name for AI content analysis |
| `slugField` | `string` | `'slug'` | Slug field name for canonical URL auto-generation |
| `dashboard` | `boolean` | `true` | Show SEO Health and Bulk Optimizer in the Studio toolbar |

---

## Next.js Integration

Fetch your SEO data from Sanity with a GROQ query and pass it to the Next.js `Metadata` API (App Router) or `next-seo` / `next/head` (Pages Router).

### GROQ query (copy this into your project)

```ts
// lib/sanity/queries.ts
import { groq } from 'next-sanity'

export const pageQuery = groq`*[_type == "page" && slug.current == $slug][0]{
  title,
  seo {
    metaTitle,
    metaDescription,
    focusKeyword,
    canonicalUrl,
    nofollowAttributes,
    robotsMeta,
    seoKeywords,
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
    }
  }
}`
```

---

### App Router

```ts
// app/[slug]/page.tsx
import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { pageQuery } from '@/lib/sanity/queries'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await client.fetch(pageQuery, { slug: params.slug })
  const seo = page?.seo
  if (!seo) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const canonical = seo.canonicalUrl ?? `${siteUrl}/${params.slug}`
  const ogImage = seo.openGraph?.image?.asset?.url ?? seo.metaImage?.asset?.url

  const robots: string[] = []
  if (seo.nofollowAttributes) robots.push('noindex', 'nofollow')
  seo.robotsMeta?.forEach((r: string) => { if (!robots.includes(r)) robots.push(r) })

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: { canonical },
    ...(robots.length && { robots: robots.join(', ') }),
    ...(seo.seoKeywords?.length && { keywords: seo.seoKeywords.join(', ') }),
    openGraph: {
      title: seo.openGraph?.title ?? seo.metaTitle,
      description: seo.openGraph?.description ?? seo.metaDescription,
      url: seo.openGraph?.url ?? canonical,
      siteName: seo.openGraph?.siteName,
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: seo.twitter?.cardType ?? 'summary_large_image',
      site: seo.twitter?.site,
      creator: seo.twitter?.creator ?? seo.twitter?.handle,
    },
  }
}

export default async function Page({ params }: Props) {
  const page = await client.fetch(pageQuery, { slug: params.slug })

  // JSON-LD structured data
  const schema = page?.seo?.schemaOrg
  const jsonLd = schema?.schemaType
    ? JSON.stringify({ '@context': 'https://schema.org', '@type': schema.schemaType, name: schema.name, description: schema.description, url: schema.url })
    : null

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      )}
      <main>{page?.title}</main>
    </>
  )
}
```

---

### Pages Router — with `next-seo`

[next-seo](https://github.com/garmeeh/next-seo) is a popular package that simplifies head tag management in the Pages Router.

```bash
npm install next-seo
```

```tsx
// pages/[slug].tsx
import { NextSeo } from 'next-seo'
import { GetStaticProps } from 'next'
import { client } from '@/lib/sanity/client'
import { pageQuery } from '@/lib/sanity/queries'

interface Props { page: any }

export default function Page({ page }: Props) {
  const seo = page?.seo ?? {}
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const canonical = seo.canonicalUrl ?? `${siteUrl}/${page?.slug?.current}`
  const ogImage = seo.openGraph?.image?.asset?.url ?? seo.metaImage?.asset?.url

  const noindex = seo.nofollowAttributes || seo.robotsMeta?.includes('noindex') || false
  const nofollow = seo.nofollowAttributes || seo.robotsMeta?.includes('nofollow') || false

  // JSON-LD structured data
  const schema = seo.schemaOrg
  const jsonLd = schema?.schemaType
    ? JSON.stringify({ '@context': 'https://schema.org', '@type': schema.schemaType, name: schema.name, description: schema.description, url: schema.url })
    : null

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
          seo.hreflang?.map(({ locale, url }: { locale: string; url: string }) => ({
            rel: 'alternate',
            hrefLang: locale,
            href: url,
          })) ?? []
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
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      )}
      <main>
        <h1>{page?.title}</h1>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const page = await client.fetch(pageQuery, { slug: params?.slug })
  return { props: { page }, revalidate: 60 }
}

export async function getStaticPaths() {
  const slugs = await client.fetch(`*[_type == "page"].slug.current`)
  return {
    paths: slugs.map((slug: string) => ({ params: { slug } })),
    fallback: 'blocking',
  }
}
```

<details>
<summary>Pages Router — without next-seo (raw next/head)</summary>

```tsx
// pages/[slug].tsx
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { client } from '@/lib/sanity/client'
import { pageQuery } from '@/lib/sanity/queries'

interface Props { page: any }

export default function Page({ page }: Props) {
  const seo = page?.seo ?? {}
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const canonical = seo.canonicalUrl ?? `${siteUrl}/${page?.slug?.current}`
  const ogImage = seo.openGraph?.image?.asset?.url ?? seo.metaImage?.asset?.url

  const robots: string[] = []
  if (seo.nofollowAttributes) robots.push('noindex', 'nofollow')
  seo.robotsMeta?.forEach((r: string) => { if (!robots.includes(r)) robots.push(r) })

  return (
    <>
      <Head>
        <title>{seo.metaTitle}</title>
        <meta name="description" content={seo.metaDescription} />
        {canonical && <link rel="canonical" href={canonical} />}
        {robots.length > 0 && <meta name="robots" content={robots.join(', ')} />}
        {seo.seoKeywords?.length > 0 && (
          <meta name="keywords" content={seo.seoKeywords.join(', ')} />
        )}
        <meta property="og:title" content={seo.openGraph?.title ?? seo.metaTitle} />
        <meta property="og:description" content={seo.openGraph?.description ?? seo.metaDescription} />
        {canonical && <meta property="og:url" content={seo.openGraph?.url ?? canonical} />}
        {seo.openGraph?.siteName && <meta property="og:site_name" content={seo.openGraph.siteName} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:card" content={seo.twitter?.cardType ?? 'summary_large_image'} />
        {seo.twitter?.site && <meta name="twitter:site" content={seo.twitter.site} />}
        {(seo.twitter?.creator ?? seo.twitter?.handle) && (
          <meta name="twitter:creator" content={seo.twitter.creator ?? seo.twitter.handle} />
        )}
        {seo.hreflang?.map(({ locale, url }: { locale: string; url: string }) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={url} />
        ))}
      </Head>
      <main>
        <h1>{page?.title}</h1>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const page = await client.fetch(pageQuery, { slug: params?.slug })
  return { props: { page }, revalidate: 60 }
}

export async function getStaticPaths() {
  const slugs = await client.fetch(`*[_type == "page"].slug.current`)
  return {
    paths: slugs.map((slug: string) => ({ params: { slug } })),
    fallback: 'blocking',
  }
}
```

</details>

---

## Astro Integration

Fetch SEO data from Sanity with a GROQ query and render it in your page `<head>`. You can use native Astro head tags or the `astro-seo` component.

#### 1. Install the Sanity client

```bash
npm install @sanity/client
```

#### 2. Create a Sanity client

```ts
// src/lib/sanity.ts
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})
```

#### 3. Fetch SEO data and render tags

**Option A — native Astro head tags**

```astro
---
// src/pages/[slug].astro
import { client } from '../lib/sanity'

const { slug } = Astro.params

const page = await client.fetch(
  `*[_type == "page" && slug.current == $slug][0]{
    title,
    seo {
      metaTitle, metaDescription, canonicalUrl, nofollowAttributes, robotsMeta, seoKeywords,
      metaImage { asset->{ url } },
      openGraph { title, description, url, siteName, image { asset->{ url } } },
      twitter { cardType, site, creator, handle },
      hreflang[] { locale, url },
      schemaOrg { schemaType, name, description, url }
    }
  }`,
  { slug }
)

const seo = page?.seo ?? {}
const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? ''
const canonical = seo.canonicalUrl ?? `${siteUrl}/${slug}`
const ogImage = seo.openGraph?.image?.asset?.url ?? seo.metaImage?.asset?.url

const robots: string[] = []
if (seo.nofollowAttributes) robots.push('noindex', 'nofollow')
seo.robotsMeta?.forEach((r: string) => { if (!robots.includes(r)) robots.push(r) })

// JSON-LD
const schema = seo.schemaOrg
const jsonLd = schema?.schemaType
  ? JSON.stringify({ '@context': 'https://schema.org', '@type': schema.schemaType, name: schema.name, description: schema.description, url: schema.url })
  : null
---

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>{seo.metaTitle}</title>
    <meta name="description" content={seo.metaDescription} />
    {canonical && <link rel="canonical" href={canonical} />}
    {robots.length > 0 && <meta name="robots" content={robots.join(', ')} />}
    {seo.seoKeywords?.length > 0 && <meta name="keywords" content={seo.seoKeywords.join(', ')} />}

    <!-- Open Graph -->
    <meta property="og:title" content={seo.openGraph?.title ?? seo.metaTitle} />
    <meta property="og:description" content={seo.openGraph?.description ?? seo.metaDescription} />
    {canonical && <meta property="og:url" content={seo.openGraph?.url ?? canonical} />}
    {seo.openGraph?.siteName && <meta property="og:site_name" content={seo.openGraph.siteName} />}
    {ogImage && <meta property="og:image" content={ogImage} />}

    <!-- Twitter -->
    <meta name="twitter:card" content={seo.twitter?.cardType ?? 'summary_large_image'} />
    {seo.twitter?.site && <meta name="twitter:site" content={seo.twitter.site} />}
    {(seo.twitter?.creator ?? seo.twitter?.handle) && (
      <meta name="twitter:creator" content={seo.twitter.creator ?? seo.twitter.handle} />
    )}

    <!-- hreflang -->
    {seo.hreflang?.map(({ locale, url }: { locale: string; url: string }) => (
      <link rel="alternate" hreflang={locale} href={url} />
    ))}

    <!-- JSON-LD -->
    {jsonLd && <script type="application/ld+json" set:html={jsonLd} />}
  </head>
  <body>
    <h1>{page?.title}</h1>
  </body>
</html>
```

**Option B — with `astro-seo`**

[astro-seo](https://github.com/jonasmerlin/astro-seo) provides a component that handles all head tags in one place.

```bash
npm install astro-seo
```

```astro
---
// src/pages/[slug].astro
import { SEO } from 'astro-seo'
import { client } from '../lib/sanity'

const { slug } = Astro.params
const page = await client.fetch(
  `*[_type == "page" && slug.current == $slug][0]{
    title,
    seo {
      metaTitle, metaDescription, canonicalUrl, nofollowAttributes, robotsMeta, seoKeywords,
      metaImage { asset->{ url } },
      openGraph { title, description, url, siteName, image { asset->{ url } } },
      twitter { cardType, site, creator, handle },
      hreflang[] { locale, url },
      schemaOrg { schemaType, name, description, url }
    }
  }`,
  { slug }
)

const seo = page?.seo ?? {}
const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? ''
const canonical = seo.canonicalUrl ?? `${siteUrl}/${slug}`
const ogImage = seo.openGraph?.image?.asset?.url ?? seo.metaImage?.asset?.url

const schema = seo.schemaOrg
const jsonLd = schema?.schemaType
  ? JSON.stringify({ '@context': 'https://schema.org', '@type': schema.schemaType, name: schema.name, description: schema.description, url: schema.url })
  : null
---

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <SEO
      title={seo.metaTitle}
      description={seo.metaDescription}
      canonical={canonical}
      noindex={seo.nofollowAttributes || seo.robotsMeta?.includes('noindex')}
      nofollow={seo.nofollowAttributes || seo.robotsMeta?.includes('nofollow')}
      openGraph={{
        basic: {
          title: seo.openGraph?.title ?? seo.metaTitle ?? '',
          type: 'website',
          image: ogImage ?? '',
          url: seo.openGraph?.url ?? canonical,
        },
        optional: {
          siteName: seo.openGraph?.siteName,
          description: seo.openGraph?.description ?? seo.metaDescription,
        },
      }}
      twitter={{
        card: (seo.twitter?.cardType as any) ?? 'summary_large_image',
        site: seo.twitter?.site,
        creator: seo.twitter?.creator ?? seo.twitter?.handle,
      }}
      extend={{
        link: seo.hreflang?.map(({ locale, url }: { locale: string; url: string }) => ({
          rel: 'alternate',
          hreflang: locale,
          href: url,
        })) ?? [],
        meta: seo.seoKeywords?.length
          ? [{ name: 'keywords', content: seo.seoKeywords.join(', ') }]
          : [],
      }}
    />
    {jsonLd && <script type="application/ld+json" set:html={jsonLd} />}
  </head>
  <body>
    <h1>{page?.title}</h1>
  </body>
</html>
```

---

## Vue 3 / Nuxt Integration

Fetch SEO data from Sanity and apply it using Nuxt's built-in `useHead` composable or the `@nuxtjs/seo` module.

### Nuxt 3

#### 1. Install the Sanity module

```bash
npm install @nuxtjs/sanity
```

#### 2. Configure the Sanity module

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/sanity'],
  sanity: {
    projectId: process.env.NUXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
  },
})
```

#### 3. Fetch SEO data and apply head tags

```vue
<!-- pages/[slug].vue -->
<script setup lang="ts">
const route = useRoute()

const { data: page } = await useSanityQuery(
  `*[_type == "page" && slug.current == $slug][0]{
    title,
    seo {
      metaTitle, metaDescription, canonicalUrl, nofollowAttributes, robotsMeta, seoKeywords,
      metaImage { asset->{ url } },
      openGraph { title, description, url, siteName, image { asset->{ url } } },
      twitter { cardType, site, creator, handle },
      hreflang[] { locale, url },
      schemaOrg { schemaType, name, description, url }
    }
  }`,
  { slug: route.params.slug as string }
)

const seo = computed(() => page.value?.seo ?? {})
const siteUrl = useRuntimeConfig().public.siteUrl ?? ''
const slug = route.params.slug as string
const canonical = computed(() => seo.value.canonicalUrl ?? `${siteUrl}/${slug}`)
const ogImage = computed(
  () => seo.value.openGraph?.image?.asset?.url ?? seo.value.metaImage?.asset?.url
)

const robots = computed(() => {
  const r: string[] = []
  if (seo.value.nofollowAttributes) r.push('noindex', 'nofollow')
  seo.value.robotsMeta?.forEach((v: string) => { if (!r.includes(v)) r.push(v) })
  return r.join(', ')
})

// JSON-LD
const schema = computed(() => seo.value.schemaOrg)
const jsonLd = computed(() =>
  schema.value?.schemaType
    ? { '@context': 'https://schema.org', '@type': schema.value.schemaType, name: schema.value.name, description: schema.value.description, url: schema.value.url }
    : null
)

useHead({
  title: () => seo.value.metaTitle,
  meta: [
    { name: 'description', content: () => seo.value.metaDescription },
    { name: 'robots', content: robots },
    ...(seo.value.seoKeywords?.length
      ? [{ name: 'keywords', content: seo.value.seoKeywords.join(', ') }]
      : []),
    { property: 'og:title', content: () => seo.value.openGraph?.title ?? seo.value.metaTitle },
    { property: 'og:description', content: () => seo.value.openGraph?.description ?? seo.value.metaDescription },
    { property: 'og:url', content: () => seo.value.openGraph?.url ?? canonical.value },
    { property: 'og:site_name', content: () => seo.value.openGraph?.siteName },
    { property: 'og:image', content: ogImage },
    { name: 'twitter:card', content: () => seo.value.twitter?.cardType ?? 'summary_large_image' },
    { name: 'twitter:site', content: () => seo.value.twitter?.site },
    { name: 'twitter:creator', content: () => seo.value.twitter?.creator ?? seo.value.twitter?.handle },
  ],
  link: [
    { rel: 'canonical', href: canonical },
    ...(seo.value.hreflang?.map(({ locale, url }: { locale: string; url: string }) => ({
      rel: 'alternate',
      hreflang: locale,
      href: url,
    })) ?? []),
  ],
  script: jsonLd.value
    ? [{ type: 'application/ld+json', children: JSON.stringify(jsonLd.value) }]
    : [],
})
</script>

<template>
  <main>
    <h1>{{ page?.title }}</h1>
  </main>
</template>
```

---

### Vue 3 (standalone, with @unhead/vue)

#### 1. Install dependencies

```bash
npm install @sanity/client @unhead/vue
```

#### 2. Fetch and apply SEO in a composable

```ts
// composables/usePage.ts
import { createClient } from '@sanity/client'
import { useHead } from '@unhead/vue'

const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

export async function usePage(slug: string) {
  const page = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      title,
      seo {
        metaTitle, metaDescription, canonicalUrl, nofollowAttributes, robotsMeta, seoKeywords,
        metaImage { asset->{ url } },
        openGraph { title, description, url, siteName, image { asset->{ url } } },
        twitter { cardType, site, creator, handle },
        hreflang[] { locale, url },
        schemaOrg { schemaType, name, description, url }
      }
    }`,
    { slug }
  )

  const seo = page?.seo ?? {}
  const siteUrl = import.meta.env.VITE_SITE_URL ?? ''
  const canonical = seo.canonicalUrl ?? `${siteUrl}/${slug}`
  const ogImage = seo.openGraph?.image?.asset?.url ?? seo.metaImage?.asset?.url

  const robots: string[] = []
  if (seo.nofollowAttributes) robots.push('noindex', 'nofollow')
  seo.robotsMeta?.forEach((r: string) => { if (!robots.includes(r)) robots.push(r) })

  const schema = seo.schemaOrg
  const jsonLd = schema?.schemaType
    ? { '@context': 'https://schema.org', '@type': schema.schemaType, name: schema.name, description: schema.description, url: schema.url }
    : null

  useHead({
    title: seo.metaTitle,
    meta: [
      { name: 'description', content: seo.metaDescription },
      ...(robots.length ? [{ name: 'robots', content: robots.join(', ') }] : []),
      ...(seo.seoKeywords?.length ? [{ name: 'keywords', content: seo.seoKeywords.join(', ') }] : []),
      { property: 'og:title', content: seo.openGraph?.title ?? seo.metaTitle },
      { property: 'og:description', content: seo.openGraph?.description ?? seo.metaDescription },
      ...(canonical ? [{ property: 'og:url', content: seo.openGraph?.url ?? canonical }] : []),
      ...(seo.openGraph?.siteName ? [{ property: 'og:site_name', content: seo.openGraph.siteName }] : []),
      ...(ogImage ? [{ property: 'og:image', content: ogImage }] : []),
      { name: 'twitter:card', content: seo.twitter?.cardType ?? 'summary_large_image' },
      ...(seo.twitter?.site ? [{ name: 'twitter:site', content: seo.twitter.site }] : []),
      ...(seo.twitter?.creator ?? seo.twitter?.handle
        ? [{ name: 'twitter:creator', content: seo.twitter.creator ?? seo.twitter.handle }]
        : []),
    ],
    link: [
      ...(canonical ? [{ rel: 'canonical', href: canonical }] : []),
      ...(seo.hreflang?.map(({ locale, url }: { locale: string; url: string }) => ({
        rel: 'alternate', hreflang: locale, href: url,
      })) ?? []),
    ],
    script: jsonLd
      ? [{ type: 'application/ld+json', children: JSON.stringify(jsonLd) }]
      : [],
  })

  return { page }
}
```

```vue
<!-- views/PageView.vue -->
<script setup lang="ts">
import { usePage } from '@/composables/usePage'
const props = defineProps<{ slug: string }>()
const { page } = await usePage(props.slug)
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

## Pro Features

### SERP Preview

Renders a pixel-accurate Google search result mockup (desktop and mobile) using the document's meta title, description, and URL. Updates live as you type.

### Schema.org Wizard

Guided form for 30+ structured data types — all eligible for Google Rich Results:

Article, Product, FAQ Page, Local Business, Event, Organization, Web Page, Video, Recipe, Person, Course, Job Posting, Breadcrumb, Blog Post, News Article, How-To Guide, Review, Software/App, Book, Movie, Service, Professional Service, Medical Condition, Dataset, Podcast, Podcast Episode, Tourist Attraction, Accommodation, Sports Team, Collection Page, About Page

Each type surfaces only the fields relevant to it. A live **JSON-LD preview** shows the exact `<script type="application/ld+json">` block that will be rendered, with a completion counter showing how many fields are filled.

### Advanced Validation

Runs 7 automated checks against your document on every save and surfaces actionable fix buttons:

| Check | Auto-fixable |
|---|:---:|
| Unique meta title (cross-document GROQ query) | — |
| No noindex + canonical conflict | — |
| Open Graph image present | — |
| Open Graph title set | ✅ Copy from meta title |
| Canonical URL set | ✅ Auto-fill placeholder |
| Focus keyword in meta title | — |
| Meta description length (100–160 chars) | — |

A progress bar and issue count badge give instant visual feedback. A **"Fix N issues automatically"** bulk button applies all auto-fixable patches in one click.

### SEO Automation

One-click actions that fill missing fields without manual copying:

| Action | What it does |
|---|---|
| **Auto Canonical URL** | Builds canonical URL from the document slug: `SITE_URL/slug` |
| **Copy Meta → Open Graph** | Copies meta title and description into OG fields when empty |
| **Auto Focus Keyword** | Extracts the most prominent word from the meta title |

All three actions can be applied together with a single **"Apply all automations"** button. Each shows a 2.5-second "Applied!" confirmation after running. Fields that are already set show a **Re-apply** button to overwrite if needed.

### Team Workflow

Visual pipeline with three statuses: **Draft → Needs SEO Review → Approved**

- Status badge in the panel header updates live
- Clickable step indicators to move between statuses directly
- Context-aware action buttons: "Request Review", "Mark Approved", "Reset to Draft"
- Review Notes field for leaving feedback to content editors
- `seoStatus` and `seoReviewNotes` are stored on the document and queryable via GROQ

### SEO Health Dashboard

A top-level Studio tool (toolbar icon) showing site-wide SEO scores across all documents. Filter by score range, document type, or missing fields. Click any document to open it directly.

### SEO Optimizer (Bulk Edit)

Identifies all documents missing key SEO fields (title, description, canonical, OG image). Lets you apply fixes in bulk without opening each document individually.

---

## Pro License Setup

1. Purchase a Pro license at **[themejam.lemonsqueezy.com](https://themejam.lemonsqueezy.com/checkout/buy/f2e069ff-cfaf-43a0-8dc2-2b46185e7f24)**
2. You will receive a license key by email via Lemon Squeezy
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

The license is validated silently on Studio load. Pro features unlock automatically once the key is verified. The validated state is cached in the browser so it does not re-validate on every page load.

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

MIT — free tier features are open source. Pro features require a valid license key purchased at [themejam.lemonsqueezy.com](https://themejam.lemonsqueezy.com/checkout/buy/f2e069ff-cfaf-43a0-8dc2-2b46185e7f24).
