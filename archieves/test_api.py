# test_api.py
import unittest
import json
from app import app  # Ensure that app.py is in the same directory and exposes the Flask app instance.

class SensorAPITest(unittest.TestCase):
    def setUp(self):
        # Create a test client using the Flask application instance configured for testing.
        self.app = app.test_client()
        self.app.testing = True

    def test_update_endpoint(self):
        # Define a sample sensor data payload.
        payload = {
            "PM2.5": 12.3,
            "NO2": 8.9,
            "PM10": 45.7
        }
        # Send a POST request to the /update endpoint.
        response = self.app.post(
            "/update",
            data=json.dumps(payload),
            content_type="application/json"
        )
        # Validate that the response status code is 200 (OK).
        self.assertEqual(response.status_code, 200)
        # Parse the response JSON.
        response_json = json.loads(response.data)
        # Verify that the API returns a "success" status.
        self.assertEqual(response_json.get("status"), "success")

if __name__ == '__main__':
    unittest.main()
