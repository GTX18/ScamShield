import Link from "next/link";
import { Reveal, SpotCard } from "@/components/fx";
export const metadata = { title: "Safety tips — ScamShield" };

const TIPS = [
  ["KYC & account-block messages", "Banks don't ask you to update KYC through a link in an SMS. Open the bank's own app instead."],
  ["OTP & PIN requests", "Nobody genuine will ask for your OTP, UPI PIN, CVV or password — not even \"bank staff\"."],
  ["Prize & lottery messages", "You can't win a contest you never entered. A \"processing fee\" to claim it is the scam."],
  ["\"Digital arrest\" & fake officials", "Police, CBI or customs never arrest or interrogate anyone over a video call or demand money."],
  ["Job & easy-money offers", "Work-from-home jobs that pay daily for liking videos, or loans with no checks, are bait."],
  ["Utility & SIM threats", "\"Your electricity will be cut tonight\" is pressure. Check with the provider's official number."],
];
export default function Learn() {
  return (
    <div className="mx-auto max-w-5xl px-5 pb-10 pt-4 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Spot scams before they spot you</h1>
      <p className="mt-3 max-w-2xl text-muted">The common tricks, in plain language.</p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {TIPS.map(([t, d], i) => (<li key={t}><Reveal delay={(i % 2) * .08} className="h-full"><SpotCard className="h-full p-6"><h2 className="font-semibold">{t}</h2><p className="mt-2 text-sm text-muted">{d}</p></SpotCard></Reveal></li>))}
      </ul>
      <div className="glass-strong mt-10 rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold">If you think you&apos;ve been scammed</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted">
          <li>Call your bank right away and ask them to block the card or account.</li>
          <li>Call the cyber-fraud helpline <strong className="text-fg">1930</strong> as soon as possible.</li>
          <li>File a report at <a className="underline" href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">cybercrime.gov.in</a>.</li>
          <li>Change passwords for accounts that may be affected.</li>
        </ol>
        <Link href="/check" className="btn btn-primary mt-6">Check a message</Link>
      </div>
    </div>
  );
}
