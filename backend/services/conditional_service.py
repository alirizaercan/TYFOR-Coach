# backend/services/conditional_service.py
from datetime import datetime
from sqlalchemy import and_, func
from models.league import League
from models.football_team import FootballTeam
from models.footballer import Footballer
from models.conditional import Conditional
from sqlalchemy.orm import Session

class ConditionalService:
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

    def get_conditional_data(self, footballer_id, graph_type=None, start_date=None, end_date=None):
        """Get conditional data for a footballer within a date range."""
        query = self.session.query(Conditional).filter(Conditional.footballer_id == footballer_id)
        
        if start_date and end_date:
            query = query.filter(Conditional.created_at.between(start_date, end_date))
        
        # Order by date
        query = query.order_by(Conditional.created_at)
        
        results = query.all()
        
        # Convert to list of dictionaries
        formatted_results = []
        for result in results:
            formatted_result = {
                'id': result.id,
                'footballer_id': result.footballer_id,
                'vo2_max': result.vo2_max,
                'lactate_levels': result.lactate_levels,
                'training_intensity': result.training_intensity,
                'recovery_times': result.recovery_times,
                'current_vo2_max': result.current_vo2_max,
                'current_lactate_levels': result.current_lactate_levels,
                'current_muscle_strength': result.current_muscle_strength,
                'target_vo2_max': result.target_vo2_max,
                'target_lactate_level': result.target_lactate_level,
                'target_muscle_strength': result.target_muscle_strength,
                'created_at': result.created_at.strftime('%Y-%m-%d')
            }
            formatted_results.append(formatted_result)
        
        return formatted_results

    def get_conditional_entry_by_date(self, footballer_id, date):
        """Get conditional data for a footballer on a specific date."""
        # Convert date to datetime objects for the beginning and end of the day
        start_date = datetime.strptime(date, '%Y-%m-%d')
        end_date = datetime.strptime(date + ' 23:59:59', '%Y-%m-%d %H:%M:%S')
        
        conditional_entry = self.session.query(Conditional).filter(
            Conditional.footballer_id == footballer_id,
            Conditional.created_at.between(start_date, end_date)
        ).first()
        
        if conditional_entry:
            return {
                'id': conditional_entry.id,
                'footballer_id': conditional_entry.footballer_id,
                'vo2_max': conditional_entry.vo2_max,
                'lactate_levels': conditional_entry.lactate_levels,
                'training_intensity': conditional_entry.training_intensity,
                'recovery_times': conditional_entry.recovery_times,
                'current_vo2_max': conditional_entry.current_vo2_max,
                'current_lactate_levels': conditional_entry.current_lactate_levels,
                'current_muscle_strength': conditional_entry.current_muscle_strength,
                'target_vo2_max': conditional_entry.target_vo2_max,
                'target_lactate_level': conditional_entry.target_lactate_level,
                'target_muscle_strength': conditional_entry.target_muscle_strength,
                'created_at': conditional_entry.created_at.strftime('%Y-%m-%d')
            }
        
        return None

    def add_conditional_data(self, footballer_id, data):
        """Add new conditional data for a footballer."""
        try:
            # Check if entry already exists for today
            today = datetime.now().strftime('%Y-%m-%d')
            existing_entry = self.get_conditional_entry_by_date(footballer_id, today)
            
            if existing_entry:
                return None, "Conditional data already exists for today. Please use update instead."
            
            # Create new conditional entry
            new_entry = Conditional(
                footballer_id=footballer_id,
                vo2_max=data.get('vo2_max'),
                lactate_levels=data.get('lactate_levels'),
                training_intensity=data.get('training_intensity'),
                recovery_times=data.get('recovery_times'),
                current_vo2_max=data.get('current_vo2_max'),
                current_lactate_levels=data.get('current_lactate_levels'),
                current_muscle_strength=data.get('current_muscle_strength'),
                target_vo2_max=data.get('target_vo2_max'),
                target_lactate_level=data.get('target_lactate_level'),
                target_muscle_strength=data.get('target_muscle_strength'),
            )
            
            self.session.add(new_entry)
            self.session.commit()
            
            return {
                'id': new_entry.id,
                'footballer_id': new_entry.footballer_id,
                'created_at': new_entry.created_at.strftime('%Y-%m-%d')
            }, "Conditional data added successfully"
            
        except Exception as e:
            self.session.rollback()
            return None, str(e)

    def update_conditional_data(self, entry_id, data):
        """Update existing conditional data for a footballer."""
        try:
            entry = self.session.query(Conditional).filter(Conditional.id == entry_id).first()
            
            if not entry:
                return None, "Conditional data entry not found"
            
            # Update fields if provided
            if 'vo2_max' in data:
                entry.vo2_max = data['vo2_max']
            if 'lactate_levels' in data:
                entry.lactate_levels = data['lactate_levels']
            if 'training_intensity' in data:
                entry.training_intensity = data['training_intensity']
            if 'recovery_times' in data:
                entry.recovery_times = data['recovery_times']
            if 'current_vo2_max' in data:
                entry.current_vo2_max = data['current_vo2_max']
            if 'current_lactate_levels' in data:
                entry.current_lactate_levels = data['current_lactate_levels']
            if 'current_muscle_strength' in data:
                entry.current_muscle_strength = data['current_muscle_strength']
            if 'target_vo2_max' in data:
                entry.target_vo2_max = data['target_vo2_max']
            if 'target_lactate_level' in data:
                entry.target_lactate_level = data['target_lactate_level']
            if 'target_muscle_strength' in data:
                entry.target_muscle_strength = data['target_muscle_strength']
            
            # Update timestamp to track modifications
            entry.timestamp = datetime.utcnow()
            
            self.session.commit()
            
            return {
                'id': entry.id,
                'footballer_id': entry.footballer_id,
                'created_at': entry.created_at.strftime('%Y-%m-%d'),
                'updated_at': entry.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            }, "Conditional data updated successfully"
            
        except Exception as e:
            self.session.rollback()
            return None, str(e)

    def delete_conditional_data(self, entry_id):
        """Delete conditional data entry."""
        try:
            entry = self.session.query(Conditional).filter(Conditional.id == entry_id).first()
            
            if not entry:
                return False, "Conditional data entry not found"
            
            self.session.delete(entry)
            self.session.commit()
            
            return True, "Conditional data deleted successfully"
            
        except Exception as e:
            self.session.rollback()
            return False, str(e)

    def get_conditional_history(self, footballer_id, limit=10):
        """Get conditional data history for a footballer."""
        entries = self.session.query(Conditional).filter(
            Conditional.footballer_id == footballer_id
        ).order_by(Conditional.created_at.desc()).limit(limit).all()
        
        return [{
            'id': entry.id,
            'footballer_id': entry.footballer_id,
            'vo2_max': entry.vo2_max,
            'lactate_levels': entry.lactate_levels,
            'training_intensity': entry.training_intensity,
            'recovery_times': entry.recovery_times,
            'current_vo2_max': entry.current_vo2_max,
            'current_lactate_levels': entry.current_lactate_levels,
            'current_muscle_strength': entry.current_muscle_strength,
            'target_vo2_max': entry.target_vo2_max,
            'target_lactate_level': entry.target_lactate_level,
            'target_muscle_strength': entry.target_muscle_strength,
            'created_at': entry.created_at.strftime('%Y-%m-%d')
        } for entry in entries]