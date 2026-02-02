export const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1280px",
} as const;

export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  laptop: `@media (max-width: ${breakpoints.laptop})`,
  desktop: `@media (max-width: ${breakpoints.desktop})`,
  minMobile: `@media (min-width: ${breakpoints.mobile})`,
  minTablet: `@media (min-width: ${breakpoints.tablet})`,
  minLaptop: `@media (min-width: ${breakpoints.laptop})`,
  minDesktop: `@media (min-width: ${breakpoints.desktop})`,
} as const;
