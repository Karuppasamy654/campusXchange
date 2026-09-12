# 3. Temporal Database (PostgreSQL System-Versioned History) — Educational Guide

## 1. What Problem Does It Solve?
Normal database records only preserve current state. When an item price is updated from ₹800 to ₹700, or when ownership transfers from Student A to Student B, standard `updatedAt` fields overwrite the previous state.

Questions like:
- *"Who owned this calculator on March 20th?"*
- *"What was the price history of this lab kit over the last 3 months?"*
- *"How many total days was this resource borrowed versus idle?"*

cannot be answered by mutating tables.

A Temporal Database maintains valid time intervals (`valid_from` to `valid_to` or `TSTZRANGE`), enabling point-in-time time travel queries without destroying historical state.

## 2. Why PostgreSQL Temporal Modeling is Suitable
- **Interval Constraints**: Uses PostgreSQL timestamp ranges (`valid_from`, `valid_to`) with `INFINITY` representing current active state.
- **SQL Range Operators**: Built-in support for range inclusion (`@>`), overlap (`&&`), and interval intersection.
- **Privacy Protection**: Anonymizes historical owner identities when returning lifecycle details to standard students.

## 3. History Tables Schema

### Table: `resource_history`
```sql
CREATE TABLE resource_history (
    history_id SERIAL PRIMARY KEY,
    resource_id VARCHAR(64) NOT NULL,
    owner_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    condition VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_to TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'infinity'
);

CREATE INDEX idx_temporal_resource ON resource_history (resource_id, valid_from, valid_to);
```

## 4. Key Temporal Queries

### Query 1: As-Of Point-In-Time Query ("What was the resource state on 2026-03-20?")
```sql
SELECT resource_id, title, price, condition, status, valid_from, valid_to
FROM resource_history
WHERE resource_id = $1
  AND $2::timestamp WITH TIME ZONE >= valid_from
  AND $2::timestamp WITH TIME ZONE < valid_to;
```

### Query 2: Lifecycle Reuse & Duration Audit
```sql
SELECT 
    resource_id,
    COUNT(CASE WHEN status = 'borrowed' THEN 1 END) AS total_times_borrowed,
    SUM(EXTRACT(EPOCH FROM (LEAST(valid_to, CURRENT_TIMESTAMP) - valid_from)) / 86400)::INT AS total_days_active
FROM resource_history
WHERE resource_id = $1
GROUP BY resource_id;
```

## 5. Expected Database Output (Query 1)
```json
{
  "resourceId": "65f01a2b3c4d5e6f7a8b9c0e",
  "title": "Casio FX-991EX Calculator",
  "price": 800.0,
  "condition": "good",
  "status": "available",
  "validFrom": "2026-01-10T00:00:00Z",
  "validTo": "2026-03-20T14:30:00Z"
}
```
