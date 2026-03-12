import { Helmet } from "react-helmet-async";

interface PageSeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  siteName?: string;
}

export function PageSeo({ title, description, path = "/", image, siteName }: PageSeoProps) {
  const siteUrl = import.meta.env.VITE_SITE_URL ?? "http://localhost:5173";
  const canonical = `${siteUrl}${path}`;
  const resolvedSiteName =
    siteName?.trim() ||
    import.meta.env.VITE_SITE_NAME ||
    "Aggimalla Abhishek";
  const fullTitle = `${title} | ${resolvedSiteName}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      {image ? <meta property="og:image" content={image} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
