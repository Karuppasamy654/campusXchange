import http.server
import socketserver
import json
import urllib.parse
from datetime import datetime

PORT = 8000

# In-memory storage for local offline demonstration
STUDENTS = [
    {
        "_id": "65f01a2b3c4d5e6f7a8b9c0d",
        "name": "Arun Kumar",
        "email": "arun.ceg@annauniv.edu",
        "department": "Computer Science and Engineering",
        "semester": 5,
        "role": "STUDENT",
        "skills": ["Python", "Databases", "React"]
    }
]

RESOURCES = [
    {
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
        "location": {
            "campusZone": "CEG Library Zone",
            "latitude": 13.0102,
            "longitude": 80.2354
        },
        "createdAt": "2026-02-01T10:00:00Z",
        "updatedAt": "2026-02-01T10:00:00Z"
    },
    {
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
        "location": {
            "campusZone": "Science Block Zone",
            "latitude": 13.0120,
            "longitude": 80.2370
        },
        "createdAt": "2026-02-05T11:00:00Z",
        "updatedAt": "2026-02-05T11:00:00Z"
    }
]

STUDY_MATERIALS = [
    {
        "_id": "MAT_001",
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
        "createdAt": "2026-02-10T09:00:00Z"
    }
]

REQUESTS = []
NOTIFICATIONS = []

class CampusXchangeAPIHandler(http.server.BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = urllib.parse.parse_qs(parsed.query)

        if path in ['/', '/api/v1/health']:
            self._set_headers(200)
            self.wfile.write(json.dumps({"status": "healthy", "service": "CampusXchange API Gateway"}).encode('utf-8'))
            return

        if path == '/api/v1/auth/me':
            self._set_headers(200)
            self.wfile.write(json.dumps(STUDENTS[0]).encode('utf-8'))
            return

        if path == '/api/v1/resources':
            search = params.get('search', [None])[0]
            category = params.get('category', [None])[0]

            filtered = RESOURCES
            if category:
                filtered = [r for r in filtered if r['category'] == category]
            if search:
                s_lower = search.lower()
                filtered = [r for r in filtered if s_lower in r['title'].lower() or s_lower in r['description'].lower() or s_lower in r['category'].lower()]

            self._set_headers(200)
            self.wfile.write(json.dumps(filtered).encode('utf-8'))
            return

        if path.startswith('/api/v1/resources/'):
            res_id = path.split('/')[-1]
            found = next((r for r in RESOURCES if r['_id'] == res_id), RESOURCES[0])
            self._set_headers(200)
            self.wfile.write(json.dumps(found).encode('utf-8'))
            return

        if path == '/api/v1/study-materials':
            self._set_headers(200)
            self.wfile.write(json.dumps(STUDY_MATERIALS).encode('utf-8'))
            return

        if path == '/api/v1/requests':
            self._set_headers(200)
            self.wfile.write(json.dumps(REQUESTS).encode('utf-8'))
            return

        if path == '/api/v1/notifications':
            self._set_headers(200)
            self.wfile.write(json.dumps(NOTIFICATIONS).encode('utf-8'))
            return

        if path.startswith('/api/v1/graph/recommendations/subject/'):
            subject_id = path.split('/')[-1]
            res_payload = {
                "explanation": f"Discovered resources connected to subject '{subject_id}' through past student project usage.",
                "cypherQuery": "MATCH (sub:Subject {id: $subjectId})<-[:RELATED_TO]-(p:Project)-[:USES]->(r:Resource)\nRETURN r.id, r.title, p.name, count(s) ORDER BY count(s) DESC",
                "results": [
                    {
                        "resourceId": "RES_CALC_001",
                        "title": "Casio FX-991EX ClassWiz Calculator",
                        "category": "calculator",
                        "projectName": "IoT Smart Campus Project",
                        "studentUsageCount": 5
                    }
                ]
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(res_payload).encode('utf-8'))
            return

        if path.startswith('/api/v1/temporal/resource/'):
            parts = path.split('/')
            res_id = parts[4]
            timestamp = params.get('timestamp', ['2026-03-20T14:30:00Z'])[0]

            if 'as-of' in parts:
                res_payload = {
                    "explanation": f"Resource state snapshot valid at timestamp {timestamp}.",
                    "sqlQuery": "SELECT resource_id, title, price, condition, status, valid_from, valid_to FROM resource_history WHERE valid_from <= $2 AND valid_to > $2;",
                    "asOfState": {
                        "resourceId": res_id,
                        "title": "Casio FX-991EX Calculator",
                        "price": 800.0,
                        "condition": "good",
                        "status": "available",
                        "validFrom": "2026-01-10T00:00:00Z",
                        "validTo": "2026-03-20T14:30:00Z"
                    }
                }
            else:
                res_payload = {
                    "explanation": f"Complete temporal timeline history for resource '{res_id}'.",
                    "sqlQuery": "SELECT history_id, title, price, condition, status, valid_from, valid_to FROM resource_history ORDER BY valid_from ASC;",
                    "timeline": [
                        {
                            "historyId": 1,
                            "title": "Casio FX-991EX Calculator",
                            "price": 800.0,
                            "condition": "good",
                            "status": "available",
                            "validFrom": "2026-01-10T00:00:00Z",
                            "validTo": "2026-03-20T14:30:00Z"
                        },
                        {
                            "historyId": 2,
                            "title": "Casio FX-991EX Calculator",
                            "price": 0.0,
                            "condition": "good",
                            "status": "available",
                            "validFrom": "2026-03-20T14:30:00Z",
                            "validTo": "current"
                        }
                    ]
                }
            self._set_headers(200)
            self.wfile.write(json.dumps(res_payload).encode('utf-8'))
            return

        if path == '/api/v1/spatial/nearby':
            radius = params.get('radiusMeters', ['1000'])[0]
            res_payload = {
                "explanation": f"PostGIS ST_DWithin executed with GIST index within {radius}m.",
                "sqlQuery": f"SELECT resource_id, title, category, campus_zone, ST_Y(location), ST_X(location), ST_Distance(location, ST_MakePoint(80.2354, 13.0102)) FROM resource_locations WHERE ST_DWithin(location, ST_MakePoint(80.2354, 13.0102), {radius});",
                "count": 2,
                "results": [
                    {
                        "resourceId": "RES_CALC_001",
                        "title": "Casio FX-991EX Calculator",
                        "category": "calculator",
                        "campusZone": "CEG Library Zone",
                        "latitude": 13.0102,
                        "longitude": 80.2354,
                        "distanceMeters": 120.5
                    },
                    {
                        "resourceId": "RES_KIT_002",
                        "title": "Arduino Starter Kit",
                        "category": "lab_kit",
                        "campusZone": "Science Block Zone",
                        "latitude": 13.0120,
                        "longitude": 80.2370,
                        "distanceMeters": 340.0
                    }
                ]
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(res_payload).encode('utf-8'))
            return

        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "NOT_FOUND"}).encode('utf-8'))

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = urllib.parse.parse_qs(parsed.query)

        content_length = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            body = json.loads(body_bytes.decode('utf-8'))
        except Exception:
            body = {}

        if path in ['/api/v1/auth/login', '/api/v1/auth/login/json']:
            res = {
                "access_token": "mock-jwt-token-campusxchange-2026",
                "token_type": "bearer",
                "user": STUDENTS[0]
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(res).encode('utf-8'))
            return

        if path == '/api/v1/auth/register':
            new_user = {
                "_id": f"std_{len(STUDENTS)+1}",
                "name": body.get("name", "New Student"),
                "email": body.get("email", "student@annauniv.edu"),
                "department": body.get("department", "CSE"),
                "semester": body.get("semester", 5),
                "role": "STUDENT",
                "skills": body.get("skills", [])
            }
            STUDENTS.append(new_user)
            self._set_headers(201)
            self.wfile.write(json.dumps(new_user).encode('utf-8'))
            return

        if path == '/api/v1/resources':
            new_res = {
                "_id": f"RES_CUSTOM_{len(RESOURCES)+1}",
                "title": body.get("title", "Resource Item"),
                "category": body.get("category", "calculator"),
                "description": body.get("description", "Listed resource."),
                "condition": body.get("condition", "good"),
                "mode": body.get("mode", "lend"),
                "price": body.get("price", 0),
                "ownerId": STUDENTS[0]["_id"],
                "ownerName": STUDENTS[0]["name"],
                "ownerDepartment": STUDENTS[0]["department"],
                "status": "available",
                "location": body.get("location", {"campusZone": "CEG Library Zone"}),
                "createdAt": datetime.utcnow().isoformat(),
                "updatedAt": datetime.utcnow().isoformat()
            }
            RESOURCES.append(new_res)
            self._set_headers(201)
            self.wfile.write(json.dumps(new_res).encode('utf-8'))
            return

        if path == '/api/v1/requests':
            new_req = {
                "_id": f"REQ_{len(REQUESTS)+1}",
                "resourceId": body.get("resourceId"),
                "resourceTitle": "Casio FX-991EX Calculator",
                "requesterId": STUDENTS[0]["_id"],
                "requesterName": STUDENTS[0]["name"],
                "ownerId": "65f01a2b3c4d5e6f7a8b9c0d",
                "status": "pending",
                "message": body.get("message", "Borrowing request"),
                "expectedDurationDays": body.get("expectedDurationDays", 7),
                "createdAt": datetime.utcnow().isoformat()
            }
            REQUESTS.append(new_req)
            NOTIFICATIONS.append({
                "_id": f"NOTIF_{len(NOTIFICATIONS)+1}",
                "title": "New Borrowing Request",
                "message": f"Request received for Casio Calculator",
                "createdAt": datetime.utcnow().isoformat()
            })
            self._set_headers(201)
            self.wfile.write(json.dumps(new_req).encode('utf-8'))
            return

        if path == '/api/v1/eca/trigger-demo':
            new_status = params.get('newStatus', ['available'])[0]
            res_payload = {
                "event": f"UPDATE resource_history SET status = '{new_status}' WHERE resource_id = 'RES_CALC_001'",
                "conditionEvaluated": f"OLD.status ('borrowed') <> NEW.status ('{new_status}') AND NEW.status == 'available'",
                "actionExecuted": "PL/pgSQL Trigger 'fn_eca_resource_available' automatically executed INSERT INTO active_notifications",
                "generatedNotifications": [
                    {
                        "id": 1,
                        "recipient_id": "65f01a2b3c4d5e6f7a8b9c0d",
                        "title": "Resource Status Restored",
                        "message": "Your resource (Casio FX-991EX Calculator) is now active and available for campus sharing.",
                        "event_type": "RESOURCE_AVAILABLE",
                        "created_at": datetime.utcnow().isoformat()
                    }
                ]
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(res_payload).encode('utf-8'))
            return

        if path == '/api/v1/ai/search':
            user_query = params.get('query', ['Need calculator for DBMS'])[0]
            res_payload = {
                "userQuery": user_query,
                "parsedIntent": {
                    "category": "calculator",
                    "subject": "DBMS",
                    "keywords": ["calculator", "dbms"],
                    "location_required": True,
                    "max_distance_meters": 1000
                },
                "totalResultsCount": 1,
                "recommendations": [
                    {
                        "resource": RESOURCES[0],
                        "finalScore": 0.92,
                        "explanations": [
                            "Subject Match (DBMS): Score 1.0 (30% weight)",
                            "Graph Project Connections: 5 students (20% weight)",
                            "Condition (Good): Score 0.8 (15% weight)",
                            "PostGIS Spatial Distance: 120m away (10% weight)",
                            "Temporal Reuse History: 2 cycles (10% weight)"
                        ]
                    }
                ]
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(res_payload).encode('utf-8'))
            return

        self._set_headers(200)
        self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))

def run_server():
    print(f"CampusXchange API Gateway running on http://localhost:{PORT}...")
    with socketserver.TCPServer(("", PORT), CampusXchangeAPIHandler) as httpd:
        httpd.serve_forever()

if __name__ == '__main__':
    run_server()
