"use client";
import { Eraser, Lock } from "lucide-react";

export const MAX_CHARS = 5000;
export default function MessageInput({ value, onChange, onClear, disabled }: { value: string; onChange: (v: string) => void; onClear: () => void; disabled?: boolean }) {
  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <label htmlFor="msg" className="text-lg font-semibold tracking-tight sm:text-xl">Paste a suspicious message</label>
        <button type="button" onClick={onClear} disabled={disabled || !value} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:text-fg disabled:opacity-40">
          <Eraser size={15} aria-hidden />Clear
        </button>
      </div>
      <div className="surface rounded-3xl p-1.5 transition-shadow focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_20%,transparent)]">
        <textarea id="msg" value={value} disabled={disabled} maxLength={MAX_CHARS} rows={5} onChange={(e) => onChange(e.target.value)}
          placeholder="Your KYC expires today. Click this link to avoid account suspension…"
          aria-describedby="msg-help" className="block min-h-[9rem] w-full sm:min-h-[11rem] resize-y rounded-[1.35rem] bg-transparent p-4 text-base leading-relaxed placeholder:text-muted/60 focus:outline-none sm:p-5" />
      </div>
      <div id="msg-help" className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5"><Lock size={13} aria-hidden />Don&apos;t include passwords, OTPs, or other private information.</span>
        <span aria-live="polite" className={value.length > MAX_CHARS * .9 ? "text-warn" : ""}>{value.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}</span>
      </div>
    </div>
  );
}
