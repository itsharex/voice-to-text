import en from "~/content/en.json";
import ru from "~/content/ru.json";
import es from "~/content/es.json";
import fr from "~/content/fr.json";
import de from "~/content/de.json";
import uk from "~/content/uk.json";
import type { LandingContent, LocalizedContent } from "~/types/content";
import type { LocaleCode } from "~/data/i18n";

export const contentByLocale: LocalizedContent = {
  en,
  ru,
  es,
  fr,
  de,
  uk
};

export const getContent = (locale: LocaleCode): LandingContent => {
  return contentByLocale[locale] ?? contentByLocale.en;
};
