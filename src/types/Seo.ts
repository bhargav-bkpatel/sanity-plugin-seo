import { Image } from "sanity";

export type HreflangEntry = {
  locale: string;
  url: string;
};

export type SchemaOrgData = {
  schemaType?: string;
  name?: string;
  description?: string;
  url?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  price?: string;
  priceCurrency?: string;
  availability?: string;
  ratingValue?: string;
  ratingCount?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  // FAQ
  faqItems?: Array<{ question: string; answer: string }>;
};

export type Seo = {
  type: string;
  nofollowAttributes?: boolean;
  robotsMeta?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: Image;
  focusKeyword?: string;
  canonicalUrl?: string;
  seoKeywords?: Array<{ type?: string }>;
  hreflang?: HreflangEntry[];
  schemaOrg?: SchemaOrgData;
  openGraph?: {
    url?: string;
    image?: Image;
    title?: string;
    description?: string;
    siteName?: string;
  };
  additionalMetaTags?: Array<{
    type?: string;
    metaAttributes?: Array<{
      type?: string;
      attributeKey?: string;
      attributeType?: string;
      attributeValueImage?: Image;
      attributeValueString?: string;
    }>;
  }>;
  twitter?: {
    cardType?: string;
    creator?: string;
    site?: string;
    handle?: string;
  };
  // Pro workflow
  seoStatus?: "draft" | "review" | "approved";
  seoReviewNotes?: string;
};

/** Shape of the seo object returned by a GROQ query — use in your frontend project */
export interface SeoData {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  nofollowAttributes?: boolean;
  robotsMeta?: string[];
  focusKeyword?: string;
  seoKeywords?: string[];
  metaImage?: { asset?: { url?: string } };
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    image?: { asset?: { url?: string } };
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
