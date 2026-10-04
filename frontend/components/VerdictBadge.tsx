import { VERDICT_UI } from "./VerdictCard";
import type { Verdict } from "@/lib/api";
export default function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const u = VERDICT_UI[verdict]; const Icon = u.Icon;
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${u.bg} ${u.cls}`}><Icon size={13} aria-hidden />{verdict}</span>;
}
