# backend/services/endurance_service.py
from datetime import datetime
from sqlalchemy import and_, func
from models.league import League
from models.football_team import FootballTeam
from models.footballer import Footballer
from models.endurance import Endurance
from sqlalchemy.orm import Session

class EnduranceService:
    def __init__(self, session: Session):
        self.session = session

    def get_all_leagues(self):
        """Get all leagues available in the database."""
        leagues = self.session.query(League).all()
        return [{"league_id": league.league_id, "league_name": league.league_name, "league_logo_path": league.league_logo_path} for league in leagues]

    def get_teams_by_league(self, league_id):
        """Get all teams in a specific league."""
        teams = self.session.query(FootballTeam).filter_by(league_id=league_id).all()
        return [{"team_id": team.team_id, "team_name": team.team_name, "img_path": team.img_path} for team in teams]

    def get_footballers_by_team(self, team_id):
        """Get all footballers in a specific team."""
        footballers = self.session.query(Footballer).filter_by(team_id=team_id).all()
        return [{
            "footballer_id": f.footballer_id, 
            "footballer_name": f.footballer_name, 
            "footballer_img_path": f.footballer_img_path, 
            "position": f.position,
            "nationality_img_path": f.nationality_img_path, 
            "birthday": f.birthday.strftime('%d %B %Y') if f.birthday else None
        } for f in footballers]

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

    def update_endurance_data(self, entry_id, data):
        """Update existing endurance data for a footballer."""
        try:
            entry = self.session.query(Endurance).filter(Endurance.id == entry_id).first()
            
            if not entry:
                return None, "Endurance data entry not found"
            
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

    def delete_endurance_data(self, entry_id):
        """Delete endurance data entry."""
        try:
            entry = self.session.query(Endurance).filter(Endurance.id == entry_id).first()
            
            if not entry:
                return False, "Endurance data entry not found"
            
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