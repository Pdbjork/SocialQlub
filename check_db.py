import sqlite3

conn = sqlite3.connect('qlub.db')
c = conn.cursor()
c.execute("SELECT * FROM users")
users = c.fetchall()
print("Users found:", users)
conn.close()
