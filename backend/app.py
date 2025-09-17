from flask import Flask, jsonify, render_template, redirect, url_for, request
from flask_cors import CORS

import face_recognition

from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
import numpy as np
import pandas as pd

import bcrypt

from sqlalchemy import create_engine

from supabase import create_client, Client

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
    else:
        data = request.form
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        userType = data.get("userType")
        file = request.files.get("image")
        if file:
            image = face_recognition.load_image_file(file)
            encodings = face_recognition.face_encodings(image)
            if encodings:
                encoding = encodings[0]
                encoding_list = encoding.tolist()
                user = {
                    "username": username,
                    "email": email,
                    "password": hashed_password.decode('utf-8'),
                    "userType": userType,
                    "face_encoding": encoding_list
                }
                response = supabase.table("users").insert(user).execute()
                if response.status_code == 201:
                    return redirect(url_for("home"))
                else:
                    return "Error creating user.", 500
            else:
                return "No face detected in the image.", 400
        else:
            return "Image file is required.", 400
        

        


       

if __name__ == "__main__":
    app.run(debug=True)