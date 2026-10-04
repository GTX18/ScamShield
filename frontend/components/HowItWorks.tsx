import { ClipboardPaste, ScanSearch, Lightbulb, Brain, ListChecks, MessageSquareText } from "lucide-react";
import { Reveal, SpotCard } from "./fx";

const STEPS = [
  { n: "01", Icon: ClipboardPaste, t: "Paste", d: "Paste a suspicious message." },
  { n: "02", Icon: ScanSearch, t: "Analyze", d: "Our ML model + red-flag engine analyzes it." },
  { n: "03", Icon: Lightbulb, t: "Understand", d: "Get a simple explanation and recommended action." },
];
const HYBRID = [
  { Icon: Brain, t: "Machine learning", d: "A trained text classifier estimates how closely the message resembles known scams." },
  { Icon: ListChecks, t: "Red-flag rules", d: "Clear rules look for urgency, risky links, payment demands, fake authority and more." },
  { Icon: MessageSquareText, t: "AI explanation", d: "A language model turns the result into friendly advice, in English, Hindi or Konkani." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-20 sm:px-6">
      <Reveal><p className="text-sm font-semibold uppercase tracking-[.16em] text-accent">How it works</p>
        <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">Three steps. About five seconds.</h2></Reveal>
      <ol className="mt-12 grid gap-4 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.n}><Reveal delay={i * .12} className="h-full"><SpotCard className="h-full p-7">
            <div className="flex items-center justify-between"><span className="text-5xl font-semibold tracking-tighter text-gradient">{s.n}</span><s.Icon className="text-accent" size={26} aria-hidden /></div>
            <h3 className="mt-8 text-xl font-semibold">{s.t}</h3><p className="mt-2 text-muted">{s.d}</p>
          </SpotCard></Reveal></li>
        ))}
      </ol>
    </section>
  );
}

export function Trust() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
      <Reveal className="glass-strong rounded-[2rem] p-7 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[.16em] text-accent">Why you can trust the verdict</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">The AI explains. It never decides.</h2>
        <p className="mt-4 max-w-2xl text-muted">ScamShield uses a hybrid approach. The machine-learning model and the rules engine decide whether a message is a scam. The language model only turns that technical result into an easy-to-understand explanation — it can&apos;t change the verdict.</p>
        <div className="mt-9 grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {HYBRID.flatMap((h, i) => {
            const card = (
              <div key={h.t} className="rounded-2xl border border-line bg-[var(--glass)] p-5">
                <h.Icon className="text-accent" size={24} aria-hidden /><h3 className="mt-4 font-semibold">{h.t}</h3><p className="mt-1.5 text-sm text-muted">{h.d}</p>
                {i === 2 && <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted">Explains only</p>}
                {i < 2 && <p className="mt-3 text-xs font-medium uppercase tracking-wider text-accent">Decides the verdict</p>}
              </div>);
            return i < 2 ? [card, <span key={`p${i}`} aria-hidden className="self-center text-center text-2xl text-muted">+</span>] : [card];
          })}
        </div>
      </Reveal>
    </section>
  );
}
