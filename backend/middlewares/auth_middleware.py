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
            request.user_team_id = data.get('team_id')
            request.is_admin = data.get('is_admin', False)
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

def team_access_required(f):
    """Decorator to check if user has access to the requested team."""
    @wraps(f)
    def decorated(*args, **kwargs):
        from utils.database import Database
        from services.authorization_service import AuthorizationService
        
        # URL'den team_id'yi al (Flask URL parametresi)
        team_id = request.view_args.get('team_id')
        
        if not team_id:
            return jsonify({'error': 'Team ID is required'}), 400
            
        try:
            # team_id'yi integer'a çevir (User.team_id Integer tipinde)
            team_id_int = int(team_id)
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid team ID format. Must be an integer.'}), 400
            
        # Authorization check
        db = Database()
        session = db.connect()
        try:
            auth_service = AuthorizationService(session)
            user_id = getattr(request, 'user_id', None)
            
            if not user_id:
                return jsonify({'message': 'User not authenticated!'}), 401
                
            # User.team_id ile karşılaştırma yap
            can_access = auth_service.can_access_team(user_id, team_id_int)
            if not can_access:
                # Daha detaylı hata mesajı için user bilgisini al
                user = auth_service.get_user_by_id(user_id)
                user_team_id = user.team_id if user else None
                return jsonify({
                    'message': 'Access denied! You can only access your assigned team.',
                    'user_team_id': user_team_id,
                    'requested_team_id': team_id_int
                }), 403
                
        except Exception as e:
            import traceback
            return jsonify({
                'error': f'Authorization error: {str(e)}',
                'traceback': traceback.format_exc()
            }), 500
        finally:
            db.close(session)
            
        return f(*args, **kwargs)
    return decorated

def footballer_access_required(f):
    """Decorator to check if user has access to the requested footballer."""
    @wraps(f)
    def decorated(*args, **kwargs):
        from utils.database import Database
        from services.authorization_service import AuthorizationService
        
        # Get footballer_id from URL parameters or request data
        footballer_id = kwargs.get('footballer_id') or request.json.get('footballer_id') if request.json else None
        
        if not footballer_id:
            return jsonify({'message': 'Footballer ID is required!'}), 400
        
        # Check authorization
        db = Database()
        session = db.connect()
        try:
            auth_service = AuthorizationService(session)
            if not auth_service.can_access_footballer(request.user_id, int(footballer_id)):
                return jsonify({'message': 'Access denied! You can only access footballers from your assigned team.'}), 403
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            db.close(session)
        
        return f(*args, **kwargs)
    
    return decorated
