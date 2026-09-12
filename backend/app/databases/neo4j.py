from neo4j import AsyncGraphDatabase, AsyncDriver
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class Neo4jGraph:
    driver: AsyncDriver = None

graph = Neo4jGraph()

async def connect_to_neo4j():
    logger.info(f"Connecting to Neo4j Graph DB at {settings.NEO4J_URI}...")
    try:
        graph.driver = AsyncGraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USERNAME, settings.NEO4J_PASSWORD)
        )
        logger.info("Connected to Neo4j successfully.")
        await init_graph_schema()
    except Exception as e:
        logger.warning(f"Neo4j connection deferred or offline: {e}")

async def close_neo4j_connection():
    if graph.driver:
        logger.info("Closing Neo4j connection...")
        await graph.driver.close()
        logger.info("Neo4j connection closed.")

async def init_graph_schema():
    """Create indexes and constraints on Neo4j node IDs."""
    if not graph.driver:
        return
    queries = [
        "CREATE CONSTRAINT student_id_unique IF NOT EXISTS FOR (s:Student) REQUIRE s.id IS UNIQUE",
        "CREATE CONSTRAINT resource_id_unique IF NOT EXISTS FOR (r:Resource) REQUIRE r.id IS UNIQUE",
        "CREATE CONSTRAINT subject_id_unique IF NOT EXISTS FOR (sub:Subject) REQUIRE sub.id IS UNIQUE",
        "CREATE CONSTRAINT department_code_unique IF NOT EXISTS FOR (d:Department) REQUIRE d.code IS UNIQUE",
        "CREATE CONSTRAINT project_id_unique IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS UNIQUE"
    ]
    try:
        async with graph.driver.session() as session:
            for q in queries:
                await session.run(q)
        logger.info("Neo4j node constraints initialized.")
    except Exception as e:
        logger.warning(f"Neo4j schema creation warning: {e}")

async def execute_cypher(query: str, parameters: dict = None):
    """Execute arbitrary Cypher query and return list of record maps."""
    if not graph.driver:
        return []
    try:
        async with graph.driver.session() as session:
            result = await session.run(query, parameters or {})
            records = await result.data()
            return records
    except Exception as e:
        logger.error(f"Error executing Cypher query: {e}")
        return []
