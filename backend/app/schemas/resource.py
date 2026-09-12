from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class LocationInput(BaseModel):
    latitude: float = Field(..., example=13.0102)
    longitude: float = Field(..., example=80.2354)
    campusZone: str = Field(default="Main Campus", example="CEG Campus - Library Zone")

class ResourceBase(BaseModel):
    title: str = Field(..., example="Casio FX-991EX Calculator")
    category: str = Field(..., example="calculator")  # calculator, textbook, lab_kit, component, tools, notes
    description: str = Field(..., example="Scientific calculator for engineering math.")
    condition: str = Field(default="good", example="good")  # new, good, fair, worn
    mode: str = Field(default="lend", example="lend")  # sell, donate, exchange, lend
    price: float = Field(default=0.0, ge=0)
    subjectIds: List[str] = Field(default_factory=list, example=["SUB_MATH_301"])
    projectId: Optional[str] = None
    tags: List[str] = Field(default_factory=list, example=["calculator", "casio"])
    location: Optional[LocationInput] = None

class ResourceCreate(ResourceBase):
    pass

class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    condition: Optional[str] = None
    mode: Optional[str] = None
    price: Optional[float] = None
    status: Optional[str] = None
    subjectIds: Optional[List[str]] = None
    tags: Optional[List[str]] = None

class ResourceResponse(ResourceBase):
    id: str = Field(..., alias="_id")
    ownerId: str
    ownerName: Optional[str] = None
    ownerDepartment: Optional[str] = None
    status: str = Field(default="available")  # available, requested, borrowed, sold, exchanged, donated
    createdAt: datetime
    updatedAt: datetime

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}
