# app.py
from flask import Flask, request, jsonify
import os
import sqlite3
from werkzeug.security import generate_password_hash
import secrets
from flask_cors import CORS  # Import Flask-CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})

# Database setup
DATABASE = 'users.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    return conn

def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                salt TEXT NOT NULL
            )
        ''')
        db.commit()

# Initialize the database
init_db()

# Generate a secure random salt
def generate_salt():
    return secrets.token_hex(16)

@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    password = data.get('password') #Jwt token  

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    salt = generate_salt()
    hashed_password = generate_password_hash(password + salt)

    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('INSERT INTO users (username, password, salt) VALUES (?, ?, ?)',
                       (username, hashed_password, salt))
        db.commit()
        return jsonify({'salt': salt}), 200
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username already exists'}), 400

if __name__ == '__main__':
    app.run(debug=True)
