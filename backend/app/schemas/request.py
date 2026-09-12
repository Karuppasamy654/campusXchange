from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class RequestCreate(BaseModel):
    resourceId: str
    message: Optional[str] = Field(default="Interested in borrowing this resource.")
    expectedDurationDays: int = Field(default=7, ge=1, le=90)

class RequestResponse(BaseModel):
    id: str = Field(..., alias="_id")
    resourceId: str
    resourceTitle: Optional[str] = None
    requesterId: str
    requesterName: Optional[str] = None
    ownerId: str
    ownerName: Optional[str] = None
    status: str = Field(default="pending")  # pending, accepted, rejected, cancelled, completed
    message: str
    expectedDurationDays: int
    createdAt: datetime

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}
