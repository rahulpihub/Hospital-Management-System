from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
import re

client = MongoClient("mongodb+srv://1QoSRtE75wSEibZJ:1QoSRtE75wSEibZJ@cluster0.mregq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["hospital"]
collection = db["registration_data"]

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


import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache
import random
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Email Configuration
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_HOST_USER = "rahulsnsihub@gmail.com"  # Replace with your email 
EMAIL_HOST_PASSWORD = "gspmoernuumgcerc"  # Replace with your app password
EMAIL_USE_TLS = True

def generate_otp():
    """Generate a 6-digit OTP"""
    return random.randint(100000, 999999)

def send_email_otp(to_email, otp):
    """Send OTP via email"""
    try:
        msg = MIMEMultipart()
        msg["From"] = EMAIL_HOST_USER
        msg["To"] = to_email
        msg["Subject"] = "Your OTP for Email Verification"

        body = f"""
        Your OTP for email verification is: {otp}
        
        This OTP will expire in 5 minutes.
        
        If you didn't request this OTP, please ignore this email.
        """
        msg.attach(MIMEText(body, "plain"))

        # Set up the server
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

@csrf_exempt
def send_otp(request):
    """Endpoint to send OTP"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON format"}, status=400)

        if email:
            otp = generate_otp()
            cache.set(email, otp, timeout=300)  # Store OTP in cache for 5 minutes
            if send_email_otp(email, otp):
                return JsonResponse({"success": True, "message": "OTP sent to email"})
            return JsonResponse({"success": False, "message": "Failed to send email"})
        return JsonResponse({"success": False, "message": "Email is required"})

    return JsonResponse({"success": False, "message": "Invalid request method"})

@csrf_exempt
def verify_otp(request):
    """Endpoint to verify OTP"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            otp = data.get("otp")
            print(f"Received OTP: {otp}, for email: {email}")
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON format"}, status=400)

        if not email or not otp:
            return JsonResponse({"success": False, "message": "Email and OTP are required"})

        cached_otp = cache.get(email)
        if cached_otp:
            print(f"Cached OTP for email {email}: {cached_otp}")
            if int(otp) == cached_otp:
                cache.delete(email)  # Remove OTP after successful verification
                return JsonResponse({"success": True, "message": "OTP verified successfully"})
            else:
                return JsonResponse({"success": False, "message": "Invalid OTP"})
        else:
            return JsonResponse({"success": False, "message": "OTP expired or not found"})

    return JsonResponse({"success": False, "message": "Invalid request method"})

