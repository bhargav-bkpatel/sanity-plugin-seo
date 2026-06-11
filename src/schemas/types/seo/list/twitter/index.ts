export default {
  name: "twitter",
  title: "Twitter",
  type: "object",
  fields: [
    {
      name: "cardType",
      title: "Card Type",
      type: "string",
      initialValue: "summary_large_image",
      options: {
        list: [
          { title: "Summary (Small Image)", value: "summary" },
          { title: "Summary with Large Image", value: "summary_large_image" },
          { title: "App Card", value: "app" },
          { title: "Player Card", value: "player" },
        ],
      },
    },
    {
      name: "creator",
      title: "Creator",
      type: "string",
    },
    {
      name: "site",
      title: "Site",
      type: "string",
    },
    {
      name: "handle",
      title: "Handle",
      type: "string",
    },
  ],
};
