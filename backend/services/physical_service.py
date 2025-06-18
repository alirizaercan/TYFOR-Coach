# backend/services/physical_service.py
from datetime import datetime
from sqlalchemy import and_, func
from models.league import League
from models.football_team import FootballTeam
from models.footballer import Footballer
from models.physical import Physical
from models.user import User
from sqlalchemy.orm import Session

class PhysicalService:
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
        if user_id:
            user = self.session.query(User).filter(User.id == user_id).first()
            if user and not user.is_admin:
                try:
                    # Convert both to strings for comparison to avoid type issues
                    user_team_id = int(user.team_id) if user.team_id is not None else None
                    requested_team_id = int(team_id) if team_id is not None else None
                    
                    if user_team_id != requested_team_id:
                        # Non-admin users can only access their assigned team's footballers
                        return []
                except Exception:
                    return []
        footballers = self.session.query(Footballer).filter_by(team_id=team_id).all()
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

    def get_physical_data(self, footballer_id, graph_type=None, start_date=None, end_date=None):
        """Get physical data for a footballer within a date range."""
        query = self.session.query(Physical).filter(Physical.footballer_id == footballer_id)
        
        if start_date and end_date:
            query = query.filter(Physical.created_at.between(start_date, end_date))
        
        # Order by date
        query = query.order_by(Physical.created_at)
        
        results = query.all()
        
        # Convert to list of dictionaries
        formatted_results = []
        for result in results:
            formatted_result = {
                'id': result.id,
                'footballer_id': result.footballer_id,
                'muscle_mass': result.muscle_mass,
                'muscle_strength': result.muscle_strength,
                'muscle_endurance': result.muscle_endurance,
                'flexibility': result.flexibility,
                'weight': result.weight,
                'body_fat_percentage': result.body_fat_percentage,
                'heights': result.heights,
                'thigh_circumference': result.thigh_circumference,
                'shoulder_circumference': result.shoulder_circumference,
                'arm_circumference': result.arm_circumference,
                'chest_circumference': result.chest_circumference,
                'back_circumference': result.back_circumference,
                'waist_circumference': result.waist_circumference,
                'leg_circumference': result.leg_circumference,
                'calf_circumference': result.calf_circumference,
                'created_at': result.created_at.strftime('%Y-%m-%d')
            }
            formatted_results.append(formatted_result)
        
        return formatted_results

    def get_physical_entry_by_date(self, footballer_id, date):
        """Get physical data for a footballer on a specific date."""
        try:
            # Convert date string to datetime objects for the beginning and end of the day
            start_date = datetime.strptime(f"{date} 00:00:00", '%Y-%m-%d %H:%M:%S')
            end_date = datetime.strptime(f"{date} 23:59:59", '%Y-%m-%d %H:%M:%S')
            
            physical_entry = self.session.query(Physical).filter(
                and_(
                    Physical.footballer_id == footballer_id,
                    Physical.created_at >= start_date,
                    Physical.created_at <= end_date
                )
            ).first()
            
            if physical_entry:
                return {
                    'id': physical_entry.id,
                    'footballer_id': physical_entry.footballer_id,
                    'muscle_mass': physical_entry.muscle_mass,
                    'muscle_strength': physical_entry.muscle_strength,
                    'muscle_endurance': physical_entry.muscle_endurance,
                    'flexibility': physical_entry.flexibility,
                    'weight': physical_entry.weight,
                    'body_fat_percentage': physical_entry.body_fat_percentage,
                    'heights': physical_entry.heights,
                    'thigh_circumference': physical_entry.thigh_circumference,
                    'shoulder_circumference': physical_entry.shoulder_circumference,
                    'arm_circumference': physical_entry.arm_circumference,
                    'chest_circumference': physical_entry.chest_circumference,
                    'back_circumference': physical_entry.back_circumference,
                    'waist_circumference': physical_entry.waist_circumference,
                    'leg_circumference': physical_entry.leg_circumference,
                    'calf_circumference': physical_entry.calf_circumference,
                    'created_at': physical_entry.created_at.strftime('%Y-%m-%d')
                }
            
            # Veri bulunamazsa boş bir veri seti döndür
            return {
                'id': None,
                'footballer_id': footballer_id,
                'muscle_mass': None,
                'muscle_strength': None,
                'muscle_endurance': None,
                'flexibility': None,
                'weight': None,
                'body_fat_percentage': None,
                'heights': None,
                'thigh_circumference': None,
                'shoulder_circumference': None,
                'arm_circumference': None,
                'chest_circumference': None,
                'back_circumference': None,
                'waist_circumference': None,
                'leg_circumference': None,
                'calf_circumference': None,
                'created_at': date
            }
            
        except Exception as e:
            print(f"Error in get_physical_entry_by_date: {str(e)}")
            return None

    def add_physical_data(self, footballer_id, data):
        try:
            selected_date = data.get('created_at', datetime.now().strftime('%Y-%m-%d'))
            
            # Seçilen tarih için kontrol yap
            existing_entry = self.get_physical_entry_by_date(footballer_id, selected_date)
            
            if existing_entry:
                return None, "Bu tarih için zaten veri mevcut"

            new_entry = Physical(
                footballer_id=footballer_id,
                created_at=datetime.strptime(selected_date, '%Y-%m-%d'),
                muscle_mass=data.get('muscle_mass'),
                muscle_strength=data.get('muscle_strength'),
                muscle_endurance=data.get('muscle_endurance'),
                flexibility=data.get('flexibility'),
                weight=data.get('weight'),
                body_fat_percentage=data.get('body_fat_percentage'),
                heights=data.get('heights'),
                thigh_circumference=data.get('thigh_circumference'),
                shoulder_circumference=data.get('shoulder_circumference'),
                arm_circumference=data.get('arm_circumference'),
                chest_circumference=data.get('chest_circumference'),
                back_circumference=data.get('back_circumference'),
                waist_circumference=data.get('waist_circumference'),
                leg_circumference=data.get('leg_circumference'),
                calf_circumference=data.get('calf_circumference')
            )
            
            self.session.add(new_entry)
            self.session.commit()
            
            return {
                'id': new_entry.id,
                'footballer_id': new_entry.footballer_id,
                'created_at': new_entry.created_at.strftime('%Y-%m-%d')
            }, "Physical data added successfully"
            
        except Exception as e:
            self.session.rollback()
        return None, str(e)    
    def update_physical_data(self, entry_id, data, user_id=None):
        """Update existing physical data for a footballer."""
        try:
            entry = self.session.query(Physical).filter(Physical.id == entry_id).first()
            
            if not entry:
                return None, "Physical data entry not found"
            
            # Check authorization if user_id is provided
            if user_id and not self.can_access_entry(user_id, entry_id):
                return None, "Access denied! You can only modify data for your assigned team."
            
            # Update fields if provided
            if 'muscle_mass' in data:
                entry.muscle_mass = data['muscle_mass']
            if 'muscle_strength' in data:
                entry.muscle_strength = data['muscle_strength']
            if 'muscle_endurance' in data:
                entry.muscle_endurance = data['muscle_endurance']
            if 'flexibility' in data:
                entry.flexibility = data['flexibility']
            if 'weight' in data:
                entry.weight = data['weight']
            if 'body_fat_percentage' in data:
                entry.body_fat_percentage = data['body_fat_percentage']
            if 'heights' in data:
                entry.heights = data['heights']
            if 'thigh_circumference' in data:
                entry.thigh_circumference = data['thigh_circumference']
            if 'shoulder_circumference' in data:
                entry.shoulder_circumference = data['shoulder_circumference']
            if 'arm_circumference' in data:
                entry.arm_circumference = data['arm_circumference']
            if 'chest_circumference' in data:
                entry.chest_circumference = data['chest_circumference']
            if 'back_circumference' in data:
                entry.back_circumference = data['back_circumference']
            if 'waist_circumference' in data:
                entry.waist_circumference = data['waist_circumference']
            if 'leg_circumference' in data:
                entry.leg_circumference = data['leg_circumference']
            if 'calf_circumference' in data:
                entry.calf_circumference = data['calf_circumference']
            
            # Update timestamp to track modifications
            entry.timestamp = datetime.utcnow()
            
            self.session.commit()
            
            return {
                'id': entry.id,
                'footballer_id': entry.footballer_id,
                'created_at': entry.created_at.strftime('%Y-%m-%d'),                'updated_at': entry.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            }, "Physical data updated successfully"
            
        except Exception as e:
            self.session.rollback()
            return None, str(e)

    def delete_physical_data(self, entry_id, user_id=None):
        """Delete physical data entry."""
        try:
            entry = self.session.query(Physical).filter(Physical.id == entry_id).first()
            
            if not entry:
                return False, "Physical data entry not found"
            
            # Check authorization if user_id is provided
            if user_id and not self.can_access_entry(user_id, entry_id):
                return False, "Access denied! You can only delete data for your assigned team."
            
            self.session.delete(entry)
            self.session.commit()
            
            return True, "Physical data deleted successfully"
            
        except Exception as e:
            self.session.rollback()
            return False, str(e)

    def get_physical_history(self, footballer_id, limit=10):
        """Get physical data history for a footballer."""
        entries = self.session.query(Physical).filter(
            Physical.footballer_id == footballer_id
        ).order_by(Physical.created_at.desc()).limit(limit).all()
        
        return [{
            'id': entry.id,
            'footballer_id': entry.footballer_id,
            'muscle_mass': entry.muscle_mass,
            'muscle_strength': entry.muscle_strength,
            'muscle_endurance': entry.muscle_endurance,
            'flexibility': entry.flexibility,
            'weight': entry.weight,
            'body_fat_percentage': entry.body_fat_percentage,
            'heights': entry.heights,
            'created_at': entry.created_at.strftime('%Y-%m-%d')
        } for entry in entries]

    def can_access_entry(self, user_id, entry_id):
        """Check if user can access a specific physical data entry."""
        user = self.session.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        
        # Admin users can access all entries
        if user.is_admin:
            return True
        
        # Get the physical entry and check if it belongs to user's team
        entry = self.session.query(Physical).filter(Physical.id == entry_id).first()
        if not entry:
            return False
        
        # Get footballer's team
        footballer = self.session.query(Footballer).filter(Footballer.footballer_id == entry.footballer_id).first()
        if not footballer:
            return False
        
        # Check if user's team matches footballer's team
        return user.team_id == footballer.team_id