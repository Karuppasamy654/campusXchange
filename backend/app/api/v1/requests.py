from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.schemas.request import RequestCreate, RequestResponse
from app.databases.mongodb import get_database
from app.api.deps import get_current_user
from app.core.exceptions import EntityNotFoundException, ResourceUnavailableException, InsufficientPermissionsException

router = APIRouter()

@router.post("", response_model=RequestResponse, status_code=201)
async def create_borrow_request(
    req_in: RequestCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    
    try:
        res_query = {"_id": ObjectId(req_in.resourceId)}
    except Exception:
        res_query = {"_id": req_in.resourceId}

    resource = await db.resources.find_one(res_query)
    if not resource:
        raise EntityNotFoundException("Resource", req_in.resourceId)

    if resource["status"] != "available":
        raise ResourceUnavailableException(f"Resource is currently {resource['status']}.")

    if resource["ownerId"] == str(current_user["_id"]):
        raise HTTPException(status_code=400, detail={"error": "SELF_REQUEST", "message": "You cannot request your own resource."})

    now = datetime.utcnow()
    request_doc = {
        "resourceId": str(resource["_id"]),
        "resourceTitle": resource.get("title"),
        "requesterId": str(current_user["_id"]),
        "requesterName": current_user.get("name"),
        "ownerId": resource["ownerId"],
        "ownerName": resource.get("ownerName"),
        "status": "pending",
        "message": req_in.message,
        "expectedDurationDays": req_in.expectedDurationDays,
        "createdAt": now
    }

    result = await db.resource_requests.insert_one(request_doc)
    request_doc["_id"] = str(result.inserted_id)

    # Trigger database notification for resource owner
    notification_doc = {
        "recipientId": resource["ownerId"],
        "senderId": str(current_user["_id"]),
        "title": "New Borrowing Request",
        "message": f"{current_user.get('name')} requested to borrow your '{resource.get('title')}'",
        "type": "REQUEST_RECEIVED",
        "resourceId": str(resource["_id"]),
        "isRead": False,
        "createdAt": now
    }
    await db.notifications.insert_one(notification_doc)

    return request_doc

@router.get("", response_model=List[RequestResponse])
async def list_requests(
    role: Optional[str] = Query("all"),  # sent, received, all
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    user_id = str(current_user["_id"])

    if role == "sent":
        query = {"requesterId": user_id}
    elif role == "received":
        query = {"ownerId": user_id}
    else:
        query = {"$or": [{"requesterId": user_id}, {"ownerId": user_id}]}

    cursor = db.resource_requests.find(query).sort("createdAt", -1)
    requests = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        requests.append(doc)

    return requests

@router.post("/{request_id}/accept")
async def accept_request(
    request_id: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    try:
        req_query = {"_id": ObjectId(request_id)}
    except Exception:
        req_query = {"_id": request_id}

    req_doc = await db.resource_requests.find_one(req_query)
    if not req_doc:
        raise EntityNotFoundException("Request", request_id)

    if req_doc["ownerId"] != str(current_user["_id"]):
        raise InsufficientPermissionsException("Only the resource owner can accept requests.")

    now = datetime.utcnow()
    await db.resource_requests.update_one(req_query, {"$set": {"status": "accepted"}})
    
    # Mark resource as borrowed
    try:
        res_query = {"_id": ObjectId(req_doc["resourceId"])}
    except Exception:
        res_query = {"_id": req_doc["resourceId"]}

    await db.resources.update_one(res_query, {"$set": {"status": "borrowed", "updatedAt": now}})

    # Create transaction record
    trans_doc = {
        "resourceId": req_doc["resourceId"],
        "requesterId": req_doc["requesterId"],
        "ownerId": req_doc["ownerId"],
        "status": "borrowed",
        "startDate": now,
        "expectedReturnDate": now,
        "createdAt": now
    }
    await db.transactions.insert_one(trans_doc)

    # Create notification for requester
    await db.notifications.insert_one({
        "recipientId": req_doc["requesterId"],
        "senderId": str(current_user["_id"]),
        "title": "Request Accepted!",
        "message": f"Your request for '{req_doc.get('resourceTitle')}' was accepted.",
        "type": "REQUEST_ACCEPTED",
        "resourceId": req_doc["resourceId"],
        "isRead": False,
        "createdAt": now
    })

    return {"message": "Request accepted successfully.", "status": "accepted"}
