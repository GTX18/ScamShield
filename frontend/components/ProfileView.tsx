"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2, LogOut } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { ApiError, clearHistory, deleteAccount, LANGUAGES, Language, updateMe } from "@/lib/api";

export default function ProfileView() {
  const { user, token, setUser, signOut } = useAuth(); const router = useRouter();
  const [name, setName] = useState(user?.name ?? ""); const [lang, setLang] = useState<Language>(user?.language ?? "English");
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle"); const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<"" | "history" | "account">("");
  if (!user || !token) return null;

  async function save(e: React.FormEvent) {
    e.preventDefault(); setError(""); setState("saving");
    try { setUser((await updateMe(token!, { name, language: lang })).user); setState("saved"); setTimeout(() => setState("idle"), 1800); }
    catch (e) { setError(e instanceof ApiError ? e.message : "Couldn't save."); setState("idle"); }
  }
  async function danger() {
    try {
      if (confirm === "history") await clearHistory(token!);
      if (confirm === "account") { await deleteAccount(token!); signOut(); router.replace("/"); }
      setConfirm("");
    } catch (e) { setError(e instanceof ApiError ? e.message : "Something went wrong."); }
  }
  const initials = user.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 pb-10 pt-4 sm:px-6">
      <div className="flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent2 text-xl font-semibold text-[var(--on-accent)]" aria-hidden>{initials}</span>
        <div><h1 className="text-3xl font-semibold tracking-tight">{user.name}</h1><p className="text-sm text-muted">{user.email} · joined {new Date(user.created_at * 1000).toLocaleDateString()}</p></div>
      </div>
      <form onSubmit={save} className="glass-strong space-y-4 rounded-3xl p-6">
        <h2 className="text-lg font-semibold">Profile</h2>
        <div><label htmlFor="pn" className="mb-1.5 block text-sm font-medium">Name</label><input id="pn" className="field" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><label htmlFor="pe" className="mb-1.5 block text-sm font-medium">Email</label><input id="pe" className="field opacity-70" value={user.email} disabled /></div>
        <div><label htmlFor="pl" className="mb-1.5 block text-sm font-medium">Default explanation language</label>
          <select id="pl" className="field" value={lang} onChange={(e) => setLang(e.target.value as Language)}>{LANGUAGES.map((l) => <option key={l}>{l}</option>)}</select></div>
        {error && <p role="alert" className="text-sm text-scam">{error}</p>}
        <button className="btn btn-primary" disabled={state === "saving"}>{state === "saving" ? <Loader2 className="animate-spin" size={18} /> : state === "saved" ? <Check size={18} /> : null}{state === "saved" ? "Saved" : "Save changes"}</button>
      </form>
      <section className="glass rounded-3xl p-6">
        <h2 className="text-lg font-semibold">Privacy &amp; data</h2>
        <p className="mt-1 text-sm text-muted">Checks you run while logged in are saved to your history so you can look back. Only you can see them, and you can delete them any time.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn btn-ghost" onClick={() => setConfirm("history")}>Delete my history</button>
          <button className="btn btn-ghost text-scam" onClick={() => setConfirm("account")}>Delete my account</button>
        </div>
        {confirm && (
          <div role="alertdialog" aria-label="Confirm" className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--scam)_40%,transparent)] bg-[var(--scam-bg)] p-4 text-sm">
            <span className="flex-1">{confirm === "history" ? "Delete all saved checks? This can't be undone." : "Delete your account and all saved checks? This can't be undone."}</span>
            <button className="btn btn-ghost !py-2" onClick={() => setConfirm("")}>Cancel</button>
            <button className="btn btn-primary !py-2" onClick={danger}>Yes, delete</button>
          </div>)}
      </section>
      <button onClick={() => { signOut(); router.replace("/"); }} className="btn btn-ghost w-full"><LogOut size={16} />Log out</button>
    </div>
  );
}
