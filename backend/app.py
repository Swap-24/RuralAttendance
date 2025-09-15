from flask import Flask, jsonify
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy
import psycopg2
from dotenv import load_dotenv
import os
import numpy as np
import pandas as pd

import bcrypt

from sqlalchemy import create_engine

app = Flask(__name__)
CORS(app)

load_dotenv()

DATABASE_URL = os.getenv("DB_URL")


if __name__ == "__main__":
    app.run(debug=True)