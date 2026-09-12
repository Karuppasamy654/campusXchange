from fastapi import APIRouter, Depends, Query, status
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.schemas.study_material import StudyMaterialCreate, StudyMaterialResponse
from app.databases.mongodb import get_database
from app.api.deps import get_current_user
from app.core.exceptions import EntityNotFoundException

router = APIRouter()

@router.post("", response_model=StudyMaterialResponse, status_code=201)
async def upload_study_material(
    material_in: StudyMaterialCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    now = datetime.utcnow()

    doc = material_in.model_dump()
    doc["uploaderId"] = str(current_user["_id"])
    doc["uploaderName"] = current_user.get("name", "Student Uploader")
    doc["rating"] = 5.0
    doc["downloadCount"] = 0
    doc["createdAt"] = now

    result = await db.study_materials.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc

@router.get("", response_model=List[StudyMaterialResponse])
async def list_study_materials(
    category: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    subjectId: Optional[str] = Query(None),
    semester: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    db = get_database()
    query = {}

    if category:
        query["category"] = category
    if department:
        query["department"] = department
    if subjectId:
        query["subjectId"] = subjectId
    if semester:
        query["semester"] = semester
    if search:
        query["$text"] = {"$search": search}

    cursor = db.study_materials.find(query).skip(skip).limit(limit).sort("createdAt", -1)
    materials = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        materials.append(doc)

    return materials

@router.post("/{material_id}/download")
async def record_download(material_id: str):
    db = get_database()
    try:
        query = {"_id": ObjectId(material_id)}
    except Exception:
        query = {"_id": material_id}

    doc = await db.study_materials.find_one(query)
    if not doc:
        raise EntityNotFoundException("Study Material", material_id)

    await db.study_materials.update_one(query, {"$inc": {"downloadCount": 1}})
    return {"message": "Download count updated.", "fileUrl": doc.get("fileUrl")}
