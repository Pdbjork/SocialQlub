import sqlite3
from datetime import datetime

DB_NAME = "qlub.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            interest_level TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def add_user(email, interest_level="subscriber"):
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute("INSERT INTO users (email, interest_level) VALUES (?, ?)", (email, interest_level))
        conn.commit()
        conn.close()
        return True
    except sqlite3.IntegrityError:
        return False
