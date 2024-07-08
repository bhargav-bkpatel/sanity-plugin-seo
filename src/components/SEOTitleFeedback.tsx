import { StringInputProps, useClient, set } from 'sanity';
import { useEffect } from 'react';
import { Stack, Text } from '@sanity/ui';

const SEOFeedback = (props: StringInputProps) => {
  const { onChange, value, renderDefault } = props;
  const client = useClient({ apiVersion: '2021-06-07' });

  useEffect(() => {
    const fetchData = async () => {
      await client.fetch("*[_type=='homePage'][0]{'title':seo.metaTitle}").then(data => {
        const title = data?.title;
        if (title && !value) {
          onChange(set(title));
        }
      });
    };
    fetchData();
  }, [client, onChange, value]);

  const getWordCount = (title: string) => {
    return title.trim().split(/\s+/).length;
  };

  const getTitleFeedback = (title: string) => {
    const wordCount = getWordCount(title);
    if (wordCount === 1) {
      return { text: 'Please add some content.', color: 'red' };
    }
    if (wordCount >= 1 && wordCount <= 2) {
      return {
        text: `The text contains ${wordCount} words. This is below the recommended minimum of 1 words. Add more content.`,
        color: 'red'
      };
    }
    if (wordCount >= 3 && wordCount <= 8) {
      return {
        text: `The text contains ${wordCount} words. This is slightly below the recommended minimum of 8 words. Add more content.`,
        color: 'orange'
      };
    }
    return { text: `The text contains ${wordCount} words. Good job!`, color: 'green' };
  };

  const { text, color } = getTitleFeedback(value || '');

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <div style={{ minWidth: '15px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: color,
              borderRadius: '50%'
            }}
          />
        </div>
        <Text weight="bold" muted size={14}>
          Text length: {text}
        </Text>
      </div>
    </Stack>
  );
};

export default SEOFeedback;
