import { useRootTheme } from "@sanity/ui";

/**
 * True when Studio renders in dark mode. `useRootTheme().scheme` works on every @sanity/ui version
 * the plugin supports (2.16 in Sanity 3, 3.x, and 4 in Sanity 6), unlike `useTheme().sanity`.
 */
export default function useIsDarkMode(): boolean {
  return useRootTheme().scheme === "dark";
}
