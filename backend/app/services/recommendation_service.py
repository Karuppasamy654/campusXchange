from typing import List, Dict, Any
from app.databases.mongodb import get_database
from app.databases.neo4j import execute_cypher
from app.databases.postgres import execute_pg_query

class RecommendationService:
    async def get_explainable_recommendations(
        self,
        student_id: str,
        subject_id: str = None,
        category: str = None,
        user_lat: float = 13.0102,
        user_lng: float = 80.2354
    ) -> List[Dict[str, Any]]:
        db = get_database()
        
        # Step 1: Fetch candidate resources from MongoDB
        query = {"status": "available"}
        if category and category != "all":
            query["category"] = category

        cursor = db.resources.find(query).limit(20)
        candidates = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            candidates.append(doc)

        scored_results = []

        for item in candidates:
            res_id = item["_id"]

            # Factor 1: Subject Relevance (0.30)
            relevance_score = 1.0 if subject_id and subject_id in item.get("subjectIds", []) else 0.5

            # Factor 2: Graph Connectivity (0.20)
            cypher = """
            MATCH (r:Resource {id: $resId})<-[:USES]-(p:Project)<-[:WORKED_ON]-(s:Student)
            RETURN count(s) AS usageCount
            """
            graph_recs = await execute_cypher(cypher, {"resId": res_id})
            usage_count = graph_recs[0]["usageCount"] if graph_recs else 0
            graph_score = min(usage_count / 5.0, 1.0)

            # Factor 3: Condition / Rating (0.15)
            cond = item.get("condition", "good").lower()
            rating_score = 1.0 if cond == "new" else (0.8 if cond == "good" else 0.5)

            # Factor 4: Availability (0.15)
            avail_score = 1.0 if item.get("status") == "available" else 0.0

            # Factor 5: PostGIS Distance (0.10)
            spatial_sql = """
            SELECT ST_Distance(location, ST_MakePoint($1, $2)::geography) AS dist
            FROM resource_locations WHERE resource_id = $3 LIMIT 1;
            """
            spatial_recs = await execute_pg_query(spatial_sql, user_lng, user_lat, res_id)
            distance_m = float(spatial_recs[0]["dist"]) if spatial_recs else 300.0
            distance_score = max(0.0, 1.0 - (distance_m / 2000.0))

            # Factor 6: Temporal Historical Reuse (0.10)
            temporal_sql = "SELECT COUNT(*) AS total_history FROM resource_history WHERE resource_id = $1;"
            temp_recs = await execute_pg_query(temporal_sql, res_id)
            reuse_count = temp_recs[0]["total_history"] if temp_recs else 1
            reuse_score = min(reuse_count / 4.0, 1.0)

            # Calculate Final Score
            final_score = (
                0.30 * relevance_score +
                0.20 * graph_score +
                0.15 * rating_score +
                0.15 * avail_score +
                0.10 * distance_score +
                0.10 * reuse_score
            )

            scored_results.append({
                "resource": item,
                "finalScore": round(final_score, 3),
                "explanations": [
                    f"Subject Match Score: {round(relevance_score, 2)} (30% weight)",
                    f"Graph Project Connects: {usage_count} students (20% weight)",
                    f"Condition ({cond.capitalize()}): Score {rating_score} (15% weight)",
                    f"PostGIS Spatial Distance: {round(distance_m, 1)}m away (10% weight)",
                    f"Temporal Reuse Count: {reuse_count} cycles (10% weight)"
                ]
            })

        scored_results.sort(key=lambda x: x["finalScore"], reverse=True)
        return scored_results

recommendation_service = RecommendationService()
