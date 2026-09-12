from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime
from bson import ObjectId

from app.schemas.student import StudentCreate, StudentResponse, StudentLogin, Token
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.exceptions import UnauthorizedException
from app.databases.mongodb import get_database
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=StudentResponse, status_code=status.HTTP_21_CREATED if hasattr(status, 'HTTP_201_CREATED') else 201)
async def register_student(student_in: StudentCreate):
    db = get_database()
    
    # Check if student email already exists
    existing = await db.students.find_one({"email": student_in.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "EMAIL_EXISTS", "message": "A student account with this email already exists."}
        )

    now = datetime.utcnow()
    student_doc = {
        "name": student_in.name,
        "email": student_in.email,
        "passwordHash": get_password_hash(student_in.password),
        "department": student_in.department,
        "semester": student_in.semester,
        "skills": student_in.skills,
        "profileImage": student_in.profileImage,
        "role": student_in.role or "STUDENT",
        "createdAt": now,
        "updatedAt": now
    }

    result = await db.students.insert_one(student_doc)
    student_doc["_id"] = str(result.inserted_id)
    return student_doc

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_database()
    user = await db.students.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user.get("passwordHash", "")):
        raise UnauthorizedException("Incorrect email or password.")

    user_id = str(user["_id"])
    role = user.get("role", "STUDENT")
    access_token = create_access_token(subject=user_id, role=role)

    user["_id"] = user_id
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login/json", response_model=Token)
async def login_json(credentials: StudentLogin):
    db = get_database()
    user = await db.students.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user.get("passwordHash", "")):
        raise UnauthorizedException("Incorrect email or password.")

    user_id = str(user["_id"])
    role = user.get("role", "STUDENT")
    access_token = create_access_token(subject=user_id, role=role)

    user["_id"] = user_id
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=StudentResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
