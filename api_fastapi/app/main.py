from api import api_router
from starlette.middleware.wsgi import WSGIMiddleware
from dashboard import create_dash_app
from fastapi import FastAPI
from db import Base, engine
import db.db_tables as models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Shoppers Insights API")

app.include_router(api_router, prefix="/api/v1")

dash_app = create_dash_app()

app.mount("/dashboard", WSGIMiddleware(dash_app.server))

@app.get("/")
def root():
    return {"message": "Welcome to shopper insights"}