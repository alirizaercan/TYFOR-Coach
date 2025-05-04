import os
import jwt
from datetime import datetime, timedelta
from werkzeug.security import check_password_hash, generate_password_hash
from models.user import User
from utils.database import Database

class AuthService:
    def __init__(self):
        self.db = Database()
        self.session = self.db.connect()
    
    def __del__(self):
        if self.session:
            self.db.close(self.session)
    
    def login_user(self, username, password):
        user = self.session.query(User).filter(User.username == username).first()
        
        if not user:
            return None, "User not found"
        
        if not check_password_hash(user.password, password):
            # Update failed login attempts
            user.wrong_login_attempt += 1
            self.session.commit()
            return None, "Invalid password"
        
        # Update successful login info
        user.login_attempt += 1
        user.is_now_login = 'yes'
        user.wrong_login_attempt = 0  # Reset wrong attempts
        self.session.commit()
        
        # Generate JWT token
        token = self._generate_token(user)
        
        return {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'role': user.role,
            'club': user.club,
            'token': token
        }, "Login successful"
    
    def register_user(self, username, email, password, firstname=None, lastname=None, role=None, club=None):
        # Check if username or email already exists
        existing_user = self.session.query(User).filter(
            (User.username == username) | (User.email == email)
        ).first()
        
        if existing_user:
            if existing_user.username == username:
                return None, "Username already exists"
            return None, "Email already exists"
        
        # Create new user
        hashed_password = generate_password_hash(password)
        new_user = User(
            username=username,
            email=email,
            password=hashed_password,
            firstname=firstname,
            lastname=lastname,
            role=role,
            club=club
        )
        
        try:
            self.session.add(new_user)
            self.session.commit()
            
            # Generate JWT token for new user
            token = self._generate_token(new_user)
            
            return {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email,
                'firstname': new_user.firstname,
                'lastname': new_user.lastname,
                'role': new_user.role,
                'club': new_user.club,
                'token': token
            }, "Registration successful"
        except Exception as e:
            self.session.rollback()
            return None, str(e)
    
    def get_user_by_id(self, user_id):
        user = self.session.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        
        return {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'role': user.role,
            'club': user.club
        }
    
    def update_user(self, user_id, data):
        user = self.session.query(User).filter(User.id == user_id).first()
        if not user:
            return None, "User not found"
        
        # Update fields if provided
        if 'firstname' in data:
            user.firstname = data['firstname']
        if 'lastname' in data:
            user.lastname = data['lastname']
        if 'email' in data:
            # Check if email is unique
            if data['email'] != user.email:
                existing_email = self.session.query(User).filter(User.email == data['email']).first()
                if existing_email:
                    return None, "Email already exists"
            user.email = data['email']
        if 'role' in data:
            user.role = data['role']
        if 'club' in data:
            user.club = data['club']
        
        # Change password if provided
        if 'password' in data and data['password']:
            if 'current_password' not in data or not check_password_hash(user.password, data['current_password']):
                return None, "Current password is incorrect"
            user.old_password = user.password
            user.password = generate_password_hash(data['password'])
        
        try:
            self.session.commit()
            return {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'firstname': user.firstname,
                'lastname': user.lastname,
                'role': user.role,
                'club': user.club
            }, "User updated successfully"
        except Exception as e:
            self.session.rollback()
            return None, str(e)
    
    def logout_user(self, user_id):
        user = self.session.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        
        user.is_now_login = 'no'
        self.session.commit()
        return True
    
    def _generate_token(self, user):
        """Generate JWT token for authenticated user"""
        token_expiration = int(os.getenv('JWT_EXPIRATION', 86400))  # Default to 24 hours
        payload = {
            'user_id': user.id,
            'username': user.username,
            'role': user.role,
            'club': user.club,
            'exp': datetime.utcnow() + timedelta(seconds=token_expiration)
        }
        
        return jwt.encode(payload, os.getenv('SECRET_KEY'), algorithm="HS256")