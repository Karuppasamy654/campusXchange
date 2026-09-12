from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
from app.databases.postgres import execute_pg_command, execute_pg_query

router = APIRouter()

@router.post("/trigger-demo")
async def simulate_eca_event(
    resourceId: str = Query("RES_TEST_101"),
    ownerId: str = Query("STUDENT_001"),
    newStatus: str = Query("available")
):
    """
    Simulates an Active Database Event-Condition-Action (ECA) flow:
    Updates resource_history status, causing PostgreSQL PL/pgSQL trigger to automatically fire and create notification.
    """
    # Step 1: Ensure initial state exists in PostgreSQL
    await execute_pg_command("""
    INSERT INTO resource_history (resource_id, owner_id, title, price, condition, status, valid_from)
    VALUES ($1, $2, 'Engineering Mathematics Calculator', 500.0, 'good', 'borrowed', CURRENT_TIMESTAMP - INTERVAL '1 day')
    ON CONFLICT DO NOTHING;
    """, resourceId, ownerId)

    # Step 2: Fire EVENT by updating status to 'available'
    update_sql = """
    UPDATE resource_history
    SET status = $1, valid_to = CURRENT_TIMESTAMP
    WHERE resource_id = $2;
    """
    await execute_pg_command(update_sql, newStatus, resourceId)

    # Step 3: Audit ACTION by querying active_notifications inserted by PL/pgSQL trigger
    notifications = await execute_pg_query("""
    SELECT id, recipient_id, title, message, event_type, created_at
    FROM active_notifications
    WHERE recipient_id = $1
    ORDER BY created_at DESC
    LIMIT 5;
    """, ownerId)

    return {
        "event": f"UPDATE resource_history SET status = '{newStatus}' WHERE resource_id = '{resourceId}'",
        "conditionEvaluated": f"OLD.status ('borrowed') <> NEW.status ('{newStatus}') AND NEW.status == 'available'",
        "actionExecuted": "PL/pgSQL Trigger 'fn_eca_resource_available' automatically executed INSERT INTO active_notifications",
        "generatedNotifications": notifications
    }

@router.get("/logs")
async def get_active_event_logs():
    """
    Returns audit log of all database-level ECA notifications fired by PostgreSQL triggers.
    """
    sql = "SELECT id, recipient_id, title, message, event_type, created_at FROM active_notifications ORDER BY created_at DESC LIMIT 20;"
    records = await execute_pg_query(sql)
    return {
        "explanation": "Event logs generated natively by PostgreSQL PL/pgSQL triggers.",
        "sqlQuery": sql,
        "logs": records
    }
