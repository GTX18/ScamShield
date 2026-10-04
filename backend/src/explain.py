"""STEP 11: Explanation layer. Uses an LLM if ANTHROPIC_API_KEY is set, else a built-in template.
The LLM never decides the verdict - it only explains what the ML + rules already found."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from check_message import check_message

ADVICE = {
    "SCAM": "Do not click any link, call any number, or pay anything. Never share your OTP, PIN or password. "
            "If unsure, contact the organisation through its official app/website. Report fraud at cybercrime.gov.in or call 1930.",
    "SUSPICIOUS": "Be careful. Don't click links or share details. Verify through the official app or website first.",
    "SAFE": "This looks like a normal message, but never share your OTP or PIN with anyone.",
}
ICON = {"SCAM": "🔴", "SUSPICIOUS": "🟠", "SAFE": "🟢"}


def template_explanation(message, r):
    why = "\n".join(f"• {f}" for f in r["red_flags"]) or "• No clear red flags found"
    return (f"{ICON[r['verdict']]} {r['verdict']} (risk score {int(r['score'] * 100)}%)\n\n"
            f"Why?\n{why}\n\nWhat to do:\n{ADVICE[r['verdict']]}")


def explain(message: str, language: str = "English") -> dict:
    r = check_message(message)
    text = None
    if os.getenv("ANTHROPIC_API_KEY"):
        try:
            import anthropic
            prompt = (f"A scam detector analysed this message.\nMessage: {message}\nVerdict: {r['verdict']}\n"
                      f"Score: {r['score']}\nRed flags: {', '.join(r['red_flags']) or 'none'}\n\n"
                      f"Explain in simple {language} (max 80 words) why it is or isn't a scam, and what the user should do. "
                      f"Do not change the verdict. Use bullet points.")
            msg = anthropic.Anthropic().messages.create(
                model=os.getenv("CLAUDE_MODEL", "claude-sonnet-5-5"), max_tokens=300,
                messages=[{"role": "user", "content": prompt}])
            text = msg.content[0].text
        except Exception as e:  # fall back silently so the demo never breaks
            print("LLM unavailable, using template:", e, file=sys.stderr)
    r["explanation"] = text or template_explanation(message, r)
    return r


if __name__ == "__main__":
    print(explain(" ".join(sys.argv[1:]) or "Your KYC expires today. Click bit.ly/abc")["explanation"])
