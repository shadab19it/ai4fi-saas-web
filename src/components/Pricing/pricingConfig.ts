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
    title: "Core Photoshoot Capabilities",
    features: [
      { id: "brand_safe", label: "Brand-safe outputs (no watermark)", values: { silver: true, gold: true, platinum: true } },
      { id: "ai_workflows", label: "AI-powered photoshoot workflows", values: { silver: true, gold: true, platinum: true } },
      { id: "model_library", label: "Model library", values: { silver: true, gold: true, platinum: true } },
      { id: "background_library", label: "Background library", values: { silver: true, gold: true, platinum: true } },
      { id: "template_library", label: "Template library", values: { silver: true, gold: true, platinum: true } },
      { id: "upload_size", label: "Max upload file size", values: { silver: "15 MB", gold: "15 MB", platinum: "15 MB" } },
    ],
  },
  {
    id: "scale",
    title: "Create Photoshoots at Scale",
    features: [
      { id: "resolution", label: "Max output resolution", values: { silver: "HD (up to 1080px)", gold: "2K (up to 2048px)", platinum: "2K (up to 2048px)" } },
      { id: "bulk_upload", label: "Bulk product uploads", values: { silver: false, gold: true, platinum: true } },
      { id: "custom_models", label: "Custom model creation", values: { silver: false, gold: true, platinum: true } },
      { id: "custom_templates", label: "Custom photoshoot templates (reusable)", values: { silver: false, gold: true, platinum: true } },
      { id: "bulk_creation", label: "Bulk photoshoot creation", values: { silver: false, gold: false, platinum: true } },
    ],
  },
  {
    id: "refine",
    title: "Refine & Finalise Outputs",
    features: [
      { id: "regenerations", label: "Regenerations per image", values: { silver: 1, gold: 2, platinum: 3 } },
      { id: "edits", label: "Edits per image", values: { silver: 1, gold: 1, platinum: 1 } },
      { id: "turnaround", label: "Photoshoot edit turnaround", values: { silver: "3 working days", gold: "2 working days", platinum: "1 working day" } },
      { id: "upscale_4k", label: "4K upscale", values: { silver: false, gold: true, platinum: true } },
      { id: "marketplace_ready", label: "Platform-ready crops (Amazon, Myntra, Shopify, etc.)", values: { silver: false, gold: true, platinum: true } },
    ],
  },
  {
    id: "team",
    title: "Team & Workflow",
    features: [
      { id: "users", label: "Included users", values: { silver: "1", gold: "Up to 4", platinum: "Up to 10" } },
      { id: "priority_queue", label: "Priority processing queue", values: { silver: false, gold: true, platinum: true } },
      { id: "early_access", label: "Early access to new AI updates", values: { silver: false, gold: false, platinum: true } },
    ],
  },
  {
    id: "support",
    title: "Support",
    features: [
      { id: "email_sla", label: "Email support SLA", values: { silver: "Within 48 hours", gold: "Within 24 hours", platinum: "Within 12 hours" } },
      { id: "chat_sla", label: "Chat support SLA", values: { silver: "Within 3 hours", gold: "Within 1 hour", platinum: "Within 30 mins" } },
      { id: "account_manager", label: "Dedicated account manager", values: { silver: false, gold: false, platinum: true } },
    ],
  },
];
