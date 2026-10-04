# ScamShield

Paste a suspicious SMS / WhatsApp / email and get a plain-language verdict: **SCAM, SUSPICIOUS or SAFE**.

- `backend/` — Flask API around your existing ScamShield-AI model (pickles, `check_message.py`, `rules.py`, `explain.py` are unchanged). Adds validation, CORS, accounts and saved history (SQLite).
- `frontend/` — Next.js (App Router) + TypeScript + Tailwind + Motion + Lucide.

The verdict always comes from the ML model + rules engine. The optional Claude layer only writes the explanation.

## Run

```bash
# backend  -> http://localhost:5000
cd backend && pip install -r requirements.txt && python src/app.py

# frontend -> http://localhost:3000
cd frontend && npm install && npm run dev
```

Health check: `GET http://localhost:5000/health`. API tests (backend running): `python backend/tests/run_api_tests.py`.

## Environment

Frontend `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5000`
Backend (see `backend/.env.example`): `ANTHROPIC_API_KEY` (optional), `CLAUDE_MODEL`, `CORS_ORIGINS`, `SECRET_KEY`.
The API key lives only in the backend. Without it, the built-in template explanation is used.

## API

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | status |
| POST | `/check` | `{message, language}` → `verdict, score, ml_score, red_flags, explanation, recommendation` (+ `id` if logged in) |
| POST | `/auth/signup`, `/auth/login` | return `{token, user}` |
| GET/PATCH/DELETE | `/me` | profile |
| GET/DELETE | `/history`, `/history/<id>` | saved checks (auth required) |

## Pages
`/` landing · `/check` analyzer · `/login` · `/signup` · `/dashboard` · `/results/[id]` · `/profile` · `/learn` · `/about`

## Notes
- Before deploying: set a strong `SECRET_KEY`, restrict `CORS_ORIGINS`, use HTTPS, and run Flask behind gunicorn.
- Logo is a placeholder: edit `frontend/components/Logo.tsx` only.

## Deploying
- **Frontend (Vercel):** import the repo, set Root Directory to `frontend`, add `NEXT_PUBLIC_API_URL` = your deployed backend URL.
- **Backend:** deploy `backend/` separately (e.g. Render/Railway: build `pip install -r requirements.txt`, start `gunicorn --chdir src app:app`). Set `CORS_ORIGINS` to your Vercel URL, a strong `SECRET_KEY`, and optionally `ANTHROPIC_API_KEY`.
- Accounts/history use SQLite (`DB_PATH`). Put it on a persistent disk, or the data is lost on redeploy.
