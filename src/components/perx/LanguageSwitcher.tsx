import { Globe } from "lucide-react";
import { useI18n, type Lang } from "@/lib/i18n";

const langs: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "sq", label: "SQ", flag: "🇦🇱" },
  { code: "it", label: "IT", flag: "🇮🇹" },
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useI18n();
  return (
    <label
      className={`inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-3 shadow-soft transition focus-within:border-coral hover:border-navy/30 ${
        compact ? "h-10" : "h-12"
      }`}
    >
      <Globe className="size-4 text-navy" aria-hidden />
      <span className="sr-only">{t("lang.label")}</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        aria-label={t("lang.label")}
        className="cursor-pointer appearance-none bg-transparent pr-1 text-sm font-bold text-navy outline-none"
      >
        {langs.map((l) => (
          <option key={l.code} value={l.code}>
            {l.flag} {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
