/* eslint-disable @typescript-eslint/no-explicit-any */
export default function portableTextToString(value: unknown): string {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";

  return value
    .filter((block: any) => block?._type === "block")
    .map((block: any) =>
      (block.children || [])
        .filter((child: any) => child._type === "span")
        .map((child: any) => child.text || "")
        .join(""),
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
