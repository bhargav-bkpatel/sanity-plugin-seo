const seo = {
  "@type": "seoMetaFields",
  nofollowAttributes: "boolean",
  robotsMeta: ["string"],
  metaTitle: "string",
  metaDescription: "string",
  focusKeyword: "string",
  seoKeywords: [{ "@type": "string" }],
  hreflang: [{ "@type": "hreflang", locale: "string", url: "string" }],
  openGraph: {
    image: "image",
    title: "string",
    description: "string",
    siteName: "string",
  },
  additionalMetaTags: [
    {
      "@type": "metaTag",
      metaAttributes: [
        {
          "@type": "metaAttribute",
          attributeKey: "string",
          attributeType: "string",
          attributeValueImage: "image",
          attributeValueString: "string",
        },
      ],
    },
  ],
  twitter: {
    cardType: "string",
    creator: "string",
    site: "string",
    handle: "string",
  },
};

export default seo;
