from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.schemas.resource import ResourceCreate, ResourceResponse, ResourceUpdate
from app.databases.mongodb import get_database
from app.api.deps import get_current_user
from app.core.exceptions import EntityNotFoundException, InsufficientPermissionsException

router = APIRouter()

@router.post("", response_model=ResourceResponse, status_code=201)
async def create_resource(
    resource_in: ResourceCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    now = datetime.utcnow()
    
    resource_doc = resource_in.model_dump()
    resource_doc["ownerId"] = str(current_user["_id"])
    resource_doc["ownerName"] = current_user.get("name", "Student")
    resource_doc["ownerDepartment"] = current_user.get("department", "Engineering")
    resource_doc["status"] = "available"
    resource_doc["createdAt"] = now
    resource_doc["updatedAt"] = now

    result = await db.resources.insert_one(resource_doc)
    resource_doc["_id"] = str(result.inserted_id)

    # Sync into Neo4j, PostGIS, and Temporal tables (Will be handled asynchronously or via Saga handlers in subsequent DB phases)
    return resource_doc

@router.get("", response_model=List[ResourceResponse])
async def list_resources(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query("available"),
    mode: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    subjectId: Optional[str] = Query(None),
    ownerId: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    db = get_database()
    query = {}

    if status:
        query["status"] = status
    if category:
        query["category"] = category
    if mode:
        query["mode"] = mode
    if subjectId:
        query["subjectIds"] = subjectId
    if ownerId:
        query["ownerId"] = ownerId
    if search:
        query["$text"] = {"$search": search}

    cursor = db.resources.find(query).skip(skip).limit(limit).sort("createdAt", -1)
    resources = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        resources.append(doc)

    return resources

@router.get("/{resource_id}", response_model=ResourceResponse)
async def get_resource(resource_id: str):
    db = get_database()
    try:
        query = {"_id": ObjectId(resource_id)}
    except Exception:
        query = {"_id": resource_id}

    doc = await db.resources.find_one(query)
    if not doc:
        raise EntityNotFoundException("Resource", resource_id)

    doc["_id"] = str(doc["_id"])
    return doc

@router.put("/{resource_id}", response_model=ResourceResponse)
async def update_resource(
    resource_id: str,
    update_in: ResourceUpdate,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    try:
        query = {"_id": ObjectId(resource_id)}
    except Exception:
        query = {"_id": resource_id}

    existing = await db.resources.find_one(query)
    if not existing:
        raise EntityNotFoundException("Resource", resource_id)

    if existing["ownerId"] != str(current_user["_id"]) and current_user.get("role") != "ADMIN":
        raise InsufficientPermissionsException("You can only edit your own resources.")

    update_data = {k: v for k, v in update_in.model_dump(exclude_unset=True).items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()

    await db.resources.update_one(query, {"$set": update_data})
    updated_doc = await db.resources.find_one(query)
    updated_doc["_id"] = str(updated_doc["_id"])
    return updated_doc
