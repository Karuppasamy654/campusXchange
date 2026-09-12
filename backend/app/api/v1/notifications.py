from fastapi import APIRouter, Depends
from typing import List
from bson import ObjectId

from app.databases.mongodb import get_database
from app.api.deps import get_current_user
from app.core.exceptions import EntityNotFoundException

router = APIRouter()

@router.get("")
async def get_notifications(current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = str(current_user["_id"])

    cursor = db.notifications.find({"recipientId": user_id}).sort("createdAt", -1).limit(50)
    notifications = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        notifications.append(doc)

    return notifications

@router.put("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    try:
        query = {"_id": ObjectId(notification_id)}
    except Exception:
        query = {"_id": notification_id}

    await db.notifications.update_one(query, {"$set": {"isRead": True}})
    return {"message": "Notification marked as read."}
