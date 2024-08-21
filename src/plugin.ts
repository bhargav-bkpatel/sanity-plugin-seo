import { definePlugin } from "sanity";
import types from "./schemas/types";

const seoMetaFields = definePlugin(() => {
  return {
    name: "sanity-plugin-seo",
    schema: { types },
  };
});

export default seoMetaFields;
