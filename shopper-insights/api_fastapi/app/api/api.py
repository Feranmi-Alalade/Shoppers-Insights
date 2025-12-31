from api.endpoints import budgets, challenges, posts, receipts, recommendations, users
from fastapi import APIRouter

api_router = APIRouter()

api_router.include_router(receipts.router, prefix="/receipts", tags=["Receipts"])
api_router.include_router(budgets.router, prefix="/budgets", tags=["Budgets"])
api_router.include_router(
    recommendations.router, prefix="/recommendations", tags=["Recommendations"]
)
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(posts.router, prefix="/posts", tags=["Posts"])
api_router.include_router(challenges.router, prefix="/challenges", tags=["Challenges"])
