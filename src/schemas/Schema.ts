import { defineType } from "sanity";
import SEOTitleFeedback from "../components/SEOTitleFeedback";
import SEODescriptionFeedback from "../components/SEODescriptionFeedback";

const schema = defineType({
  title: "Seo MetaFields",
  name: "seoMetaFields",
  type: "object",
  fields: [
    {
      name: "nofollowAttributes",
      title: "Prevent Indexing",
      type: "boolean",
      initialValue: false,
      description:
        "Enable this option to prevent search engines from indexing this URL (applies a `noindex` tag).",
    },
    {
      name: "metaTitle",
      title: "Title",
      type: "string",
      components: {
        input: SEOTitleFeedback,
      },
    },
    {
      name: "metaDescription",
      title: "Description",
      type: "string",
      components: {
        input: SEODescriptionFeedback,
      },
    },
    {
      name: "metaImage",
      title: "Meta Image",
      type: "image",
    },
    {
      name: "seoKeywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "openGraph",
      title: "Open Graph",
      type: "openGraph",
    },
    {
      name: "additionalMetaTags",
      title: "Additional Meta Tags",
      type: "array",
      of: [{ type: "metaTag" }],
    },
    {
      name: "twitter",
      title: "Twitter",
      type: "twitter",
    },
  ],
});

export default schema;
