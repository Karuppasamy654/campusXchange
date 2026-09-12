from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.databases.neo4j import execute_cypher

router = APIRouter()

@router.get("/recommendations/subject/{subject_id}")
async def get_resources_by_subject_graph(subject_id: str):
    """
    Multi-hop Graph Discovery:
    Finds resources connected to a subject via projects and past student usage.
    """
    query = """
    MATCH (sub:Subject {id: $subjectId})<-[:RELATED_TO]-(p:Project)-[:USES]->(r:Resource)
    OPTIONAL MATCH (s:Student)-[:WORKED_ON]->(p)
    RETURN r.id AS resourceId, r.title AS title, r.category AS category,
           p.name AS projectName, count(s) AS studentUsageCount
    ORDER BY studentUsageCount DESC
    LIMIT 10
    """
    records = await execute_cypher(query, {"subjectId": subject_id})
    return {
        "explanation": f"Discovered resources connected to subject '{subject_id}' through past student project usage.",
        "cypherQuery": query.strip(),
        "results": records
    }

@router.get("/recommendations/department/{department_code}")
async def get_resources_by_department_graph(department_code: str):
    """
    Collaborative Graph Discovery:
    Finds resources borrowed or owned by students studying in the specified department.
    """
    query = """
    MATCH (d:Department {code: $deptCode})<-[:STUDIES_IN]-(s:Student)-[:BORROWED|OWNS]->(r:Resource)
    RETURN r.id AS resourceId, r.title AS title, r.category AS category,
           count(s) AS departmentUserCount
    ORDER BY departmentUserCount DESC
    LIMIT 10
    """
    records = await execute_cypher(query, {"deptCode": department_code})
    return {
        "explanation": f"Popular resources among students in department '{department_code}'.",
        "cypherQuery": query.strip(),
        "results": records
    }

@router.get("/visualizer")
async def get_graph_visualizer_data():
    """
    Returns graph nodes and edges payload formatted for D3/vis.js frontend visualizer in Database Lab.
    """
    query = """
    MATCH (n)-[r]->(m)
    RETURN labels(n)[0] AS sourceType, n.id AS sourceId, coalesce(n.name, n.title, n.code) AS sourceLabel,
           type(r) AS relationship,
           labels(m)[0] AS targetType, m.id AS targetId, coalesce(m.name, m.title, m.code) AS targetLabel
    LIMIT 100
    """
    records = await execute_cypher(query)
    
    nodes = {}
    edges = []
    
    for rec in records:
        src_id = f"{rec['sourceType']}_{rec['sourceId']}"
        tgt_id = f"{rec['targetType']}_{rec['targetId']}"
        
        if src_id not in nodes:
            nodes[src_id] = {"id": src_id, "label": rec["sourceLabel"], "type": rec["sourceType"]}
        if tgt_id not in nodes:
            nodes[tgt_id] = {"id": tgt_id, "label": rec["targetLabel"], "type": rec["targetType"]}
            
        edges.append({
            "source": src_id,
            "target": tgt_id,
            "label": rec["relationship"]
        })
        
    return {
        "nodes": list(nodes.values()),
        "edges": edges,
        "rawRecordsCount": len(records)
    }
