import { AIConfig } from "../types/PluginConfig";

export type AIField = "title" | "description" | "keywords";

const TITLE_ANGLES = [
  "lead with a strong action verb",
  "lead with the benefit to the reader",
  "use a how-to format",
  "use a question format",
  "lead with a number or statistic",
  "use a curiosity-driven hook",
  "emphasise speed or ease",
  "emphasise expertise or depth",
];

const DESC_ANGLES = [
  "open with a direct answer, then add a call to action",
  "open with a pain point the reader has, then offer the solution",
  "open with a bold claim, then back it up briefly",
  "open with who this is for, then what they will get",
  "open with a question, then promise the answer",
  "open with a surprising fact or statistic",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildPrompt(field: AIField, content: string, keyword: string): string {
  const keywordLine = keyword ? `Focus keyword: "${keyword}"` : "";
  const snippet = content.slice(0, 2000);

  if (field === "title") {
    const angle = pick(TITLE_ANGLES);
    return `You are an SEO expert. Generate one SEO-optimized meta title using this specific angle: ${angle}.
Requirements:
- Exactly 50–60 characters (count carefully)
- ${keywordLine || "Make it compelling and clear"}
- Apply the angle: ${angle}
- Return ONLY the title text, no quotes, no explanation, no character count

Page content:
${snippet}`;
  }

  if (field === "description") {
    const angle = pick(DESC_ANGLES);
    return `You are an SEO expert. Generate one SEO-optimized meta description using this specific angle: ${angle}.
Requirements:
- Exactly 100–160 characters (count carefully)
- ${keywordLine || "Include a clear call to action"}
- Apply the angle: ${angle}
- Return ONLY the description text, no quotes, no explanation, no character count

Page content:
${snippet}`;
  }

  return `You are an SEO expert. Generate 8 relevant SEO keywords for this page.
Requirements:
- Return a comma-separated list only
- No explanation, no numbering, just keywords
- Mix short-tail and long-tail keywords

Page content:
${snippet}`;
}

async function callOpenAI(prompt: string, config: AIConfig): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 1.0,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "OpenAI request failed");
  return (data.choices?.[0]?.message?.content || "").trim();
}

async function callGroq(prompt: string, config: AIConfig): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 1.0,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Groq request failed");
  return (data.choices?.[0]?.message?.content || "").trim();
}

async function callAnthropic(prompt: string, config: AIConfig): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: config.model || "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Anthropic request failed");
  return (data.content?.[0]?.text || "").trim();
}

export async function generateSEOContent(
  field: AIField,
  bodyContent: string,
  focusKeyword: string,
  config: AIConfig,
): Promise<string> {
  const prompt = buildPrompt(field, bodyContent, focusKeyword);
  if (config.provider === "anthropic") return callAnthropic(prompt, config);
  if (config.provider === "groq") return callGroq(prompt, config);
  return callOpenAI(prompt, config);
}
