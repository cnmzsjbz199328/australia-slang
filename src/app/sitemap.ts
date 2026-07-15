import type { MetadataRoute } from "next";
import { getAllSlang } from "@/lib/slang";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/slang", "/quiz"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const slangRoutes = getAllSlang().map((t) => ({
    url: `${SITE_URL}/slang/${t.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...slangRoutes];
}
