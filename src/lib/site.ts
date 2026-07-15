// Canonical site URL, overridable at build time for previews/custom domains.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://australiaslang.futurebutnow.xyz"
).replace(/\/$/, "");
