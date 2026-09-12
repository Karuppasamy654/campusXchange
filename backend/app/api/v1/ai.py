from fastapi import APIRouter, Query
from app.services.ai_service import ai_service
from app.services.recommendation_service import recommendation_service

router = APIRouter()

@router.post("/search")
async def ai_natural_language_search(
    query: str = Query(..., example="I need a calculator for DBMS lab near CEG campus"),
    studentId: str = Query("STUDENT_001")
):
    """
    AI Natural Language Search Pipeline:
    1. Gemini API / NLU extracts structured query intent.
    2. Backend queries MongoDB, Neo4j, and PostGIS DBs.
    3. Scores candidates using 6-Factor Explainable Recommendation Algorithm.
    """
    intent = await ai_service.parse_natural_language_intent(query)
    
    recs = await recommendation_service.get_explainable_recommendations(
        student_id=studentId,
        subject_id=intent.get("subject"),
        category=intent.get("category")
    )

    return {
        "userQuery": query,
        "parsedIntent": intent,
        "totalResultsCount": len(recs),
        "recommendations": recs
    }
