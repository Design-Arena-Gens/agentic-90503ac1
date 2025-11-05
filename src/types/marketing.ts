export type ProductInput = {
  product_id: string;
  user_id: string;
  product_name: string;
  product_file_s3_url: string;
  landing_url: string;
  niche: string;
  max_images: number;
  variants_per_platform: number;
  human_review_required: boolean;
};

export type PlatformVariant = {
  id: string;
  hook: string;
  caption: string;
  hashtags: string[];
  call_to_action: string;
  image_prompt: string;
  recommended_post_time: string;
  supporting_points: string[];
  tone: string;
};

export type PlatformAsset = {
  platform: PlatformName;
  narrative_angle: string;
  primary_goal: "awareness" | "lead-gen" | "conversion" | "engagement";
  tone: string;
  variants: PlatformVariant[];
};

export type PlatformName =
  | "twitter"
  | "pinterest"
  | "instagram"
  | "linkedin"
  | "reddit";

export type ResearchInsight = {
  pillar: string;
  insight: string;
  headline: string;
  proof_points: string[];
};

export type MasterAssetFile = {
  product_id: string;
  product_name: string;
  landing_url: string;
  niche: string;
  positioning: {
    elevator_pitch: string;
    audience_profile: string;
    unique_selling_points: string[];
    problem_statement: string;
  };
  campaign_pillars: string[];
  voice_and_style: {
    tone: string[];
    dos: string[];
    donts: string[];
  };
  image_directions: string[];
};

export type MarketingResponse = {
  product_id: string;
  status: "success" | "partial" | "failed";
  master_assets_s3: string;
  research_insights_s3: string;
  assets: PlatformAsset[];
  research_snippet: string[];
  generated_at: string;
  requires_human_review: boolean;
  notes: string[];
};
