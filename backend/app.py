from flask import Flask, jsonify
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy
import psycopg2
from dotenv import load_dotenv
import os

import cv2
import face_recognition
import numpy as np
from PIL import Image

import bcrypt

from sqlalchemy import create_engine

app = Flask(__name__)
CORS(app)

load_dotenv()

DATABASE_URL = os.getenv("DB_URL")


try:
    engine = create_engine(DATABASE_URL)
    connection = engine.connect()
    print("✅ Connection successful!")
    connection.close()
except Exception as e:
    print("❌ Connection failed:", e)

@app.route("/ping")
def ping():
    return jsonify({"msg": "Backend is alive!"})

if __name__ == "__main__":
    app.run(debug=True)