import { computed } from "vue";
import { supportedLocales } from "~/data/i18n";
import ogImage from "~/assets/images/screenshots/light.svg";

type PageSeoImage = {
  url: string;
  width?: number;
  height?: number;
  type?: string;
  alt?: string;
};

type PageSeoOptions = {
  type?: "website" | "article";
  robots?: string;
  image?: PageSeoImage;
};

export const usePageSeo = (titleKey: string, descriptionKey: string, options: PageSeoOptions = {}) => {
  const { t, locale } = useI18n();
  const route = useRoute();
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl || "https://example.com";
  const siteName = (config as any)?.site?.name || "VoicetextAI";
  const switchLocale = useSwitchLocalePath();

  const title = computed(() => t(titleKey));
  const description = computed(() => t(descriptionKey));

  const canonicalPath = computed(() => route.path);
  const canonicalUrl = computed(() => `${siteUrl}${canonicalPath.value}`);

  const resolvedImage = computed<PageSeoImage>(() => {
    if (options.image) return options.image;
    return {
      url: ogImage,
      width: 1200,
      height: 750,
      type: "image/svg+xml",
      alt: `${siteName} — voice to text`
    };
  });

  const resolvedImageUrl = computed(() => {
    // Если сборщик вернул относительный путь — сделаем абсолютный.
    const url = resolvedImage.value.url;
    return url.startsWith("http") ? url : new URL(url, siteUrl).toString();
  });

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: options.type || "website",
    ogSiteName: siteName,
    ogUrl: canonicalUrl,
    ogImage: resolvedImageUrl,
    ogImageType: computed(() => resolvedImage.value.type),
    ogImageWidth: computed(() => (resolvedImage.value.width ? String(resolvedImage.value.width) : undefined)),
    ogImageHeight: computed(() => (resolvedImage.value.height ? String(resolvedImage.value.height) : undefined)),
    ogImageAlt: computed(() => resolvedImage.value.alt),
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: resolvedImageUrl,
    twitterImageAlt: computed(() => resolvedImage.value.alt),
    robots:
      options.robots ||
      "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
  });

  useHead(() => {
    const links = supportedLocales.map((locale) => {
      const path = switchLocale(locale.code) || canonicalPath.value;
      return {
        rel: "alternate",
        hreflang: locale.code,
        href: `${siteUrl}${path}`
      };
    });

    const defaultPath = switchLocale(defaultLocale) || canonicalPath.value;
    links.push({ rel: "alternate", hreflang: "x-default", href: `${siteUrl}${defaultPath}` });
    links.push({ rel: "canonical", href: canonicalUrl.value });

    const jsonLd: any[] = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteName,
        url: siteUrl
      }
    ];

    // Для главной и страницы скачивания добавим более “вкусную” разметку.
    const isDownload = canonicalPath.value.endsWith("/download");
    const isHome = canonicalPath.value === "/";
    if (isHome || isDownload) {
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: siteName,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Windows, macOS, Linux",
        description: description.value,
        url: canonicalUrl.value,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        },
        downloadUrl: config.public.githubReleasesUrl || `https://github.com/${config.public.githubRepo}/releases`
      });
    }

    return {
      htmlAttrs: { lang: locale.value || "en" },
      link: links,
      meta: [
        { name: "application-name", content: siteName },
        { name: "apple-mobile-web-app-title", content: siteName },
        { name: "format-detection", content: "telephone=no" },
        { name: "theme-color", content: "#6366f1" }
      ],
      script: jsonLd.map((item) => ({
        type: "application/ld+json",
        children: JSON.stringify(item)
      }))
    };
  });
};
