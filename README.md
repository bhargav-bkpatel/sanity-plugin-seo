# sanity-plugin-seo

> This is a **Sanity Studio v3** plugin.

# What it is

The `sanity-plugin-seo` Plugin is designed to simplify the process of generating SEO fields for various types of content. This plugin is particularly useful for enhancing the structured data of your content, making it more accessible and understandable for search engines. By integrating seamlessly with Sanity Studio, it provides an easy way to add and configure SEO fields within your document schemas, ensuring your content is fully optimized for search visibility.

![Alt Text](https://github.com/bhargav-bkpatel/sanity-plugin-seo/blob/main/public/assets/demo-1.gif)

## Key Features

- **Customizable SEO Fields:** Easily add and configure essential SEO fields such as title, description, keywords, and more within your document schemas.

- **Sanity Studio Integration:** Effortlessly incorporate SEO field creation into your Sanity Studio workflow, ensuring that SEO optimization becomes an integral part of your content development process.

- **Compatibility:** Fully compatible with Sanity v3 and integrates seamlessly with your existing schemas and plugins. It is also compatible with Next.js and React, ensuring a smooth integration with modern web development frameworks.

## Demo links for sanity with Next.js plugin integration

Here is the frontend.
[Frontend Demo](https://sanity-nextjs-seo-boilerplate.vercel.app/)

Here is the sanity studio.
[Studio Demo](https://sanity-nextjs-seo-boilerplate.vercel.app/studio/)

## Installation

To get started, install the plugin using npm:

```sh
npm install sanity-plugin-seo
```

## Usage in Sanity Studio

Add it as a plugin in `sanity.config.ts` (or .js):

```ts
import { defineConfig } from "sanity";
import { seoMetaFields } from "sanity-plugin-seo";

export default defineConfig({
  plugins: [seoMetaFields()],
});
```

You can then add the `schemaMarkup` field to any Sanity Document you want it to be in.

```javascript
const myDocument = {
  type: "page",
  name: "page",
  fields: [
    {
      title: "Seo",
      name: "seo",
      type: "seoMetaFields",
    },
  ],
  preview: {
    select: {
      metaTitle: "seo",
    },
    prepare(selection) {
      const { metaTitle } = selection?.metaTitle || "";
      return {
        title: metaTitle || "seo",
      };
    },
  },
};
```

## Usage with Next.js and React.js

Create query for SEO fields in `/lib/sanity/queries/demo.ts` frontend

```Typescript (or js)
const groqQuery = groq`*[_type == "page"]{
_type,
"slug":slug.current,
${seo},
}`;

export const seo = /* groq */ `seo{
${seofields}
}`;

export const seofields = /* groq */ `
_type,
metaTitle,
nofollowAttributes,
seoKeywords,
metaDescription,
openGraph{
${openGraphQuery}
},
twitter{
${twitterQuery}
},
additionalMetaTags[]{
_type,
metaAttributes[]{
${metaAttributesQuery}
}
}
`;

export const twitterQuery = /* groq */ `
_type,
site,
creator,
cardType,
handle
`;

export const openGraphQuery = /* groq */ `
_type,
siteName,
url,
description,
title,
image{
${imageFields}
}
`;

export const metaAttributesQuery = /* groq */ `
_type,
attributeValueString,
attributeType,
attributeKey,
attributeValueImage{
${imageFields}
}
`;

export const imageFields = /* groq */ `
_type,
crop{
_type,
right,
top,
left,
bottom
},
hotspot{
_type,
x,
y,
height,
width,
},
asset->{...}
`;
```

Create type for all the fields `/lib/sanity/queries/demo.d.ts`

``` Typescript

export type SeoType = {
  _type?: "seo";
  nofollowAttributes?: boolean
  metaDescription?: string;
  additionalMetaTags?: MetaTagType[];
  metaTitle?: string;
  seoKeywords?: string[]
  openGraph?: OpenGraphType;
  twitter?: Twitter;
};

export type MetaTagType = {
  _type: "metaTag";
  metaAttributes?: MetaAttributeType[];
};

export type MetaAttributeType = {
  _type: "metaAttribute";
  attributeKey?: string;
  attributeType?: string;
  attributeValueString?: string;
  attributeValueImage?: CustomImageType;
};


export type OpenGraphType = {
  _type: "openGraph";
  title: string;
  url?: string
  siteName?: string
  description: string;
  image: CustomImageType;
};

export type Twitter = {
  _type: "twitter";
  handle?: string;
  creator?: string
  site?: string;
  cardType?: string;
};

export type CustomImageType = {
  _type: "customImage";
  asset?: SanityImageAssetType;
  crop?: {
    _type: "SanityImageCrop";
    right: number;
    top: number;
    left: number;
    bottom: number;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    _type: "SanityImageHotspot";
    width?: number;
  };
};

export type SanityImageAssetType = {
  _type?: "SanityImageAsset";
  _id?: string;
  path?: string;
  url?: string;
  metadata?: {
    _type?: "SanityImageMetadata";
    dimensions?: {
      _type?: "SanityImageDimensions";
      height?: number;
      width?: number;
    };
  };
};

```

Call MetaData on CustomNextSeo

```Typescript (or js)

import React, { useMemo } from "react";
import type { PropsWithChildren } from "react";
import { NextSeo } from "next-seo";
import { MetaTag as NextSeoMetaTag, OpenGraph as NextSeoOpenGraph } from 'next-seo/lib/types'
import { CustomImageType, MetaAttributeType, MetaTagType, OpenGraphType, SeoType } from "../../../lib/sanity/types";


export const getOpenGraph = (args: OpenGraphType) => {
  const { description, image, title, _type, siteName, url } = args
  const getImage = image ? resolveImage(image) : null
  const values = {
    _type,
    description,
    siteName,
    url,
    title,
    images: [{ url: getImage ?? '' }],
  }
  return values as NextSeoOpenGraph
}

export const getMetaObjects = (tags: MetaTagType[], allowIndexing?: boolean) => {
  const tagArray: NextSeoMetaTag[] = []
  tags.map(tag => {
    const excludeTag =
      !allowIndexing &&
      !!tag.metaAttributes?.find(
        i =>
          i?.attributeValueString?.includes('noindex') ||
          i?.attributeValueString?.includes('nofollow'),
      )
    if (!excludeTag) {
      const metaTag = getMetaAttribute(tag?.metaAttributes)
      if (metaTag) {
        tagArray.push(metaTag)
      }
    }
  })
  return tagArray
}

export const resolveImage = (image?: CustomImageType) => {
  return image?.asset?.url ?? "";
};

export const getMetaAttribute = (attrs: MetaAttributeType[] | undefined) => {
  if (!attrs) {
    return null
  }
  const obj: Record<string, string> = {}
  attrs.map((i) => {
    Object.assign(obj, {
      [i?.attributeKey as string]:
        i.attributeType == "image"
          ? resolveImage(i?.attributeValueImage)
          : i.attributeValueString,
    })
  })
  return obj as unknown as NextSeoMetaTag
}


interface CustomNextSeoProps {
  seo: SeoType | null;
  slug: string;
}

const CustomNextSeo: React.FC<PropsWithChildren<CustomNextSeoProps>> = ({
  seo,
    children,
  slug,
}) => {

  const { additionalMetaTags, metaDescription, metaTitle, twitter, nofollowAttributes, seoKeywords } = seo || {};

  const tags = useMemo(
    () => (additionalMetaTags ? getMetaObjects(additionalMetaTags) : []),
    [additionalMetaTags]
  );
  const openGraph = useMemo(
    () => (seo?.openGraph ? getOpenGraph(seo?.openGraph) : undefined),
    [seo]
  );
  const url = (process.env.NEXT_PUBLIC_APP_URL ?? "") + (slug?.startsWith("/") ? slug : `/${slug}`);

  return (
       <>
    <NextSeo
      themeColor=""
      twitter={{
        handle: twitter?.creator,
        site: twitter?.site,
        cardType: twitter?.cardType,
      }}
      nofollow={nofollowAttributes}
      noindex={nofollowAttributes}
      openGraph={openGraph}
      canonical={url || ""}
      additionalMetaTags={((seoKeywords && seoKeywords?.length > 0
        ? [{ name: "keywords", content: seoKeywords?.join(", ") }]
        : []) as NextSeoMetaTag[]).concat(tags ?? [])}
      title={metaTitle ?? ""}
      description={metaDescription ?? ""}
    />
       {children}
    </>
  );
};

export default CustomNextSeo;


```

## License

MIT
