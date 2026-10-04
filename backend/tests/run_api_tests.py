"""End-to-end API check. Usage: python tests/run_api_tests.py [base_url]"""
import csv, json, os, sys, urllib.request, urllib.error
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:5000"

def post(path, body, headers=None):
    req = urllib.request.Request(BASE + path, json.dumps(body).encode(), {"Content-Type": "application/json", "Origin": "http://localhost:3000", **(headers or {})})
    try:
        with urllib.request.urlopen(req) as r: return r.status, json.loads(r.read()), r.headers
    except urllib.error.HTTPError as e: return e.code, json.loads(e.read()), e.headers

here = os.path.dirname(__file__)
rows = list(csv.DictReader(open(os.path.join(here, "test_messages.csv"), encoding="utf-8"))) + list(csv.DictReader(open(os.path.join(here, "hard_messages.csv"), encoding="utf-8")))
ok = 0
for r in rows:
    s, d, _ = post("/check", {"message": r["message"], "language": "English"})
    ok += d["verdict"] == r["expected"]
print(f"model agreement with expected labels: {ok}/{len(rows)}")
for r in rows:
    s, d, _ = post("/check", {"message": r["message"], "language": "English"})
    if d["verdict"] != r["expected"]: print("  MISMATCH", r["expected"], "->", d["verdict"], d["score"], "|", r["message"][:70])

s, d, h = post("/check", {"message": "Your KYC expires today. Click this link immediately to avoid account suspension.", "language": "English"})
print("T1 scam      ", s, d["verdict"], d["score"], d["ml_score"], d["red_flags"], "| CORS:", h.get("Access-Control-Allow-Origin"))
sus = next((r for r in rows if r["expected"] == "SUSPICIOUS"), None)
s, d, _ = post("/check", {"message": sus["message"] if sus else "Your parcel is held. Pay Rs 50 delivery fee at tinyurl.com/x", "language": "English"})
print("T2 suspicious", s, d["verdict"], d["score"], d["red_flags"])
s, d, _ = post("/check", {"message": "Hi mom I reached home safely", "language": "English"})
print("T3 safe      ", s, d["verdict"], d["score"], d["red_flags"])
s, d, _ = post("/check", {"message": "आपका KYC आज बंद हो जाएगा। तुरंत इस लिंक पर क्लिक करें।", "language": "Hindi"})
print("T4 hindi     ", s, d["verdict"], d["score"], d["red_flags"], d["language"])
s, d, _ = post("/check", {"message": "Tuzo KYC aiz sampta. Hi link vor click kor.", "language": "Konkani"})
print("T5 konkani   ", s, d["verdict"], d["score"], d["red_flags"], d["language"])
print("empty        ", post("/check", {"message": "  ", "language": "English"})[:2])
print("bad language ", post("/check", {"message": "hi", "language": "French"})[:2])
print("too long     ", post("/check", {"message": "a" * 5001})[:2])
# auth + history
em = f"t{os.getpid()}@example.com"
s, d, _ = post("/auth/signup", {"name": "Test", "email": em, "password": "password123"}); tok = d["token"]; print("signup", s)
s, d, _ = post("/check", {"message": "You won a lottery! Pay Rs 5000 processing fee.", "language": "English"}, {"Authorization": f"Bearer {tok}"}); print("saved id", d.get("id"), d["verdict"])
req = urllib.request.Request(BASE + "/history", headers={"Authorization": f"Bearer {tok}"}); print("history", len(json.loads(urllib.request.urlopen(req).read())["items"]))
print("bad login", post("/auth/login", {"email": em, "password": "nope"})[:2])
