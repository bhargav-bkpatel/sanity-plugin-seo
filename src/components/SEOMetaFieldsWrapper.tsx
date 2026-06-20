import React, { useMemo, useCallback } from "react";
import { ObjectInputProps, PatchEvent, set, MemberField } from "sanity";
import { Stack, Box } from "@sanity/ui";
import AIKeywordsSection from "./AIKeywordsSection";
import { computeSEOScore } from "../utils/seoScore";
import SEOScoreDisplay from "./SEOScoreDisplay";
import GEOChecklist from "./GEOChecklist";
import MetaTagsPreview from "./MetaTagsPreview";
import SERPPreview from "./pro/SERPPreview";
import AdvancedValidation from "./pro/AdvancedValidation";

/* eslint-disable @typescript-eslint/no-explicit-any */

const HR = () => (
  <Box style={{ borderTop: "1px solid var(--card-border-color)", margin: "4px 0" }} />
);

const SEOMetaFieldsWrapper = ({
  value: rawValue,
  onChange,
  renderDefault,
  ...rest
}: ObjectInputProps) => {
  const value = rawValue as Record<string, any> | undefined;

  const { groups } = rest as any;
  const hasGroups = Array.isArray(groups) && groups.length > 0;
  const selectedGroup = hasGroups ? groups.find((g: any) => g.selected) : undefined;

  const DEFINED_GROUPS = ["basic", "social", "advanced", "schema"];
  const isAllFields =
    !hasGroups ||
    !selectedGroup ||
    !selectedGroup.name ||
    !DEFINED_GROUPS.includes(selectedGroup.name);

  const activeGroup = selectedGroup?.name;

  const scoreResult = useMemo(() => computeSEOScore(value), [value]);

  const handleKeywordsChange = useCallback(
    (keywords: string[]) => {
      onChange(PatchEvent.from(set(keywords, ["seoKeywords"])));
    },
    [onChange],
  );

  const props = { value: rawValue, onChange, renderDefault, ...rest };

  const nofollowMember = props.members.find((m: any) => m.name === "nofollowAttributes");
  const filteredMembers = props.members.filter((m: any) => m.name !== "nofollowAttributes");

  return (
    <Stack space={4}>
      <SEOScoreDisplay result={scoreResult} />

      {(isAllFields || activeGroup === "social") && <GEOChecklist value={value} />}
      {(isAllFields || activeGroup === "advanced") && <SERPPreview value={value} />}

      <HR />

      {renderDefault({ ...props, members: filteredMembers })}

      {(isAllFields || activeGroup === "basic") && (
        <>
          <HR />
          <AIKeywordsSection value={value} onChange={handleKeywordsChange} />
        </>
      )}

      {nofollowMember &&
        nofollowMember.kind === "field" &&
        (isAllFields || activeGroup === "basic") && (
          <>
            <HR />
            <MemberField
              member={nofollowMember}
              renderInput={props.renderInput}
              renderField={props.renderField}
              renderItem={props.renderItem}
              renderPreview={props.renderPreview}
            />
          </>
        )}

      {(isAllFields || activeGroup === "advanced") && (
        <>
          <HR />
          <AdvancedValidation value={value} onChange={onChange} />
        </>
      )}

      {(isAllFields || activeGroup === "social" || activeGroup === "advanced") && (
        <>
          <HR />
          <MetaTagsPreview value={value} />
        </>
      )}
    </Stack>
  );
};

export default SEOMetaFieldsWrapper;
