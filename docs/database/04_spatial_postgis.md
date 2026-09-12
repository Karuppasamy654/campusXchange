# 4. Spatial Database (PostgreSQL + PostGIS) — Educational Guide

## 1. What Problem Does It Solve?
Students want to discover physical resources (calculators, lab components, textbooks) located near their current campus location (e.g., within 500m of the Science Block or Library).

Calculating distance manually in Python using the Haversine formula requires executing `SELECT * FROM resources` and iterating over all records in memory ($O(N)$ complexity).

PostGIS integrates **GIST (Generalized Search Tree) Spatial Indexing** using R-Tree algorithms. It filters candidates at the database storage engine layer in $O(\log N)$ time.

## 2. Why PostGIS is Suitable
- **Ellipsoidal Accuracy**: Uses `GEOGRAPHY(Point, 4326)` (WGS 84 coordinate reference system) to calculate exact real-world distances in meters on the curved earth surface.
- **Native Spatial Indexing**: GIST indexes bounding boxes of geometric objects.
- **Privacy Protection**: Returns campus pickup zones and distance approximations without exposing exact student dorm rooms.

## 3. Spatial Schema & GIST Index

```sql
CREATE TABLE resource_locations (
    location_id SERIAL PRIMARY KEY,
    resource_id VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    campus_zone VARCHAR(100) NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- GIST Spatial Index for R-Tree fast bounding-box filtering
CREATE INDEX idx_resource_spatial_gist ON resource_locations USING GIST(location);
```

## 4. Key PostGIS Spatial Queries

### Query 1: Find resources within $R$ meters of current coordinates (`ST_DWithin`)
```sql
SELECT 
    resource_id,
    title,
    category,
    campus_zone,
    ST_Y(location::geometry) AS latitude,
    ST_X(location::geometry) AS longitude,
    ST_Distance(location, ST_MakePoint($1, $2)::geography) AS distance_meters
FROM resource_locations
WHERE ST_DWithin(location, ST_MakePoint($1, $2)::geography, $3)
ORDER BY distance_meters ASC;
```

### Query 2: Find the 5 nearest calculators to a user's location
```sql
SELECT 
    resource_id,
    title,
    campus_zone,
    ST_Distance(location, ST_MakePoint($1, $2)::geography) AS distance_meters
FROM resource_locations
WHERE category = 'calculator'
ORDER BY location <-> ST_MakePoint($1, $2)::geography
LIMIT 5;
```

## 5. Expected Database Output (Query 1)
```json
[
  {
    "resourceId": "65f01a2b3c4d5e6f7a8b9c0e",
    "title": "Casio FX-991EX Calculator",
    "category": "calculator",
    "campusZone": "Library Zone",
    "latitude": 13.0102,
    "longitude": 80.2354,
    "distanceMeters": 185.4
  }
]
```
