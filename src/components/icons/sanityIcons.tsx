import React, { forwardRef, type SVGProps } from "react";

/*
 * The Sanity icons this plugin uses, copied from @sanity/icons 3.7.4 (MIT, Copyright (c) Sanity.io).
 * @sanity/icons 5 (Sanity 6) dropped most root exports in favour of per-icon subpaths that v3 lacks,
 * so local copies keep the same icons working on every Studio from Sanity 3 to 6.
 */

type IconProps = SVGProps<SVGSVGElement>;

function createIcon(name: string, viewBox: string, inner: string) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(props, ref) {
    return (
      <svg
        data-sanity-icon={name}
        width="1em"
        height="1em"
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={ref}
        // Static, trusted SVG paths copied from @sanity/icons.
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: inner }}
      />
    );
  });
  Icon.displayName = name;
  return Icon;
}

export const ChevronLeftIcon = createIcon(
  "chevron-left",
  "0 0 25 25",
  '<path d="M15 17L10.5 12.5L15 8" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);

export const CodeBlockIcon = createIcon(
  "code-block",
  "0 0 25 25",
  '<path d="M11 15L8.5 12.5L11 10M14 10L16.5 12.5L14 15M5.5 6.5H19.5V18.5H5.5V6.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);

export const EarthGlobeIcon = createIcon(
  "earth-globe",
  "0 0 25 25",
  '<path d="M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path><path d="M20.5 12.5H4.5M12.5 20.5C12.5 20.5 9.5 17.5 9.5 12.5C9.5 7.5 12.5 4.5 12.5 4.5C12.5 4.5 15.5 7.5 15.5 12.5C15.5 17.5 12.5 20.5 12.5 20.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);

export const LockIcon = createIcon(
  "lock",
  "0 0 25 25",
  '<path d="M15.5 11.5V8.5C15.5 6.5 14 5.5 12.5 5.5C11 5.5 9.5 6.5 9.5 8.5V11.5M7.5 11.5H17.5V19.5H7.5V11.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);

export const SparklesIcon = createIcon(
  "sparkles",
  "0 0 25 25",
  '<path d="M11 3.5V5M11 5V6.5M11 5H12.5M11 5H9.5M9.5 15C9.5 15 12.2308 14.7692 13.5 13.5C14.7692 12.2308 15 9.5 15 9.5C15 9.5 15.2308 12.2308 16.5 13.5C17.7692 14.7692 20.5 15 20.5 15C20.5 15 17.7692 15.2308 16.5 16.5C15.2308 17.7692 15 20.5 15 20.5C15 20.5 14.7692 17.7692 13.5 16.5C12.2308 15.2308 9.5 15 9.5 15ZM4.5 10C4.5 10 5.72308 9.87692 6.3 9.3C6.87692 8.72308 7 7.5 7 7.5C7 7.5 7.12308 8.72308 7.7 9.3C8.27692 9.87692 9.5 10 9.5 10C9.5 10 8.27692 10.1231 7.7 10.7C7.12308 11.2769 7 12.5 7 12.5C7 12.5 6.87692 11.2769 6.3 10.7C5.72308 10.1231 4.5 10 4.5 10Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>',
);

export const RefreshIcon = createIcon(
  "refresh",
  "0 0 25 25",
  '<path d="M19.5 13.5C19.5 17.366 16.366 20.5 12.5 20.5C8.63401 20.5 5.5 17.366 5.5 13.5C5.5 9.63401 8.63401 6.5 12.5 6.5H15.5" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path><path d="M11.5 10.5L15.5 6.5L11.5 2.5" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);

export const SearchIcon = createIcon(
  "search",
  "0 0 25 25",
  '<path d="M15.0355 15.0355L20 20M16.5 11.5C16.5 14.2614 14.2614 16.5 11.5 16.5C8.73858 16.5 6.5 14.2614 6.5 11.5C6.5 8.73858 8.73858 6.5 11.5 6.5C14.2614 6.5 16.5 8.73858 16.5 11.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);

export const DownloadIcon = createIcon(
  "download",
  "0 0 25 25",
  '<path d="M19.5 17V19.5H5.5V17M12.5 16L12.5 5" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path><path d="M17.5 11L12.5 16L7.5 11" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);

export const ChevronRightIcon = createIcon(
  "chevron-right",
  "0 0 25 25",
  '<path d="M10 8L14.5 12.5L10 17" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);

export const ActivityIcon = createIcon(
  "activity",
  "0 0 25 25",
  '<path d="M21 15H19L15.5 7L11 18L8 12L6 15H4" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);

export const CheckmarkCircleIcon = createIcon(
  "checkmark-circle",
  "0 0 25 25",
  '<path d="M9.5 12.1316L11.7414 14.5L16 10M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);

export const EditIcon = createIcon(
  "edit",
  "0 0 25 25",
  '<path d="M15 7L18 10M6 19L7 15L17 5L20 8L10 18L6 19Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);

export const ClockIcon = createIcon(
  "clock",
  "0 0 25 25",
  '<path d="M12.5 8V12.5L15.5 15.5M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);

export const UploadIcon = createIcon(
  "upload",
  "0 0 25 25",
  '<path d="M12.5 6V15.5M5.5 15.5H19.5V19.5H5.5V15.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path><path d="M7.5 11L12.5 6L17.5 11" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);

export const ChevronDownIcon = createIcon(
  "chevron-down",
  "0 0 25 25",
  '<path d="M17 10L12.5 14.5L8 10" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);

export const LaunchIcon = createIcon(
  "launch",
  "0 0 25 25",
  '<path d="M12 7.5H6.5V18.5H17.5V13M19.5 5.5L10.5 14.5" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path><path d="M14 5.5H19.5V11" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);

export const WarningOutlineIcon = createIcon(
  "warning-outline",
  "0 0 25 25",
  '<path d="M12.5 9V13M12.5 16V14.5M14.2239 5.43058L20.727 16.486C21.5113 17.8192 20.55 19.5 19.0032 19.5H5.99683C4.45 19.5 3.48869 17.8192 4.27297 16.486L10.7761 5.43058C11.5494 4.11596 13.4506 4.11596 14.2239 5.43058Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);

export const DocumentsIcon = createIcon(
  "documents",
  "0 0 25 25",
  '<path d="M10.5 4.5V9.5H5.5" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path><path d="M16.5 7.5H19.5V21.5H8.5V18.5M10.5 4.5H16.5V18.5H5.5V9.5L10.5 4.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path>',
);
