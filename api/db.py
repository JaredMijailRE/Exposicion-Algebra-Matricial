import os
import psycopg2
from urllib.parse import urlparse

def get_db_connection():
    # Hardcoded connection for Docker environment
    # User requested to avoid .env files
    conn = psycopg2.connect(
        database="dbname",
        user="user",
        password="password",
        host="db",
        port="5432",
        sslmode="disable"
    )
    return conn

def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS responses (
            id SERIAL PRIMARY KEY,
            papa FLOAT,
            ingreso FLOAT,
            dependientes INTEGER,
            traslado FLOAT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    cur.close()
    conn.close()
