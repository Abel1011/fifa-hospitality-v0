// Subset of web/src/lib/hospitalitySource.ts — only the bits used by Header/Hero/AuthModal.

export const HOSPITALITY_HERO_IMAGE =
  "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/69d95f1cd329a58ab5240e4b_FWC26_Ecomm_Photo_Update_A_788x1000.webp";

export const HOSPITALITY_SOURCE = {
  hero: {
    eyebrow: "Get closer Than Ever To",
    title: "FIFA World Cup 2026™",
    copy:
      "Experience the best of it all with official hospitality packages featuring premium tickets, food & beverage, entertainment, and more. Now available: single matches and private suites!",
    ctas: [
      {
        label: "Browse Matches",
        href: "/matches",
      },
      {
        label: "Browse Suites",
        href: "https://fifaworldcup26.suites.fifa.com/",
      },
    ],
  },
} as const;
