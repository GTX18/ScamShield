"""ScamShield API.  Run: python src/app.py  ->  http://localhost:5000

The verdict ALWAYS comes from the supplied ML model + rules engine (check_message.py).
The optional LLM layer (explain.py) only writes the explanation; it can never change the verdict.
"""
import os, re, sys, time
from flask import Flask, request, jsonify, g
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

sys.path.insert(0, os.path.dirname(__file__))
import store
from explain import explain, ADVICE  # existing AI pipeline, unchanged

LANGUAGES = {"English", "Hindi", "Konkani"}
MAX_LEN = 5000
TOKEN_TTL = 60 * 60 * 24 * 14
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

app = Flask(__name__)
SECRET = os.getenv("SECRET_KEY", "dev-only-secret-change-me")
signer = URLSafeTimedSerializer(SECRET, salt="scamshield-auth")
store.init()


# ---------- helpers ----------
def err(msg, code):
    return jsonify({"error": msg}), code


@app.after_request
def cors(resp):
    allowed = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")]
    origin = request.headers.get("Origin", "")
    if "*" in allowed or origin in allowed:
        resp.headers["Access-Control-Allow-Origin"] = origin or "*"
        resp.headers["Vary"] = "Origin"
        resp.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        resp.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, DELETE, OPTIONS"
    return resp


@app.before_request
def preflight_and_auth():
    if request.method == "OPTIONS":
        return "", 204
    g.user = None
    h = request.headers.get("Authorization", "")
    if h.startswith("Bearer "):
        try:
            uid = signer.loads(h[7:], max_age=TOKEN_TTL)["uid"]
            with store.conn() as c:
                row = c.execute("SELECT * FROM users WHERE id=?", (uid,)).fetchone()
            g.user = row
        except (BadSignature, SignatureExpired, KeyError):
            g.user = None


def need_user():
    return None if g.user else err("Please sign in to continue.", 401)


def token_for(row):
    return signer.dumps({"uid": row["id"]})


@app.errorhandler(404)
def nf(_):
    return err("Not found.", 404)


@app.errorhandler(405)
def mna(_):
    return err("Method not allowed.", 405)


@app.errorhandler(Exception)
def boom(e):
    print("Unhandled error:", repr(e), file=sys.stderr)
    return err("Something went wrong on our side. Please try again.", 500)


# ---------- core ----------
@app.get("/health")
def health():
    return jsonify({"status": "ok", "llm_explanations": bool(os.getenv("ANTHROPIC_API_KEY"))})


@app.post("/check")
def check():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return err('Send JSON like {"message": "...", "language": "English"}', 400)
    msg = data.get("message")
    if not isinstance(msg, str) or not msg.strip():
        return err("Message is required.", 400)
    msg = msg.strip()
    if len(msg) > MAX_LEN:
        return err(f"Message is too long (max {MAX_LEN} characters).", 413)
    language = data.get("language", "English")
    if language not in LANGUAGES:
        return err(f"Language must be one of: {', '.join(sorted(LANGUAGES))}.", 400)

    res = explain(msg, language)                 # verdict, score, ml_score, red_flags, explanation
    res["recommendation"] = ADVICE[res["verdict"]]  # additive: advice text from explain.py
    res["language"] = language
    if g.user:
        res["id"] = store.save_check(g.user["id"], msg, language, res)
    return jsonify(res)


# ---------- auth ----------
@app.post("/auth/signup")
def signup():
    d = request.get_json(silent=True) or {}
    name, email, pw = (str(d.get("name", "")).strip(), str(d.get("email", "")).strip().lower(), str(d.get("password", "")))
    if not name or len(name) > 80:
        return err("Please enter your name.", 400)
    if not EMAIL_RE.match(email):
        return err("Please enter a valid email address.", 400)
    if len(pw) < 8:
        return err("Password must be at least 8 characters.", 400)
    try:
        with store.conn() as c:
            cur = c.execute("INSERT INTO users(name,email,pw_hash,created_at) VALUES(?,?,?,?)",
                            (name, email, generate_password_hash(pw), int(time.time())))
            row = c.execute("SELECT * FROM users WHERE id=?", (cur.lastrowid,)).fetchone()
    except Exception as e:
        if "UNIQUE" in str(e):
            return err("An account with this email already exists.", 409)
        raise
    return jsonify({"token": token_for(row), "user": store.user_dict(row)}), 201


@app.post("/auth/login")
def login():
    d = request.get_json(silent=True) or {}
    email, pw = str(d.get("email", "")).strip().lower(), str(d.get("password", ""))
    with store.conn() as c:
        row = c.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
    if not row or not check_password_hash(row["pw_hash"], pw):
        return err("Incorrect email or password.", 401)
    return jsonify({"token": token_for(row), "user": store.user_dict(row)})


@app.get("/me")
def me():
    return need_user() or jsonify({"user": store.user_dict(g.user)})


@app.patch("/me")
def update_me():
    if (r := need_user()):
        return r
    d = request.get_json(silent=True) or {}
    name = str(d.get("name", g.user["name"])).strip()
    lang = d.get("language", g.user["language"])
    if not name or len(name) > 80:
        return err("Please enter your name.", 400)
    if lang not in LANGUAGES:
        return err("Unsupported language.", 400)
    with store.conn() as c:
        c.execute("UPDATE users SET name=?, language=? WHERE id=?", (name, lang, g.user["id"]))
        row = c.execute("SELECT * FROM users WHERE id=?", (g.user["id"],)).fetchone()
    return jsonify({"user": store.user_dict(row)})


@app.delete("/me")
def delete_me():
    if (r := need_user()):
        return r
    with store.conn() as c:
        c.execute("DELETE FROM history WHERE user_id=?", (g.user["id"],))
        c.execute("DELETE FROM users WHERE id=?", (g.user["id"],))
    return jsonify({"ok": True})


# ---------- history ----------
@app.get("/history")
def history():
    if (r := need_user()):
        return r
    with store.conn() as c:
        rows = c.execute("SELECT * FROM history WHERE user_id=? ORDER BY created_at DESC, id DESC LIMIT 200",
                         (g.user["id"],)).fetchall()
    return jsonify({"items": [store.history_dict(x, full=False) for x in rows]})


@app.get("/history/<int:hid>")
def history_item(hid):
    if (r := need_user()):
        return r
    with store.conn() as c:
        row = c.execute("SELECT * FROM history WHERE id=? AND user_id=?", (hid, g.user["id"])).fetchone()
    return jsonify(store.history_dict(row)) if row else err("Result not found.", 404)


@app.delete("/history/<int:hid>")
def history_delete(hid):
    if (r := need_user()):
        return r
    with store.conn() as c:
        c.execute("DELETE FROM history WHERE id=? AND user_id=?", (hid, g.user["id"]))
    return jsonify({"ok": True})


@app.delete("/history")
def history_clear():
    if (r := need_user()):
        return r
    with store.conn() as c:
        c.execute("DELETE FROM history WHERE user_id=?", (g.user["id"],))
    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=False)
