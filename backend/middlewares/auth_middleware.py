# backend/middlewares/auth_middleware.py
import jwt
from flask import request, jsonify
from functools import wraps
import os
from dotenv import load_dotenv

load_dotenv()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check if token is in headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # Verify the token
            data = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=["HS256"])
            current_user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
        
        # Add user_id to the request
        request.user_id = current_user_id
        return f(*args, **kwargs)
    
    return decorated

def coach_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # First check if token is valid
        token_verify = token_required(lambda: None)()
        if isinstance(token_verify, tuple) and token_verify[1] != 200:
            return token_verify
        
        # Get user role from token
        token = request.headers['Authorization'].split(' ')[1]
        data = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=["HS256"])
        
        # Check if user is a coach
        if data['role'] != 'coach':
            return jsonify({'message': 'Coach access required!'}), 403
            
        return f(*args, **kwargs)
    
    return decorated