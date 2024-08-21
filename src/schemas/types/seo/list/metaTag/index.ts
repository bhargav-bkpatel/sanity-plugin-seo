import { SchemaTypeDefinition } from "sanity";

export default {
  name: "metaTag",
  title: "Meta tag",
  type: "object",
  fields: [
    {
      name: "metaAttributes",
      title: "Meta Attributes",
      type: "array",
      of: [{ type: "metaAttribute" }],
    },
  ],
  preview: {
    select: {
      title: "attributeName",
      metaTags: "metaAttributes",
    },
    prepare({ metaTags }) {
      return {
        title:
          metaTags && metaTags[0]?.attributeValueString
            ? metaTags[0]?.attributeValueString
            : "Meta Tag",
      };
    },
  },
} as SchemaTypeDefinition;
