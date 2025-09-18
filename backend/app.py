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

    face_encoding_bytes = np.array(face_encoding, dtype=np.float64).tobytes()
    face_encoding_b64 = base64.b64encode(face_encoding_bytes).decode("utf-8")

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
        return redirect(url_for("login"))
    else:
        return "Error creating user.", 500
    
@app.route("/student_view", methods=["GET"])
def student_view():
    name  = session.get("name")
    return render_template("StudentView.html", name=name)
    

if __name__ == "__main__":
    app.run(debug=True)
