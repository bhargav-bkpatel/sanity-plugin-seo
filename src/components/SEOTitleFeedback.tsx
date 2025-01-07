import { StringInputProps, useFormValue, useClient, set } from "sanity";
import React, { useEffect } from "react";
import { Stack, Text } from "@sanity/ui";

const SEOTitleFeedback = (props: StringInputProps) => {
  const client = useClient({ apiVersion: "2021-06-07" });
  const { value, onChange, renderDefault } = props;

  // Access the parent object to get keywords from the `seoKeywords` field
  const parentPath = props.path.slice(0, -1);
  const parent = useFormValue(parentPath) as {
    seoKeywords?: string[];
  };

  const keywords = parent?.seoKeywords || [];

    // If current value is empty, fetch `metaTitle` from `homePage` and set
    useEffect(() => {
      if (value) return; // Only fetch if there's no title yet
      const fetchData = async () => {
        const data = await client.fetch("*[_type=='homePage'][0]{'title':seo.metaTitle}");
        const titleFromHomePage = data?.title;
        if (titleFromHomePage && !value) {
          onChange(set(titleFromHomePage));
        }
      };
      fetchData();
    }, [client, onChange, value]);

  /**
   * Returns an array of feedback items.
   * Each item has its own text + color for an individual bullet.
   */
  const getTitleFeedback = (
    title: string,
    keywords: string[]
  ): { text: string; color: "green" | "orange" | "red" }[] => {
    const feedbackItems: { text: string; color: "green" | "orange" | "red" }[] =
      [];

    if (!title?.trim()) {
      feedbackItems.push({
        text: "Your title is empty. Please add some content for better SEO.",
        color: "red",
      });
      return feedbackItems;
    }

    const charCount = title.length;
    const minChar = 50;
    const maxChar = 60;

    // 1) Title length check
    if (charCount < minChar) {
      feedbackItems.push({
        text: `Your title is only ${charCount} characters long — below ${minChar}.`,
        color: "orange",
      });
    } else if (charCount > maxChar) {
      feedbackItems.push({
        text: `Your title is ${charCount} characters long — above ${maxChar}.`,
        color: "red",
      });
    } else {
      feedbackItems.push({
        text: `Great! Your title length (${charCount}) looks good for SEO.`,
        color: "green",
      });
    }

    // 2) Keyword usage check
    if (keywords.length > 0) {
      const foundKeyword = keywords.some((kw) =>
        title.toLowerCase().includes(kw.toLowerCase())
      );
      if (!foundKeyword) {
        feedbackItems.push({
          text: "You have defined keywords but none appear in the title.",
          color: "red",
        });
      }else{
        feedbackItems.push({
          text: "Your keyword is in the title. Good job!",
          color: "green",
        });
      }
    } else {
      feedbackItems.push({
        text: "No keywords defined. Consider adding relevant keywords for better SEO.",
        color: "orange",
      });
    }

    return feedbackItems;
  };

  // Get an array of feedback items for the current title
  const feedbackItems = getTitleFeedback(value || "", keywords);

  return (
    <Stack space={3}>
      {/* Default input field */}
      {renderDefault(props)}

      {/* Map over feedback items, each with its own color-coded bullet */}
      <Stack space={2}>
        {feedbackItems.map((item, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: "7px" }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: item.color,
              }}
            />
            <Text weight="bold" muted size={14}>
              {item.text}
            </Text>
          </div>
        ))}
      </Stack>
    </Stack>
  );
};

export default SEOTitleFeedback;
