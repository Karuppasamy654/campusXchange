from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class StudyMaterialCreate(BaseModel):
    title: str = Field(..., example="DBMS Lecture Notes & SQL Cheatsheet")
    category: str = Field(..., example="notes")  # notes, pyq, lab_manual, project_ref
    subjectId: str = Field(..., example="SUB_DBMS_501")
    department: str = Field(..., example="Computer Science and Engineering")
    semester: int = Field(..., ge=1, le=8, example=5)
    description: str = Field(..., example="Comprehensive notes covering normalization and indexing.")
    fileUrl: str = Field(..., example="https://storage.campusxchange.edu/materials/dbms_notes.pdf")
    tags: List[str] = Field(default_factory=list, example=["dbms", "sql", "normalization"])

class StudyMaterialResponse(StudyMaterialCreate):
    id: str = Field(..., alias="_id")
    uploaderId: str
    uploaderName: Optional[str] = None
    rating: float = Field(default=5.0)
    downloadCount: int = Field(default=0)
    createdAt: datetime

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}
