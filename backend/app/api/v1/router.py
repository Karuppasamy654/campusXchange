from app.api.v1 import auth, resources, requests, study_materials, notifications, graph, temporal, spatial, eca, ai, recommendations

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(resources.router, prefix="/resources", tags=["Resources"])
api_router.include_router(requests.router, prefix="/requests", tags=["Resource Requests"])
api_router.include_router(study_materials.router, prefix="/study-materials", tags=["Study Materials"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(graph.router, prefix="/graph", tags=["Graph Neo4j"])
api_router.include_router(temporal.router, prefix="/temporal", tags=["Temporal DB"])
api_router.include_router(spatial.router, prefix="/spatial", tags=["Spatial PostGIS"])
api_router.include_router(eca.router, prefix="/eca", tags=["Active Database ECA"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI NLU Search"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations Engine"])

# Remaining routers will be registered in subsequent database phases:
# api_router.include_router(spatial.router, prefix="/spatial", tags=["Spatial PostGIS"])
# api_router.include_router(graph.router, prefix="/graph", tags=["Graph Neo4j"])
# api_router.include_router(temporal.router, prefix="/temporal", tags=["Temporal DB"])
# api_router.include_router(ai.router, prefix="/ai", tags=["AI & Search"])
# api_router.include_router(admin.router, prefix="/admin", tags=["Admin & Analytics"])

@api_router.get("/health", tags=["Health Check"])
async def health_check():
    return {
        "status": "healthy",
        "service": "CampusXchange API Gateway",
        "version": "1.0.0"
    }
