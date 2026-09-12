import asyncio
import os
import sys
from datetime import datetime, timedelta
import logging

# Add backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend')))

from app.core.config import settings
from motor.motor_asyncio import AsyncIOMotorClient
from neo4j import AsyncGraphDatabase
import asyncpg

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed_mongodb(mongo_uri, db_name):
    logger.info("Seeding MongoDB...")
    client = AsyncIOMotorClient(mongo_uri)
    db = client[db_name]

    # Clean existing collections
    await db.students.delete_many({})
    await db.resources.delete_many({})
    await db.study_materials.delete_many({})
    await db.resource_requests.delete_many({})

    # Seed Students
    student1 = {
        "_id": "65f01a2b3c4d5e6f7a8b9c0d",
        "name": "Arun Kumar",
        "email": "arun.ceg@annauniv.edu",
        "passwordHash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW", # "password123"
        "department": "Computer Science and Engineering",
        "semester": 5,
        "role": "STUDENT",
        "skills": ["Python", "Databases", "React"],
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    student2 = {
        "_id": "65f01a2b3c4d5e6f7a8b9c0e",
        "name": "Priya Ramesh",
        "email": "priya.ceg@annauniv.edu",
        "passwordHash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "department": "Electronics and Communication",
        "semester": 6,
        "role": "STUDENT",
        "skills": ["Embedded C", "Circuit Design"],
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    await db.students.insert_many([student1, student2])

    # Seed Resources
    resource1 = {
        "_id": "RES_CALC_001",
        "title": "Casio FX-991EX ClassWiz Calculator",
        "category": "calculator",
        "description": "Scientific calculator required for Engineering Mathematics III and Statistics.",
        "condition": "good",
        "mode": "lend",
        "price": 0.0,
        "ownerId": "65f01a2b3c4d5e6f7a8b9c0d",
        "ownerName": "Arun Kumar",
        "ownerDepartment": "Computer Science and Engineering",
        "subjectIds": ["SUB_MATH_301"],
        "status": "available",
        "tags": ["calculator", "casio", "math"],
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    resource2 = {
        "_id": "RES_KIT_002",
        "title": "Arduino Uno Rev3 Electronics Starter Kit",
        "category": "lab_kit",
        "description": "Complete IoT kit containing sensors, breadboards, jumper wires for Embedded Systems lab.",
        "condition": "new",
        "mode": "lend",
        "price": 0.0,
        "ownerId": "65f01a2b3c4d5e6f7a8b9c0e",
        "ownerName": "Priya Ramesh",
        "ownerDepartment": "Electronics and Communication",
        "subjectIds": ["SUB_IOT_402"],
        "status": "available",
        "tags": ["arduino", "iot", "electronics"],
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    await db.resources.insert_many([resource1, resource2])

    # Seed Study Materials
    notes = {
        "title": "DBMS Comprehensive Lecture Notes & SQL Cheatsheet",
        "category": "notes",
        "subjectId": "SUB_DBMS_501",
        "department": "Computer Science and Engineering",
        "semester": 5,
        "description": "Complete unit-wise notes covering Relational Algebra, B+ Trees, and Normalization.",
        "fileUrl": "https://storage.campusxchange.edu/materials/dbms_notes.pdf",
        "uploaderId": "65f01a2b3c4d5e6f7a8b9c0d",
        "uploaderName": "Arun Kumar",
        "rating": 5.0,
        "downloadCount": 42,
        "createdAt": datetime.utcnow()
    }
    await db.study_materials.insert_one(notes)

    client.close()
    logger.info("MongoDB seed completed.")

async def seed_neo4j(neo4j_uri, username, password):
    logger.info("Seeding Neo4j Graph DB...")
    driver = AsyncGraphDatabase.driver(neo4j_uri, auth=(username, password))
    async with driver.session() as session:
        # Clear graph
        await session.run("MATCH (n) DETACH DELETE n")

        # Create nodes and relationships
        cypher = """
        CREATE (s1:Student {id: '65f01a2b3c4d5e6f7a8b9c0d', name: 'Arun Kumar', department: 'CSE'})
        CREATE (s2:Student {id: '65f01a2b3c4d5e6f7a8b9c0e', name: 'Priya Ramesh', department: 'ECE'})
        
        CREATE (d1:Department {code: 'CSE', name: 'Computer Science'})
        CREATE (d2:Department {code: 'ECE', name: 'Electronics and Comm'})
        
        CREATE (sub1:Subject {id: 'SUB_DBMS_501', title: 'Database Management Systems'})
        CREATE (sub2:Subject {id: 'SUB_MATH_301', title: 'Engineering Mathematics III'})
        
        CREATE (r1:Resource {id: 'RES_CALC_001', title: 'Casio FX-991EX Calculator', category: 'calculator', status: 'available'})
        CREATE (r2:Resource {id: 'RES_KIT_002', title: 'Arduino Starter Kit', category: 'lab_kit', status: 'available'})
        
        CREATE (p1:Project {id: 'PROJ_001', name: 'Smart IoT Campus Lock'})

        CREATE (s1)-[:STUDIES_IN]->(d1)
        CREATE (s2)-[:STUDIES_IN]->(d2)
        CREATE (s1)-[:OWNS]->(r1)
        CREATE (s2)-[:OWNS]->(r2)
        CREATE (r1)-[:RELATED_TO]->(sub2)
        CREATE (r2)-[:RELATED_TO]->(sub1)
        CREATE (s1)-[:WORKED_ON]->(p1)
        CREATE (p1)-[:USES]->(r2)
        CREATE (p1)-[:RELATED_TO]->(sub1)
        """
        await session.run(cypher)
    await driver.close()
    logger.info("Neo4j Graph seed completed.")

async def seed_postgres():
    logger.info("Seeding PostgreSQL (PostGIS & Temporal)...")
    conn = await asyncpg.connect(
        host=settings.POSTGRES_HOST,
        port=settings.POSTGRES_PORT,
        user=settings.POSTGRES_USER,
        password=settings.POSTGRES_PASSWORD,
        database=settings.POSTGRES_DB
    )

    # Enable PostGIS
    await conn.execute("CREATE EXTENSION IF NOT EXISTS postgis;")

    # Reset & Populate Spatial Locations
    await conn.execute("DELETE FROM resource_locations;")
    spatial_sql = """
    INSERT INTO resource_locations (resource_id, title, category, campus_zone, location)
    VALUES 
    ('RES_CALC_001', 'Casio FX-991EX Calculator', 'calculator', 'CEG Library Zone', ST_SetSRID(ST_MakePoint(80.2354, 13.0102), 4326)),
    ('RES_KIT_002', 'Arduino Starter Kit', 'lab_kit', 'Science Block Zone', ST_SetSRID(ST_MakePoint(80.2370, 13.0120), 4326));
    """
    await conn.execute(spatial_sql)

    # Reset & Populate Temporal History
    await conn.execute("DELETE FROM resource_history;")
    temp_sql = """
    INSERT INTO resource_history (resource_id, owner_id, title, price, condition, status, valid_from, valid_to)
    VALUES 
    ('RES_CALC_001', '65f01a2b3c4d5e6f7a8b9c0d', 'Casio FX-991EX Calculator', 800.00, 'good', 'available', '2026-01-10 00:00:00+00', '2026-03-20 14:30:00+00'),
    ('RES_CALC_001', '65f01a2b3c4d5e6f7a8b9c0d', 'Casio FX-991EX Calculator', 0.00, 'good', 'available', '2026-03-20 14:30:00+00', 'infinity');
    """
    await conn.execute(temp_sql)

    await conn.close()
    logger.info("PostgreSQL PostGIS & Temporal seed completed.")

async def main():
    logger.info("Starting CampusXchange Multi-Database Seeding Process...")
    try:
        await seed_mongodb(settings.MONGODB_URI, settings.MONGODB_DB_NAME)
    except Exception as e:
        logger.warning(f"Mongo seed note: {e}")

    try:
        await seed_neo4j(settings.NEO4J_URI, settings.NEO4J_USERNAME, settings.NEO4J_PASSWORD)
    except Exception as e:
        logger.warning(f"Neo4j seed note: {e}")

    try:
        await seed_postgres()
    except Exception as e:
        logger.warning(f"Postgres seed note: {e}")

    logger.info("Database seeding process finished successfully.")

if __name__ == '__main__':
    asyncio.run(main())
