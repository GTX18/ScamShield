import type { Metadata } from "next";
import MessageAnalyzer from "@/components/MessageAnalyzer";
export const metadata: Metadata = { title: "Check a message — ScamShield" };
export default function CheckPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-6 sm:px-6">
      <h1 className="mb-2 text-center text-4xl font-semibold tracking-tight sm:text-5xl">Check a message</h1>
      <p className="mx-auto mb-8 max-w-lg text-center text-muted">Works for SMS, WhatsApp, email or any text. Nothing is sent to anyone but our analyzer.</p>
      <MessageAnalyzer />
    </div>
  );
}
