"use client";
import { MessageCircleHeart, ListChecks } from "lucide-react";

export default function Explanation({ explanation, recommendation }: { explanation: string; recommendation: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section aria-labelledby="exp-h" className="glass rounded-3xl p-6 sm:p-7">
        <h3 id="exp-h" className="flex items-center gap-2 text-lg font-semibold tracking-tight"><MessageCircleHeart size={19} className="text-accent" aria-hidden />In plain words</h3>
        <p className="mt-3 whitespace-pre-line leading-relaxed text-muted [overflow-wrap:anywhere]">{explanation}</p>
      </section>
      <section aria-labelledby="todo-h" className="glass rounded-3xl p-6 sm:p-7">
        <h3 id="todo-h" className="flex items-center gap-2 text-lg font-semibold tracking-tight"><ListChecks size={19} className="text-accent" aria-hidden />What should you do?</h3>
        {recommendation && <p className="mt-3 leading-relaxed">{recommendation}</p>}
        <p className="mt-4 text-sm text-muted">Report fraud at <a className="underline" href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">cybercrime.gov.in</a> or call <strong className="text-fg">1930</strong>.</p>
      </section>
    </div>
  );
}
