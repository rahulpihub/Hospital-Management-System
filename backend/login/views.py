from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
import re
import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

client = MongoClient("mongodb+srv://1QoSRtE75wSEibZJ:1QoSRtE75wSEibZJ@cluster0.mregq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["hospital"]
collection = db["Credentials"]

EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_HOST_USER = "rahulsnsihub@gmail.com"  
EMAIL_HOST_PASSWORD = "gspmoernuumgcerc"  


def validate_email(email):
    """Validate email to ensure it ends with @gmail.com"""
    return re.match(r'^[a-zA-Z0-9._%+-]+@gmail\.com$', email)
def validate_password(password):
    return re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', password)

import bcrypt
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from pymongo import MongoClient

# MongoDB setup (adjust as per your database)
client = MongoClient("mongodb+srv://1QoSRtE75wSEibZJ:1QoSRtE75wSEibZJ@cluster0.mregq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["hospital"]
collection = db["Credentials"]

# Email validation (example)
def validate_email(email):
    return email.endswith("@gmail.com")

# Password validation (example)
def validate_password(password):
    import re
    pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
    return bool(re.match(pattern, password))


@csrf_exempt
def create_account(request):
    """Endpoint to create accounts for Admin, Doctor, and Nurse"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username', '').strip()
            email = data.get('email', '').strip()
            password = data.get('password', '').strip()
            role = data.get('role', '').strip()
            privilege = data.get('privilege', '').strip()

            if not username or not email or not password or not role or not privilege:
                return JsonResponse({"message": "All fields are required."}, status=400)

            if not validate_email(email):
                return JsonResponse({"message": "Invalid email format. Only @gmail.com allowed."}, status=400)
            
            if not validate_password(password):
                return JsonResponse({
                    "message": "Password must include uppercase, lowercase, number, special character, and be at least 8 characters long"
                }, status=400)

            # Hash the password with bcrypt
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            # Store the user data in MongoDB
            account = {
                "username": username,
                "email": email,
                "password": hashed_password.decode('utf-8'),  # Store as string
                "role": role,
                "privilege": privilege
            }
            collection.insert_one(account)

            return JsonResponse({"message": "Account created successfully!"}, status=201)

        except Exception as e:
            return JsonResponse({"message": "Error occurred while creating account.", "error": str(e)}, status=500)

    return JsonResponse({"message": "Invalid request method."}, status=405)


@csrf_exempt
def login(request):
    """Endpoint for user login"""
    if request.method == "POST":
        try:
            # Parse the JSON request body
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON format"}, status=400)

        if not email or not password:
            return JsonResponse({"success": False, "message": "Email and password are required"}, status=400)

        # Fetch the user data from MongoDB
        user = collection.find_one({"email": email})
        if user:
            # Retrieve the hashed password from the database
            stored_hashed_password = user["password"]

            # Use bcrypt to compare the provided password with the stored hash
            if bcrypt.checkpw(password.encode('utf-8'), stored_hashed_password.encode('utf-8')):
                # Send login email
                send_email(email, "Login Notification", "You have logged in successfully.")
                return JsonResponse({"success": True, "message": "Login successful"}, status=200)
            else:
                return JsonResponse({"success": False, "message": "Invalid email or password"}, status=401)
        else:
            return JsonResponse({"success": False, "message": "User not found"}, status=404)

    return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)




def send_email(to_email, subject, message):
    """Send an email notification."""
    try:
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)

        msg = MIMEMultipart()
        msg['From'] = EMAIL_HOST_USER
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(message, 'plain'))

        server.send_message(msg)
        server.quit()
    except Exception as e:
        print(f"Error sending email: {e}")



        import json
import smtplib
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

@csrf_exempt
def logout(request):
    """Endpoint for user logout and sending an email notification"""
    if request.method == "POST":
        try:
            # Parse the JSON request body
            data = json.loads(request.body)
            email = data.get("email")
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON format"}, status=400)

        if not email:
            return JsonResponse({"success": False, "message": "Email is required"}, status=400)

        # Send logout email notification
        send_email(email, "Logout Notification", "You have successfully logged out.")

        return JsonResponse({"success": True, "message": "Logout successful"}, status=200)

    return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)
