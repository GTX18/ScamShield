"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { Loader2, TriangleAlert } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { ApiError } from "@/lib/api";
import Logo from "./Logo";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { signIn, signUp } = useAuth(); const router = useRouter(); const sp = useSearchParams();
  const [name, setName] = useState(""), [email, setEmail] = useState(""), [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const signup = mode === "signup";

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (signup && !name.trim()) return setError("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email address.");
    if (pw.length < 8) return setError("Password must be at least 8 characters.");
    setBusy(true);
    try {
      if (signup) await signUp(name.trim(), email, pw); else await signIn(email, pw);
      const next = sp.get("next"); router.replace(next && next.startsWith("/") ? next : "/dashboard");
    } catch (e) { setError(e instanceof ApiError ? e.message : "Something went wrong."); setBusy(false); }
  }

  return (
    <div className="mx-auto grid min-h-[70dvh] max-w-md place-items-center px-5 py-10">
      <motion.div initial={{ opacity: 0, y: 24, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} className="glass-strong gradient-border w-full rounded-[2rem] p-7 sm:p-9">
        <Logo />
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">{signup ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-1.5 text-sm text-muted">{signup ? "Keep a private history of the messages you check." : "Log in to see your dashboard and history."}</p>
        <form onSubmit={submit} noValidate className="mt-7 space-y-4">
          {signup && (<div><label htmlFor="name" className="mb-1.5 block text-sm font-medium">Name</label><input id="name" className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></div>)}
          <div><label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label><input id="email" type="email" className="field" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><label htmlFor="pw" className="mb-1.5 block text-sm font-medium">Password</label>
            <input id="pw" type="password" className="field" autoComplete={signup ? "new-password" : "current-password"} value={pw} onChange={(e) => setPw(e.target.value)} aria-describedby={signup ? "pw-h" : undefined} />
            {signup && <p id="pw-h" className="mt-1.5 text-xs text-muted">At least 8 characters.</p>}</div>
          {error && <p role="alert" className="flex items-start gap-2 rounded-xl bg-[var(--scam-bg)] p-3 text-sm text-scam"><TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden />{error}</p>}
          <button className="btn btn-primary w-full !py-3.5" disabled={busy}>{busy && <Loader2 size={18} className="animate-spin" />}{signup ? "Create account" : "Log in"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">{signup ? "Already have an account? " : "New to ScamShield? "}
          <Link className="font-semibold text-accent hover:underline" href={signup ? "/login" : "/signup"}>{signup ? "Log in" : "Sign up"}</Link></p>
        <p className="mt-4 text-center text-xs text-muted">Don&apos;t reuse a banking password here.</p>
      </motion.div>
    </div>
  );
}
