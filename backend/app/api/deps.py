from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from bson import ObjectId

from app.core.config import settings
from app.core.exceptions import UnauthorizedException, InsufficientPermissionsException
from app.databases.mongodb import get_database

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise UnauthorizedException("Token missing subject claim.")
    except JWTError:
        raise UnauthorizedException("Could not validate authentication credentials.")

    db = get_database()
    if db is None:
        # Fallback for isolated testing/mock mode if mongo DB is not active yet
        return {"_id": user_id, "id": user_id, "name": "Test User", "email": "test@campusxchange.edu", "role": payload.get("role", "STUDENT")}
    
    try:
        user = await db.students.find_one({"_id": ObjectId(user_id)})
    except Exception:
        user = await db.students.find_one({"_id": user_id})

    if not user:
        raise UnauthorizedException("User associated with token no longer exists.")

    user["_id"] = str(user["_id"])
    return user

async def get_current_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") != "ADMIN":
        raise InsufficientPermissionsException("Admin access required for this endpoint.")
    return current_user
