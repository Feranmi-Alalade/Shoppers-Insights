import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("SQL_DB_URL")