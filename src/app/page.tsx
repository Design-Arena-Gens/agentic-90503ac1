"use client";

import { useCallback, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { defaultPayload, marketingInputSchema } from "@/lib/marketing/schema";
import { MarketingResponse, PlatformAsset } from "@/types/marketing";

type RequestPayload = typeof defaultPayload;

const numericFields: Array<keyof Pick<RequestPayload, "max_images" | "variants_per_platform">> = [
  "max_images",
  "variants_per_platform",
];

export default function Home() {
  const [form, setForm] = useState<RequestPayload>(defaultPayload);
  const [response, setResponse] = useState<MarketingResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedVariantId, setCopiedVariantId] = useState<string | null>(null);

  const requestPreview = useMemo(() => JSON.stringify(form, null, 2), [form]);

  const updateField = useCallback(<K extends keyof RequestPayload>(key: K, value: RequestPayload[K]) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleInputChange = useCallback(
    (key: keyof RequestPayload) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const target = event.target;
      if (typeof form[key] === "boolean" && target instanceof HTMLInputElement) {
        updateField(key, target.checked as RequestPayload[typeof key]);
        return;
      }

      if (numericFields.includes(key as never)) {
        const numericValue = Number(target.value);
        updateField(key, (Number.isNaN(numericValue) ? form[key] : numericValue) as RequestPayload[typeof key]);
        return;
      }

      updateField(key, target.value as RequestPayload[typeof key]);
    },
    [form, updateField]
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setIsSubmitting(true);
      setCopiedVariantId(null);

      const validation = marketingInputSchema.safeParse(form);
      if (!validation.success) {
        setError(validation.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n"));
        setIsSubmitting(false);
        return;
      }

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validation.data),
        });

        if (!res.ok) {
          const payload = await res.json();
          setError(typeof payload?.message === "string" ? payload.message : "Failed to generate assets.");
          setResponse(null);
          return;
        }

        const data = (await res.json()) as MarketingResponse;
        setResponse(data);
      } catch (err) {
        console.error("Failed to generate marketing assets", err);
        setError("Unexpected error while generating assets. Please retry.");
        setResponse(null);
      } finally {
        setIsSubmitting(false);
      }
    },
    [form]
  );

  const copyToClipboard = useCallback(async (caption: string, variantId: string) => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopiedVariantId(variantId);
      setTimeout(() => {
        setCopiedVariantId(null);
      }, 2000);
    } catch (err) {
      console.error("Clipboard unavailable", err);
      setError("Unable to copy to clipboard in this environment.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="flex flex-col gap-3 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              AI Organic Marketing Agent
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Generate platform-ready creative prompts, copy, and campaign direction for your digital product launches.
              Drop in a product file URL and landing page, and ship a carousel of viral assets in seconds.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-slate-400">
            <span className="rounded-full border border-slate-700 px-3 py-1">Insights Engine</span>
            <span className="rounded-full border border-slate-700 px-3 py-1">Asset Orchestrator</span>
            <span className="rounded-full border border-slate-700 px-3 py-1">Human-in-the-loop</span>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur"
          >
            <div>
              <h2 className="text-lg font-semibold text-white">Product Intelligence</h2>
              <p className="mt-1 text-xs text-slate-400">
                Paste the metadata from your product workflow. UUIDs keep assets linked to your internal systems.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Product Name
                <input
                  value={form.product_name}
                  onChange={handleInputChange("product_name")}
                  className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none ring-slate-500 transition focus:ring-2"
                  placeholder="The launch-ready resource"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Niche
                <input
                  value={form.niche}
                  onChange={handleInputChange("niche")}
                  className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none ring-slate-500 transition focus:ring-2"
                  placeholder="SaaS onboarding"
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Product ID
                <input
                  value={form.product_id}
                  onChange={handleInputChange("product_id")}
                  className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none ring-slate-500 transition focus:ring-2"
                  placeholder="UUID"
                  required
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-200">
                User ID
                <input
                  value={form.user_id}
                  onChange={handleInputChange("user_id")}
                  className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none ring-slate-500 transition focus:ring-2"
                  placeholder="UUID"
                  required
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Product File S3 URL
              <input
                value={form.product_file_s3_url}
                onChange={handleInputChange("product_file_s3_url")}
                className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none ring-slate-500 transition focus:ring-2"
                placeholder="https://bucket.s3.amazonaws.com/file.pdf"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Landing Page URL
              <input
                value={form.landing_url}
                onChange={handleInputChange("landing_url")}
                className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none ring-slate-500 transition focus:ring-2"
                placeholder="https://landing.page"
                required
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Max Images
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.max_images}
                  onChange={handleInputChange("max_images")}
                  className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none ring-slate-500 transition focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Variants per Platform
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.variants_per_platform}
                  onChange={handleInputChange("variants_per_platform")}
                  className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none ring-slate-500 transition focus:ring-2"
                />
              </label>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 transition hover:border-slate-600">
              <input
                type="checkbox"
                checked={form.human_review_required}
                onChange={handleInputChange("human_review_required")}
                className="size-4 rounded border border-slate-500 bg-slate-900 text-slate-100 accent-emerald-400"
              />
              Flag for human review before publishing
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-medium text-emerald-950 shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-800"
            >
              {isSubmitting ? "Generating assets…" : "Generate marketing system"}
            </button>

            {error && (
              <p className="whitespace-pre-wrap rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                {error}
              </p>
            )}
          </form>

          <aside className="flex h-full flex-col gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Payload Preview</h2>
                <span className="text-xs text-slate-500">POST /api/generate</span>
              </div>
              <pre className="mt-3 max-h-64 overflow-auto rounded-xl bg-black/40 p-4 text-xs leading-relaxed text-emerald-200">
                {requestPreview}
              </pre>
            </div>

            {response && (
              <div className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <header className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-white">Campaign Output</h2>
                  <p className="text-xs text-slate-400">
                    Status:{" "}
                    <span className="font-semibold text-emerald-300">
                      {response.status.toUpperCase()}
                    </span>{" "}
                    • Generated at {new Date(response.generated_at).toLocaleString()}
                  </p>
                </header>

                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    href={response.master_assets_s3}
                    download={`master-assets-${response.product_id}.json`}
                    className="rounded-xl border border-emerald-600/40 bg-emerald-600/10 px-4 py-3 text-xs font-medium text-emerald-200 transition hover:border-emerald-400/60 hover:bg-emerald-500/10"
                  >
                    Download master_assets.json
                  </a>
                  <a
                    href={response.research_insights_s3}
                    download={`research-insights-${response.product_id}.json`}
                    className="rounded-xl border border-cyan-600/40 bg-cyan-600/10 px-4 py-3 text-xs font-medium text-cyan-200 transition hover:border-cyan-400/60 hover:bg-cyan-500/10"
                  >
                    Download research_insights.json
                  </a>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">Research Headlines</h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {response.research_snippet.map((headline) => (
                      <li key={headline} className="rounded-xl border border-slate-800/80 bg-black/20 px-3 py-2">
                        {headline}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-5">
                  {response.assets.map((platformAsset) => (
                    <PlatformPanel
                      key={platformAsset.platform}
                      asset={platformAsset}
                      onCopy={copyToClipboard}
                      copiedVariantId={copiedVariantId}
                    />
                  ))}
                </div>

                <footer className="space-y-2 text-xs text-slate-400">
                  <p>Review status: {response.requires_human_review ? "Requires manual approval" : "Approved to schedule"}</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {response.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </footer>
              </div>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}

type PlatformPanelProps = {
  asset: PlatformAsset;
  onCopy: (caption: string, variantId: string) => Promise<void>;
  copiedVariantId: string | null;
};

function PlatformPanel({ asset, onCopy, copiedVariantId }: PlatformPanelProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-black/40">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            {asset.platform.toUpperCase()}
          </p>
          <h4 className="text-sm font-semibold text-white">{asset.narrative_angle}</h4>
        </div>
        <div className="flex flex-col items-end gap-1 text-[10px] uppercase tracking-wider text-slate-500">
          <span>Goal: {asset.primary_goal}</span>
          <span>Tone: {asset.tone}</span>
        </div>
      </div>

      <div className="divide-y divide-slate-800">
        {asset.variants.map((variant) => (
          <div key={variant.id} className="space-y-3 px-4 py-4 text-sm text-slate-200">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Hook • {variant.hook}
              </p>
              <button
                onClick={() => onCopy(variant.caption, variant.id)}
                className="rounded-lg border border-emerald-600/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200 transition hover:border-emerald-400/60 hover:bg-emerald-500/20"
              >
                {copiedVariantId === variant.id ? "Copied ✔" : "Copy caption"}
              </button>
            </div>

            <p className="text-sm leading-relaxed text-slate-100">{variant.caption}</p>

            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              {variant.hashtags.map((tag) => (
                <span key={tag} className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
                <p className="font-semibold text-slate-200">Image Prompt</p>
                <p className="mt-1 text-slate-300">{variant.image_prompt}</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
                <p className="font-semibold text-slate-200">Support Pillars</p>
                <ul className="mt-1 space-y-1 text-slate-300">
                  {variant.supporting_points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span>CTA: {variant.call_to_action}</span>
              <span>Drop at: {variant.recommended_post_time}</span>
              <span>Voice: {variant.tone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
