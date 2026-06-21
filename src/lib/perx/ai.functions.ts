// AI-powered server functions: Benefit DNA generation, strategist reports,
// marketing campaign generation. All use Lovable AI Gateway server-side.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText, Output } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type Sb = { from: (t: string) => any; rpc: (...a: any[]) => any };
const sb = (supabase: unknown) => supabase as unknown as Sb;

function gateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const g = createLovableAiGatewayProvider(key);
  return g("google/gemini-3-flash-preview");
}

// ─────────────────────── BENEFIT DNA ───────────────────────
const DnaSchema = z.object({
  primary_archetype: z.string(),
  secondary_archetype: z.string().optional(),
  archetypes: z.array(z.object({
    trait: z.string(), intensity: z.number(), emoji: z.string(),
  })),
  goals: z.array(z.string()),
  interests: z.array(z.string()),
  recommended_categories: z.array(z.string()),
});

export const generateBenefitDna = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    transcript: z.array(z.object({ role: z.string(), text: z.string() })).min(1),
  }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const convo = data.transcript.map(t => `${t.role.toUpperCase()}: ${t.text}`).join("\n").slice(0, 8000);
    const { experimental_output } = await generateText({
      model: gateway(),
      experimental_output: Output.object({ schema: DnaSchema }),
      system: "You are Perx's Benefit DNA analyzer. From an onboarding conversation, extract the employee's archetype profile. Archetypes: Explorer, Learner, Leader, Wellness Seeker, Connector, Creator, Athlete, Parent. Recommended categories must come from: Wellness, Learning, Adventure, Dining, Travel, Workspace, Workshop, Lifestyle, Social, Growth.",
      prompt: `Onboarding conversation:\n${convo}\n\nReturn a Benefit DNA profile. Primary archetype is the strongest trait. 3-5 archetypes with intensity 40-95. Pick emojis that match each trait.`,
    });
    const dna = experimental_output as z.infer<typeof DnaSchema>;
    await sb(supabase).from("benefit_dna").upsert({
      user_id: userId,
      primary_archetype: dna.primary_archetype,
      secondary_archetype: dna.secondary_archetype ?? null,
      archetypes: dna.archetypes,
      goals: dna.goals,
      interests: dna.interests,
      recommended_categories: dna.recommended_categories,
      raw: { source: "onboarding" },
    }, { onConflict: "user_id" });
    await sb(supabase).from("profiles").update({ onboarded: true }).eq("id", userId);
    return dna;
  });

// ─────────────────────── STRATEGIST REPORT ───────────────────────
const ReportSchema = z.object({
  title: z.string(),
  summary: z.string(),
  insights: z.array(z.object({
    headline: z.string(),
    detail: z.string(),
    impact: z.string(),
    action: z.string(),
  })),
});

export const generateStrategyReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const co = await sb(supabase).from("companies").select("*").eq("owner_user_id", userId).maybeSingle();
    if (!co.data) throw new Error("No company");

    // Pull live signals
    const reqs = await sb(supabase).from("benefit_requests").select("title,amount_all,status,created_at")
      .eq("company_id", co.data.id).order("created_at", { ascending: false }).limit(40);
    const demand = await sb(supabase).from("demand_insights").select("category,segment,employees_interested,trend").limit(10);

    const ctx = JSON.stringify({
      company: { name: co.data.name, industry: co.data.industry, budget: co.data.monthly_budget_all },
      recent_requests: reqs.data ?? [],
      market_demand: demand.data ?? [],
    }).slice(0, 6000);

    const { experimental_output } = await generateText({
      model: gateway(),
      experimental_output: Output.object({ schema: ReportSchema }),
      system: "You are the Perx AI Benefits Strategist for an Albanian company. Generate a sharp monthly insight report. Each insight cites a metric and ends with a concrete action and predicted impact.",
      prompt: `Analyze this company's last 30 days and produce a strategy report:\n${ctx}`,
    });
    const out = experimental_output as z.infer<typeof ReportSchema>;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await sb(supabaseAdmin).from("strategy_reports").insert({
      company_id: co.data.id, kind: "monthly", title: out.title,
      summary: out.summary, insights: out.insights,
    }).select("*").single();
    return row;
  });

// ─────────────────────── MARKETING CAMPAIGN ───────────────────────
const PostSchema = z.object({
  campaign_title: z.string(),
  instagram_caption: z.string(),
  instagram_hashtags: z.array(z.string()),
  facebook_headline: z.string(),
  facebook_body: z.string(),
  linkedin_headline: z.string(),
  linkedin_body: z.string(),
});

type MarketingCampaignOutput = z.infer<typeof PostSchema>;

const textOr = (value: unknown, fallback: string) => typeof value === "string" && value.trim() ? value.trim() : fallback;
const tagsOr = (value: unknown) => Array.isArray(value)
  ? value.map((tag) => String(tag).replace(/^#/, "").trim()).filter(Boolean).slice(0, 8)
  : ["PerxBenefits", "TiranaTeams", "CorporateWellbeing"];

function fallbackCampaign(provider: any, theme: string): MarketingCampaignOutput {
  const providerName = provider?.name ?? "Perx Provider";
  const category = provider?.category ?? "wellbeing";
  return {
    campaign_title: `${providerName} · ${theme.slice(0, 48)}`,
    instagram_caption: `${providerName} brings ${category} benefits closer to Tirana teams. ${theme}. Rezervo eksperiencën dhe jepi ekipit një arsye të ndihet më mirë këtë javë.`,
    instagram_hashtags: ["PerxBenefits", "TiranaTeams", "CorporateWellbeing"],
    facebook_headline: `${providerName} for better employee days`,
    facebook_body: `A practical ${category} perk for companies that want happier, healthier teams in Albania. ${theme}. Available through Perx for fast employee claims and measurable engagement.`,
    linkedin_headline: `A smarter ${category} benefit for Albanian teams`,
    linkedin_body: `${providerName} helps HR leaders turn benefits into real employee engagement. This campaign focuses on ${theme}, designed for corporate teams in Tirana that value retention, wellbeing, and clear outcomes.`,
  };
}

function parseMarketingCampaign(raw: string, provider: any, theme: string): MarketingCampaignOutput {
  const fallback = fallbackCampaign(provider, theme);
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match?.[0] ?? cleaned) as Partial<Record<keyof MarketingCampaignOutput, unknown>>;
    return {
      campaign_title: textOr(parsed.campaign_title, fallback.campaign_title),
      instagram_caption: textOr(parsed.instagram_caption, fallback.instagram_caption),
      instagram_hashtags: tagsOr(parsed.instagram_hashtags),
      facebook_headline: textOr(parsed.facebook_headline, fallback.facebook_headline),
      facebook_body: textOr(parsed.facebook_body, fallback.facebook_body),
      linkedin_headline: textOr(parsed.linkedin_headline, fallback.linkedin_headline),
      linkedin_body: textOr(parsed.linkedin_body, fallback.linkedin_body),
    };
  } catch {
    return fallback;
  }
}

export const generateMarketingCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    offer_id: z.string().uuid().optional(),
    theme: z.string().min(2).max(200),
  }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const prov = await sb(supabase).from("providers").select("*").eq("owner_user_id", userId).maybeSingle();
    if (!prov.data) throw new Error("No provider profile. Bootstrap first.");

    let offerCtx = "";
    if (data.offer_id) {
      const o = await sb(supabase).from("offers").select("title,description,price_all,category")
        .eq("id", data.offer_id).maybeSingle();
      if (o.data) offerCtx = `Offer: ${o.data.title} — ${o.data.description ?? ""} — ${o.data.price_all} ALL (${o.data.category})`;
    }

    const { text } = await generateText({
      model: gateway(),
      system: "You write social media campaigns for Albanian lifestyle/wellness/learning businesses. Voice: warm, confident, modern. Mix English with occasional Albanian phrases where natural. No emojis spam. Return only compact JSON, no markdown.",
      prompt: `Provider: ${prov.data.name} (${prov.data.category}). ${prov.data.description ?? ""}\n${offerCtx}\nTheme: ${data.theme}\n\nCreate one cohesive campaign targeting corporate Tirana audiences. Return a JSON object with exactly these keys: campaign_title, instagram_caption, instagram_hashtags, facebook_headline, facebook_body, linkedin_headline, linkedin_body. instagram_hashtags must be an array of short strings without #.`,
    });
    const out = parseMarketingCampaign(text, prov.data, data.theme);

    // Save the 3 channel posts as separate rows
    const baseAnalytics = {};
    const rows = [
      { channel: "instagram", content: `${out.instagram_caption}\n\n${out.instagram_hashtags.map((h: string) => "#" + h.replace(/^#/, "")).join(" ")}` },
      { channel: "facebook", content: `${out.facebook_headline}\n\n${out.facebook_body}` },
      { channel: "linkedin", content: `${out.linkedin_headline}\n\n${out.linkedin_body}` },
    ].map(r => ({
      provider_id: prov.data.id,
      title: out.campaign_title,
      channel: r.channel as "instagram"|"facebook"|"linkedin",
      content: r.content,
      status: "draft" as const,
      analytics: baseAnalytics,
    }));
    const { data: inserted } = await sb(supabase).from("marketing_campaigns").insert(rows).select("*");
    return { campaign_title: out.campaign_title, posts: inserted ?? [] };
  });
