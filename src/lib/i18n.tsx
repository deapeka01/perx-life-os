import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "sq" | "it";

type Dict = Record<string, string>;

const dictionaries: Record<Lang, Dict> = {
  en: {
    "lang.label": "Language",
    "lang.en": "English",
    "lang.sq": "Shqip",
    "lang.it": "Italiano",

    "landing.tag": "Now in private beta",
    "landing.title.1": "One ecosystem.",
    "landing.title.2": "Three lives",
    "landing.title.3": "made easier by AI.",
    "landing.subtitle":
      "Companies fund growth and wellbeing. Employees pursue goals and experiences. Providers reach corporate customers.",
    "landing.search.placeholder": "Search experiences, restaurants, wellness…",
    "landing.choose": "Choose how you'll enter",
    "landing.footer": "Mock data only · No real transactions · Lek (ALL) currency",

    "role.employee": "I'm an employee",
    "role.employee.desc": "Pursue goals, discover experiences, talk to your AI Concierge.",
    "role.company": "I'm a company",
    "role.company.desc": "Fund growth and wellbeing. Approvals, insights, budgets.",
    "role.provider": "I'm a provider",
    "role.provider.desc": "Reach qualified corporate customers and build offers.",
    "role.enter": "Enter",

    "nav.home": "Home",
    "nav.search": "Search",
    "nav.concierge": "AI",
    "nav.discover": "Discover",
    "nav.quests": "Quests",
    "nav.team": "Team",
    "nav.profile": "Profile",
    "nav.wallet": "Wallet",

    "home.hello": "Good morning",
    "home.delivering": "Available in",
    "home.city": "Tirana",
    "home.search.placeholder": "Ask anything · \"I need a weekend escape\"",
    "home.search.hint": "Tap to chat with your AI Concierge",
    "home.categories": "What are you in the mood for?",
    "home.featured": "Picked for you today",
    "home.match": "match",
    "home.drops": "Limited offers",
    "home.drops.endsIn": "Ends in",
    "home.discover": "Discover near you",
    "home.viewAll": "See all",
    "home.quests": "Your quests",
    "home.team": "Team adventures",
    "home.wallet": "Your wallet",
    "home.wallet.sub": "Monthly allowance",
    "home.claim": "Claim bundle",
    "home.aiPick": "AI pick",
    "home.starters": "Try asking",

    "cat.wellness": "Wellness",
    "cat.food": "Food",
    "cat.fitness": "Fitness",
    "cat.learning": "Learning",
    "cat.travel": "Travel",
    "cat.events": "Events",
    "cat.workspace": "Workspace",
    "cat.family": "Family",
  },
  sq: {
    "lang.label": "Gjuha",
    "lang.en": "English",
    "lang.sq": "Shqip",
    "lang.it": "Italiano",

    "landing.tag": "Tani në beta privat",
    "landing.title.1": "Një ekosistem.",
    "landing.title.2": "Tre jetë",
    "landing.title.3": "më të lehta me AI.",
    "landing.subtitle":
      "Kompanitë financojnë rritjen dhe mirëqenien. Punonjësit ndjekin qëllimet. Ofruesit arrijnë klientët korporativë.",
    "landing.search.placeholder": "Kërko përvoja, restorante, mirëqenie…",
    "landing.choose": "Zgjidh si do të hysh",
    "landing.footer": "Vetëm të dhëna provë · Pa transaksione reale · Monedha Lek (ALL)",

    "role.employee": "Jam punonjës",
    "role.employee.desc": "Ndiq qëllimet, zbulo përvoja, fol me Konsulentin tënd AI.",
    "role.company": "Jam kompani",
    "role.company.desc": "Financo rritjen dhe mirëqenien. Miratime, njohuri, buxhete.",
    "role.provider": "Jam ofrues",
    "role.provider.desc": "Arri klientët korporativë dhe ndërto oferta.",
    "role.enter": "Hyr",

    "nav.home": "Kreu",
    "nav.search": "Kërko",
    "nav.concierge": "AI",
    "nav.discover": "Zbulo",
    "nav.quests": "Sfida",
    "nav.team": "Ekipi",
    "nav.profile": "Profili",
    "nav.wallet": "Portofoli",

    "home.hello": "Mirëmëngjes",
    "home.delivering": "Në dispozicion në",
    "home.city": "Tiranë",
    "home.search.placeholder": "Pyet çdo gjë · \"Dua një pushim fundjave\"",
    "home.search.hint": "Trokit për të folur me Konsulentin AI",
    "home.categories": "Për çfarë ke qejf sot?",
    "home.featured": "Të zgjedhura për ty sot",
    "home.match": "përputhje",
    "home.drops": "Oferta të kufizuara",
    "home.drops.endsIn": "Mbaron pas",
    "home.discover": "Zbulo afër teje",
    "home.viewAll": "Shiko të gjitha",
    "home.quests": "Sfidat e tua",
    "home.team": "Aventura ekipore",
    "home.wallet": "Portofoli yt",
    "home.wallet.sub": "Buxheti mujor",
    "home.claim": "Merr paketën",
    "home.aiPick": "Zgjedhja AI",
    "home.starters": "Provo të pyesësh",

    "cat.wellness": "Mirëqenie",
    "cat.food": "Ushqim",
    "cat.fitness": "Fitnes",
    "cat.learning": "Mësim",
    "cat.travel": "Udhëtim",
    "cat.events": "Evente",
    "cat.workspace": "Hapësirë pune",
    "cat.family": "Familje",
  },
  it: {
    "lang.label": "Lingua",
    "lang.en": "English",
    "lang.sq": "Shqip",
    "lang.it": "Italiano",

    "landing.tag": "Ora in beta privata",
    "landing.title.1": "Un ecosistema.",
    "landing.title.2": "Tre vite",
    "landing.title.3": "rese più facili dall'IA.",
    "landing.subtitle":
      "Le aziende finanziano crescita e benessere. I dipendenti seguono obiettivi. I fornitori raggiungono clienti aziendali.",
    "landing.search.placeholder": "Cerca esperienze, ristoranti, benessere…",
    "landing.choose": "Scegli come entrare",
    "landing.footer": "Solo dati dimostrativi · Nessuna transazione reale · Valuta Lek (ALL)",

    "role.employee": "Sono un dipendente",
    "role.employee.desc": "Insegui obiettivi, scopri esperienze, parla con il tuo Concierge IA.",
    "role.company": "Siamo un'azienda",
    "role.company.desc": "Finanzia crescita e benessere. Approvazioni, insight, budget.",
    "role.provider": "Sono un fornitore",
    "role.provider.desc": "Raggiungi clienti aziendali qualificati e crea offerte.",
    "role.enter": "Entra",

    "nav.home": "Home",
    "nav.search": "Cerca",
    "nav.concierge": "IA",
    "nav.discover": "Scopri",
    "nav.quests": "Sfide",
    "nav.team": "Team",
    "nav.profile": "Profilo",
    "nav.wallet": "Portafoglio",

    "home.hello": "Buongiorno",
    "home.delivering": "Disponibile a",
    "home.city": "Tirana",
    "home.search.placeholder": "Chiedi qualsiasi cosa · \"Voglio una fuga nel weekend\"",
    "home.search.hint": "Tocca per parlare con il Concierge IA",
    "home.categories": "Cosa ti va oggi?",
    "home.featured": "Selezionati per te oggi",
    "home.match": "affinità",
    "home.drops": "Offerte limitate",
    "home.drops.endsIn": "Finisce tra",
    "home.discover": "Scopri vicino a te",
    "home.viewAll": "Vedi tutto",
    "home.quests": "Le tue sfide",
    "home.team": "Avventure di squadra",
    "home.wallet": "Il tuo portafoglio",
    "home.wallet.sub": "Budget mensile",
    "home.claim": "Prendi il pacchetto",
    "home.aiPick": "Scelta IA",
    "home.starters": "Prova a chiedere",

    "cat.wellness": "Benessere",
    "cat.food": "Cibo",
    "cat.fitness": "Fitness",
    "cat.learning": "Formazione",
    "cat.travel": "Viaggi",
    "cat.events": "Eventi",
    "cat.workspace": "Coworking",
    "cat.family": "Famiglia",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };
const I18nCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = "perx.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && dictionaries[saved]) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    }
  };

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (k: string) => dictionaries[lang][k] ?? dictionaries.en[k] ?? k,
    }),
    [lang],
  );

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
