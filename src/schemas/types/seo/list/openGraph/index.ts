import SEODescriptionFeedback from "../../../../../components/SEODescriptionFeedback";
import SEOTitleFeedback from "../../../../../components/SEOTitleFeedback";

export default {
  name: "openGraph",
  title: "Open Graph",
  type: "object",
  fields: [
    {
      name: "url",
      title: "URL",
      type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
    },
    {
      name: "title",
      title: "Title",
      type: "string",
      components: {
        input: SEOTitleFeedback,
      },
    },
    {
      name: "description",
      title: "Description",
      type: "string",
      components: {
        input: SEODescriptionFeedback,
      },
    },
    {
      name: "siteName",
      title: "Site Name",
      type: "string",
    },
  ],
};
