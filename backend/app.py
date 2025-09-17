from flask import Flask, jsonify, render_template, redirect, url_for
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy
import psycopg2
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

@app.route("/")
def home():
    return render_template("login.html")


if __name__ == "__main__":
    app.run(debug=True)