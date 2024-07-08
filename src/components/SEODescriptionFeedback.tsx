import { StringInputProps, useClient, set } from 'sanity';
import { useEffect } from 'react';
import { Stack, Text } from '@sanity/ui';

const SEODescriptionFeedback = (props: StringInputProps) => {
  const { onChange, value, renderDefault } = props;
  const client = useClient({ apiVersion: '2021-06-07' });

  useEffect(() => {
    const fetchData = async () => {
      await client
        .fetch("*[_type=='homePage'][0]{'description':seo.metaDescription}")
        .then(data => {
          const description = data?.description;
          if (description && !value) {
            onChange(set(description));
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
      return {
        text: 'No meta description has been specified. Search engines will display copy from the page instead. Make sure to write one!',
        color: 'red'
      };
    }
    if (wordCount <= 20) {
      return {
        text: `The meta description is too short (under ${wordCount} characters). Up to 60 characters are available. Use the space!`,
        color: 'orange'
      };
    }
    return { text: `Well done!`, color: 'green' };
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
          Meta description length: {text}
        </Text>
      </div>
    </Stack>
  );
};

export default SEODescriptionFeedback;
