export type Verdict = "SCAM" | "SUSPICIOUS" | "SAFE";
export const LANGUAGES = ["English", "Hindi", "Konkani"] as const;
export type Language = (typeof LANGUAGES)[number];

export interface AnalysisResult {
  verdict: Verdict; score: number; ml_score: number; red_flags: string[];
  explanation: string; recommendation: string; language?: string; id?: number;
}
export interface HistoryItem extends Partial<AnalysisResult> {
  id: number; verdict: Verdict; score: number; ml_score: number; red_flags: string[];
  message: string; language: string; created_at: number;
}
export interface User { id: number; name: string; email: string; language: Language; created_at: number }

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(/\/$/, "");
export const TOKEN_KEY = "ss-token";

export class ApiError extends Error {
  constructor(message: string, public kind: "network" | "timeout" | "server" | "client" | "auth" | "malformed") { super(message); }
}

export const FRIENDLY_DOWN = "We couldn't reach the ScamShield AI service. Make sure it's running and try again.";

async function request<T>(path: string, opts: { method?: string; body?: unknown; token?: string | null; timeoutMs?: number } = {}): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 20000);
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: opts.method ?? "GET", signal: ctrl.signal,
      headers: { "Content-Type": "application/json", ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}) },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw new ApiError("The analysis took too long. Please try again.", "timeout");
    throw new ApiError(FRIENDLY_DOWN, "network");
  } finally { clearTimeout(t); }

  let data: unknown = null;
  try { data = await res.json(); } catch { /* handled below */ }
  if (!res.ok) {
    const msg = (data as { error?: string } | null)?.error;
    if (res.status === 401) throw new ApiError(msg ?? "Please sign in again.", "auth");
    if (res.status >= 500) throw new ApiError("Something went wrong on our side. Please try again.", "server");
    throw new ApiError(msg ?? "That request couldn't be completed.", "client");
  }
  if (data === null) throw new ApiError("We got an unexpected response from the service.", "malformed");
  return data as T;
}

function validateResult(d: unknown): AnalysisResult {
  const r = d as Partial<AnalysisResult>;
  if (!r || !["SCAM", "SUSPICIOUS", "SAFE"].includes(r.verdict as string) || typeof r.score !== "number" ||
      typeof r.ml_score !== "number" || !Array.isArray(r.red_flags) || typeof r.explanation !== "string")
    throw new ApiError("We got an unexpected response from the service.", "malformed");
  return { ...(r as AnalysisResult), recommendation: r.recommendation ?? "" };
}

export async function analyzeMessage(message: string, language: string, token?: string | null) {
  return validateResult(await request("/check", { method: "POST", body: { message, language }, token }));
}
export const health = () => request<{ status: string; llm_explanations: boolean }>("/health", { timeoutMs: 4000 });

export const signup = (b: { name: string; email: string; password: string }) =>
  request<{ token: string; user: User }>("/auth/signup", { method: "POST", body: b });
export const login = (b: { email: string; password: string }) =>
  request<{ token: string; user: User }>("/auth/login", { method: "POST", body: b });
export const getMe = (token: string) => request<{ user: User }>("/me", { token });
export const updateMe = (token: string, b: { name?: string; language?: string }) =>
  request<{ user: User }>("/me", { method: "PATCH", body: b, token });
export const deleteAccount = (token: string) => request<{ ok: boolean }>("/me", { method: "DELETE", token });
export const getHistory = (token: string) => request<{ items: HistoryItem[] }>("/history", { token });
export const getHistoryItem = (token: string, id: number) => request<HistoryItem & AnalysisResult>(`/history/${id}`, { token });
export const deleteHistoryItem = (token: string, id: number) => request<{ ok: boolean }>(`/history/${id}`, { method: "DELETE", token });
export const clearHistory = (token: string) => request<{ ok: boolean }>("/history", { method: "DELETE", token });

/** Plain-language meaning of the red-flag names the rules engine can return. Only shown for flags actually returned. */
export const FLAG_HELP: Record<string, string> = {
  "Urgency": "The message pressures you to act right now, so you won't stop to think.",
  "Suspicious link": "It contains a link that may lead to a fake or unsafe website.",
  "Payment request": "It asks you to pay a fee, charge or deposit — real prizes and jobs don't.",
  "Account-blocking threat": "It threatens to block, suspend or cut off something you rely on.",
  "Prize / lottery bait": "It claims you won something you never entered for.",
  "Asks for sensitive info": "It asks for an OTP, PIN, password or card detail. Genuine companies never do.",
  "Authority impersonation": "It pretends to be police, a government body or a regulator to scare you.",
  "Secrecy demand": "It tells you to keep this secret, so nobody can warn you.",
  "Too-good-to-be-true offer": "It promises easy money or loans with no checks.",
};
