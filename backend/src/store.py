"""Small SQLite layer for accounts + saved check history."""
import json, os, sqlite3, time

DB_PATH = os.getenv("DB_PATH", os.path.join(os.path.dirname(__file__), "..", "data", "scamshield.db"))


def conn():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    c = sqlite3.connect(DB_PATH)
    c.row_factory = sqlite3.Row
    return c


def init():
    with conn() as c:
        c.executescript("""
        CREATE TABLE IF NOT EXISTS users(
          id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL, pw_hash TEXT NOT NULL,
          language TEXT NOT NULL DEFAULT 'English', created_at INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS history(
          id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL,
          message TEXT NOT NULL, language TEXT NOT NULL, verdict TEXT NOT NULL,
          score REAL NOT NULL, ml_score REAL NOT NULL, red_flags TEXT NOT NULL,
          explanation TEXT NOT NULL, recommendation TEXT NOT NULL, created_at INTEGER NOT NULL);
        CREATE INDEX IF NOT EXISTS idx_history_user ON history(user_id, created_at DESC);
        """)


def user_dict(r):
    return {"id": r["id"], "name": r["name"], "email": r["email"], "language": r["language"], "created_at": r["created_at"]}


def history_dict(r, full=True):
    d = {"id": r["id"], "verdict": r["verdict"], "score": r["score"], "ml_score": r["ml_score"],
         "red_flags": json.loads(r["red_flags"]), "language": r["language"], "created_at": r["created_at"],
         "message": r["message"]}
    if full:
        d["explanation"] = r["explanation"]
        d["recommendation"] = r["recommendation"]
    return d


def save_check(user_id, message, language, res):
    with conn() as c:
        cur = c.execute(
            "INSERT INTO history(user_id,message,language,verdict,score,ml_score,red_flags,explanation,recommendation,created_at)"
            " VALUES(?,?,?,?,?,?,?,?,?,?)",
            (user_id, message, language, res["verdict"], res["score"], res["ml_score"],
             json.dumps(res["red_flags"], ensure_ascii=False), res["explanation"], res["recommendation"], int(time.time())))
        return cur.lastrowid
