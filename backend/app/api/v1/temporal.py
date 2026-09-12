from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any
from datetime import datetime
from app.databases.postgres import execute_pg_query

router = APIRouter()

@router.get("/resource/{resource_id}/as-of")
async def get_resource_as_of_time(
    resource_id: str,
    timestamp: str = Query(..., example="2026-03-20T14:30:00Z")
):
    """
    Temporal Point-in-Time Query:
    Returns the exact state of a resource at any historic timestamp (valid_from <= timestamp < valid_to).
    """
    sql = """
    SELECT resource_id, title, price, condition, status, valid_from, valid_to
    FROM resource_history
    WHERE resource_id = $1
      AND $2::timestamp WITH TIME ZONE >= valid_from
      AND $2::timestamp WITH TIME ZONE < valid_to
    LIMIT 1;
    """
    records = await execute_pg_query(sql, resource_id, timestamp)
    if not records:
        return {
            "explanation": f"No temporal record existed for resource '{resource_id}' at timestamp {timestamp}.",
            "sqlQuery": sql.strip(),
            "asOfState": None
        }

    rec = records[0]
    return {
        "explanation": f"Resource state snapshot for ID '{resource_id}' valid at point-in-time {timestamp}.",
        "sqlQuery": sql.strip(),
        "asOfState": {
            "resourceId": rec["resource_id"],
            "title": rec["title"],
            "price": float(rec["price"]),
            "condition": rec["condition"],
            "status": rec["status"],
            "validFrom": rec["valid_from"].isoformat(),
            "validTo": rec["valid_to"].isoformat() if rec["valid_to"] else "infinity"
        }
    }

@router.get("/resource/{resource_id}/timeline")
async def get_resource_lifecycle_timeline(resource_id: str):
    """
    Returns full system-versioned temporal audit trail for a resource.
    """
    sql = """
    SELECT history_id, title, price, condition, status, valid_from, valid_to
    FROM resource_history
    WHERE resource_id = $1
    ORDER BY valid_from ASC;
    """
    records = await execute_pg_query(sql, resource_id)
    
    timeline = []
    for r in records:
        timeline.append({
            "historyId": r["history_id"],
            "title": r["title"],
            "price": float(r["price"]),
            "condition": r["condition"],
            "status": r["status"],
            "validFrom": r["valid_from"].isoformat(),
            "validTo": r["valid_to"].isoformat() if str(r["valid_to"]) != "9999-12-31 23:59:59.999999+00:00" else "current"
        })

    return {
        "explanation": f"Complete temporal timeline history for resource '{resource_id}'.",
        "sqlQuery": sql.strip(),
        "timeline": timeline,
        "totalVersionCount": len(timeline)
    }
