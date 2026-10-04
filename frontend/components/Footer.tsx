import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted">Before you click, check it. Plain-language scam checks for SMS, WhatsApp and email.</p>
        </div>
        <nav aria-label="Product" className="text-sm">
          <p className="mb-3 font-semibold">Product</p>
          <ul className="space-y-2 text-muted">
            <li><Link className="hover:text-fg" href="/check">Check a message</Link></li>
            <li><Link className="hover:text-fg" href="/#how-it-works">How it works</Link></li>
            <li><Link className="hover:text-fg" href="/dashboard">Dashboard</Link></li>
          </ul>
        </nav>
        <nav aria-label="Help" className="text-sm">
          <p className="mb-3 font-semibold">If you've been scammed</p>
          <ul className="space-y-2 text-muted">
            <li>Call <strong className="text-fg">1930</strong> (India cyber-fraud helpline)</li>
            <li>Report at <a className="underline hover:text-fg" href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">cybercrime.gov.in</a></li>
            <li><Link className="hover:text-fg" href="/learn">Safety tips</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line px-6 py-5 text-center text-xs text-muted">
        ScamShield gives guidance, not guarantees. When in doubt, contact the organisation through its official app or website.
      </div>
    </footer>
  );
}
