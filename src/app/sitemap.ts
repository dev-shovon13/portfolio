import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/work";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kawser-ahmed-shovon.pages.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, priority: 1 },
    ...caseStudies.filter((c) => !c.withheld).map((c) => ({ url: `${siteUrl}/work/${c.slug}`, priority: 0.7 })),
  ];
}
