"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { AnalysisResult, ApiError, getHistoryItem, HistoryItem } from "@/lib/api";
import ResultView from "./ResultView";

export default function ResultPage({ id }: { id: number }) {
  const { token } = useAuth();
  const [data, setData] = useState<(HistoryItem & AnalysisResult) | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!token) return;
    getHistoryItem(token, id).then(setData).catch((e) => setError(e instanceof ApiError ? e.message : "Couldn't load this result."));
  }, [token, id]);
  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-4 sm:px-6">
      <Link href="/dashboard" className="btn btn-ghost !py-2 text-sm"><ArrowLeft size={16} />Back to dashboard</Link>
      {error && <p role="alert" className="mt-6 rounded-2xl bg-[var(--scam-bg)] p-4 text-scam">{error}</p>}
      {!data && !error && <div className="shimmer mt-6 h-72 rounded-3xl" role="status" aria-label="Loading" />}
      {data && (<>
        <blockquote className="glass my-5 rounded-2xl p-4 text-sm text-muted">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[.14em]">Message checked · {new Date(data.created_at * 1000).toLocaleString()}</span>
          <span className="whitespace-pre-line [overflow-wrap:anywhere]">{data.message}</span>
        </blockquote>
        <ResultView r={data} />
      </>)}
    </div>
  );
}
