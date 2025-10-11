import os

import yaml
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker


# --- YAML Loader ---
def read_yaml_file(filepath):
    """Read a YAML file and return its contents as a Python dict."""
    with open(filepath, "r") as f:
        return yaml.safe_load(f)


# --- SQLAlchemy ORM Setup ---
# Example: Use environment variables for DB connection
DB_URL = os.getenv("DB_URL", "sqlite:///shopper_insight.db")
engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# --- SQL Query Helpers ---
def query_all(sql, params=None):
    """Run a raw SQL query and return all results as dicts."""
    with engine.connect() as conn:
        result = conn.execute(text(sql), params or {})
        return [dict(row) for row in result]


# Example ORM model usage (if you have models defined)
# from models import Challenge
# def get_challenges():
#     with SessionLocal() as session:
#         return session.query(Challenge).all()

# --- Example Usage ---
# yaml_data = read_yaml_file('mock_data.yaml')
# sql_results = query_all('SELECT * FROM challenges')
