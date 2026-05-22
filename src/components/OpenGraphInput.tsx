import React from "react";
import { ObjectInputProps } from "sanity";
import { Stack } from "@sanity/ui";
import SocialPreviewCard from "./SocialPreviewCard";

/* eslint-disable @typescript-eslint/no-explicit-any */

const OpenGraphInput = ({ renderDefault, path, value, ...rest }: ObjectInputProps) => {
  const props = { renderDefault, path, value, ...rest };

  return (
    <Stack space={4}>
      {renderDefault(props)}
      <SocialPreviewCard value={value as Record<string, any> | undefined} />
    </Stack>
  );
};

export default OpenGraphInput;
