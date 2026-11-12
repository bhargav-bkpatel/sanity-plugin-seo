import React from "react";
import { ObjectInputProps } from "sanity";
import { Flex } from "@sanity/ui";
import SocialPreviewCard from "./SocialPreviewCard";

/* eslint-disable @typescript-eslint/no-explicit-any */

const OpenGraphInput = ({ renderDefault, path, value, ...rest }: ObjectInputProps) => {
  const props = { renderDefault, path, value, ...rest };

  return (
    <Flex direction="column" gap={4}>
      {renderDefault(props)}
      <SocialPreviewCard value={value as Record<string, any> | undefined} />
    </Flex>
  );
};

export default OpenGraphInput;
