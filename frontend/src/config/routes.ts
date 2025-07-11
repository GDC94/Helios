// Internal application routes
export const APP_ROUTES = {
  ROOT: "/",
  HOME: "/",
  DASHBOARD: "/dashboard",
  REPORTS: "/reports",
  IDEAS: "/ideas",
  SETTINGS: "/settings",
  NOT_FOUND: "*",
} as const;

export const EXTERNAL_LINKS = {
  GITHUB: {
    PERSONAL: "https://github.com/GDC94",
    REPOSITORY: "https://github.com/GDC94/sentora",
  },
  SOCIAL: {
    LINKEDIN: "https://www.linkedin.com/in/german-derbes-catoni/",
    EMAIL: "mailto:germanderbescatoni@gmail.com",
  },
  DOCUMENTATION: {
    API_DOCS: "/api/docs",
    PROJECT_DOCS: "/docs",
  },
} as const;

export const NAVIGATION_ITEMS = [
  {
    name: "Home",
    path: APP_ROUTES.HOME,
    external: false,
  },
  {
    name: "Dashboard",
    path: APP_ROUTES.DASHBOARD,
    external: false,
  },
] as const;

export const FOOTER_QUICK_LINKS = [
  {
    name: "Dashboard",
    href: APP_ROUTES.DASHBOARD,
  },
  {
    name: "GitHub",
    href: EXTERNAL_LINKS.GITHUB.PERSONAL,
  },
] as const;

export const FOOTER_SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: EXTERNAL_LINKS.GITHUB.PERSONAL,
  },
  {
    name: "LinkedIn",
    href: EXTERNAL_LINKS.SOCIAL.LINKEDIN,
  },
  {
    name: "Email",
    href: EXTERNAL_LINKS.SOCIAL.EMAIL,
  },
] as const;
