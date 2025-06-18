# backend/services/conditional_service.py
from datetime import datetime
from sqlalchemy import and_, func
from models.league import League
from models.football_team import FootballTeam
from models.footballer import Footballer
from models.conditional import Conditional
from models.user import User
from sqlalchemy.orm import Session

class ConditionalService:
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
        try:
            # First convert team_id to integer for consistency
            try:
                team_id_int = int(team_id)
            except (ValueError, TypeError):
                print(f"Invalid team_id format: {team_id}")
                return []

            # Check user permissions if user_id is provided
            if user_id:
                user = self.session.query(User).filter(User.id == user_id).first()
                if user and not user.is_admin:
                    # Handle case where user has no team assigned
                    if user.team_id is None:
                        print(f"User {user_id} has no team assigned")
                        return []
                    
                    # Convert user's team_id to integer
                    try:
                        user_team_id = int(user.team_id)
                    except (ValueError, TypeError):
                        print(f"Invalid user.team_id format: {user.team_id}")
                        return []
                    
                    # Verify team access
                    if user_team_id != team_id_int:
                        print(f"Access denied: User team {user_team_id} != Requested team {team_id_int}")
                        return []

            # Query footballers
            footballers = self.session.query(Footballer).filter_by(team_id=team_id_int).all()
            
            print(f"Found {len(footballers)} footballers for team {team_id_int}")
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
            
        except Exception as e:
            print(f"Error in get_footballers_by_team: {str(e)}")
            import traceback
            print(traceback.format_exc())
            return []

    def can_access_entry(self, user_id, entry_id):
        """Check if user can access a specific conditional data entry."""
        user = self.session.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        
        # Admin users can access all entries
        if user.is_admin:
            return True
        
        # Get the conditional entry and check if it belongs to user's team
        entry = self.session.query(Conditional).filter(Conditional.id == entry_id).first()
        if not entry:
            return False
        
        # Get footballer's team
        footballer = self.session.query(Footballer).filter(Footballer.footballer_id == entry.footballer_id).first()
        if not footballer:
            return False
        
        # Check if user's team matches footballer's team
        return user.team_id == footballer.team_id

    def get_conditional_data(self, footballer_id, graph_type=None, start_date=None, end_date=None):
        """Get conditional data for a footballer within a date range."""
        try:
            query = self.session.query(Conditional).filter(Conditional.footballer_id == footballer_id)
            
            if start_date and end_date:
                # Parse dates if they are strings
                if isinstance(start_date, str):
                    start_date = datetime.strptime(start_date, '%Y-%m-%d')
                if isinstance(end_date, str):
                    end_date = datetime.strptime(end_date, '%Y-%m-%d')
                    
                query = query.filter(Conditional.created_at.between(start_date, end_date))
            
            # Order by date
            query = query.order_by(Conditional.created_at)
            
            results = query.all()
            
            # Convert to list of dictionaries
            formatted_results = []
            for result in results:
                try:
                    formatted_result = {
                        'id': result.id,
                        'footballer_id': result.footballer_id,
                        'vo2_max': float(result.vo2_max) if result.vo2_max is not None else 0.0,
                        'lactate_levels': float(result.lactate_levels) if result.lactate_levels is not None else 0.0,
                        'training_intensity': float(result.training_intensity) if result.training_intensity is not None else 0.0,
                        'recovery_times': float(result.recovery_times) if result.recovery_times is not None else 0.0,
                        'current_vo2_max': float(result.current_vo2_max) if result.current_vo2_max is not None else 0.0,
                        'current_lactate_levels': float(result.current_lactate_levels) if result.current_lactate_levels is not None else 0.0,
                        'current_muscle_strength': float(result.current_muscle_strength) if result.current_muscle_strength is not None else 0.0,
                        'target_vo2_max': float(result.target_vo2_max) if result.target_vo2_max is not None else 0.0,
                        'target_lactate_level': float(result.target_lactate_level) if result.target_lactate_level is not None else 0.0,
                        'target_muscle_strength': float(result.target_muscle_strength) if result.target_muscle_strength is not None else 0.0,
                        'created_at': result.created_at if hasattr(result, 'created_at') and result.created_at else datetime.now()
                    }
                    formatted_results.append(formatted_result)
                except Exception as e:
                    print(f"Error formatting result: {str(e)}")
                    # Skip problematic entries
                    continue
            
            return formatted_results
            
        except Exception as e:
            print(f"Error in get_conditional_data: {str(e)}")
            return []

    def get_conditional_entry_by_date(self, footballer_id, date):
        """Get conditional data for a footballer on a specific date."""
        try:
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
                    'created_at': conditional_entry.created_at.strftime('%Y-%m-%d') if conditional_entry.created_at else datetime.now().strftime('%Y-%m-%d')
                }
            
            return None
            
        except Exception as e:
            print(f"Error in get_conditional_entry_by_date: {str(e)}")
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
                'created_at': new_entry.created_at.strftime('%Y-%m-%d') if new_entry.created_at else datetime.now().strftime('%Y-%m-%d')
            }, "Conditional data added successfully"
            
        except Exception as e:
            self.session.rollback()
            print(f"Error in add_conditional_data: {str(e)}")
            return None, str(e)    
        
    def update_conditional_data(self, entry_id, data, user_id=None):
        """Update existing conditional data for a footballer."""
        try:
            entry = self.session.query(Conditional).filter(Conditional.id == entry_id).first()
            
            if not entry:
                return None, "Conditional data entry not found"
            
            # Check authorization if user_id is provided
            if user_id and not self.can_access_entry(user_id, entry_id):
                return None, "Access denied! You can only modify data for your assigned team."
            
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
            if hasattr(entry, 'timestamp'):
                entry.timestamp = datetime.utcnow()
            
            self.session.commit()
            
            return {
                'id': entry.id,
                'footballer_id': entry.footballer_id,
                'created_at': entry.created_at.strftime('%Y-%m-%d') if entry.created_at else datetime.now().strftime('%Y-%m-%d'),
                'updated_at': entry.timestamp.strftime('%Y-%m-%d %H:%M:%S') if hasattr(entry, 'timestamp') and entry.timestamp else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }, "Conditional data updated successfully"
            
        except Exception as e:
            self.session.rollback()
            print(f"Error in update_conditional_data: {str(e)}")
            return None, str(e)    
        
    def delete_conditional_data(self, entry_id, user_id=None):
        """Delete conditional data entry."""
        try:
            entry = self.session.query(Conditional).filter(Conditional.id == entry_id).first()
            
            if not entry:
                return False, "Conditional data entry not found"
            
            # Check authorization if user_id is provided
            if user_id and not self.can_access_entry(user_id, entry_id):
                return False, "Access denied! You can only delete data for your assigned team."
            
            self.session.delete(entry)
            self.session.commit()
            
            return True, "Conditional data deleted successfully"
            
        except Exception as e:
            self.session.rollback()
            print(f"Error in delete_conditional_data: {str(e)}")
            return False, str(e)

    def get_conditional_history(self, footballer_id, limit=10):
        """Get conditional data history for a footballer."""
        try:
            entries = self.session.query(Conditional).filter(
                Conditional.footballer_id == footballer_id
            ).order_by(Conditional.created_at.desc()).limit(limit).all()
            
            result = []
            for entry in entries:
                try:
                    result.append({
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
                        'created_at': entry.created_at.strftime('%Y-%m-%d') if entry.created_at else datetime.now().strftime('%Y-%m-%d')
                    })
                except Exception as e:
                    print(f"Error formatting history entry: {str(e)}")
                    continue
            
            return result
            
        except Exception as e:
            print(f"Error in get_conditional_history: {str(e)}")
            return []