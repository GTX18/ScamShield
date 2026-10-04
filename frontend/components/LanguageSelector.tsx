"use client";
import { Languages } from "lucide-react";
import { LANGUAGES, Language } from "@/lib/api";

export default function LanguageSelector({ value, onChange, disabled, className = "" }: { value: Language; onChange: (l: Language) => void; disabled?: boolean; className?: string }) {
  return (
    <label className={`surface relative inline-flex items-center gap-2 rounded-full py-2.5 pl-3.5 pr-2 text-sm ${className}`}>
      <Languages size={16} className="text-accent" aria-hidden />
      <span className="sr-only">Explanation language</span>
      <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value as Language)}
        className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent pr-6 font-medium focus:outline-none" aria-label="Explanation language">
        {LANGUAGES.map((l) => <option key={l} value={l} className="bg-bg text-fg">{l}</option>)}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-4 text-xs text-muted">▾</span>
    </label>
  );
}
