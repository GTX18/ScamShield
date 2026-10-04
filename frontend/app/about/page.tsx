import Link from "next/link";
export const metadata = { title: "About — ScamShield" };
export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-4 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">About ScamShield</h1>
      <div className="glass-strong mt-8 space-y-6 rounded-3xl p-6 leading-relaxed text-muted sm:p-9">
        <p>Scam messages are getting harder to spot, and families are often the ones targeted. ScamShield lets anyone paste a suspicious message and get a clear answer — <strong className="text-fg">scam, suspicious or safe</strong> — with the reasons explained simply, in English, Hindi or Konkani.</p>
        <div><h2 className="mb-2 text-lg font-semibold text-fg">How the verdict is made</h2>
          <p>A machine-learning text classifier estimates the chance a message is a scam. A separate rules engine looks for red flags such as urgency, risky links and payment demands. The two are combined into one risk score, and that score sets the verdict.</p></div>
        <div><h2 className="mb-2 text-lg font-semibold text-fg">What the language model does</h2>
          <p>If enabled, a language model rewrites the result as friendly advice. It never decides or changes the verdict. If it isn&apos;t available, ScamShield falls back to a built-in explanation.</p></div>
        <div><h2 className="mb-2 text-lg font-semibold text-fg">Limits</h2>
          <p>No checker is perfect. ScamShield is guidance, not a guarantee — when in doubt, contact the organisation through its official app or website.</p></div>
        <Link href="/check" className="btn btn-primary">Check a message</Link>
      </div>
    </div>
  );
}
