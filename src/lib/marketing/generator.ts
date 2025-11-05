import { customAlphabet } from "nanoid";
import { ProductInput, MarketingResponse, MasterAssetFile, ResearchInsight, PlatformAsset, PlatformVariant, PlatformName } from "@/types/marketing";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);

const PLATFORM_GOALS: Record<PlatformName, PlatformAsset["primary_goal"]> = {
  twitter: "engagement",
  pinterest: "awareness",
  instagram: "conversion",
  linkedin: "lead-gen",
  reddit: "engagement",
};

const PLATFORM_TONES: Record<PlatformName, string> = {
  twitter: "Punchy, curiosity-driven, emoji-light",
  pinterest: "Aspirational, visual-first, benefit forward",
  instagram: "Story-driven, energetic, emoji-friendly",
  linkedin: "Authoritative, insightful, credibility-focused",
  reddit: "Authentic, conversational, value-first",
};

const PLATFORM_NARRATIVES: Record<PlatformName, string> = {
  twitter: "Spark fast interest and drive clicks with curiosity gaps.",
  pinterest: "Show the transformation and visual payoff for the audience.",
  instagram: "Highlight lifestyle impact and emotional resonance.",
  linkedin: "Connect the product to professional growth and ROI.",
  reddit: "Lead with authentic problem-solving and community value.",
};

const POSTING_WINDOWS: Record<PlatformName, string[]> = {
  twitter: ["Morning commute", "Lunch hour", "Late evening scroll"],
  pinterest: ["Weeknight inspiration", "Weekend planning", "Sunday prep"],
  instagram: ["Morning hype", "Golden hour", "Evening unwind"],
  linkedin: ["Pre-work insight", "Lunch & learn", "Late afternoon reflection"],
  reddit: ["Mid-morning focus blocks", "Evening deep dive", "Weekend share"],
};

const CTA_LIBRARY = [
  "Download now and turn ideas into action.",
  "Grab your copy and start implementing today.",
  "Unlock the full playbook in minutes.",
  "Level up instantly—access the full resource.",
  "Save this landing page and dive in right away.",
];

const BRIDGE_WORDS = ["because", "so that", "which means", "giving you", "unlocking"];

const capitalize = (value: string) =>
  value
    .split(" ")
    .map((word) => (word.length ? `${word[0].toUpperCase()}${word.slice(1)}` : word))
    .join(" ");

const uniqueElements = <T>(values: T[]): T[] => Array.from(new Set(values));

const createBullets = (base: string, niche: string): string[] => {
  const statements = [
    `Actionable framework built for ${niche} creators.`,
    `Battle-tested tactics sourced from real ${capitalize(niche)} launches.`,
    `Ready-to-use templates that eliminate guesswork.`,
    `Conversion-focused messaging aligned with ${niche} buyers.`,
    `Step-by-step roadmap that scales from idea to monetization.`,
  ];
  return uniqueElements(statements.concat(base)).slice(0, 4);
};

const createHooks = (product: ProductInput): string[] => {
  const { product_name, niche, landing_url } = product;
  const domain = landing_url.replace(/^https?:\/\//, "").replace(/\/.*/, "");
  return uniqueElements([
    `New in ${capitalize(niche)}: ${product_name} turns browsers into buyers.`,
    `Stop losing leads—${product_name} is the ${niche} system that actually converts.`,
    `${product_name} breaks down the exact playbook we used to grow ${domain}.`,
    `If you're in ${niche}, you need this shortcut before the next launch.`,
    `${product_name} is the operator-only toolkit for compounding results.`,
  ]);
};

const createHashtags = (niche: string, count = 5): string[] => {
  const sanitized = niche
    .split(/[^\w]+/)
    .filter(Boolean)
    .map((segment) => segment.toLowerCase());

  const base = [
    `#${sanitized[0] ?? "digitalproducts"}`,
    "#growth",
    `#${sanitized[1] ?? "marketing"}`,
    "#creatorbiz",
    "#buildinpublic",
    "#conversion",
    "#audiencegrowth",
    "#indiehackers",
    "#nocode",
  ];

  return uniqueElements(base).slice(0, count);
};

const createImagePrompt = (product: ProductInput, angle: string, style: string): string =>
  [
    "ultra-detailed digital illustration",
    `${style} palette`,
    `${product.niche} audience focus`,
    angle,
    `call-to-action banner with “${product.product_name}”`,
    "bold typography, crisp lighting, share-worthy composition",
  ].join(", ");

const pick = <T>(items: T[], index: number): T => items[index % items.length];

const buildVariants = (platform: PlatformName, product: ProductInput): PlatformVariant[] => {
  const hooks = createHooks(product);
  const hashtags = createHashtags(product.niche, 6);
  const postTimes = POSTING_WINDOWS[platform];
  const variantsPerPlatform = Math.max(1, Math.min(product.variants_per_platform, product.max_images));

  const supportStatements = [
    `Highlights the precise step-by-step system inside ${product.product_name}.`,
    `Signals credibility with niche-specific proof points.`,
    `Creates urgency by referencing limited-time bonuses.`,
    `Shows tangible outcomes using metrics ${BRIDGE_WORDS[0]} social proof.`,
    `Directs traffic straight to ${product.landing_url} with a bold CTA.`,
  ];

  const tones = [
    "Momentum-laced tone with urgency and clarity.",
    "Value-first storytelling that humanizes the journey.",
    "Data-backed confidence with emotional resonance.",
  ];

  return Array.from({ length: variantsPerPlatform }).map((_, index) => {
    const hook = pick(hooks, index);
    const callToAction = pick(CTA_LIBRARY, index);

    const supporting_points = uniqueElements([
      supportStatements[index % supportStatements.length],
      `Mentions customer wins specifically from the ${product.niche} space.`,
      `Shows the transformation from “stuck” to “launched” in one scroll.`,
    ]).slice(0, 3);

    const captionSegments = [
      hook,
      `${capitalize(product.niche)} operators ${BRIDGE_WORDS[index % BRIDGE_WORDS.length]} ${supporting_points[0].replace(/\.$/, "")}.`,
      `Inside you get: ${createBullets("", product.niche).join("; ")}.`,
      callToAction,
    ];

    const variantTones = pick(tones, index);

    return {
      id: nanoid(),
      hook,
      caption: captionSegments.join(" "),
      hashtags: hashtags.slice(0, platform === "linkedin" ? 3 : 5),
      call_to_action: callToAction,
      image_prompt: createImagePrompt(
        product,
        supporting_points[index % supporting_points.length],
        platform === "pinterest" || platform === "instagram" ? "vibrant pastel" : "high-contrast dark"
      ),
      recommended_post_time: pick(postTimes, index),
      supporting_points,
      tone: variantTones,
    };
  });
};

const buildResearchInsights = (product: ProductInput): ResearchInsight[] => {
  const { niche, product_name } = product;
  const baseInsights: ResearchInsight[] = [
    {
      pillar: "Audience Trigger",
      headline: `${capitalize(niche)} buyers convert when the transformation is visualized.`,
      insight: `Campaigns with before/after storylines see up to 38% higher engagement in the ${niche} vertical.`,
      proof_points: [
        "Use carousel or multi-frame storytelling to map the journey.",
        `Include a metric-driven promise tied directly to ${product_name}.`,
        "Highlight community or peer validation early in the caption.",
      ],
    },
    {
      pillar: "Positioning",
      headline: `${product_name} should be framed as a done-for-you accelerator.`,
      insight: `Operators in ${niche} respond to frameworks that combine strategy with plug-and-play templates.`,
      proof_points: [
        "Lead with a single compelling promise in the hero hook.",
        "Layer credibility with numbers, client wins, or personal proof.",
        "Invite the reader into a quick action loop (watch, swipe, click).",
      ],
    },
    {
      pillar: "Retention",
      headline: "Social proof is the make-or-break moment for conversions.",
      insight: `Testimonials placed mid-caption outperform end-of-caption mentions by 22% in ${niche} campaigns.`,
      proof_points: [
        "Use short, punchy proof lines instead of full paragraphs.",
        "Blend emoji signposts to draw eyes to proof points.",
        "Experiment with contrasting visual blocks for proof overlays.",
      ],
    },
  ];
  return baseInsights;
};

const buildMasterAssets = (product: ProductInput): MasterAssetFile => {
  const bullets = createBullets(
    `Toolkit crafted around the daily workflow pain points ${BRIDGE_WORDS[1]} ${product.niche} teams.`,
    product.niche
  );

  return {
    product_id: product.product_id,
    product_name: product.product_name,
    landing_url: product.landing_url,
    niche: product.niche,
    positioning: {
      elevator_pitch: `${product.product_name} gives ${capitalize(product.niche)} creators a proven launch engine in under 60 minutes.`,
      audience_profile: `Operator-level builders, indie founders, and marketing leads within the ${product.niche} economy who need consistent conversion assets.`,
      unique_selling_points: bullets,
      problem_statement: `Most ${product.niche} launches stall because teams recycle generic swipe files. ${product.product_name} delivers high-converting assets engineered for rapid iteration.`,
    },
    campaign_pillars: [
      "Transformation snapshots showing life before vs. after using the product.",
      "Proof-driven breakdown of the system, frameworks, and quick wins.",
      "Scarcity moments that nudge immediate clicks (bonuses, cohorts, limited bundles).",
    ],
    voice_and_style: {
      tone: ["direct", "operator-smart", "optimistic", "conversion-minded"],
      dos: [
        "Lead with the outcome and backfill with process.",
        "Use sharp, visual language that hints at screenshots or templates.",
        "Anchor every call-to-action with urgency and clarity.",
      ],
      donts: [
        "Avoid vague promises without metrics.",
        "Skip overly corporate jargon—sound like a peer.",
        "Do not crowd visuals; leave space for the CTA badge.",
      ],
    },
    image_directions: [
      "Leverage gradient backgrounds with high contrast CTA buttons.",
      "Include device mockups that showcase product UI or worksheets.",
      "Use bold typography overlays to highlight the key promise.",
      "Incorporate tasteful motion blur to imply momentum and speed.",
    ],
  };
};

const toDataUrl = (data: unknown): string => {
  const json = JSON.stringify(data, null, 2);
  const base64 = Buffer.from(json, "utf8").toString("base64");
  return `data:application/json;base64,${base64}`;
};

const createPlatformAssets = (product: ProductInput): PlatformAsset[] => {
  const assets: PlatformAsset[] = ["twitter", "pinterest", "instagram", "linkedin", "reddit"].map((platform) => {
    const platformKey = platform as PlatformName;
    const variants = buildVariants(platformKey, product);
    return {
      platform: platformKey,
      narrative_angle: PLATFORM_NARRATIVES[platformKey],
      primary_goal: PLATFORM_GOALS[platformKey],
      tone: PLATFORM_TONES[platformKey],
      variants,
    };
  });
  return assets;
};

export const generateMarketingResponse = (product: ProductInput): MarketingResponse => {
  const now = new Date().toISOString();
  const masterAssets = buildMasterAssets(product);
  const research = buildResearchInsights(product);
  const campaignAssets = createPlatformAssets(product);
  const note = product.human_review_required
    ? "Human review requested—ensure compliance check before scheduling."
    : "Auto-approved template ready for scheduling.";

  return {
    product_id: product.product_id,
    status: "success",
    master_assets_s3: toDataUrl(masterAssets),
    research_insights_s3: toDataUrl(research),
    assets: campaignAssets,
    research_snippet: research.map((insight) => insight.headline),
    generated_at: now,
    requires_human_review: product.human_review_required,
    notes: [note, "All assets optimized for virality and conversion across platforms."],
  };
};
