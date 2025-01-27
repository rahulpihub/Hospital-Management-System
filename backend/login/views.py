from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
import time
import re
import bcrypt
import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# def validate_email(email):
#     """Validate email to ensure it ends with @gmail.com"""
#     return re.match(r'^[a-zA-Z0-9._%+-]+@gmail\.com$', email)
# def validate_password(password):
#     return re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', password)


client = MongoClient("mongodb+srv://1QoSRtE75wSEibZJ:1QoSRtE75wSEibZJ@cluster0.mregq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["hospital"]
collection = db["Credentials"]

EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_HOST_USER = "rahulsnsihub@gmail.com"  
EMAIL_HOST_PASSWORD = "gspmoernuumgcerc"  

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

        # Check if the account is locked
        lock_record = collection.find_one({"email": email})
        if lock_record:
            # If the account is locked, check if it has been more than 30 minutes since the last failed attempt
            last_failed_time = lock_record.get("last_failed_time")
            failed_attempts = lock_record.get("failed_attempts", 0)
            if failed_attempts >= 5:
                # If the account is locked, reject login attempts until it's unlocked
                if time.time() - last_failed_time < 1800:  # 1800 seconds = 30 minutes
                    return JsonResponse({"success": False, "message": "Your account is locked. Try again after 30 minutes."}, status=403)
                else:
                    # If more than 30 minutes have passed, reset the failed attempts counter
                    collection.update_one({"email": email}, {"$set": {"failed_attempts": 0}})
                    lock_record = None  # Proceed to check the login

        # Fetch the user data from MongoDB
        user = collection.find_one({"email": email})
        if user:
            # Retrieve the hashed password from the database
            stored_hashed_password = user["password"]

            # Use bcrypt to compare the provided password with the stored hash
            if bcrypt.checkpw(password.encode('utf-8'), stored_hashed_password.encode('utf-8')):
                # Reset the failed attempts if login is successful
                if lock_record:
                    collection.update_one({"email": email}, {"$set": {"failed_attempts": 0}})
                
                # Send login email
                send_email(email, "Login Notification", "You have logged in successfully.")
                
                # Get the user's role
                user_role = user.get("role", "user")  # Default to 'user' if role is not found

                # Send the success response along with the role
                return JsonResponse({
                    "success": True,
                    "message": "Login successful",
                    "role": user_role  # Send the role to the frontend
                }, status=200)
            else:
                # Increment failed attempts counter in the LocksAccounts collection
                failed_attempts = 1
                if lock_record:
                    failed_attempts = lock_record.get("failed_attempts", 0) + 1

                # If failed attempts exceed 5, lock the account
                if failed_attempts >= 5:
                    collection.update_one(
                        {"email": email},
                        {"$set": {"failed_attempts": failed_attempts, "last_failed_time": time.time()}}
                    )
                    return JsonResponse({"success": False, "message": "Your account is locked. Try again after 30 minutes."}, status=403)
                else:
                    # Update failed attempts count for the account
                    collection.update_one(
                        {"email": email},
                        {"$set": {"failed_attempts": failed_attempts, "last_failed_time": time.time()}}
                    )

                return JsonResponse({"success": False, "message": "Invalid email or password"}, status=401)
        else:
            return JsonResponse({"success": False, "message": "User not found"}, status=404)

    return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)



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

@csrf_exempt
def forgot_password(request):
    """Handle password reset request."""
    if request.method == 'POST':
        try:
            # Parse JSON body
            data = json.loads(request.body)
            email = data.get('email')
            
            # Check if the email is a valid Gmail address
            if not email or not email.endswith('@gmail.com'):
                return JsonResponse({'success': False, 'message': 'Invalid email address. Please use a valid Gmail address.'}, status=400)

            # Generate a password reset link
            reset_link = f"http://localhost:3000/resetpassword"
            
            # Send the reset email
            subject = "Password Reset Request"
            message = f"To reset your password, click the link: {reset_link}"

            send_email(email, subject, message)
            return JsonResponse({'success': True, 'message': 'Password reset link sent to your email'})

        except Exception as e:
            print(f"Error during password reset: {e}")
            return JsonResponse({'success': False, 'message': 'An error occurred. Please try again later.'}, status=500)
        

@csrf_exempt
def reset_password(request):
    if request.method == 'POST':
        try:
            # Parse JSON data from request
            body = json.loads(request.body.decode('utf-8'))
            email = body.get('email')
            new_password = body.get('newPassword')

            # Check if email exists in the collection
            user = collection.find_one({"email": email})
            if not user:
                return JsonResponse({"success": False, "message": "Email not found in the system"})

            # Hash the new password using bcrypt
            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

            # Update the user's password (store the hashed password)
            collection.update_one({"email": email}, {"$set": {"password": hashed_password.decode('utf-8')}})
            return JsonResponse({"success": True, "message": "Password updated successfully"})
        
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({"success": False, "message": "An error occurred during the reset process"})
    
    return JsonResponse({"success": False, "message": "Invalid request method"})


    