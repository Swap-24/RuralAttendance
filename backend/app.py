from flask import Flask, jsonify, render_template, redirect, url_for, request
from flask_cors import CORS

import face_recognition
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
import numpy as np
import bcrypt
from supabase import create_client, Client
import base64

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))  
TEMPLATES_DIR = os.path.join(BASE_DIR, "frontend", "templates")
STATIC_DIR = os.path.join(BASE_DIR, "frontend", "static")

app = Flask(__name__, template_folder=TEMPLATES_DIR, static_folder=STATIC_DIR)
CORS(app)

load_dotenv()

DATABASE_URL = os.getenv("DB_URL")
ANON_KEY = os.getenv("API_KEY")
SERVICE_ROLE_KEY = os.getenv("SERVICE_ROLE_KEY")

supabase = create_client(DATABASE_URL, SERVICE_ROLE_KEY)


@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "GET":
        return render_template("login.html")
    else:
        data = request.form
        email = data.get("email")
        password = data.get("password")
        response = supabase.table("users").select("*").eq("email", email).execute()
        if response.status_code == 200 and response.data:
            user = response.data[0]
            stored_hashed_password = user["password"].encode('utf-8')
            if bcrypt.checkpw(password.encode('utf-8'), stored_hashed_password):
                if user["userType"] == "student":
                    return redirect(url_for("student_view", user_id=user["id"]))
                elif user["userType"] == "teacher":
                    return redirect(url_for("teacher_view", user_id=user["id"]))
                else:
                    return "Invalid user type.", 400
            else:
                return "Incorrect password.", 401
        else:
            return "User not found.", 404


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "GET":
        return render_template("signup.html")

    data = request.form
    name = data.get("name")
    email = data.get("email")
    roll_number = data.get("roll_number")
    password = data.get("password")
    confirm_password = data.get("confirm_password")
    user_role = data.get("user_role")

    if password != confirm_password:
        return "Passwords do not match.", 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    file = request.files.get("image")
    if not file:
        return "Image file is required.", 400

    image = face_recognition.load_image_file(file)
    encodings = face_recognition.face_encodings(image)

    if not encodings:
        return "No face detected in the image.", 400

    face_encoding = encodings[0]

    # ✅ Convert to base64 string
    face_encoding_bytes = np.array(face_encoding, dtype=np.float64).tobytes()
    face_encoding_b64 = base64.b64encode(face_encoding_bytes).decode("utf-8")

    user = {
        "name": name,
        "email": email,
        "roll_number": roll_number,
        "password_hash": hashed_password,
        "role": user_role,
        "face_encoding": face_encoding_b64,  # ✅ safe for Supabase
    }

    response = supabase.table("users").insert(user).execute()

    if response.data:
        return redirect(url_for("home"))
    else:
        return "Error creating user.", 500

if __name__ == "__main__":
    app.run(debug=True)
