# from db.base import Base, SessionLocal, engine
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker
from core import DATABASE_URL

Base = declarative_base()

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from db.db_tables import BudgetDB, ReceiptDB