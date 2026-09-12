import asyncpg
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class PostgresPool:
    pool: asyncpg.Pool = None

pg_db = PostgresPool()

async def connect_to_postgres():
    logger.info("Connecting to PostgreSQL database...")
    try:
        pg_db.pool = await asyncpg.create_pool(
            host=settings.POSTGRES_HOST,
            port=settings.POSTGRES_PORT,
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            database=settings.POSTGRES_DB,
            min_size=1,
            max_size=10
        )
        logger.info("Connected to PostgreSQL successfully.")
        await init_postgres_schemas()
    except Exception as e:
        logger.warning(f"PostgreSQL connection deferred or offline: {e}")

async def close_postgres_connection():
    if pg_db.pool:
        logger.info("Closing PostgreSQL pool...")
        await pg_db.pool.close()
        logger.info("PostgreSQL connection closed.")

async def init_postgres_schemas():
    if not pg_db.pool:
        return
    async with pg_db.pool.acquire() as conn:
        # Enable PostGIS extension
        try:
            await conn.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
        except Exception as e:
            logger.warning(f"PostGIS extension creation note: {e}")
        
        # Create Temporal Tables
        await conn.execute("""
        CREATE TABLE IF NOT EXISTS resource_history (
            history_id SERIAL PRIMARY KEY,
            resource_id VARCHAR(64) NOT NULL,
            owner_id VARCHAR(64) NOT NULL,
            title VARCHAR(255) NOT NULL,
            price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
            condition VARCHAR(50) NOT NULL DEFAULT 'good',
            status VARCHAR(50) NOT NULL DEFAULT 'available',
            valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            valid_to TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'infinity'
        );
        CREATE INDEX IF NOT EXISTS idx_temporal_resource_range ON resource_history (resource_id, valid_from, valid_to);
        """)
        
        # Create Spatial Table
        await conn.execute("""
        CREATE TABLE IF NOT EXISTS resource_locations (
            location_id SERIAL PRIMARY KEY,
            resource_id VARCHAR(64) UNIQUE NOT NULL,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(50) NOT NULL,
            campus_zone VARCHAR(100) NOT NULL,
            location GEOGRAPHY(Point, 4326) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_resource_spatial_gist ON resource_locations USING GIST(location);
        """)

        # Create Notifications / ECA table in Postgres
        await conn.execute("""
        CREATE TABLE IF NOT EXISTS active_notifications (
            id SERIAL PRIMARY KEY,
            recipient_id VARCHAR(64) NOT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            event_type VARCHAR(50) NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        """)
        logger.info("PostgreSQL schemas (Temporal, PostGIS, Active ECA) initialized successfully.")

async def execute_pg_query(query: str, *args):
    """Execute SQL query returning records."""
    if not pg_db.pool:
        return []
    try:
        async with pg_db.pool.acquire() as conn:
            records = await conn.fetch(query, *args)
            return [dict(r) for r in records]
    except Exception as e:
        logger.error(f"Error executing Postgres query: {e}")
        return []

async def execute_pg_command(query: str, *args):
    """Execute SQL DML/DDL command."""
    if not pg_db.pool:
        return None
    try:
        async with pg_db.pool.acquire() as conn:
            return await conn.execute(query, *args)
    except Exception as e:
        logger.error(f"Error executing Postgres command: {e}")
        return None
