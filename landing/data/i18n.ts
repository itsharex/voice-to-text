export type LocaleCode = "en" | "ru" | "es" | "fr" | "de" | "uk";

export const supportedLocales = [
  { code: "en", iso: "en-US", name: "English", file: "en.json" },
  { code: "ru", iso: "ru-RU", name: "Русский", file: "ru.json" },
  { code: "es", iso: "es-ES", name: "Español", file: "es.json" },
  { code: "fr", iso: "fr-FR", name: "Français", file: "fr.json" },
  { code: "de", iso: "de-DE", name: "Deutsch", file: "de.json" },
  { code: "uk", iso: "uk-UA", name: "Українська", file: "uk.json" }
] as const;

export const defaultLocale: LocaleCode = "en";

export const pages = ["/", "/download", "/privacy"] as const;

export const generateI18nRoutes = (): string[] => {
  const routes: string[] = [];
  for (const page of pages) {
    routes.push(page);
    for (const locale of supportedLocales) {
      if (locale.code === defaultLocale) {
        continue;
      }
      routes.push(page === "/" ? `/${locale.code}` : `/${locale.code}${page}`);
    }
  }
  return routes;
};
