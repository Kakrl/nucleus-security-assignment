# app.py
import os
import json
import sqlite3
import hashlib
from flask import Flask, request
import hmac

app = Flask(__name__)
DB_PATH = os.getenv("DB_PATH", "/tmp/app.db")
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET")  # no default, must be set in env for security

def get_db():
    return sqlite3.connect(DB_PATH)

def verify(sig, body: bytes) -> bool:
    if not WEBHOOK_SECRET:
        return False  # fail if secret is not set
    mac = hmac.new(
        WEBHOOK_SECRET.encode('utf-8'),
        msg=body,
        digestmod=hashlib.sha256
    )
    expected = mac.hexdigest()
    return hmac.compare_digest(expected, sig)

@app.post("/webhook")
def webhook():
    raw = request.data  # bytes
    sig = request.headers.get("X-Signature", "")

    if not verify(sig, raw):
        return ("bad sig", 401)

    payload = json.loads(raw.decode("utf-8"))

    # Example payload:
    # {"email":"a@b.com","role":"admin","metadata":{"source":"vendor"}}
    email = payload.get("email", "")
    role = payload.get("role", "user")

    with get_db() as db:
        cur = db.cursor()

        # Store raw payload for auditing / debugging
        cur.execute(
            f"INSERT INTO webhook_audit(email, raw_json) VALUES (?, ?)", (email, raw.decode('utf-8'))
        )

        # Upsert user
        cur.execute(
            f"INSERT INTO users(email, role) VALUES(?, ?) ON CONFLICT(email) DO UPDATE SET role=excluded.role", (email, role)
        )

        db.commit()

    return ("ok", 200)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)