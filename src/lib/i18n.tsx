import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "sq" | "it" | "de";

type Dict = Record<string, string>;

const dictionaries: Record<Lang, Dict> = {
  en: {
    "lang.label": "Language",
    "lang.en": "English",
    "lang.sq": "Shqip",
    "lang.it": "Italiano",
    "lang.de": "Deutsch",

    "landing.tag": "Now in private beta",
    "landing.title.1": "One ecosystem.",
    "landing.title.2": "Three lives",
    "landing.title.3": "made easier by AI.",
    "landing.subtitle":
      "Companies fund growth and wellbeing. Employees pursue goals and experiences. Providers reach corporate customers.",
    "landing.cta": "Enter Perx",
    "landing.choose": "Choose how you'll enter",
    "landing.footer": "Mock data only. No real transactions. Lek (ALL) currency.",

    "role.employee": "I'm an employee",
    "role.employee.desc": "Pursue goals, discover experiences, talk to your AI Concierge.",
    "role.company": "I'm a company",
    "role.company.desc": "Fund growth and wellbeing. Approvals, insights, budgets.",
    "role.provider": "I'm a provider",
    "role.provider.desc": "Reach qualified corporate customers and build offers.",
    "role.enter": "Enter",

    "auth.welcome": "Welcome back",
    "auth.create": "Create your account",
    "auth.signin.cta": "Sign in",
    "auth.signup.cta": "Create account",
    "auth.continueGoogle": "Continue with Google",
    "auth.or": "or",
    "auth.tagline": "Your AI lifestyle companion.",
    "auth.name": "Full name",
    "auth.email": "Work email",
    "auth.password": "Password",
    "auth.toggle.login": "Login",
    "auth.toggle.signup": "Sign up",
    "auth.haveAccount": "Already have an account?",
    "auth.noAccount": "New to Perx?",

    "redeem.title": "Join your company",
    "redeem.subtitle": "Enter the invitation code your company shared with you.",
    "redeem.placeholder": "Invitation code",
    "redeem.cta": "Continue",
    "redeem.error": "Invalid or expired code.",
    "redeem.help": "Demo codes: EMP-DEMO, CO-DEMO, PRV-DEMO",
    "redeem.skip": "Skip for now",
  },
  sq: {
    "lang.label": "Gjuha",
    "lang.en": "English",
    "lang.sq": "Shqip",
    "lang.it": "Italiano",
    "lang.de": "Deutsch",

    "landing.tag": "Tani në beta privat",
    "landing.title.1": "Një ekosistem.",
    "landing.title.2": "Tre jetë",
    "landing.title.3": "më të lehta me AI.",
    "landing.subtitle":
      "Kompanitë financojnë rritjen dhe mirëqenien. Punonjësit ndjekin qëllimet. Ofruesit arrijnë klientët korporativë.",
    "landing.cta": "Hyr në Perx",
    "landing.choose": "Zgjidh si do të hysh",
    "landing.footer": "Vetëm të dhëna provë. Pa transaksione reale. Monedha Lek (ALL).",

    "role.employee": "Jam punonjës",
    "role.employee.desc": "Ndiq qëllimet, zbulo përvoja, fol me Konsulentin tënd AI.",
    "role.company": "Jam kompani",
    "role.company.desc": "Financo rritjen dhe mirëqenien. Miratime, njohuri, buxhete.",
    "role.provider": "Jam ofrues",
    "role.provider.desc": "Arri klientët korporativë dhe ndërto oferta.",
    "role.enter": "Hyr",

    "auth.welcome": "Mirësevjen",
    "auth.create": "Krijo llogarinë tënde",
    "auth.signin.cta": "Hyr",
    "auth.signup.cta": "Krijo llogari",
    "auth.continueGoogle": "Vazhdo me Google",
    "auth.or": "ose",
    "auth.tagline": "Shoqëruesi yt AI i jetës.",
    "auth.name": "Emri i plotë",
    "auth.email": "Email pune",
    "auth.password": "Fjalëkalimi",
    "auth.toggle.login": "Hyr",
    "auth.toggle.signup": "Regjistrohu",
    "auth.haveAccount": "Ke tashmë llogari?",
    "auth.noAccount": "I ri në Perx?",

    "redeem.title": "Bashkohu me kompaninë tënde",
    "redeem.subtitle": "Vendos kodin e ftesës që ndau kompania jote.",
    "redeem.placeholder": "Kodi i ftesës",
    "redeem.cta": "Vazhdo",
    "redeem.error": "Kod i pavlefshëm ose i skaduar.",
    "redeem.help": "Kode provë: EMP-DEMO, CO-DEMO, PRV-DEMO",
    "redeem.skip": "Kalo për momentin",
  },
  it: {
    "lang.label": "Lingua",
    "lang.en": "English",
    "lang.sq": "Shqip",
    "lang.it": "Italiano",
    "lang.de": "Deutsch",

    "landing.tag": "Ora in beta privata",
    "landing.title.1": "Un ecosistema.",
    "landing.title.2": "Tre vite",
    "landing.title.3": "rese più facili dall'IA.",
    "landing.subtitle":
      "Le aziende finanziano crescita e benessere. I dipendenti seguono obiettivi. I fornitori raggiungono clienti aziendali.",
    "landing.cta": "Entra in Perx",
    "landing.choose": "Scegli come entrare",
    "landing.footer": "Solo dati dimostrativi. Nessuna transazione reale. Valuta Lek (ALL).",

    "role.employee": "Sono un dipendente",
    "role.employee.desc": "Insegui obiettivi, scopri esperienze, parla con il tuo Concierge IA.",
    "role.company": "Siamo un'azienda",
    "role.company.desc": "Finanzia crescita e benessere. Approvazioni, insight, budget.",
    "role.provider": "Sono un fornitore",
    "role.provider.desc": "Raggiungi clienti aziendali qualificati e crea offerte.",
    "role.enter": "Entra",

    "auth.welcome": "Bentornato",
    "auth.create": "Crea il tuo account",
    "auth.signin.cta": "Accedi",
    "auth.signup.cta": "Crea account",
    "auth.continueGoogle": "Continua con Google",
    "auth.or": "oppure",
    "auth.tagline": "Il tuo compagno AI di vita.",
    "auth.name": "Nome completo",
    "auth.email": "Email di lavoro",
    "auth.password": "Password",
    "auth.toggle.login": "Accedi",
    "auth.toggle.signup": "Registrati",
    "auth.haveAccount": "Hai già un account?",
    "auth.noAccount": "Nuovo su Perx?",

    "redeem.title": "Unisciti alla tua azienda",
    "redeem.subtitle": "Inserisci il codice di invito condiviso dalla tua azienda.",
    "redeem.placeholder": "Codice di invito",
    "redeem.cta": "Continua",
    "redeem.error": "Codice non valido o scaduto.",
    "redeem.help": "Codici demo: EMP-DEMO, CO-DEMO, PRV-DEMO",
    "redeem.skip": "Salta per ora",
  },
  de: {
    "lang.label": "Sprache",
    "lang.en": "English",
    "lang.sq": "Shqip",
    "lang.it": "Italiano",
    "lang.de": "Deutsch",

    "landing.tag": "Jetzt in privater Beta",
    "landing.title.1": "Ein Ökosystem.",
    "landing.title.2": "Drei Leben",
    "landing.title.3": "von KI vereinfacht.",
    "landing.subtitle":
      "Unternehmen finanzieren Wachstum und Wohlbefinden. Mitarbeitende verfolgen Ziele. Anbieter erreichen Firmenkunden.",
    "landing.cta": "Perx betreten",
    "landing.choose": "Wähle deinen Zugang",
    "landing.footer": "Nur Demo-Daten. Keine echten Transaktionen. Währung Lek (ALL).",

    "role.employee": "Ich bin Mitarbeitende:r",
    "role.employee.desc": "Verfolge Ziele, entdecke Erlebnisse, sprich mit deinem KI-Concierge.",
    "role.company": "Wir sind ein Unternehmen",
    "role.company.desc": "Wachstum und Wohlbefinden finanzieren. Freigaben, Insights, Budgets.",
    "role.provider": "Ich bin Anbieter",
    "role.provider.desc": "Qualifizierte Firmenkunden erreichen und Angebote erstellen.",
    "role.enter": "Eintreten",

    "auth.welcome": "Willkommen zurück",
    "auth.create": "Konto erstellen",
    "auth.signin.cta": "Anmelden",
    "auth.signup.cta": "Konto erstellen",
    "auth.continueGoogle": "Mit Google fortfahren",
    "auth.or": "oder",
    "auth.tagline": "Dein KI-Lifestyle-Begleiter.",
    "auth.name": "Vollständiger Name",
    "auth.email": "Geschäftliche E-Mail",
    "auth.password": "Passwort",
    "auth.toggle.login": "Anmelden",
    "auth.toggle.signup": "Registrieren",
    "auth.haveAccount": "Schon ein Konto?",
    "auth.noAccount": "Neu bei Perx?",

    "redeem.title": "Tritt deinem Unternehmen bei",
    "redeem.subtitle": "Gib den Einladungscode ein, den dein Unternehmen geteilt hat.",
    "redeem.placeholder": "Einladungscode",
    "redeem.cta": "Weiter",
    "redeem.error": "Ungültiger oder abgelaufener Code.",
    "redeem.help": "Demo-Codes: EMP-DEMO, CO-DEMO, PRV-DEMO",
    "redeem.skip": "Vorerst überspringen",
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
