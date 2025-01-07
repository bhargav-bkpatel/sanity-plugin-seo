import { StringInputProps,useFormValue, useClient, set  } from "sanity";
import { useEffect } from "react";
import { Stack, Text } from "@sanity/ui";

const SEODescriptionFeedback = (props: StringInputProps) => {
  const { value, renderDefault, onChange } = props;
   const client = useClient({ apiVersion: "2021-06-07" });

  const parentPath = props.path.slice(0, -1);
  const parent = useFormValue(parentPath) as {
    metaDescription?: string;
    };
  
  const description = parent?.metaDescription || '';

  // If current value is empty, fetch `metaDescription` from `homePage` and set
  useEffect(() => {
    const fetchData = async () => {
      await client
        .fetch("*[_type=='homePage'][0]{'description':seo.metaDescription}")
        .then((data) => {
          const descriptionFromHomePage  = data?.description;
          if (descriptionFromHomePage  && !value) {
            onChange(set(descriptionFromHomePage ));
          }
        });
    };
    fetchData();
  }, [client, onChange, value]);


/**
 * Returns feedback about a page’s meta description based on Yoast SEO-style best practices.
 *
 * Typical guidance:
 * - Write *some* description (don’t leave it empty).
 * - Aim for roughly 100–160 characters. 
 * - If it’s under ~100, it’s likely too short.
 * - If it’s over ~160, it might get truncated in search engine results.
 */

const getDescriptionFeedback = (
  description: string
): { text: string; color: string } => {
  // 1. Check if the description is empty
  if (!description || !description.trim()) {
    return {
      text: "No meta description has been specified. Search engines will display copy from the page instead. Make sure to write one!",
      color: "red",
    };
  }

  // 2. Measure description length
  const charCount = description.trim().length;
  const minLength = 100;
  const maxLength = 160;

  // 3. Check if too short
  if (charCount < minLength) {
    return {
      text: `The meta description is too short at ${charCount} characters. You have up to ${maxLength} characters to use — make the most of it!`,
      color: "orange",
    };
  }

  // 4. Check if too long
  if (charCount > maxLength) {
    return {
      text: `The meta description is too long at ${charCount} characters. It may get truncated in search results. Try keeping it under ${maxLength}.`,
      color: "red",
    };
  }

  // 5. If it’s within recommended range, give a thumbs up
    return {
      text: "Well done! Your meta description length looks good for SEO.",
      color: "green",
    };
  };

  const { text, color } = getDescriptionFeedback(value || description);

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <div style={{ minWidth: "15px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: color,
              borderRadius: "50%",
            }}
          />
        </div>
        <Text weight="bold" muted size={14}>
          Meta description length: {text}
        </Text>
      </div>
    </Stack>
  );
};

export default SEODescriptionFeedback;
