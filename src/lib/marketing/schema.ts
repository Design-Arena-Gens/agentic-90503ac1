import { z } from "zod";

export const marketingInputSchema = z.object({
  product_id: z.string().uuid(),
  user_id: z.string().uuid(),
  product_name: z.string().min(2).max(120),
  product_file_s3_url: z.string().url(),
  landing_url: z.string().url(),
  niche: z.string().min(2).max(120),
  max_images: z.number().int().min(1).max(10),
  variants_per_platform: z.number().int().min(1).max(5),
  human_review_required: z.boolean(),
});

export type MarketingInputSchema = z.infer<typeof marketingInputSchema>;

export const defaultPayload: MarketingInputSchema = {
  product_id: "00000000-0000-0000-0000-000000000000",
  user_id: "11111111-1111-1111-1111-111111111111",
  product_name: "Launch Catalyst OS",
  product_file_s3_url: "https://example-bucket.s3.amazonaws.com/products/launch-catalyst.pdf",
  landing_url: "https://launchcatalyst.io",
  niche: "SaaS marketing playbooks",
  max_images: 5,
  variants_per_platform: 3,
  human_review_required: true,
};
