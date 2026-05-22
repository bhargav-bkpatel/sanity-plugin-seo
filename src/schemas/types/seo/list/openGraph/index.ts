import SEODescriptionFeedback from "../../../../../components/SEODescriptionFeedback";
import SEOTitleFeedback from "../../../../../components/SEOTitleFeedback";
import OpenGraphInput from "../../../../../components/OpenGraphInput";

export default {
  name: "openGraph",
  title: "Open Graph",
  type: "object",
  components: { input: OpenGraphInput },
  description:
    "Controls how your content appears when shared on social media (Facebook, LinkedIn, Slack, WhatsApp).",
  fields: [
    {
      name: "title",
      title: "OG Title",
      type: "string",
      components: { input: SEOTitleFeedback },
    },
    {
      name: "description",
      title: "OG Description",
      type: "string",
      components: { input: SEODescriptionFeedback },
    },
    {
      name: "image",
      title: "OG Image",
      type: "image",
      description: "Recommended: 1200×630px",
    },
    {
      name: "url",
      title: "OG URL",
      type: "string",
    },
    {
      name: "siteName",
      title: "Site Name",
      type: "string",
    },
  ],
};
