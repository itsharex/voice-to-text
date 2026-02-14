export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const siteUrl = (config.public.siteUrl as string) || "https://example.com";

  setHeader(event, "content-type", "text/plain; charset=utf-8");

  return `User-agent: *
Allow: /
Disallow: /checkout-success
Disallow: /pay
Disallow: /*/checkout-success
Disallow: /*/pay
Sitemap: ${siteUrl}/sitemap.xml
`;
});

