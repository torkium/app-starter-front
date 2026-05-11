export const messages = {
  fr: {
    common: {
      language: "Langue",
      cookies: "Cookies",
      install: "Installer l’application",
    },
  },
  en: {
    common: {
      language: "Language",
      cookies: "Cookies",
      install: "Install app",
    },
  },
} as const;

export type Locale = keyof typeof messages;
