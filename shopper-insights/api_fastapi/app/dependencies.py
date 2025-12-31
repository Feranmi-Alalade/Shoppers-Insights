import json
from pathlib import Path
from db import SessionLocal

path_output_mock = Path(r"C:\Users\hp\Downloads\endpoint_outputs.json")
path_input_mock = Path(r"C:\Users\hp\Downloads\endpoint_input.json")


def get_db():
    """FastAPI dependency to get a database session.

    This function creates a new database session for each request, handles
    the cleanup, and ensures the session is always closed, even if an
    error occurs.

    Yields:
        A new SQLAlchemy Session object.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def load_output_mock():
    with open(path_output_mock, "r") as f:
        return json.load(f)


def load_input_mock():
    with open(path_input_mock, "r") as f:
        return json.load(f)
