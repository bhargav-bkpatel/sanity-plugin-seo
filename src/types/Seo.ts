import { Image } from 'sanity';

export type Seo = {
  type: string;
  nofollowAttributes?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: Array<{
    type?: string;
  }>;
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
};
