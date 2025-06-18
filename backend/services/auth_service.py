import os
from itsdangerous import URLSafeTimedSerializer as Serializer
from datetime import datetime, timedelta
from werkzeug.security import check_password_hash, generate_password_hash
from models.user import User
from models.football_team import FootballTeam
from utils.database import Database

class AuthService:
    def __init__(self):
        self.db = Database()
        self.session = self.db.connect()
        self.secret_key = os.getenv('SECRET_KEY')
        self.salt = os.getenv('SECURITY_PASSWORD_SALT', 'default_salt')
        self.serializer = Serializer(self.secret_key, salt=self.salt)

    def __del__(self):
        if self.session:
            self.db.close(self.session)
    
    def login_user(self, username, password):
        user = self.session.query(User).filter(User.username == username).first()
        
        if not user:
            return None, "User not found"
        
        if not check_password_hash(user.password, password):
            user.wrong_login_attempt += 1
            self.session.commit()
            return None, "Invalid password"
        
        user.login_attempt += 1
        user.is_now_login = 'yes'
        user.wrong_login_attempt = 0
        self.session.commit()
        
        token = self._generate_token(user)
        
        return {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'role': user.role,
            'club': user.club,
            'team_id': user.team_id,
            'access_key': user.access_key,
            'is_admin': user.is_admin,
            'needs_password_change': user.needs_password_change,
            'token': token
        }, "Login successful"
    
    def register_user(self, username, email, password, firstname=None, lastname=None, 
                     role=None, club=None, team_id=None, access_key=None, 
                     is_admin=False, needs_password_change=False):
        existing_user = self.session.query(User).filter(
            (User.username == username) | (User.email == email)
        ).first()
        
        if existing_user:
            if existing_user.username == username:
                return None, "Username already exists"
            return None, "Email already exists"
        
        hashed_password = generate_password_hash(password)
        new_user = User(
            username=username,
            email=email,
            password=hashed_password,
            firstname=firstname,
            lastname=lastname,
            role=role,
            club=club,
            team_id=team_id,
            access_key=access_key,
            is_admin=is_admin,
            needs_password_change=needs_password_change
        )
        
        try:
            self.session.add(new_user)
            self.session.commit()
            
            token = self._generate_token(new_user)
            
            return {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email,
                'firstname': new_user.firstname,
                'lastname': new_user.lastname,
                'role': new_user.role,
                'club': new_user.club,
                'team_id': new_user.team_id,
                'access_key': new_user.access_key,
                'is_admin': new_user.is_admin,
                'needs_password_change': new_user.needs_password_change,
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
            'club': user.club,
            'team_id': user.team_id,
            'access_key': user.access_key,
            'is_admin': user.is_admin,
            'needs_password_change': user.needs_password_change
        }
    
    def get_user_with_team_info(self, user_id):
        """Get user data with team information including logo"""
        user = self.session.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        
        team_info = None
        if user.team_id:
            team = self.session.query(FootballTeam).filter(FootballTeam.team_id == user.team_id).first()
            if team:
                team_info = {
                    'team_id': team.team_id,
                    'team_name': team.team_name,
                    'league_name': team.league_name,
                    'img_path': team.img_path,
                    'team_info_link': team.team_info_link
                }
        
        return {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'role': user.role,
            'club': user.club,
            'team_id': user.team_id,
            'access_key': user.access_key,
            'is_admin': user.is_admin,
            'needs_password_change': user.needs_password_change,
            'team_info': team_info
        }
    
    def update_user(self, user_id, data):
        user = self.session.query(User).filter(User.id == user_id).first()
        if not user:
            return None, "User not found"
        
        if 'firstname' in data:
            user.firstname = data['firstname']
        if 'lastname' in data:
            user.lastname = data['lastname']
        if 'email' in data:
            if data['email'] != user.email:
                existing_email = self.session.query(User).filter(User.email == data['email']).first()
                if existing_email:
                    return None, "Email already exists"
            user.email = data['email']
        if 'role' in data:
            user.role = data['role']
        if 'club' in data:
            user.club = data['club']
        if 'team_id' in data:
            user.team_id = data['team_id']
        if 'access_key' in data:
            user.access_key = data['access_key']
        if 'is_admin' in data:
            user.is_admin = data['is_admin']
        if 'needs_password_change' in data:
            user.needs_password_change = data['needs_password_change']
        
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
                'club': user.club,
                'team_id': user.team_id,
                'access_key': user.access_key,
                'is_admin': user.is_admin,
                'needs_password_change': user.needs_password_change
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
        try:
            payload = {
                'user_id': user.id,
                'username': user.username,
                'role': user.role,
                'club': user.club,
                'team_id': user.team_id,
                'is_admin': user.is_admin
            }
            token = self.serializer.dumps(payload)
            return token
        except Exception as e:
            print(f"Token Generation Error: {str(e)}")
            raise
