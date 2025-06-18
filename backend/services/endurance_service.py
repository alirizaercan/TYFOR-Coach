# backend/services/endurance_service.py
from datetime import datetime
from sqlalchemy import and_, func
from models.league import League
from models.football_team import FootballTeam
from models.footballer import Footballer
from models.endurance import Endurance
from models.user import User
from sqlalchemy.orm import Session

class EnduranceService:
    def __init__(self, session: Session):
        self.session = session

    def get_all_leagues(self):
        """Get all leagues available in the database."""
        leagues = self.session.query(League).all()
        return [{"league_id": league.league_id, "league_name": league.league_name, "league_logo_path": league.league_logo_path} for league in leagues]

    def get_teams_by_league(self, league_id, user_id=None):
        """Get all teams in a specific league that user can access."""
        if user_id:
            user = self.session.query(User).filter(User.id == user_id).first()
            if user and not user.is_admin and user.team_id:
                # Non-admin users can only see their assigned team
                teams = self.session.query(FootballTeam).filter(
                    and_(FootballTeam.league_id == league_id, FootballTeam.team_id == user.team_id)
                ).all()
            else:
                # Admin users can see all teams
                teams = self.session.query(FootballTeam).filter_by(league_id=league_id).all()
        else:
            teams = self.session.query(FootballTeam).filter_by(league_id=league_id).all()
          
        
        return [{"team_id": team.team_id, "team_name": team.team_name, "img_path": team.img_path} for team in teams]
      
    def get_footballers_by_team(self, team_id, user_id=None):
        """Get all footballers in a specific team that user can access."""
        print(f"DEBUG: get_footballers_by_team called with team_id={team_id}, user_id={user_id}")
        
        if user_id:
            user = self.session.query(User).filter(User.id == user_id).first()
            print(f"DEBUG: Found user: {user.id if user else None}, team_id: {user.team_id if user else None}, is_admin: {user.is_admin if user else None}")
            
            if user and not user.is_admin:
                try:
                    # Convert both to strings for comparison to avoid type issues
                    user_team_id = int(user.team_id) if user.team_id is not None else None
                    requested_team_id = int(team_id) if team_id is not None else None
                    
                    print(f"DEBUG: Comparing user_team_id={user_team_id} with requested_team_id={requested_team_id}")
                    
                    if user_team_id != requested_team_id:
                        # Non-admin users can only access their assigned team's footballers
                        print(f"DEBUG: Access denied - user team {user_team_id} != requested team {requested_team_id}")
                        return []
                except Exception as e:
                    print(f"DEBUG: Error comparing team_ids: {e}")
                    return []
        
        print(f"DEBUG: Querying footballers for team_id={team_id}")
        footballers = self.session.query(Footballer).filter_by(team_id=team_id).all()
        print(f"DEBUG: Found {len(footballers)} footballers")
        return [{
            "footballer_id": f.footballer_id, 
            "footballer_name": f.footballer_name, 
            "footballer_img_path": f.footballer_img_path, 
            "position": f.position,
            "nationality_img_path": f.nationality_img_path, 
            "birthday": f.birthday.strftime('%d %B %Y') if f.birthday else None,
            "age": f.age,
            "height": f.height,
            "trikot_num": f.trikot_num,
            "feet": f.feet,
            "market_value": f.market_value
        } for f in footballers]

    def can_access_entry(self, user_id, entry_id):
        """Check if user can access a specific endurance data entry."""
        user = self.session.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        
        # Admin users can access all entries
        if user.is_admin:
            return True
        
        # Get the endurance entry and check if it belongs to user's team
        entry = self.session.query(Endurance).filter(Endurance.id == entry_id).first()
        if not entry:
            return False
        
        # Get footballer's team
        footballer = self.session.query(Footballer).filter(Footballer.footballer_id == entry.footballer_id).first()
        if not footballer:
            return False
        
        # Check if user's team matches footballer's team
        return user.team_id == footballer.team_id

    def get_endurance_data(self, footballer_id, graph_type=None, start_date=None, end_date=None):
        """Get endurance data for a footballer within a date range."""
        query = self.session.query(Endurance).filter(Endurance.footballer_id == footballer_id)
        
        if start_date and end_date:
            query = query.filter(Endurance.created_at.between(start_date, end_date))
        
        # Order by date
        query = query.order_by(Endurance.created_at)
        
        results = query.all()
        
        # Convert to list of dictionaries
        formatted_results = []
        for result in results:
            formatted_result = {
                'id': result.id,
                'footballer_id': result.footballer_id,
                'running_distance': result.running_distance,
                'average_speed': result.average_speed,
                'heart_rate': result.heart_rate,
                'peak_heart_rate': result.peak_heart_rate,
                'training_intensity': result.training_intensity,
                'session': result.session,
                'created_at': result.created_at.strftime('%Y-%m-%d')
            }
            formatted_results.append(formatted_result)
        
        return formatted_results

    def get_endurance_entry_by_date(self, footballer_id, date):
        """Get endurance data for a footballer on a specific date."""
        # Convert date to datetime objects for the beginning and end of the day
        start_date = datetime.strptime(date, '%Y-%m-%d')
        end_date = datetime.strptime(date + ' 23:59:59', '%Y-%m-%d %H:%M:%S')
        
        endurance_entry = self.session.query(Endurance).filter(
            Endurance.footballer_id == footballer_id,
            Endurance.created_at.between(start_date, end_date)
        ).first()
        
        if endurance_entry:
            return {
                'id': endurance_entry.id,
                'footballer_id': endurance_entry.footballer_id,
                'running_distance': endurance_entry.running_distance,
                'average_speed': endurance_entry.average_speed,
                'heart_rate': endurance_entry.heart_rate,
                'peak_heart_rate': endurance_entry.peak_heart_rate,
                'training_intensity': endurance_entry.training_intensity,
                'session': endurance_entry.session,
                'created_at': endurance_entry.created_at.strftime('%Y-%m-%d')
            }
        
        return None

    def add_endurance_data(self, footballer_id, data):
        """Add new endurance data for a footballer."""
        try:
            # Check if entry already exists for today
            today = datetime.now().strftime('%Y-%m-%d')
            existing_entry = self.get_endurance_entry_by_date(footballer_id, today)
            
            if existing_entry:
                return None, "Endurance data already exists for today. Please use update instead."
            
            # Create new endurance entry
            new_entry = Endurance(
                footballer_id=footballer_id,
                running_distance=data.get('running_distance'),
                average_speed=data.get('average_speed'),
                heart_rate=data.get('heart_rate'),
                peak_heart_rate=data.get('peak_heart_rate'),
                training_intensity=data.get('training_intensity'),
                session=data.get('session')
            )
            
            self.session.add(new_entry)
            self.session.commit()
            
            return {
                'id': new_entry.id,
                'footballer_id': new_entry.footballer_id,
                'created_at': new_entry.created_at.strftime('%Y-%m-%d')
            }, "Endurance data added successfully"
            
        except Exception as e:
            self.session.rollback()
            return None, str(e)    
        
    def update_endurance_data(self, entry_id, data, user_id=None):
        """Update existing endurance data for a footballer."""
        try:
            entry = self.session.query(Endurance).filter(Endurance.id == entry_id).first()
            
            if not entry:
                return None, "Endurance data entry not found"
            
            # Check authorization if user_id is provided
            if user_id and not self.can_access_entry(user_id, entry_id):
                return None, "Access denied! You can only modify data for your assigned team."
            
            # Update fields if provided
            if 'running_distance' in data:
                entry.running_distance = data['running_distance']
            if 'average_speed' in data:
                entry.average_speed = data['average_speed']
            if 'heart_rate' in data:
                entry.heart_rate = data['heart_rate']
            if 'peak_heart_rate' in data:
                entry.peak_heart_rate = data['peak_heart_rate']
            if 'training_intensity' in data:
                entry.training_intensity = data['training_intensity']
            if 'session' in data:
                entry.session = data['session']
            
            # Update timestamp to track modifications
            entry.timestamp = datetime.utcnow()
            
            self.session.commit()
            return {
                'id': entry.id,
                'footballer_id': entry.footballer_id,
                'created_at': entry.created_at.strftime('%Y-%m-%d'),
                'updated_at': entry.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            }, "Endurance data updated successfully"
            
        except Exception as e:
            self.session.rollback()
            return None, str(e)

    def delete_endurance_data(self, entry_id, user_id=None):
        """Delete endurance data entry."""
        try:
            entry = self.session.query(Endurance).filter(Endurance.id == entry_id).first()
            
            if not entry:
                return False, "Endurance data entry not found"
            
            # Check authorization if user_id is provided
            if user_id and not self.can_access_entry(user_id, entry_id):
                return False, "Access denied! You can only delete data for your assigned team."
            
            self.session.delete(entry)
            self.session.commit()
            
            return True, "Endurance data deleted successfully"
            
        except Exception as e:
            self.session.rollback()
            return False, str(e)

    def get_endurance_history(self, footballer_id, limit=10):
        """Get endurance data history for a footballer."""
        entries = self.session.query(Endurance).filter(
            Endurance.footballer_id == footballer_id
        ).order_by(Endurance.created_at.desc()).limit(limit).all()
        
        return [{
            'id': entry.id,
            'footballer_id': entry.footballer_id,
            'running_distance': entry.running_distance,
            'average_speed': entry.average_speed,
            'heart_rate': entry.heart_rate,
            'peak_heart_rate': entry.peak_heart_rate,
            'training_intensity': entry.training_intensity,
            'session': entry.session,
            'created_at': entry.created_at.strftime('%Y-%m-%d')
        } for entry in entries]