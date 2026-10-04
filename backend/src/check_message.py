"""STEP 8 + 9: Combine ML + rules. This is the function you hand to Person 1."""
import sys, os, joblib
sys.path.insert(0, os.path.dirname(__file__))
from clean import clean_text
from rules import find_red_flags

_ROOT = os.path.join(os.path.dirname(__file__), "..")
_clf = joblib.load(os.path.join(_ROOT, "model", "scam_classifier.pkl"))
_vec = joblib.load(os.path.join(_ROOT, "model", "tfidf_vectorizer.pkl"))


def check_message(message: str) -> dict:
    ml_score = float(_clf.predict_proba(_vec.transform([clean_text(message)]))[0][1])
    flags = find_red_flags(message)
    # Blend: ML is the main signal, rules nudge it up (many flags) or down (no flags)
    rule_score = min(len(flags) / 3, 1.0)
    score = round(0.7 * ml_score + 0.3 * rule_score, 3)
    if score >= 0.60:
        verdict = "SCAM"
    elif score >= 0.40:
        verdict = "SUSPICIOUS"
    else:
        verdict = "SAFE"
    return {"verdict": verdict, "score": score, "ml_score": round(ml_score, 3), "red_flags": flags}


if __name__ == "__main__":
    import json
    msg = " ".join(sys.argv[1:]) or "Your KYC expires today. Click this link."
    print(json.dumps(check_message(msg), indent=2, ensure_ascii=False))
