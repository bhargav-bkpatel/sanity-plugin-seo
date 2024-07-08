const seo = {
  '@type': 'seoMetaFields',
  nofollowAttributes: 'boolean',
  metaTitle: 'string',
  metaDescription: 'string',
  seoKeywords: [
    {
      '@type': 'string'
    }
  ],
  openGraph: {
    url: 'string',
    image: 'image',
    title: 'string',
    description: 'string',
    siteName: 'string'
  },
  additionalMetaTags: [
    {
      '@type': 'metaTag',
      metaAttributes: [
        {
          '@type': 'metaAttribute',
          attributeKey: 'string',
          attributeType: 'string',
          attributeValueImage: 'image',
          attributeValueString: 'string'
        }
      ]
    }
  ],
  twitter: {
    cardType: 'string',
    creator: 'string',
    site: 'string',
    handle: 'string'
  }
};

export default seo;
