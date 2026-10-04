"""STEP 7: Rules engine - detects red flags with regex. Independent of the ML model."""
import re

RULES = [
    ("Urgency",              r"\b(urgent|urgently|immediately|today|tonight|right now|within \d+ (hours?|minutes?)|hurry|final warning|act now|expires?)\b|तुरंत|आज"),
    ("Suspicious link",      r"(https?://|bit\.ly|tinyurl|\b\S+\.(xyz|top|net|in\.net)\b|लिंक)"),
    ("Payment request",      r"\b(pay|deposit|transfer|send)\b.{0,40}(fee|charge|charges|tax|deposit|₹|rs\.?|processing|registration|shipping)|\b(registration|processing|security|delivery|insurance) (fee|charges?|deposit)\b|जमा करें"),
    ("Account-blocking threat", r"\b(blocked|suspended|frozen|freeze|disconnected|disconnect|cut|deactivated|arrested|returned)\b|बंद हो जाएगा|कट जाएगा"),
    ("Prize / lottery bait", r"\b(you (have )?won|winner|lucky winner|lottery|prize|congratulations.{0,30}(won|selected)|cashback)\b|बधाई|इनाम"),
    ("Asks for sensitive info", r"\b(share|send|tell|give|enter|provide)\b.{0,25}\b(otp|pin|upi pin|password|cvv|card number|aadhaar)\b|ओटीपी शेयर|OTP शेयर"),
    ("Authority impersonation", r"\b(cbi|police|cyber crime|trai|customs|income tax|rbi|digital arrest)\b"),
    ("Secrecy demand",       r"\b(do not tell anyone|don'?t tell anyone|keep this secret)\b"),
    ("Too-good-to-be-true offer", r"\b(no cibil|without documents|earn ₹?\s?[\d,]+ (daily|per day)|work from home)\b"),
]
SAFE_HINT = re.compile(r"\b(do not share|never share|don'?t share)\b|साझा न करें", re.I)


def find_red_flags(message: str):
    flags = []
    for name, pattern in RULES:
        if re.search(pattern, message, re.I):
            flags.append(name)
    # "Do not share your OTP" is a SAFE warning, not a request for it
    if "Asks for sensitive info" in flags and SAFE_HINT.search(message):
        flags.remove("Asks for sensitive info")
    return flags
