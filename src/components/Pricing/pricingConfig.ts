export type PlanKey = "silver" | "gold" | "platinum";

export type FeatureValue = boolean | string | number;

export interface ComparisonFeature {
  id: string;
  label: string;
  values: Record<PlanKey, FeatureValue>;
}

export interface ComparisonSection {
  id: string;
  title: string;
  features: ComparisonFeature[];
}

export const planComparison: ComparisonSection[] = [
  {
    id: "core",
    title: "Core Platform Capabilities",
    features: [
      { id: "resolution", label: "Max output resolution", values: { silver: "HD (1080px)", gold: "2K (2048px) → 4K upscalable", platinum: "2K (2048px) → 4K upscalable" } },
      { id: "upscale_4k", label: "4K upscale", values: { silver: false, gold: true, platinum: true } },
      { id: "regenerations", label: "Regenerations per image", values: { silver: 1, gold: 2, platinum: 3 } },
      { id: "brand_safe", label: "Brand-safe outputs (no watermark)", values: { silver: true, gold: true, platinum: true } },
      { id: "upload_size", label: "Max upload file size", values: { silver: "15 MB", gold: "15 MB", platinum: "15 MB" } },
    ],
  },
  {
    id: "photoshoot",
    title: "AI Photoshoot & Virtual Try-On",
    features: [
      { id: "ai_workflows", label: "AI-powered photoshoot workflows", values: { silver: true, gold: true, platinum: true } },
      { id: "unstitched_tryon", label: "Unstitched AI virtual try-on", values: { silver: true, gold: true, platinum: true } },
      { id: "pose_limit", label: "Pose creation per photoshoot", values: { silver: "Max 2", gold: "Max 5", platinum: "Max 8" } },
      { id: "pose_library", label: "Pose library", values: { silver: "100+ poses", gold: "100+ poses", platinum: "100+ poses" } },
      { id: "model_support", label: "Pre-built AI model support", values: { silver: "1000+ models", gold: "1000+ models", platinum: "1000+ models" } },
      { id: "nationality", label: "Nationality diversity", values: { silver: false, gold: "20 nationalities", platinum: "20+ nationalities" } },
      { id: "special_categories", label: "Special categories support (Obese models & Minors)", values: { silver: false, gold: true, platinum: true } },
      { id: "bg_library", label: "Background library", values: { silver: false, gold: "150+ backgrounds", platinum: "150+ backgrounds" } },
      { id: "jewellery", label: "Jewellery support", values: { silver: false, gold: "100+ styles", platinum: "100+ styles" } },
      { id: "accessories", label: "Accessories support", values: { silver: false, gold: true, platinum: true } },
      { id: "custom_models", label: "Custom model creation", values: { silver: false, gold: true, platinum: true } },
    ],
  },
  {
    id: "lifestyle",
    title: "Lifestyle Photography & Content",
    features: [
      { id: "ecommerce_images", label: "Ready-to-list eCommerce images", values: { silver: false, gold: true, platinum: true } },
      { id: "banner_creation", label: "Banner creation from product images", values: { silver: false, gold: true, platinum: true } },
      { id: "ecommerce_content", label: "Content support for eCommerce & affiliation", values: { silver: false, gold: true, platinum: true } },
      { id: "platform_crops", label: "Platform-ready crops (Amazon, Myntra, Shopify, etc.)", values: { silver: false, gold: true, platinum: true } },
    ],
  },
  {
    id: "ad_studio",
    title: "Ad Studio",
    features: [
      { id: "static_ads", label: "Static ad creatives from product images", values: { silver: false, gold: true, platinum: true } },
      { id: "video_ads", label: "Video ad creation", values: { silver: false, gold: "Contact Us", platinum: "Contact Us" } },
    ],
  },
  {
    id: "refinement",
    title: "Refinement & Delivery",
    features: [
      { id: "turnaround", label: "Photoshoot turnaround time", values: { silver: "3 working days", gold: "2 working days", platinum: "1 working day" } },
      { id: "priority", label: "Priority processing", values: { silver: false, gold: true, platinum: true } },
    ],
  },
  {
    id: "data_storage",
    title: "Data Access & Storage Policy",
    features: [
      { id: "data_retention", label: "Access to previously generated data", values: { silver: "7 days", gold: "30 days", platinum: "90 days" } },
      { id: "gallery_limit", label: "Max generated images stored in gallery", values: { silver: "20 images", gold: "100 images", platinum: "300 images" } },
      { id: "auto_removal", label: "Auto removal of old generated images", values: { silver: "After 7 days", gold: "After 30 days", platinum: "After 90 days" } },
      { id: "storage_notification", label: "Storage limit notification", values: { silver: true, gold: true, platinum: true } },
      { id: "manual_cleanup", label: "Manual storage cleanup option", values: { silver: true, gold: true, platinum: true } },
    ],
  },
  {
    id: "team_support",
    title: "Team & Support",
    features: [
      { id: "users", label: "Included users", values: { silver: "1", gold: "Up to 4", platinum: "Up to 10" } },
      { id: "early_access", label: "Early access to new AI updates", values: { silver: false, gold: false, platinum: true } },
      { id: "support_number", label: "Dedicated support number", values: { silver: false, gold: true, platinum: true } },
      { id: "account_manager", label: "Dedicated account manager", values: { silver: false, gold: false, platinum: true } },
      { id: "email_sla", label: "Email support SLA", values: { silver: "Within 48 hours", gold: "Within 24 hours", platinum: "Within 12 hours" } },
      { id: "chat_sla", label: "Chat support SLA", values: { silver: "Within 3 hours", gold: "Within 1 hour", platinum: "Within 30 mins" } },
    ],
  },
];
