import type { ImageRule } from "@sanity/types";

export function webpImageValidation(rule: ImageRule) {
  return rule.custom((value) => {
    if (!value || typeof value !== "object" || !("asset" in value)) return true;

    const asset = value.asset;
    if (!asset || typeof asset !== "object" || !("_ref" in asset) || typeof asset._ref !== "string") {
      return true;
    }

    return /-webp$/i.test(asset._ref)
      ? true
      : {
          message: "This image is not WebP. For smaller files and faster pages, upload a .webp version if available.",
          level: "warning" as const,
        };
  });
}
