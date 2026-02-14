export type LocaleCode = "en" | "ru" | "es" | "fr" | "de" | "uk";

export const supportedLocales = [
  { code: "en", iso: "en-US", name: "English", flag: "🇺🇸", file: "en.json" },
  { code: "ru", iso: "ru-RU", name: "Русский", flag: "🇷🇺", file: "ru.json" },
  { code: "es", iso: "es-ES", name: "Español", flag: "🇪🇸", file: "es.json" },
  { code: "fr", iso: "fr-FR", name: "Français", flag: "🇫🇷", file: "fr.json" },
  { code: "de", iso: "de-DE", name: "Deutsch", flag: "🇩🇪", file: "de.json" },
  { code: "uk", iso: "uk-UA", name: "Українська", flag: "🇺🇦", file: "uk.json" }
] as const;

export const defaultLocale: LocaleCode = "en";

export const pages = [
  "/",
  "/download",
  "/privacy",
  "/privacy-policy",
  "/terms",
  "/refund-policy",
  "/checkout-success",
  "/pay"
] as const;

/** Страницы для sitemap — без транзакционных (noindex) */
export const sitemapPages = [
  "/",
  "/download",
  "/privacy",
  "/privacy-policy",
  "/terms",
  "/refund-policy"
] as const;

/** Генерирует i18n-маршруты для заданного списка страниц */
const buildI18nRoutes = (source: readonly string[]): string[] => {
  const routes: string[] = [];
  for (const page of source) {
    routes.push(page);
    for (const locale of supportedLocales) {
      if (locale.code === defaultLocale) continue;
      routes.push(page === "/" ? `/${locale.code}` : `/${locale.code}${page}`);
    }
  }
  return routes;
};

/** Все i18n-маршруты (для prerender) */
export const generateI18nRoutes = (): string[] => buildI18nRoutes(pages);

/** i18n-маршруты только для sitemap (без noindex-страниц) */
export const generateSitemapRoutes = (): string[] => buildI18nRoutes(sitemapPages);
