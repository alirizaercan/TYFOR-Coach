# backend/services/authorization_service.py
from models.user import User
from models.football_team import FootballTeam
from models.footballer import Footballer
from sqlalchemy.orm import Session

class AuthorizationService:
    def __init__(self, session: Session):
        self.session = session    
        
    def get_user_by_id(self, user_id):
        """Get user by ID."""
        return self.session.query(User).filter(User.id == user_id).first()
        
    def can_access_team(self, user_id, team_id):
        """Check if user can access a specific team."""
        print(f"DEBUG: can_access_team called with user_id={user_id}, team_id={team_id}")
        
        user = self.get_user_by_id(user_id)
        if not user:
            print(f"DEBUG: User {user_id} not found")
            return False
        
        print(f"DEBUG: User found: id={user.id}, team_id={user.team_id}, is_admin={user.is_admin}")
        
        # Admin users can access all teams
        if user.is_admin:
            print(f"DEBUG: User is admin, access granted")
            return True
        
        # Regular users can only access their assigned team
        try:
            # Convert both to strings for comparison to avoid type issues
            user_team_id = int(user.team_id) if user.team_id is not None else None
            requested_team_id = int(team_id) if team_id is not None else None
            
            result = user_team_id == requested_team_id
            print(f"DEBUG: Regular user access check: {user_team_id} == {requested_team_id} = {result}")
            return result
        except Exception as e:
            print(f"DEBUG: Error comparing team_ids: {e}")
            return False

    def can_access_footballer(self, user_id, footballer_id):
        """Check if user can access a specific footballer."""
        user = self.get_user_by_id(user_id)
        if not user:
            return False
        
        # Admin users can access all footballers
        if user.is_admin:
            return True
        
        # Get footballer's team
        footballer = self.session.query(Footballer).filter(Footballer.footballer_id == footballer_id).first()
        if not footballer:
            return False
        
        # Check if user's team matches footballer's team
        return user.team_id == footballer.team_id

    def get_user_accessible_teams(self, user_id):
        """Get all teams that user can access."""
        user = self.get_user_by_id(user_id)
        if not user:
            return []
        
        # Admin users can access all teams
        if user.is_admin:
            return self.session.query(FootballTeam).all()
        
        # Regular users can only access their assigned team
        if user.team_id:
            team = self.session.query(FootballTeam).filter(FootballTeam.team_id == user.team_id).first()
            return [team] if team else []
        
        return []

    def get_user_accessible_footballers(self, user_id):
        """Get all footballers that user can access."""
        user = self.get_user_by_id(user_id)
        if not user:
            return []
        
        # Admin users can access all footballers
        if user.is_admin:
            return self.session.query(Footballer).all()
        
        # Regular users can only access footballers from their assigned team
        if user.team_id:
            return self.session.query(Footballer).filter(Footballer.team_id == user.team_id).all()
        
        return []