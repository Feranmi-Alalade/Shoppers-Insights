from api import api_router
from fastapi import FastAPI
from db import Base, engine
import db.db_tables as models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Shoppers Insights API")

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "Welcome to shopper insights"}
