import Link from "next/link";
export default function NotFound() {
  return <div className="mx-auto max-w-md px-6 py-24 text-center"><h1 className="text-5xl font-semibold">404</h1><p className="mt-3 text-muted">That page doesn&apos;t exist.</p><Link href="/" className="btn btn-primary mt-6">Go home</Link></div>;
}
