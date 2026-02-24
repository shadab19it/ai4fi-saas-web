export type EcommercePlatformKey =
  | "amazon"
  | "flipkart"
  | "myntra"
  | "nykaa"
  | "meesho"
  | "ebay"
  | "other"

export interface EcommercePlatformPreset {
  label: string
  ratio: string
  resolution: "1K" | "2K"
  width: number
  height: number
  description: string
}

export const ECOMMERCE_PLATFORM_PRESETS: Record<EcommercePlatformKey, EcommercePlatformPreset> = {
  amazon: {
    label: "Amazon",
    ratio: "1:1",
    resolution: "2K",
    width: 2048,
    height: 2048,
    description: "2048×2048 (1:1) · 2K",
  },
  flipkart: {
    label: "Flipkart",
    ratio: "2:3",
    resolution: "2K",
    width: 1365,
    height: 2048,
    description: "1365×2048 (2:3) · 2K",
  },
  myntra: {
    label: "Myntra",
    ratio: "3:4",
    resolution: "2K",
    width: 1536,
    height: 2048,
    description: "1536×2048 (3:4) · 2K",
  },
  nykaa: {
    label: "Nykaa",
    ratio: "3:4",
    resolution: "2K",
    width: 1536,
    height: 2048,
    description: "1536×2048 (3:4) · 2K",
  },
  meesho: {
    label: "Meesho",
    ratio: "1:1",
    resolution: "1K",
    width: 1080,
    height: 1080,
    description: "1080×1080 (1:1) · 1K",
  },
  ebay: {
    label: "eBay",
    ratio: "1:1",
    resolution: "1K",
    width: 1024,
    height: 1024,
    description: "1024×1024 (1:1) · 1K",
  },
  other: {
    label: "Other",
    ratio: "1:1",
    resolution: "1K",
    width: 1080,
    height: 1080,
    description: "1080×1080 (1:1) · 1K",
  },
}

export const ECOMMERCE_PLATFORM_OPTIONS: { value: EcommercePlatformKey; label: string }[] =
  Object.entries(ECOMMERCE_PLATFORM_PRESETS).map(([value, preset]) => ({
    value: value as EcommercePlatformKey,
    label: preset.label,
  }))

export const PRODUCT_LISTING_MARKETPLACE_KEYS = ["amazon", "flipkart", "myntra", "other"] as const
export type ProductListingMarketplace = (typeof PRODUCT_LISTING_MARKETPLACE_KEYS)[number]

export const PRODUCT_LISTING_MARKETPLACES: { value: ProductListingMarketplace; label: string }[] =
  PRODUCT_LISTING_MARKETPLACE_KEYS.map((value) => ({
    value,
    label: ECOMMERCE_PLATFORM_PRESETS[value].label,
  }))
