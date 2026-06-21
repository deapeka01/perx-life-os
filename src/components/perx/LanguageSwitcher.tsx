import { Globe } from "lucide-react";
import { useI18n, type Lang } from "@/lib/i18n";

const langs: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "it", label: "IT", flag: "🇮🇹" },
  { code: "sq", label: "SQ", flag: "🇦🇱" },
];

export function LanguageSwitcher({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  const { lang, setLang, t } = useI18n();
  const base = dark
    ? "border-white/20 bg-white/10 text-white focus-within:border-white/60 hover:border-white/40"
    : "border-border bg-card text-navy focus-within:border-coral hover:border-navy/30";
  return (
    <label
      className={`inline-flex items-center gap-2 rounded-full border-2 px-3 shadow-soft transition ${base} ${
        compact ? "h-10" : "h-12"
      }`}
    >
      <Globe className="size-4" aria-hidden />
      <span className="sr-only">{t("lang.label")}</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        aria-label={t("lang.label")}
        className="cursor-pointer appearance-none bg-transparent pr-1 text-sm font-bold outline-none"
        style={{ color: "inherit" }}
      >
        {langs.map((l) => (
          <option key={l.code} value={l.code} className="text-navy">
            {l.flag} {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
