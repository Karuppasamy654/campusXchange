import unittest
import os
import sys

# Add project root and backend to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

class TestCampusXchangeBackend(unittest.TestCase):

    def test_01_backend_files_exist(self):
        """Verify essential backend service files exist"""
        files = [
            'app/main.py',
            'app/api/v1/router.py',
            'app/databases/mongodb.py',
            'app/databases/neo4j.py',
            'app/databases/postgres.py',
            'app/api/v1/temporal.py',
            'app/api/v1/spatial.py',
            'app/api/v1/eca.py',
            'app/api/v1/ai.py',
            'app/api/v1/recommendations.py',
            'app/api/v1/study_materials.py'
        ]
        backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        for f in files:
            path = os.path.join(backend_dir, f)
            self.assertTrue(os.path.exists(path), f"File missing: {f}")

    def test_02_database_schemas_and_sql_exist(self):
        """Verify database SQL scripts and documentation exist"""
        sql_files = [
            '../database/postgres/temporal_schema.sql',
            '../database/postgres/triggers.sql',
            '../database/seed/seed_data.py',
            '../docs/database/01_mongodb.md',
            '../docs/database/02_neo4j.md',
            '../docs/database/03_temporal.md',
            '../docs/database/04_spatial_postgis.md',
            '../docs/database/05_active_eca.md'
        ]
        backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        for f in sql_files:
            path = os.path.join(backend_dir, f)
            self.assertTrue(os.path.exists(path), f"SQL/Doc file missing: {f}")

    def test_03_docker_and_env_exist(self):
        """Verify Docker compose and environment example exist"""
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
        self.assertTrue(os.path.exists(os.path.join(root_dir, 'docker/docker-compose.yml')))
        self.assertTrue(os.path.exists(os.path.join(root_dir, '.env.example')))

if __name__ == '__main__':
    unittest.main()
