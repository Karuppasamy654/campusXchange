# 1. MongoDB (Primary NoSQL Engine) — Educational Guide

## 1. What Problem Does It Solve?
Campus resources (calculators, lab coats, textbooks, notes, past papers, lab kits) have highly variable metadata. A textbook has an ISBN and edition, while a calculator has a model number and battery type, and notes have file formats and page counts. A rigid relational table would require excessive `NULL` columns or complex EAV (Entity-Attribute-Value) patterns.

MongoDB provides a schema-flexible document store where each resource can store its dynamic payload natively as BSON documents.

## 2. Why MongoDB is Suitable
- **Schema Flexibility**: Stores arbitrary resource attributes without migrations.
- **Sub-document Embedding**: Ratings, tags, and dynamic metadata are nested inside resource documents, eliminating joins for basic reads.
- **Built-in Text Search**: Enables multi-field text indexing across `title`, `description`, and `tags`.
- **High Read Throughput**: Async non-blocking I/O using `motor` with MongoDB.

## 3. Collections & Data Schemas

### `students` Collection
```json
{
  "_id": "65f01a2b3c4d5e6f7a8b9c0d",
  "name": "Arun Kumar",
  "email": "arun.ceg@annauniv.edu",
  "passwordHash": "$2b$12$...",
  "department": "Computer Science and Engineering",
  "semester": 6,
  "role": "STUDENT",
  "skills": ["Python", "Database Systems", "React"],
  "createdAt": "2026-01-15T09:30:00Z"
}
```

### `resources` Collection
```json
{
  "_id": "65f01a2b3c4d5e6f7a8b9c0e",
  "title": "Casio FX-991EX ClassWiz Calculator",
  "category": "calculator",
  "description": "Scientific calculator required for Engineering Mathematics III and Statistics.",
  "condition": "good",
  "mode": "lend",
  "price": 0.0,
  "ownerId": "65f01a2b3c4d5e6f7a8b9c0d",
  "subjectIds": ["SUB_MATH_301"],
  "status": "available",
  "tags": ["calculator", "casio", "math"],
  "createdAt": "2026-02-01T10:00:00Z"
}
```

## 4. Indexing Rationale & Queries

| Collection | Index Fields | Type | Why This Index Exists |
|---|---|---|---|
| `students` | `{ "email": 1 }` | Unique | Fast user lookup during login; enforces unique email constraint. |
| `resources` | `{ "ownerId": 1, "status": 1 }` | Compound | Instant retrieval of a student's active resources in their profile. |
| `resources` | `{ "category": 1, "status": 1, "price": 1 }` | Compound | Filters resource catalog searches efficiently without in-memory sorting. |
| `resources` | `{ "title": "text", "description": "text" }` | Text Index | Enables full-text search across resource listings. |
| `study_materials` | `{ "subjectId": 1, "department": 1 }` | Compound | Quick filtering of notes/lab manuals by course and department. |

## 5. Sample Operations & Expected Results

### Query: Find all available calculators sorted by lowest price
```javascript
db.resources.find({
  "category": "calculator",
  "status": "available"
}).sort({ "price": 1 }).limit(10);
```

### Expected Database Result:
```json
[
  {
    "_id": "65f01a2b3c4d5e6f7a8b9c0e",
    "title": "Casio FX-991EX ClassWiz Calculator",
    "category": "calculator",
    "status": "available",
    "price": 0.0,
    "ownerId": "65f01a2b3c4d5e6f7a8b9c0d"
  }
]
```
