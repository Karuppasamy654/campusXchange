from fastapi import APIRouter, Query
from app.services.recommendation_service import recommendation_service

router = APIRouter()

@router.get("")
async def get_personalized_recommendations(
    studentId: str = Query("STUDENT_001"),
    subjectId: str = Query(None),
    category: str = Query(None),
    latitude: float = Query(13.0102),
    longitude: float = Query(80.2354)
):
    """
    Transparent Multi-Database Recommendation API:
    Ranks resources using formula:
    0.30*Relevance + 0.20*GraphConnect + 0.15*Rating + 0.15*Avail + 0.10*PostGISDist + 0.10*TemporalReuse
    """
    recs = await recommendation_service.get_explainable_recommendations(
        student_id=studentId,
        subject_id=subjectId,
        category=category,
        user_lat=latitude,
        user_lng=longitude
    )

    return {
        "formula": "Score = 0.30*SubjectRelevance + 0.20*GraphUsage + 0.15*Condition + 0.15*Availability + 0.10*PostGISDistance + 0.10*TemporalReuse",
        "recommendations": recs
    }
