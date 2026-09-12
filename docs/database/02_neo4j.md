# 2. Neo4j Graph Database — Educational Guide

## 1. What Problem Does It Solve?
Campus resource discovery depends heavily on indirect relationships:
- *"What resources were used by students in my department who excelled in DBMS?"*
- *"Which lab equipment is frequently borrowed together for Project X?"*
- *"Find resources connected to Subject Y through past student projects across 3 hops."*

In MongoDB or SQL, performing multi-hop join queries across Students, Projects, Subjects, and Resources requires recursively scanning tables or executing nested aggregation pipelines, which scale exponentially ($O(b^k)$ where $b$ is branch factor and $k$ is depth).

Neo4j uses **Index-Free Adjacency** (pointers directly between nodes), executing multi-hop graph traversals in $O(k)$ time regardless of total dataset size.

## 2. Why Neo4j is Suitable
- **Expressive Traversal**: Cypher pattern-matching syntax makes complex network traversals simple (`MATCH (s:Student)-[:WORKED_ON]->(p:Project)-[:USES]->(r:Resource)`).
- **Index-Free Adjacency**: Each node stores direct memory references to its adjacent nodes and relationships.
- **Explainable Recommendations**: Allows tracing exact recommendation paths for transparency.

## 3. Graph Schema (Nodes & Relationships)

### Nodes
- `(:Student { id, name, department })`
- `(:Resource { id, title, category, status })`
- `(:Subject { id, title, code })`
- `(:Department { code, name })`
- `(:Project { id, name })`

### Relationships
- `(Student)-[:OWNS]->(Resource)`
- `(Student)-[:BORROWED]->(Resource)`
- `(Student)-[:STUDIES_IN]->(Department)`
- `(Student)-[:WORKED_ON]->(Project)`
- `(Project)-[:USES]->(Resource)`
- `(Project)-[:RELATED_TO]->(Subject)`
- `(Resource)-[:RELATED_TO]->(Subject)`
- `(Subject)-[:BELONGS_TO]->(Department)`
- `(Resource)-[:SIMILAR_TO]->(Resource)`

## 4. Key Cypher Queries

### Query 1: Multi-Hop Resource Discovery (Resources connected to a subject via projects and past student usage)
```cypher
MATCH (sub:Subject {id: $subjectId})<-[:RELATED_TO]-(p:Project)-[:USES]->(r:Resource {status: 'available'})
MATCH (s:Student)-[:WORKED_ON]->(p)
RETURN r.id AS resourceId, r.title AS title, p.name AS projectName, count(s) AS studentUsageCount
ORDER BY studentUsageCount DESC
LIMIT 5;
```

### Query 2: Collaborative Department Discovery (Resources used by students from the same department)
```cypher
MATCH (me:Student {id: $studentId})-[:STUDIES_IN]->(d:Department)<-[:STUDIES_IN]-(peer:Student)
WHERE me <> peer
MATCH (peer)-[:BORROWED|OWNS]->(r:Resource {status: 'available'})
WHERE NOT (me)-[:BORROWED|OWNS]->(r)
RETURN r.id AS resourceId, r.title AS title, count(peer) AS peerBorrowCount
ORDER BY peerBorrowCount DESC
LIMIT 5;
```

### Query 3: Multi-hop Provenance Chain (Visualizing how a resource is connected to a course)
```cypher
MATCH path = (r:Resource {id: $resourceId})-[*1..3]-(sub:Subject)
RETURN path;
```

## 5. Expected Database Output (Query 1)
```json
[
  {
    "resourceId": "65f01a2b3c4d5e6f7a8b9c0e",
    "title": "Arduino Uno Rev3 Starter Kit",
    "projectName": "IoT Automated Attendance System",
    "studentUsageCount": 4
  }
]
```
