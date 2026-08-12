import type { MetadataRoute } from "next";
import { isPublicDeployment, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: isPublicDeployment ? "/" : undefined,
      disallow: isPublicDeployment ? undefined : "/",
      userAgent: "*",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
