import { computed } from "vue";
import { supportedLocales, defaultLocale } from "~/data/i18n";

export const usePageSeo = (titleKey: string, descriptionKey: string) => {
  const { t, switchLocalePath } = useI18n();
  const route = useRoute();
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl || "https://example.com";
  const switchLocale = useSwitchLocalePath();

  useSeoMeta({
    title: computed(() => t(titleKey)),
    description: computed(() => t(descriptionKey))
  });

  useHead(() => {
    const canonicalPath = route.path;
    const canonicalUrl = `${siteUrl}${canonicalPath}`;
    const links = supportedLocales.map((locale) => {
      const path = switchLocale(locale.code) || canonicalPath;
      return {
        rel: "alternate",
        hreflang: locale.code,
        href: `${siteUrl}${path}`
      };
    });

    const defaultPath = switchLocale(defaultLocale) || canonicalPath;
    links.push({ rel: "alternate", hreflang: "x-default", href: `${siteUrl}${defaultPath}` });
    links.push({ rel: "canonical", href: canonicalUrl });

    return { link: links };
  });
};
