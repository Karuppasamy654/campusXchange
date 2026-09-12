from fastapi import APIRouter, Query
from typing import List
from app.databases.postgres import execute_pg_query

router = APIRouter()

@router.get("/nearby")
async def find_nearby_resources(
    latitude: float = Query(..., example=13.0102),
    longitude: float = Query(..., example=80.2354),
    radiusMeters: float = Query(1000.0, ge=50, le=20000, example=1000.0),
    category: str = Query(None)
):
    """
    PostGIS Spatial Radius Search using ST_DWithin and ST_Distance:
    Finds physical resources within radiusMeters of given coordinates.
    """
    sql = """
    SELECT 
        resource_id,
        title,
        category,
        campus_zone,
        ST_Y(location::geometry) AS latitude,
        ST_X(location::geometry) AS longitude,
        ST_Distance(location, ST_MakePoint($1, $2)::geography) AS distance_meters
    FROM resource_locations
    WHERE ST_DWithin(location, ST_MakePoint($1, $2)::geography, $3)
    """
    args = [longitude, latitude, radiusMeters]
    
    if category:
        sql += " AND category = $4"
        args.append(category)

    sql += " ORDER BY distance_meters ASC;"

    records = await execute_pg_query(sql, *args)
    results = []
    for r in records:
        results.append({
            "resourceId": r["resource_id"],
            "title": r["title"],
            "category": r["category"],
            "campusZone": r["campus_zone"],
            "latitude": r["latitude"],
            "longitude": r["longitude"],
            "distanceMeters": round(float(r["distance_meters"]), 1)
        })

    return {
        "explanation": f"PostGIS ST_DWithin executed with GIST index filtering within {radiusMeters}m of coordinates ({latitude}, {longitude}).",
        "sqlQuery": sql.strip(),
        "count": len(results),
        "results": results
    }

@router.get("/map-pins")
async def get_all_campus_map_pins():
    """
    Returns all resource locations formatted for Leaflet/Interactive Map in UI.
    """
    sql = """
    SELECT resource_id, title, category, campus_zone,
           ST_Y(location::geometry) AS latitude,
           ST_X(location::geometry) AS longitude
    FROM resource_locations;
    """
    records = await execute_pg_query(sql)
    pins = []
    for r in records:
        pins.append({
            "resourceId": r["resource_id"],
            "title": r["title"],
            "category": r["category"],
            "campusZone": r["campus_zone"],
            "latitude": r["latitude"],
            "longitude": r["longitude"]
        })
    return pins
