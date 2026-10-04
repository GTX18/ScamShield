"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Plus, Trash2, ChevronRight, ShieldAlert, TriangleAlert, ShieldCheck, Inbox } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { ApiError, clearHistory, deleteHistoryItem, getHistory, HistoryItem } from "@/lib/api";
import VerdictBadge from "./VerdictBadge";
import { CountUp, Reveal } from "./fx";

const fmt = (t: number) => new Date(t * 1000).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function DashboardView() {
  const { user, token, signOut } = useAuth();
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const [error, setError] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    try { setItems((await getHistory(token)).items); setError(""); }
    catch (e) { if (e instanceof ApiError && e.kind === "auth") signOut(); setError(e instanceof ApiError ? e.message : "Couldn't load your history."); }
  }, [token, signOut]);
  useEffect(() => { load(); }, [load]);

  const count = (v: string) => items?.filter((i) => i.verdict === v).length ?? 0;
  const total = items?.length ?? 0;
  const stats = [
    { l: "Messages checked", v: total, Icon: Inbox, c: "text-accent" },
    { l: "Scams caught", v: count("SCAM"), Icon: ShieldAlert, c: "text-scam" },
    { l: "Suspicious", v: count("SUSPICIOUS"), Icon: TriangleAlert, c: "text-warn" },
    { l: "Looked safe", v: count("SAFE"), Icon: ShieldCheck, c: "text-safe" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-4 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm text-muted">Dashboard</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Hi, {user?.name.split(" ")[0]}</h1></div>
        <Link href="/check" className="btn btn-primary"><Plus size={18} />New check</Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.l} delay={i * .06}><div className="glass rounded-3xl p-5">
            <s.Icon className={s.c} size={22} aria-hidden />
            <p className="mt-4 text-3xl font-semibold tabular-nums">{items ? <CountUp to={s.v} suffix="" duration={.8} /> : "–"}</p>
            <p className="text-sm text-muted">{s.l}</p></div></Reveal>
        ))}
      </div>

      {total > 0 && (
        <div className="glass mt-4 rounded-3xl p-5" aria-label="Breakdown of verdicts">
          <p className="mb-3 text-sm font-medium">Verdict breakdown</p>
          <div className="flex h-3 overflow-hidden rounded-full bg-[var(--line)]">
            {[["SCAM", "var(--scam)"], ["SUSPICIOUS", "var(--warn)"], ["SAFE", "var(--safe)"]].map(([k, c]) => (
              <motion.div key={k} title={`${k}: ${count(k)}`} className="h-full" style={{ background: c }} initial={{ width: 0 }} animate={{ width: `${(count(k) / total) * 100}%` }} transition={{ duration: .9 }} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Recent checks</h2>
        {total > 0 && (confirmClear ? (
          <span className="flex items-center gap-2 text-sm">Delete all?
            <button className="btn btn-ghost !px-3 !py-1.5 text-scam" onClick={async () => { await clearHistory(token!); setConfirmClear(false); load(); }}>Yes, delete</button>
            <button className="btn btn-ghost !px-3 !py-1.5" onClick={() => setConfirmClear(false)}>Cancel</button></span>
        ) : <button className="flex items-center gap-1.5 text-sm text-muted hover:text-fg" onClick={() => setConfirmClear(true)}><Trash2 size={15} />Clear history</button>)}
      </div>

      {error && <p role="alert" className="mt-4 rounded-2xl bg-[var(--scam-bg)] p-4 text-sm text-scam">{error}</p>}
      {items === null && !error && <div className="mt-4 space-y-3" role="status" aria-label="Loading">{[0, 1, 2].map((i) => <div key={i} className="shimmer h-20 rounded-2xl" />)}</div>}
      {items && total === 0 && (
        <div className="glass mt-4 rounded-3xl p-10 text-center"><p className="font-medium">No checks yet</p><p className="mt-1 text-sm text-muted">Messages you check while logged in will show up here.</p>
          <Link href="/check" className="btn btn-primary mt-5">Check your first message</Link></div>
      )}
      <ul className="mt-4 space-y-3">
        {items?.map((it, i) => (
          <motion.li key={it.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 8) * .04 }} className="glass group flex items-center gap-3 rounded-2xl p-2 pr-3">
            <Link href={`/results/${it.id}`} className="flex min-w-0 flex-1 items-center gap-4 rounded-xl p-3 hover:bg-[var(--line)]">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><VerdictBadge verdict={it.verdict} /><span className="text-xs text-muted">{Math.round(it.score * 100)}% risk · {it.language} · {fmt(it.created_at)}</span></div>
                <p className="mt-1.5 truncate text-sm text-muted">{it.message}</p>
              </div>
              <ChevronRight size={18} className="shrink-0 text-muted" aria-hidden />
            </Link>
            <button aria-label="Delete this check" className="rounded-full p-2 text-muted hover:text-scam" onClick={async () => { await deleteHistoryItem(token!, it.id); load(); }}><Trash2 size={16} /></button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
