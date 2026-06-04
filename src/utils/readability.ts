function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (clean.length <= 3) return 1;
  const stripped = clean.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const matches = stripped.match(/[aeiouy]{1,2}/g);
  return Math.max(1, matches?.length ?? 1);
}

function countSentences(text: string): number {
  return Math.max(1, text.split(/[.!?]+/).filter((s) => s.trim().length > 2).length);
}

export interface ReadabilityResult {
  score: number;
  label: string;
  color: "green" | "orange" | "red";
}

export function getReadabilityScore(text: string): ReadabilityResult | null {
  if (!text || text.trim().split(/\s+/).length < 10) return null;

  const words = text.trim().split(/\s+/).filter(Boolean);
  const sentences = countSentences(text);
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);

  const score = 206.835 - 1.015 * (words.length / sentences) - 84.6 * (syllables / words.length);
  const clamped = Math.max(0, Math.min(100, score));

  if (clamped >= 70)
    return {
      score: clamped,
      label: "Easy — great for general audiences and AI citation",
      color: "green",
    };
  if (clamped >= 50)
    return {
      score: clamped,
      label: "Moderate — good for informed readers",
      color: "orange",
    };
  return {
    score: clamped,
    label: "Difficult — simplify for better AI search visibility",
    color: "red",
  };
}
