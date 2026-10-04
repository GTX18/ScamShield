import Link from "next/link";
import { Shield } from "lucide-react";

/** Temporary placeholder logo — replace the contents of this file to rebrand the whole app. */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="40" height="40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#22D3EE"/><stop offset="1" stopColor="#2F6BFF"/></linearGradient></defs><g id="icon"><path d="M100 22L164 46V100C164 134 136 156 100 176C64 156 36 134 36 100V46Z" fill="none" stroke="#2F6BFF" strokeWidth="15" strokeLinejoin="round"/><path d="M76 70H124A12 12 0 0 1 136 82V104A12 12 0 0 1 124 116H98L82 130V116H76A12 12 0 0 1 64 104V82A12 12 0 0 1 76 70Z" fill="#22D3EE"/><circle cx="130" cy="76" r="9" fill="#34D399" stroke="#0B1226" strokeWidth="4"/><path d="M6 12L40 22L20 44Z" fill="#FF5A5F"/></g></svg>
  );
}
export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 font-semibold tracking-tight" aria-label="ScamShield home">
      <LogoMark /><span className="text-lg">ScamShield</span>
    </Link>
  );
}
