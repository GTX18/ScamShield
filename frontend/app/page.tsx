import Link from "next/link";
import Hero from "@/components/Hero";
import { HowItWorks, Trust } from "@/components/HowItWorks";
import { Reveal } from "@/components/fx";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Trust />
      <section className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-6">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Got a message that feels off?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">Don&apos;t click, don&apos;t reply. Paste it here first.</p>
          <Link href="/check" className="btn btn-primary mt-8 !px-8 !py-4 text-base">Check a message</Link>
        </Reveal>
      </section>
    </>
  );
}
