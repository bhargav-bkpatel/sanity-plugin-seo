import React, { useEffect, useCallback } from "react";
import { StringInputProps, useFormValue, useClient, set } from "sanity";
import { Stack, Text, Flex } from "@sanity/ui";
import AIGenerateButton from "./AIGenerateButton";

const DOT = (color: string) => (
  <div
    style={{
      width: 10,
      height: 10,
      borderRadius: "50%",
      backgroundColor: color,
      flexShrink: 0,
    }}
  />
);

const SEOTitleFeedback = ({ value, onChange, renderDefault, path, ...rest }: StringInputProps) => {
  const client = useClient({ apiVersion: "2021-06-07" });

  const parentPath = path.slice(0, -1);
  const parent = useFormValue(parentPath) as {
    seoKeywords?: string[];
    focusKeyword?: string;
  };

  const keywords = parent?.seoKeywords || [];
  const focusKeyword = parent?.focusKeyword || "";
  const defaultFetchType = "homePage";

  useEffect(() => {
    if (value) return;
    const fetchData = async () => {
      const data = await client.fetch(`*[_type=='${defaultFetchType}'][0]{'title':seo.metaTitle}`);
      if (data?.title && !value) onChange(set(data.title));
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, onChange, value]);

  const handleAIGenerate = useCallback((generated: string) => onChange(set(generated)), [onChange]);

  const getFeedback = (
    title: string,
    kw: string,
    kwArr: string[],
  ): { text: string; color: string }[] => {
    if (!title?.trim())
      return [{ text: "Title is empty. Add a title for better SEO.", color: "red" }];

    const items: { text: string; color: string }[] = [];
    const len = title.length;

    if (len >= 50 && len <= 60) {
      items.push({
        text: `Title length (${len}) is perfect for SEO.`,
        color: "#43d675",
      });
    } else if (len < 50) {
      items.push({
        text: `Title is short (${len}/50–60 chars).`,
        color: "#f59e0b",
      });
    } else {
      items.push({
        text: `Title is too long (${len}/60 chars max).`,
        color: "#ef4444",
      });
    }

    const primary = kw || (kwArr.length > 0 ? kwArr[0] : "");
    if (primary) {
      if (title.toLowerCase().includes(primary.toLowerCase())) {
        items.push({
          text: `Focus keyword "${primary}" found in title.`,
          color: "#43d675",
        });
      } else {
        items.push({
          text: `Focus keyword "${primary}" not in title.`,
          color: "#ef4444",
        });
      }
    } else {
      items.push({
        text: "No focus keyword set. Consider adding one.",
        color: "#f59e0b",
      });
    }

    return items;
  };

  const feedbackItems = getFeedback(value || "", focusKeyword, keywords);

  const props = { value, onChange, renderDefault, path, ...rest };

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <AIGenerateButton field="title" focusKeyword={focusKeyword} onGenerate={handleAIGenerate} />
      <Stack space={2}>
        {feedbackItems.map((item) => (
          <Flex key={item.text} align="center" gap={2}>
            {DOT(item.color)}
            <Text size={1} muted>
              {item.text}
            </Text>
          </Flex>
        ))}
      </Stack>
    </Stack>
  );
};

export default SEOTitleFeedback;
