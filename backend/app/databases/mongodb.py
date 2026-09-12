from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

db = MongoDB()

async def connect_to_mongo():
    logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
    db.client = AsyncIOMotorClient(settings.MONGODB_URI)
    db.db = db.client[settings.MONGODB_DB_NAME]
    logger.info("Connected to MongoDB successfully.")
    await init_indexes()

async def close_mongo_connection():
    if db.client:
        logger.info("Closing MongoDB connection...")
        db.client.close()
        logger.info("MongoDB connection closed.")

async def init_indexes():
    """Create MongoDB indexes with explicit rationale."""
    try:
        # Students: unique email index for login & registration speed
        await db.db.students.create_index("email", unique=True)

        # Resources: Compound index for owner dashboard queries
        await db.db.resources.create_index([("ownerId", 1), ("status", 1)])
        
        # Resources: Compound index for catalog filtering (category, status, price)
        await db.db.resources.create_index([("category", 1), ("status", 1), ("price", 1)])
        
        # Resources: Text index for title & description search
        await db.db.resources.create_index([("title", "text"), ("description", "text")])

        # Resource Requests: Index by requester and resource
        await db.db.resource_requests.create_index([("requesterId", 1), ("status", 1)])
        await db.db.resource_requests.create_index([("resourceId", 1), ("status", 1)])

        # Study Materials: Subject and Department filtering
        await db.db.study_materials.create_index([("subjectId", 1), ("department", 1)])
        await db.db.study_materials.create_index([("title", "text"), ("description", "text")])

        # Notifications: Index by recipient student ID and read status
        await db.db.notifications.create_index([("recipientId", 1), ("isRead", 1), ("createdAt", -1)])

        logger.info("MongoDB indexes verified / created successfully.")
    except Exception as e:
        logger.warning(f"Note: MongoDB index initialization deferred or skipped: {e}")

def get_database() -> AsyncIOMotorDatabase:
    return db.db
