from .models import Farmer
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import (
    authenticate,
    login as auth_login,
    logout as auth_logout,
)
from django.contrib.auth.decorators import login_required

import json


# ==========================================
# Register
# ==========================================

@csrf_exempt
def register(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "POST request required"},
            status=405,
        )

    try:

        data = json.loads(request.body)

        if User.objects.filter(username=data["email"]).exists():
            return JsonResponse(
                {"error": "Email already registered"},
                status=400,
            )

        user = User.objects.create_user(
            username=data["email"],
            email=data["email"],
            password=data["password"],
            first_name=data["full_name"],
        )

        Farmer.objects.create(
            user=user,
            phone=data["phone"],
            state=data["state"],
            farm_size=float(data["farm_size"]),
        )

        # Send welcome email
        send_mail(
            "Welcome to AgroSense NG",
            f"""Hello {user.first_name},

                Welcome to AgroSense NG!

                Your account has been created successfully.

                Thank you for registering.

                Regards,
                AgroSense NG Team
                """,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

        return JsonResponse({
            "message": "Registration successful!",
            "user": {
                "id": user.id,
                "full_name": user.first_name,
                "email": user.email,
            }
        })

    except Exception as e:
        return JsonResponse(
            {"error": str(e)},
            status=500,
        )
    
# ==========================================
# Login
# ==========================================
@csrf_exempt
def login(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "POST request required"},
            status=405,
        )

    try:

        data = json.loads(request.body)

        user = authenticate(
            username=data["email"],
            password=data["password"],
        )

        if user is None:
            return JsonResponse(
                {"error": "Invalid email or password"},
                status=401,
            )

        # Create Django session
        auth_login(request, user)

        print("Authenticated:", request.user.is_authenticated)
        print("Session Key:", request.session.session_key)

        return JsonResponse({

            "message": "Login successful!",

            "redirect": "/dashboard/",

            "user": {
                "id": user.id,
                "full_name": user.first_name,
                "email": user.email,
            }

        })

    except Exception as e:

        return JsonResponse(
            {"error": str(e)},
            status=500,
        )


from django.contrib.auth import logout as auth_logout
from django.shortcuts import redirect

@login_required
def logout(request):
    auth_logout(request)
    return redirect("/")


# ==========================================
# Profile
# ==========================================

@login_required
def profile(request):

    print("Logged in user:", request.user.username)

    try:
        farmer = request.user.farmer

        print("Farmer found:", farmer)

        return JsonResponse({
            "id": request.user.id,
            "full_name": request.user.first_name,
            "email": request.user.email,
            "phone": farmer.phone,
            "state": farmer.state,
            "farm_size": farmer.farm_size,
        })

    except Farmer.DoesNotExist:

        print("No Farmer profile for:", request.user.username)

        return JsonResponse(
            {
                "error": "Farmer profile does not exist."
            },
            status=404,
        )
# ==========================================
# HTML Pages
# ==========================================
def login_page(request):
    return render(request, "login.html")


def register_page(request):
    return render(request, "register.html")