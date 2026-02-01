import { generateI18nRoutes } from "~/data/i18n";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const siteUrl = (config.public.siteUrl as string) || "https://example.com";

  setHeader(event, "content-type", "application/xml; charset=utf-8");

  const routes = generateI18nRoutes();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((path) => `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc></url>`)
  .join("\n")}
</urlset>
`;

  return body;
});

