from flask import Flask, jsonify, render_template, redirect, url_for, request , session
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
app.secret_key = "ABCD1234"

load_dotenv()

DATABASE_URL = os.getenv("DB_URL")
ANON_KEY = os.getenv("API_KEY")
SERVICE_ROLE_KEY = os.getenv("SERVICE_ROLE_KEY")

supabase = create_client(DATABASE_URL, SERVICE_ROLE_KEY)


from flask import jsonify, request, render_template

@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("login.html")
    else:
        data = request.get_json()
        rollno = data.get("rollno")
        password = data.get("password")
        session["rollno"] = rollno

        response = supabase.table("users").select("*").eq("roll_number", rollno).execute()
        

        if not response.data:
            return jsonify({"message": "User not found."}), 404

        user = response.data[0]
        session["name"] = user["name"]
        stored_hashed_password = user["password_hash"].encode('utf-8')

        if not bcrypt.checkpw(password.encode('utf-8'), stored_hashed_password):
            return jsonify({"message": "Incorrect password."}), 401

        if user["role"] == "student":
            redirect(url_for("student_view"))
            return jsonify({"message": "Login Successful!", "role": "student"}), 200

        elif user["role"] == "teacher":
            return jsonify({"message": "Login Successful!", "role": "teacher"}), 200
        else:
            return jsonify({"message": "Invalid user type."}), 400



@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "GET":
        return render_template("signup.html")

    data = request.form
    name = data.get("name")
    email = data.get("email")
    roll_number = data.get("roll_number")
    grade = data.get("grade")
    password = data.get("password")
    confirm_password = data.get("confirm_password")
    user_role = data.get("user_role")

    # Password check
    if password != confirm_password:
        return jsonify({"field": "confirm_password", "message": "Passwords do not match."}), 400

    # Check if email already exists
    existing_email = supabase.table("users").select("email").eq("email", email).execute()
    if existing_email.data:
        return jsonify({"field": "email", "message": "Email already exists."}), 400

    # Check if roll number already exists
    existing_roll = supabase.table("users").select("roll_number").eq("roll_number", roll_number).execute()
    if existing_roll.data:
        return jsonify({"field": "roll_number", "message": "Roll number already exists."}), 400

    # Required field checks
    required_fields = {"name": name, "grade": grade, "user_role": user_role}
    for field, value in required_fields.items():
        if not value:
            return jsonify({"field": field, "message": f"{field.replace('_',' ').title()} is required."}), 400

    # Image handling
    file = request.files.get("image")
    if not file:
        return jsonify({"field": "image", "message": "Profile image is required."}), 400

    image = face_recognition.load_image_file(file)
    encodings = face_recognition.face_encodings(image)
    if not encodings:
        return jsonify({"field": "image", "message": "No face detected in the image."}), 400

    face_encoding = encodings[0]
    face_encoding_bytes = np.array(face_encoding, dtype=np.float64).tobytes()
    face_encoding_b64 = base64.b64encode(face_encoding_bytes).decode("utf-8")

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    user = {
        "name": name,
        "email": email,
        "roll_number": roll_number,
        "password_hash": hashed_password,
        "role": user_role,
        "face_encoding": face_encoding_b64,
        "grade": grade
    }

    response = supabase.table("users").insert(user).execute()
    if response.data:
        return jsonify({"field": "success", "redirect": url_for("/")}), 200
    else:
        return jsonify({"field": "submit", "message": "Error creating user."}), 500
    

if __name__ == "__main__":
    app.run(debug=True)
