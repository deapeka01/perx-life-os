# Perx — AI-Native Operating System rebuild

This is a substantial pivot. The current build is screen-first with cards and side nav. The brief asks for a conversation-first OS where almost every action starts in chat with a specialized AI agent. I'll restructure around that.

## Guiding rules I'll apply everywhere
- One conversational surface per role; "features" are overlays/sheets invoked by the AI or quick chips, not menu pages.
- No traditional sidebars or dashboards. Replace with floating action bar + AI thread.
- Premium, calm, futuristic aesthetic: animated gradients, glass surfaces, soft motion, AI "node" visualization. Keep Deep Navy + Coral palette already chosen.
- Real LLM (Lovable AI Gateway, gemini-3-flash-preview) drives Employee Concierge, Onboarding, Company Strategist, Provider Growth Agent — each with its own system prompt + persona.
- All persistence stays mock (no Cloud yet) unless you ask — auth is a mock invitation-code flow that routes to the right role.

## Scope of this pass (Phase 1)

I'll ship the spine end-to-end so it feels real, then iterate. Phase 1 = Landing + Auth + the three AI agent homes + onboarding flows. Phase 2 (next turn) = Quests, Tribes, Team Adventures, Drops detail, Wallet, Demand Feed depth, Marketing Assistant, Notifications, Payments.

### 1. Landing (`/`)
- Full-bleed immersive hero: animated gradient mesh, floating orbiting AI nodes (Company ↔ AI ↔ Employee ↔ Provider) rendered with SVG + CSS animation.
- Center: "PERX — AI-Powered Employee Lifestyle Operating System" + supporting line.
- Single CTA `ENTER PERX` → `/auth`.
- Language switcher + subtle footer only.

### 2. Auth (`/auth`)
- Tabs: Login / Signup.
- Signup fields: Name, Surname, Work Email, Invitation Code, Password.
- Mock invitation codes map to role:
  - `EMP-*` → employee → `/onboarding/employee`
  - `CO-*` → company → `/onboarding/company`
  - `PRV-*` → provider → `/onboarding/provider`
- Login goes straight to role home (mock localStorage session).

### 3. Employee
- **Onboarding** (`/onboarding/employee`): full-screen AI chat. The agent (system-prompted as "Perx Lifestyle Concierge") naturally collects pro goals, lifestyle goals, background, activities, comms prefs through conversation. A subtle right-side panel shows the **Benefit DNA** assembling in real time (animated traits popping in as the AI extracts them via structured output). Ends with archetype reveal (Explorer / Learner / Leader / Wellness Seeker / Connector).
- **Home** (`/employee`): ChatGPT-style. Big greeting, large input, suggested prompts (credits, team activity, goal progress, wellness under budget, stress, weekend plan). Tiny pill row top-right: credits, streak, DNA archetype. No sidebar. Everything else (Goals, Quests, Tribes, Adventures, Drops, DNA Report) opens as a slide-over sheet triggered by AI responses or a single `+` action menu.
- Concierge already wired to Lovable AI — extend its system prompt with persona + tool-style suggestions.

### 4. Company
- **Onboarding** (`/onboarding/company`): conversational collection of legal name, registration, tax, industry, description, then an "Upload employee dataset" step (mocked with a sample CSV preview).
- **Home** (`/company`): AI Benefits Strategist chat as primary surface. Suggested prompts ("Generate a balanced welfare plan", "Where is engagement dropping?", "Optimize Q2 budget"). Right rail shows live KPIs (engagement, budget used, top tribes) as compact glass tiles, not a dashboard grid. Approvals + Wallet open as sheets from chat replies.

### 5. Provider
- **Onboarding** (`/onboarding/provider`): conversational collection of legal/business/tax, brand assets upload mock, services.
- **Home** (`/provider`): AI Business Growth Agent chat. Suggested prompts ("Build an offer for stressed tech teams", "Show me corporate demand near me", "Draft a launch campaign"). Right rail: live Corporate Demand Feed as glass cards (e.g. "120 employees seeking wellness").

### 6. Shared design system additions
- `AIOrb` component: animated multi-ring gradient avatar for each agent (different hues per role).
- `GlassPanel`, `FloatingActionBar`, `AgentChat` (reusable shell wrapping current concierge logic, parameterized by agent persona + starter prompts + right-rail slot).
- Sheet-based feature overlays via existing shadcn `Sheet`.
- Remove `SideNav` from role layouts; replace `employee.tsx` / `company.tsx` / `provider.tsx` shells with minimal top bar (logo + role agent name + profile menu) and full-bleed children.

## Technical plan

```text
src/
  components/perx/
    AIOrb.tsx                 (animated agent avatar)
    AgentChat.tsx             (reusable streaming chat shell)
    GlassPanel.tsx
    FloatingActions.tsx
    BenefitDnaBuilder.tsx     (live DNA panel during onboarding)
    DemandCard.tsx
    KpiTile.tsx
    LandingHero.tsx           (orbiting nodes + gradient mesh)
  lib/
    agents.ts                 (system prompts + starter sets per persona)
    session.ts                (mock auth/role in localStorage)
    mock-data.ts              (extend with company KPIs, demand feed, archetypes)
  routes/
    index.tsx                 (new landing)
    auth.tsx                  (login/signup tabs)
    onboarding.employee.tsx
    onboarding.company.tsx
    onboarding.provider.tsx
    employee.tsx              (minimal shell: top bar + Outlet)
    employee.index.tsx        (AgentChat: lifestyle concierge)
    company.tsx               (minimal shell)
    company.index.tsx         (AgentChat: benefits strategist + KPI rail)
    provider.tsx              (minimal shell)
    provider.index.tsx        (AgentChat: growth agent + demand rail)
    api/chat.ts               (extend: accept `agent` param → swap system prompt)
```

- `api/chat.ts` will accept `{ messages, agent }` and pick the system prompt from `agents.ts` server-side.
- Keep existing sub-routes (discover, quests, team, profile, approvals, etc.) but they become sheet content or secondary pages reached only via AI suggestions. I'll keep their files so nothing breaks; restyling them is Phase 2.
- Delete `SideNav` usage from role layouts; component file stays for now.

## What's explicitly NOT in this pass
- Real payments, wallet ledger, invoices.
- Publer integration for Marketing Assistant.
- Push notifications.
- Multi-currency finance system.
- Real database / auth (still mock).
- Restyle of every existing sub-page (Phase 2).

Confirm and I'll build Phase 1. If you want me to also fold in any Phase 2 item now (e.g. Wallet sheet, Marketing Assistant skeleton), tell me which.
