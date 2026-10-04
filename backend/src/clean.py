"""STEP 4: Clean raw_dataset.csv -> cleaned_dataset.csv"""
import re
import pandas as pd


def clean_text(t: str) -> str:
    t = str(t).lower()
    t = re.sub(r"(https?://\S+|www\.\S+|\b(bit\.ly|tinyurl\.com)/\S+|\b\S+\.(com|in|xyz|top|net|org)\S*)", " urltoken ", t)
    t = re.sub(r"(₹|rs\.?|inr)\s*[\d,\.]+\s*(lakh|crore)?", " moneytoken ", t)   # amounts
    t = re.sub(r"\b\d{10}\b|\b\d{2}x{8}\b", " phonetoken ", t)                    # phone numbers
    t = re.sub(r"\b\d{4,6}\b", " numtoken ", t)                                   # OTP-like numbers
    t = re.sub(r"[^\w\s\u0900-\u097F]", " ", t)                                    # keep words + Devanagari
    return re.sub(r"\s+", " ", t).strip()


if __name__ == "__main__":
    df = pd.read_csv("data/raw_dataset.csv")
    df["clean_text"] = df["text"].apply(clean_text)
    before = len(df)
    df = df.drop_duplicates(subset="clean_text").dropna(subset=["clean_text"])
    df.to_csv("data/cleaned_dataset.csv", index=False)
    print(f"Cleaned: {before} -> {len(df)} rows (duplicates removed)")
    print(df[["text", "clean_text"]].head(3).to_string())
