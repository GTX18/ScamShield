"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth(); const router = useRouter(); const path = usePathname();
  useEffect(() => { if (ready && !user) router.replace(`/login?next=${encodeURIComponent(path)}`); }, [ready, user, router, path]);
  if (!ready || !user) return <div className="mx-auto max-w-6xl px-6 py-24"><div className="shimmer h-40 rounded-3xl" role="status" aria-label="Loading" /></div>;
  return <>{children}</>;
}
