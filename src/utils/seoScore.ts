/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SEOCheck {
  name: string;
  pass: boolean | "partial";
  points: number;
  maxPoints: number;
  hint: string;
}

export interface SEOScoreResult {
  score: number;
  checks: SEOCheck[];
  color: "green" | "orange" | "red";
  label: string;
}

export function computeSEOScore(value: Record<string, any> | undefined): SEOScoreResult {
  const v = value || {};
  const checks: SEOCheck[] = [];

  // Title — 20 pts
  const titleLen = (v.metaTitle || "").length;
  if (titleLen >= 50 && titleLen <= 60) {
    checks.push({
      name: "Meta Title",
      pass: true,
      points: 20,
      maxPoints: 20,
      hint: `Perfect length (${titleLen} chars)`,
    });
  } else if (titleLen > 0) {
    checks.push({
      name: "Meta Title",
      pass: "partial",
      points: 10,
      maxPoints: 20,
      hint: titleLen < 50 ? `Too short (${titleLen}/50–60)` : `Too long (${titleLen}/60)`,
    });
  } else {
    checks.push({
      name: "Meta Title",
      pass: false,
      points: 0,
      maxPoints: 20,
      hint: "No meta title set",
    });
  }

  // Description — 20 pts
  const descLen = (v.metaDescription || "").length;
  if (descLen >= 100 && descLen <= 160) {
    checks.push({
      name: "Description",
      pass: true,
      points: 20,
      maxPoints: 20,
      hint: `Perfect length (${descLen} chars)`,
    });
  } else if (descLen > 0) {
    checks.push({
      name: "Description",
      pass: "partial",
      points: 10,
      maxPoints: 20,
      hint: descLen < 100 ? `Too short (${descLen}/100–160)` : `Too long (${descLen}/160)`,
    });
  } else {
    checks.push({
      name: "Description",
      pass: false,
      points: 0,
      maxPoints: 20,
      hint: "No meta description set",
    });
  }

  // Focus keyword — 15 pts
  const kw = (v.focusKeyword || "").toLowerCase().trim();
  if (kw) {
    const inTitle = v.metaTitle?.toLowerCase().includes(kw);
    const inDesc = v.metaDescription?.toLowerCase().includes(kw);
    if (inTitle && inDesc) {
      checks.push({
        name: "Focus Keyword",
        pass: true,
        points: 15,
        maxPoints: 15,
        hint: "Keyword in title and description",
      });
    } else if (inTitle || inDesc) {
      checks.push({
        name: "Focus Keyword",
        pass: "partial",
        points: 8,
        maxPoints: 15,
        hint: `Keyword in ${inTitle ? "title" : "description"} only`,
      });
    } else {
      checks.push({
        name: "Focus Keyword",
        pass: false,
        points: 0,
        maxPoints: 15,
        hint: "Keyword not found in title or description",
      });
    }
  } else {
    checks.push({
      name: "Focus Keyword",
      pass: false,
      points: 0,
      maxPoints: 15,
      hint: "No focus keyword set",
    });
  }

  // Meta image — 10 pts
  if (v.metaImage?.asset) {
    checks.push({
      name: "Meta Image",
      pass: true,
      points: 10,
      maxPoints: 10,
      hint: "Meta image is set",
    });
  } else {
    checks.push({
      name: "Meta Image",
      pass: false,
      points: 0,
      maxPoints: 10,
      hint: "No meta image",
    });
  }

  // Open Graph — 15 pts
  const og = v.openGraph || {};
  if (og.title && og.description && og.image?.asset) {
    checks.push({
      name: "Open Graph",
      pass: true,
      points: 15,
      maxPoints: 15,
      hint: "Fully configured",
    });
  } else if (og.title || og.description) {
    checks.push({
      name: "Open Graph",
      pass: "partial",
      points: 7,
      maxPoints: 15,
      hint: "Partially configured — add title, description and image",
    });
  } else {
    checks.push({
      name: "Open Graph",
      pass: false,
      points: 0,
      maxPoints: 15,
      hint: "Not configured",
    });
  }

  // Twitter — 10 pts
  if (v.twitter?.cardType) {
    checks.push({
      name: "Twitter Card",
      pass: true,
      points: 10,
      maxPoints: 10,
      hint: "Twitter card is set",
    });
  } else {
    checks.push({
      name: "Twitter Card",
      pass: false,
      points: 0,
      maxPoints: 10,
      hint: "No Twitter card type",
    });
  }

  const score = checks.reduce((s, c) => s + c.points, 0);

  let color: "green" | "orange" | "red";
  let label: string;
  if (score >= 80) {
    color = "green";
    label = "Good";
  } else if (score >= 50) {
    color = "orange";
    label = "Needs Work";
  } else {
    color = "red";
    label = "Poor";
  }

  return { score, checks, color, label };
}
