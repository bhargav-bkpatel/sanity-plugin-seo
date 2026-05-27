import React, { useMemo, useCallback } from "react";
import { ObjectInputProps, PatchEvent, set } from "sanity";
import { Stack, Box } from "@sanity/ui";
import AIKeywordsSection from "./AIKeywordsSection";
import { computeSEOScore } from "../utils/seoScore";
import SEOScoreDisplay from "./SEOScoreDisplay";
import GEOChecklist from "./GEOChecklist";
import MetaTagsPreview from "./MetaTagsPreview";
import SERPPreview from "./pro/SERPPreview";
import AdvancedValidation from "./pro/AdvancedValidation";
import AutomationPanel from "./pro/AutomationPanel";

/* eslint-disable @typescript-eslint/no-explicit-any */

const HR = () => <Box style={{ borderTop: "1px solid #e2e8f0", margin: "4px 0" }} />;

const SEOMetaFieldsWrapper = ({
  value: rawValue,
  onChange,
  renderDefault,
  ...rest
}: ObjectInputProps) => {
  const value = rawValue as Record<string, any> | undefined;

  // Detect which tab/group is currently active
  const activeGroup: string = (rest as any).groups?.find((g: any) => g.selected)?.name ?? "basic";

  const scoreResult = useMemo(() => computeSEOScore(value), [value]);

  const handleKeywordsChange = useCallback(
    (keywords: string[]) => {
      onChange(PatchEvent.from(set(keywords, ["seoKeywords"])));
    },
    [onChange],
  );

  const props = { value: rawValue, onChange, renderDefault, ...rest };

  return (
    <Stack space={4}>
      {/* SEO Score — always visible */}
      <SEOScoreDisplay result={scoreResult} />

      {/* GEO Checklist — Basic tab only */}
      {activeGroup === "basic" && <GEOChecklist value={value} />}

      {/* SERP Preview — Basic tab */}
      {activeGroup === "basic" && <SERPPreview value={value} />}

      <HR />

      {/* All standard fields rendered by Sanity (tab bar + active group fields) */}
      {renderDefault(props)}

      {/* AI Keyword Suggestions — Basic tab only */}
      {activeGroup === "basic" && (
        <>
          <HR />
          <AIKeywordsSection value={value} onChange={handleKeywordsChange} />
        </>
      )}

      {/* Advanced Validation + Automation — Advanced tab */}
      {activeGroup === "advanced" && (
        <>
          <HR />
          <AdvancedValidation value={value} onChange={onChange} />
          <HR />
          <AutomationPanel value={value} onChange={onChange} />
        </>
      )}

      {/* Meta Tags Preview — Basic and Advanced tabs */}
      {(activeGroup === "basic" || activeGroup === "advanced") && (
        <>
          <HR />
          <MetaTagsPreview value={value} />
        </>
      )}
    </Stack>
  );
};

export default SEOMetaFieldsWrapper;
