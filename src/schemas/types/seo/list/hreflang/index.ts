/* eslint-disable @typescript-eslint/no-explicit-any */
export default {
  name: "hreflangEntry",
  title: "Language Alternate",
  type: "object",
  fields: [
    {
      name: "locale",
      title: "Language / Locale",
      type: "string",
      description: "e.g. en, fr, de, en-US, fr-FR, x-default",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "url",
      title: "URL",
      type: "url",
      description: "Full URL to this page in the specified language",
      validation: (Rule: any) => Rule.required().uri({ scheme: ["http", "https"] }),
    },
  ],
  preview: {
    select: { locale: "locale", url: "url" },
    prepare({ locale, url }: { locale: string; url: string }) {
      return { title: locale || "Locale", subtitle: url || "No URL" };
    },
  },
};
