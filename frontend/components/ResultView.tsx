"use client";
import type { AnalysisResult } from "@/lib/api";
import VerdictCard from "./VerdictCard";
import RedFlags from "./RedFlags";
import Explanation from "./Explanation";

export default function ResultView({ r }: { r: AnalysisResult }) {
  return (
    <div className="space-y-4">
      <VerdictCard verdict={r.verdict} score={r.score} mlScore={r.ml_score} />
      <RedFlags flags={r.red_flags} />
      <Explanation explanation={r.explanation} recommendation={r.recommendation} />
    </div>
  );
}
