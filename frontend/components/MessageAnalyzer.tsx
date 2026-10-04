"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ScanSearch, TriangleAlert, RotateCw, LogIn } from "lucide-react";
import { analyzeMessage, AnalysisResult, ApiError, Language } from "@/lib/api";
import { useAuth } from "./AuthProvider";
import MessageInput from "./MessageInput";
import LanguageSelector from "./LanguageSelector";
import LoadingState from "./LoadingState";
import ResultView from "./ResultView";
import CautionModal from "./CautionModal";
import { Magnetic } from "./fx";

const EXAMPLES = [
  "Your KYC expires today. Click this link immediately to avoid account suspension.",
  "Congratulations! You won ₹25,00,000. Pay ₹5,000 processing fee to claim.",
  "Hi mom I reached home safely",
];
/** Heuristic: does the text look like it contains an OTP / PIN / password / card / Aadhaar number? */
const SENSITIVE = /\b(otp|pin|password|passcode|cvv)\b\D{0,15}\d{3,8}|\b\d{3,8}\b\D{0,12}\b(otp|pin|cvv)\b|\b\d{13,19}\b|\b\d{4}\s\d{4}\s\d{4}\b/i;
const MIN_ANIM_MS = 1900;

export default function MessageAnalyzer() {
  const { user, token } = useAuth();
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState<Language>("English");
  const [phase, setPhase] = useState<"idle" | "loading" | "result" | "error">("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [modal, setModal] = useState<null | "privacy" | "danger">(null);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => { if (user?.language) setLanguage(user.language); }, [user]);

  const run = useCallback(async () => {
    setPhase("loading"); setError("");
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    try {
      const [r] = await Promise.all([analyzeMessage(message.trim(), language, token), new Promise((res) => setTimeout(res, MIN_ANIM_MS))]);
      setResult(r); setPhase("result");
      if (r.verdict === "SCAM") setTimeout(() => setModal("danger"), 900);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something unexpected happened."); setPhase("error");
    }
  }, [message, language, token]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim()) { setFormError("Paste or type a message first."); return; }
    setFormError("");
    if (SENSITIVE.test(message)) { setModal("privacy"); return; }
    run();
  };
  const reset = () => { setPhase("idle"); setResult(null); setMessage(""); };

  return (
    <div ref={top} className="relative scroll-mt-28">
      <AnimatePresence mode="popLayout">
        {phase === "loading" && (
          <motion.div key="load" layoutId="panel" className="glass-strong overflow-hidden rounded-[2rem]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingState message={message} />
          </motion.div>
        )}
        {phase === "result" && result && (
          <motion.div key="res" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <button onClick={reset} className="btn btn-ghost !py-2 text-sm"><ArrowLeft size={16} />Check another message</button>
              <LanguageSelector value={language} onChange={setLanguage} disabled />
            </div>
            <motion.blockquote layoutId="msgbox" className="surface mb-4 rounded-2xl p-4 text-sm text-muted">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[.14em]">Message checked</span>
              <span className="line-clamp-4 whitespace-pre-line [overflow-wrap:anywhere]">{message}</span>
            </motion.blockquote>
            <ResultView r={result} />
            {!user ? (
              <p className="glass mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 text-sm text-muted">
                <span>Want to keep a history of your checks?</span>
                <Link href="/signup" className="btn btn-ghost !py-2"><LogIn size={16} />Create free account</Link>
              </p>
            ) : result.id ? (
              <p className="mt-4 text-center text-sm text-muted">Saved to your history · <Link className="underline hover:text-fg" href={`/results/${result.id}`}>open full result</Link></p>
            ) : null}
          </motion.div>
        )}
        {(phase === "idle" || phase === "error") && (
          <motion.form key="form" layoutId="panel" onSubmit={submit} noValidate initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass-strong gradient-border rounded-[2rem] p-4 sm:p-7">
            <AnimatePresence>
              {phase === "error" && (
                <motion.div role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-5 overflow-hidden">
                  <div className="flex gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--scam)_40%,transparent)] bg-[var(--scam-bg)] p-4 text-sm">
                    <TriangleAlert className="mt-0.5 shrink-0 text-scam" size={18} aria-hidden />
                    <div><p className="font-semibold">We couldn&apos;t analyze that message.</p>
                      <p className="mt-1 text-muted">{error}</p></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <MessageInput value={message} onChange={(v) => { setMessage(v); setFormError(""); }} onClear={() => { setMessage(""); setFormError(""); }} />
            {formError && <p role="alert" className="mt-3 text-sm font-medium text-scam">{formError}</p>}
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible" aria-label="Example messages">
              <span className="shrink-0 text-xs text-muted">Try an example:</span>
              {EXAMPLES.map((ex, i) => (
                <button key={i} type="button" onClick={() => { setMessage(ex); setFormError(""); }} className="surface max-w-[16rem] shrink-0 truncate rounded-full px-3 py-1.5 text-xs text-muted transition-colors hover:text-fg">{ex}</button>
              ))}
            </div>
            <div className="mt-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
              <LanguageSelector value={language} onChange={setLanguage} className="flex w-full sm:inline-flex sm:w-auto" />
              <Magnetic className="w-full sm:w-auto">
                <button type="submit" className="btn btn-primary w-full !px-8 !py-3.5 text-base sm:w-auto">
                  {phase === "error" ? <RotateCw size={18} /> : <ScanSearch size={18} />}{phase === "error" ? "Try again" : "Analyze Message"}
                </button>
              </Magnetic>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <CautionModal open={modal === "privacy"} variant="privacy" onClose={() => setModal(null)} primaryLabel="Edit message"
        secondaryLabel="Analyze anyway" onSecondary={() => { setModal(null); run(); }} />
      <CautionModal open={modal === "danger"} variant="danger" onClose={() => setModal(null)} primaryLabel="I understand" />
    </div>
  );
}
