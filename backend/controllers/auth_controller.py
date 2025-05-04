from flask import Blueprint, request, jsonify
from services.auth_service import AuthService
from middlewares.auth_middleware import token_required

auth_controller = Blueprint('auth', __name__)
auth_service = AuthService()

@auth_controller.route('/login', methods=['POST'])
def login():
    """Handle user login"""
    if not request.is_json:
        return jsonify({"message": "Missing JSON in request"}), 400
    
    data = request.get_json()
    
    # Validate required fields
    if not data.get('username') or not data.get('password'):
        return jsonify({"message": "Missing username or password"}), 400
    
    user, message = auth_service.login_user(data.get('username'), data.get('password'))
    
    if not user:
        return jsonify({"message": message}), 401
    
    return jsonify({
        "message": message,
        "user": user
    }), 200

@auth_controller.route('/register', methods=['POST'])
def register():
    """Handle user registration"""
    if not request.is_json:
        return jsonify({"message": "Missing JSON in request"}), 400
    
    data = request.get_json()
    
    # Validate required fields
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Missing required fields"}), 400
    
    user, message = auth_service.register_user(
        username=data.get('username'),
        email=data.get('email'),
        password=data.get('password'),
        firstname=data.get('firstname'),
        lastname=data.get('lastname'),
        role=data.get('role'),
        club=data.get('club')
    )
    
    if not user:
        return jsonify({"message": message}), 400
    
    return jsonify({
        "message": message,
        "user": user
    }), 201

@auth_controller.route('/profile', methods=['GET'])
@token_required
def get_profile():
    """Get user profile information"""
    user_id = request.user_id
    user = auth_service.get_user_by_id(user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    return jsonify({
        "message": "Profile retrieved successfully",
        "user": user
    }), 200

@auth_controller.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    """Update user profile information"""
    if not request.is_json:
        return jsonify({"message": "Missing JSON in request"}), 400
    
    user_id = request.user_id
    data = request.get_json()
    
    user, message = auth_service.update_user(user_id, data)
    
    if not user:
        return jsonify({"message": message}), 400
    
    return jsonify({
        "message": message,
        "user": user
    }), 200

@auth_controller.route('/logout', methods=['POST'])
@token_required
def logout():
    """Handle user logout"""
    user_id = request.user_id
    if auth_service.logout_user(user_id):
        return jsonify({"message": "Logged out successfully"}), 200
    
    return jsonify({"message": "Logout failed"}), 400

@auth_controller.route('/verify-token', methods=['GET'])
@token_required
def verify_token():
    """Verify if the token is valid"""
    user_id = request.user_id
    user = auth_service.get_user_by_id(user_id)
    
    if not user:
        return jsonify({"message": "Invalid token"}), 401
    
    return jsonify({
        "message": "Token is valid",
        "user": user
    }), 200