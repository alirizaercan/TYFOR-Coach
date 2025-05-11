from itsdangerous import URLSafeTimedSerializer as Serializer
from itsdangerous.exc import BadSignature, BadTimeSignature, SignatureExpired
from flask import request, jsonify
from functools import wraps
import os
from dotenv import load_dotenv

load_dotenv()

serializer = Serializer(
    secret_key=os.getenv('SECRET_KEY'),
    salt=os.getenv('SECURITY_PASSWORD_SALT', 'default_salt')
)

EXPIRATION_SECONDS = int(os.getenv('JWT_EXPIRATION', 86400))

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = serializer.loads(token, max_age=EXPIRATION_SECONDS)
            request.user_id = data['user_id']
            request.user_role = data['role']
        except SignatureExpired:
            return jsonify({'message': 'Token has expired!'}), 401
        except (BadSignature, BadTimeSignature):
            return jsonify({'message': 'Invalid token!'}), 401

        return f(*args, **kwargs)
    return decorated

def coach_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token_verify = token_required(lambda: None)()
        if isinstance(token_verify, tuple) and token_verify[1] != 200:
            return token_verify

        if request.user_role != 'coach':
            return jsonify({'message': 'Coach access required!'}), 403
        
        return f(*args, **kwargs)
    
    return decorated
