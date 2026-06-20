// Perx — Albanian-focused mock data for the hackathon MVP
// Currency: ALL (Albanian Lek)

export type Role = "employee" | "company" | "provider";

export const currentEmployee = {
  id: "emp-ardit",
  firstName: "Ardit",
  lastName: "Hoxha",
  email: "ardit.hoxha@digitsapiens.al",
  walletALL: 42500,
  monthlyAllowanceALL: 60000,
  company: "DigitSapiens",
  department: "Engineering",
  dna: [
    { id: "dna1", trait: "Explorer", intensity: 88, emoji: "🧭" },
    { id: "dna2", trait: "Learner", intensity: 74, emoji: "📚" },
    { id: "dna3", trait: "Wellness Seeker", intensity: 69, emoji: "🌿" },
    { id: "dna4", trait: "Athlete", intensity: 52, emoji: "🏃" },
    { id: "dna5", trait: "Socializer", intensity: 41, emoji: "🤝" },
  ],
  professionalGoal: {
    label: "Become Team Lead",
    progress: 68,
    next: "Finish 'Leading Engineering Teams' course",
  },
  lifestyleGoal: {
    label: "Reduce stress",
    progress: 42,
    next: "Two wellness sessions this week",
  },
  quests: [
    { id: "q1", title: "Mindful Albania", desc: "Attend 4 wellness events", progress: 75, color: "coral" as const },
    { id: "q2", title: "Code Master", desc: "Finish React Fundamentals", progress: 30, color: "sky" as const },
    { id: "q3", title: "Team Player", desc: "Join 2 team adventures", progress: 50, color: "emerald" as const },
  ],
};

// "How are you feeling today?" entry chips — seed the concierge with these prompts.
export const feelingChips = [
  { id: "f1", emoji: "😮‍💨", label: "I'm stressed", prompt: "I've been really stressed this week. Help me unwind." },
  { id: "f2", emoji: "🧠", label: "I want to learn", prompt: "I want to grow my skills. What should I learn next?" },
  { id: "f3", emoji: "🔥", label: "I need motivation", prompt: "I'm feeling stuck. Suggest something to get me moving again." },
  { id: "f4", emoji: "🏔️", label: "I want an adventure", prompt: "I need an adventure this weekend in Albania. Surprise me." },
  { id: "f5", emoji: "✨", label: "Surprise me", prompt: "Surprise me with something unexpected within my monthly budget." },
];

export const aiBundle = {
  id: "bundle-weekend-recharge",
  title: "Weekend Recharge",
  tagline: "Tirana Thermal Spa · Mullixhiu Dinner · Yoga Flow",
  totalALL: 18000,
  reasoning:
    "Based on your high stress signals this week and your 'Wellness Seeker' Benefit DNA, paired with a free Saturday.",
  items: [
    { id: "i1", name: "Thermal Spa Access", provider: "Bamboo Spa", priceALL: 7500 },
    { id: "i2", name: "3-course organic dinner", provider: "Mullixhiu", priceALL: 6500 },
    { id: "i3", name: "Vinyasa Yoga Session", provider: "Yoga House Tirana", priceALL: 4000 },
  ],
  matchScore: 96,
};

// Multiple weekly Perx Drops with countdowns and emotional framing.
export const perxDrops = [
  {
    id: "drop-dajti",
    title: "Dajti Express VIP",
    desc: "Sunset cable car + a slow dinner at 1,613m.",
    emoji: "🚠",
    endsInSeconds: 4 * 3600 + 22 * 60 + 15,
    spotsLeft: 4,
    accent: "coral" as const,
  },
  {
    id: "drop-theth",
    title: "Theth Sunrise Hike",
    desc: "Tiny group, guided. Saturday only.",
    emoji: "🏔️",
    endsInSeconds: 38 * 3600,
    spotsLeft: 6,
    accent: "emerald" as const,
  },
  {
    id: "drop-jazz",
    title: "Jazz Night · Blloku",
    desc: "Live trio + curated wine pairing.",
    emoji: "🎷",
    endsInSeconds: 12 * 3600 + 7 * 60,
    spotsLeft: 9,
    accent: "sky" as const,
  },
];

// Kept for the older home variant fallback
export const perxDrop = perxDrops[0];

export const discoverFeed = [
  {
    id: "d1",
    title: "All-Day Pass + Coffee",
    provider: "Destil Creative Hub",
    category: "Workspace",
    priceALL: 1200,
    matchScore: 98,
    accent: "sky" as const,
    emoji: "☕",
    story: "Quiet third-place to focus without the office buzz.",
  },
  {
    id: "d2",
    title: "Pottery Masterclass",
    provider: "Artisanal Clay Hub",
    category: "Workshop",
    priceALL: 3500,
    matchScore: 91,
    accent: "emerald" as const,
    emoji: "🏺",
    story: "Two hours making something with your hands. No screens.",
  },
  {
    id: "d3",
    title: "Sunset Paragliding",
    provider: "Dajti Skyline",
    category: "Adventure",
    priceALL: 8200,
    matchScore: 88,
    accent: "coral" as const,
    emoji: "🪂",
    story: "Tandem flight as the city turns gold.",
  },
  {
    id: "d4",
    title: "AI Prompt Engineering Lab",
    provider: "Tirana AI School",
    category: "Growth",
    priceALL: 5400,
    matchScore: 94,
    accent: "sky" as const,
    emoji: "🤖",
    story: "Three hours, one new skill that compounds at work.",
  },
  {
    id: "d5",
    title: "Sunday Rooftop Brunch",
    provider: "Lift Tirana",
    category: "Lifestyle",
    priceALL: 3200,
    matchScore: 89,
    accent: "coral" as const,
    emoji: "🥂",
    story: "Slow morning, panoramic view, no rush.",
  },
  {
    id: "d6",
    title: "Albanian Riviera Day Trip",
    provider: "Albania Trips Co.",
    category: "Travel",
    priceALL: 11000,
    matchScore: 86,
    accent: "emerald" as const,
    emoji: "🌊",
    story: "Sea, salt, and a long lunch with feta.",
  },
];

export const teamAdventures = [
  { id: "t1", title: "The Great Escape Room", when: "Friday · 19:00", going: 6, capacity: 8, location: "Tirana" },
  { id: "t2", title: "Theth Peak Expedition", when: "Sat 12 Oct", going: 4, capacity: 6, location: "Albanian Alps" },
  { id: "t3", title: "Mediterranean Cooking", when: "Wed · 18:30", going: 5, capacity: 10, location: "Blloku" },
];

export const conciergeStarters = [
  "I feel stressed",
  "I want to learn AI",
  "I need a team activity",
  "I have 10,000 ALL",
  "Plan a relaxing weekend",
  "Help me hit my fitness goal",
];

// ─────────────── COMPANY ───────────────

export const currentCompany = {
  id: "co-digitsapiens",
  name: "DigitSapiens",
  industry: "Software & AI",
  employees: 184,
  monthlyBudgetALL: 9_400_000,
  utilizationPct: 67,
  engagementScore: 82,
  goalCompletionPct: 71,
};

export const companyInsights = [
  {
    id: "ci1",
    headline: "Employees engage most with wellness experiences.",
    story: "Wellness bundles get 2.3× the engagement of gym memberships, and stress signals drop within 5 days of redemption.",
    action: "Shift 15% of fitness budget to wellness bundles.",
    impact: "+8 engagement",
  },
  {
    id: "ci2",
    headline: "Learning benefits have the highest completion rate.",
    story: "88% of started learning quests reach completion — the highest of any category. Engineering leads, Sales is catching up.",
    action: "Top up the L&D pool for Q4.",
    impact: "+12 growth quests",
  },
  {
    id: "ci3",
    headline: "Outdoor experiences drive stronger participation.",
    story: "Theth and Riviera trips outperform indoor experiences by 41% in repeat usage. Worth a permanent featured slot.",
    action: "Feature Theth & Riviera on employee home.",
    impact: "+23 bookings",
  },
];

export const pendingApprovals = [
  {
    id: "a1",
    employee: "Ardit Hoxha",
    department: "Engineering",
    request: "Weekend Recharge Bundle",
    goal: "Reduce stress · Wellness",
    costALL: 18000,
    aiNote: "High stress signals; aligns with 'Wellness Seeker' DNA. Budget impact: 0.19%.",
  },
  {
    id: "a2",
    employee: "Eriola Sula",
    department: "Design",
    request: "AI Prompt Engineering Lab",
    goal: "Learn applied AI",
    costALL: 5400,
    aiNote: "Matches growth goal & company L&D priority. Budget impact: 0.06%.",
  },
  {
    id: "a3",
    employee: "Klaudio Bregu",
    department: "Sales",
    request: "Team Escape Room (4 seats)",
    goal: "Team cohesion",
    costALL: 9600,
    aiNote: "Sales team engagement dropped 7% last month. Recommended.",
  },
  {
    id: "a4",
    employee: "Mira Lleshi",
    department: "HR",
    request: "Pottery Masterclass",
    goal: "Creative recovery",
    costALL: 3500,
    aiNote: "Aligns with 'Explorer' DNA. Budget impact: 0.04%.",
  },
];

export const companyEmployees = [
  { name: "Ardit Hoxha", dept: "Engineering", dna: "Explorer", goals: 3, completion: 76 },
  { name: "Eriola Sula", dept: "Design", dna: "Learner", goals: 4, completion: 68 },
  { name: "Klaudio Bregu", dept: "Sales", dna: "Socializer", goals: 2, completion: 82 },
  { name: "Mira Lleshi", dept: "HR", dna: "Wellness Seeker", goals: 3, completion: 91 },
  { name: "Endrit Kola", dept: "Engineering", dna: "Athlete", goals: 5, completion: 64 },
  { name: "Sara Vata", dept: "Marketing", dna: "Explorer", goals: 3, completion: 78 },
];

// ─────────────── PROVIDER ───────────────

export const currentProvider = {
  id: "prov-bamboo",
  name: "Bamboo Spa",
  category: "Wellness",
  monthlyRevenueALL: 1_850_000,
  bookings: 124,
  pendingRequests: 9,
  corporateReach: 14,
};

export const providerServices = [
  { id: "s1", name: "Thermal Spa Day", price: 7500, bookings: 48, status: "active" as const },
  { id: "s2", name: "Couples Recovery", price: 12000, bookings: 22, status: "active" as const },
  { id: "s3", name: "Sports Massage", price: 4500, bookings: 31, status: "active" as const },
  { id: "s4", name: "Corporate Wellness Day", price: 60000, bookings: 6, status: "draft" as const },
];

export const corporateDemand = [
  { id: "cd1", segment: "Wellness experiences", employees: 120, trend: "+18%", color: "coral" as const },
  { id: "cd2", segment: "Team activities", employees: 85, trend: "+9%", color: "sky" as const },
  { id: "cd3", segment: "AI / Tech courses", employees: 60, trend: "+34%", color: "emerald" as const },
  { id: "cd4", segment: "Weekend escapes", employees: 47, trend: "+12%", color: "coral" as const },
];

export const providerCampaigns = [
  { id: "mk1", title: "Recharge Weekends Drop", reach: 1280, engagement: 14.2, status: "live" as const },
  { id: "mk2", title: "Corporate Wellness Day pitch", reach: 412, engagement: 22.8, status: "draft" as const },
];

export const formatALL = (n: number) => `${n.toLocaleString("en-US")} ALL`;
