from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class StudentBase(BaseModel):
    name: str = Field(..., example="Arun Kumar")
    email: EmailStr = Field(..., example="arun.ceg@annauniv.edu")
    department: str = Field(..., example="Computer Science and Engineering")
    semester: int = Field(..., ge=1, le=8, example=5)
    skills: List[str] = Field(default_factory=list, example=["Python", "Database Systems"])
    profileImage: Optional[str] = None
    role: str = Field(default="STUDENT", example="STUDENT")

class StudentCreate(StudentBase):
    password: str = Field(..., min_length=6)

class StudentLogin(BaseModel):
    email: EmailStr
    password: str

class StudentResponse(StudentBase):
    id: str = Field(..., alias="_id")
    createdAt: datetime
    updatedAt: datetime

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: StudentResponse
