from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
import re

client = MongoClient("mongodb+srv://1QoSRtE75wSEibZJ:1QoSRtE75wSEibZJ@cluster0.mregq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["hospital"]
collection = db["login"]

def validate_email(email):
    return re.match(r'^[a-zA-Z0-9._%+-]+@gmail\.com$', email)

def validate_password(password):
    return re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', password)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            import json
            data = json.loads(request.body)
            username = data.get('username', '')
            email = data.get('email', '')
            password = data.get('password', '')

            if not username or not email or not password:
                return JsonResponse({"message": "All fields are required"}, status=400)

            if not validate_email(email):
                return JsonResponse({"message": "Invalid email format. Only @gmail.com allowed"}, status=400)

            if not validate_password(password):
                return JsonResponse({
                    "message": "Password must include uppercase, lowercase, number, special character, and be at least 8 characters long"
                }, status=400)

            # Save to database
            user = {"username": username, "email": email, "password": password}
            collection.insert_one(user)

            return JsonResponse({"message": "User registered successfully"}, status=201)
        except Exception as e:
            return JsonResponse({"message": "Error occurred", "error": str(e)}, status=500)
