# sanity-plugin-seo

> This is a **Sanity Studio v3** plugin.

# What it is

The `sanity-plugin-seo` Plugin is designed to simplify the process of generating SEO fields for various types of content. This plugin is particularly useful for enhancing the structured data of your content, making it more accessible and understandable for search engines. By integrating seamlessly with Sanity Studio, it provides an easy way to add and configure SEO fields within your document schemas, ensuring your content is fully optimized for search visibility.

![Alt Text](https://github.com/bhargav-bkpatel/sanity-plugin-seo/blob/main/public/assets/demo-1.gif)

## Key Features

- **Customizable SEO Fields:** Easily add and configure essential SEO fields such as title, description, keywords, and more within your document schemas.

- **Sanity Studio Integration:** Effortlessly incorporate SEO field creation into your Sanity Studio workflow, ensuring that SEO optimization becomes an integral part of your content development process.

- **Compatibility:** Fully compatible with Sanity v3 and integrates seamlessly with your existing schemas and plugins.

## Installation

To get started, install the plugin using npm:

```sh
npm install sanity-plugin-seo
```

## Usage in Sanity Studio

Add it as a plugin in `sanity.config.ts` (or .js):

```ts
import { defineConfig } from 'sanity';
import { seoMetaFields } from 'sanity-plugin-seo';

export default defineConfig({
  plugins: [seoMetaFields()]
});
```

You can then add the `schemaMarkup` field to any Sanity Document you want it to be in.

```javascript
const myDocument = {
  type: 'document',
  name: 'myDocument',
  fields: [
    {
      title: 'Seo',
      name: 'seo',
      type: 'seoMetaFields'
    }
  ],
  preview: {
    select: {
      metaTitle: 'seo'
    },
    prepare(selection) {
      const { metaTitle } = selection?.metaTitle || '';
      return {
        title: metaTitle || 'seo',
      };
    }
  }
};
```

## License

MIT
