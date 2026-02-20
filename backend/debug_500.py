import requests
import traceback

try:
    response = requests.get("http://127.0.0.1:8000/dashboard")
    print(f"Status Code: {response.status_code}")
    print("Response Body:")
    print(response.text)
except Exception:
    traceback.print_exc()
