# CampusXchange — Real-World Advanced Database Platform

> **Connecting Students, Resources, and Knowledge Across Campus**  
> *An Advanced Databases Academic Project demonstrating multi-paradigm database architecture.*

---

## 1. Executive Summary & Problem Statement

Students frequently purchase textbooks, scientific calculators, laboratory kits, electronic components, tools, and notes that are only needed for a single semester or course project. Afterwards, these expensive resources lie idle, while junior students are forced to repurchase identical items.

**CampusXchange** provides a college-exclusive marketplace and academic knowledge network allowing students to sell, lend, exchange, donate, or request physical resources and study notes.

Crucially, CampusXchange is built as an **Advanced Database Demonstration Platform**, using specialized database engines for distinct workloads instead of a monolithic CRUD database.

---

## 2. Multi-Database Architecture

```
                                  +---------------------------------------+
                                  |    Vite + React.js (JavaScript/JSX)   |
                                  |    (Tailwind CSS, Framer Motion)      |
                                  +-------------------+-------------------+
                                                      |
                                                      v REST / JSON
                                  +-------------------+-------------------+
                                  |        FastAPI Python Gateway         |
                                  +----+---------+---------+---------+----+
                                       |         |         |         |
                +----------------------+         |         |         +----------------------+
                v                                v         v                                v
          +-----------+                    +-----------+ +------------+               +--------------+
          |  MongoDB  |                    |   Neo4j   | | PostgreSQL |               |  Gemini API  |
          |  (NoSQL   |                    |  (Graph   | | (Spatial + |               | (AI NLU Intent|
          | Documents)|                    |  Cypher)  | | Temporal + |               | Parser & Rec)|
          +-----------+                    +-----------+ | ECA Active)|               +--------------+
                                                         +------------+
```

| Database Paradigm | Engine | Specific Responsibility | Why Suitable? |
|---|---|---|---|
| **Primary NoSQL Document Store** | MongoDB | Flexible resource listings, user profiles, study materials, notifications. | Schema flexibility for dynamic resource attributes and built-in full-text indexing. |
| **Graph Database** | Neo4j | Multi-hop resource discovery, project-subject-resource networks, peer usage traversals. | Index-free adjacency executing traversals in $O(k)$ time vs exponential SQL joins. |
| **Temporal System DB** | PostgreSQL | `valid_from` to `valid_to` point-in-time state tracking of price, ownership, and availability history. | Maintains non-destructive audit history without overwriting past record states. |
| **Spatial Database** | PostgreSQL + PostGIS | Geospatial campus location queries (`ST_DWithin`, `ST_Distance`, `GEOGRAPHY(Point, 4326)`). | GIST spatial indexing bounding box search vs $O(N)$ Haversine calculation in application logic. |
| **Active Database** | PostgreSQL Triggers | Event-Condition-Action (ECA) database rules for automatic notifications and alerts. | Moves business invariants and event rules into database kernel level. |
| **AI NLU & Hybrid Search** | Gemini API | Converts natural language text intent into multi-DB spatial & graph queries. | Solves intent extraction without fabricating data; database remains source of truth. |

---

## 3. Database Specialization Details

### A. MongoDB (NoSQL)
- **Collections**: `students`, `resources`, `resource_requests`, `transactions`, `study_materials`, `notifications`.
- **Text Search Index**: `{ "title": "text", "description": "text" }` for keyword filtering.
- **Compound Index**: `{ "category": 1, "status": 1, "price": 1 }` for instant catalog search.

### B. Neo4j Cypher Graph Query
**Multi-Hop Resource Discovery Query**:
```cypher
MATCH (sub:Subject {id: $subjectId})<-[:RELATED_TO]-(p:Project)-[:USES]->(r:Resource {status: 'available'})
MATCH (s:Student)-[:WORKED_ON]->(p)
RETURN r.id AS resourceId, r.title AS title, p.name AS projectName, count(s) AS studentUsageCount
ORDER BY studentUsageCount DESC
LIMIT 5;
```

### C. Temporal Database (PostgreSQL System-Versioned Modeling)
**Point-in-Time As-Of State Query**:
```sql
SELECT resource_id, title, price, condition, status, valid_from, valid_to
FROM resource_history
WHERE resource_id = 'RES_CALC_001'
  AND '2026-03-20 14:30:00+00'::timestamp WITH TIME ZONE >= valid_from
  AND '2026-03-20 14:30:00+00'::timestamp WITH TIME ZONE < valid_to;
```

### D. PostGIS Spatial Distance Query
```sql
SELECT resource_id, title, campus_zone,
       ST_Distance(location, ST_MakePoint(80.2354, 13.0102)::geography) AS distance_meters
FROM resource_locations
WHERE ST_DWithin(location, ST_MakePoint(80.2354, 13.0102)::geography, 1000)
ORDER BY distance_meters ASC;
```

### E. Active Database (PL/pgSQL ECA Trigger)
```sql
CREATE OR REPLACE FUNCTION fn_eca_resource_available()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status <> 'available' AND NEW.status = 'available') THEN
        INSERT INTO active_notifications (recipient_id, title, message, event_type)
        VALUES (
            NEW.owner_id,
            'Resource Status Restored',
            'Your resource (' || NEW.title || ') is now active and available for campus sharing.',
            'RESOURCE_AVAILABLE'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 4. Transparent Recommendation Ranking Formula

$$\text{Final Score} = 0.30 \cdot S_{\text{relevance}} + 0.20 \cdot S_{\text{graph}} + 0.15 \cdot S_{\text{rating}} + 0.15 \cdot S_{\text{availability}} + 0.10 \cdot S_{\text{distance}} + 0.10 \cdot S_{\text{reuse}}$$

---

## 5. Local Setup & Docker Execution

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose

### Quick Run via Docker Compose
```bash
cd docker
docker-compose up --build
```
- **Frontend App**: `http://localhost:3000`
- **FastAPI OpenAPI Swagger**: `http://localhost:8000/docs`
- **Interactive Database Lab**: `http://localhost:3000/database-lab`

### Data Seed Command
```bash
python database/seed/seed_data.py
```

### Running Backend Pytest Suite
```bash
pytest backend/tests/ -v
```

---

## 6. Faculty Viva Q&A Guide

### Q1: Why didn't you put everything in MongoDB?
**Answer**: While MongoDB excels at storing semi-structured resource documents, multi-hop relationship traversals across (Student -> Project -> Subject -> Resource) in Mongo require expensive nested aggregation pipelines. Neo4j handles this in $O(k)$ time using Index-Free Adjacency pointers. Similarly, PostGIS spatial GIST indexing handles radius bounding-box queries far more efficiently than application-level Python math.

### Q2: What is the difference between `updatedAt` and a Temporal Database?
**Answer**: An `updatedAt` column overwrites the row state, destroying past prices, previous owners, and historical status. A Temporal Database maintains valid time intervals (`valid_from` to `valid_to`), allowing point-in-time time-travel queries ("Who owned item X on March 20th?") without losing historical records.

### Q3: How do Active Database ECA triggers work here?
**Answer**: Instead of relying solely on frontend JavaScript or backend API handlers to push notifications, PostgreSQL PL/pgSQL triggers execute automatically inside the database engine whenever a database EVENT occurs (`AFTER UPDATE` on `resource_history`) matching a CONDITION (`OLD.status <> 'available' AND NEW.status = 'available'`), performing an ACTION (inserting notification rows).
