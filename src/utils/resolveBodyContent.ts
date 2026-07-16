/* eslint-disable @typescript-eslint/no-explicit-any */
import portableTextToString from "./portableTextToString";

const get = (obj: unknown, key: string): unknown =>
  obj != null && typeof obj === "object" ? (obj as Record<string, unknown>)[key] : undefined;

function resolvePath(doc: unknown, path: string | string[]): unknown[] {
  if (Array.isArray(path)) {
    return [path.reduce<unknown>(get, doc)];
  }
  const parts = path.split("[].");
  const walk = (val: unknown, rem: string[]): unknown[] => {
    const [head, ...rest] = rem;
    const cur = head.split(".").reduce<unknown>(get, val);
    if (!rest.length) return [cur];
    return Array.isArray(cur) ? cur.flatMap((item) => walk(item, rest)) : [];
  };
  return walk(doc, parts);
}

export function resolveBodyContent(doc: unknown, fieldPaths: Array<string | string[]>): string {
  return fieldPaths
    .flatMap((path) => resolvePath(doc, path).map(portableTextToString).filter(Boolean))
    .join(" ")
    .trim();
}

export function getBodyFieldPaths(
  bodyFields?: Array<string | string[]>,
  bodyField?: string,
): Array<string | string[]> {
  return bodyFields?.length ? bodyFields : [bodyField || "body"];
}
