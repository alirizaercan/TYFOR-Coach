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
        club=data.get('club'),
        team_id=data.get('team_id'),
        access_key=data.get('access_key'),
        is_admin=data.get('is_admin', False),
        needs_password_change=data.get('needs_password_change', False)
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

@auth_controller.route('/profile/with-team', methods=['GET'])
@token_required
def get_profile_with_team():
    """Get user profile information with team details including logo"""
    user_id = request.user_id
    user = auth_service.get_user_with_team_info(user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    return jsonify({
        "message": "Profile with team info retrieved successfully",
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

@auth_controller.route('/debug/user-info', methods=['GET'])
@token_required
def debug_user_info():
    """Debug endpoint to check user information and permissions"""
    from utils.database import Database
    from services.authorization_service import AuthorizationService
    
    db = Database()
    session = db.connect()
    try:
        auth_service_obj = AuthorizationService(session)
        user = auth_service_obj.get_user_by_id(request.user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        # Get accessible teams
        accessible_teams = auth_service_obj.get_user_accessible_teams(request.user_id)
        
        debug_info = {
            "user_id": user.id,
            "username": user.username,
            "team_id": user.team_id,
            "is_admin": user.is_admin,
            "token_user_id": request.user_id,
            "token_team_id": getattr(request, 'user_team_id', None),
            "token_is_admin": getattr(request, 'is_admin', None),
            "accessible_teams": [{"team_id": team.team_id, "team_name": team.team_name} for team in accessible_teams]
        }
        
        return jsonify(debug_info), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close(session)