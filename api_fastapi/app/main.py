from api import api_router
from fastapi import FastAPI

app = FastAPI(title="Shoppers Insights API")

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "Welcome to shopper insights"}
