# backend/controllers/physical_dev_controller.py
import os 
from flask import Blueprint, request, jsonify, current_app
from services.physical_service import PhysicalService
from utils.database import Database
from middlewares.auth_middleware import token_required, coach_required, team_access_required, footballer_access_required
import random
import numpy as np
import seaborn as sns
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from datetime import datetime

physical_bp = Blueprint('physical', __name__)
db = Database()

@physical_bp.route('/leagues', methods=['GET'])
@token_required
def get_leagues():
    """Get all leagues."""
    session = db.connect()
    try:
        service = PhysicalService(session)
        leagues = service.get_all_leagues()
        if not leagues:
            return jsonify({'message': 'No leagues found'}), 404
        return jsonify(leagues), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close(session)

@physical_bp.route('/teams/<league_id>', methods=['GET'])
@token_required
def get_teams(league_id):
    """Get teams by league_id that user can access."""
    session = db.connect()
    try:
        service = PhysicalService(session)
        teams = service.get_teams_by_league(league_id, user_id=request.user_id)
        return jsonify(teams), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close(session)

@physical_bp.route('/footballers/<team_id>', methods=['GET'])
@token_required
@team_access_required
def get_footballers(team_id):
    """Get footballers by team_id."""
    session = db.connect()
    try:
        service = PhysicalService(session)
        footballers = service.get_footballers_by_team(team_id, user_id=request.user_id)
        return jsonify(footballers), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close(session)

@physical_bp.route('/physical-data/<footballer_id>', methods=['GET'])
@token_required
@footballer_access_required
def get_footballer_physical_data(footballer_id):
    """Get physical data for a specific footballer."""
    session = db.connect()
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        service = PhysicalService(session)
        physical_data = service.get_physical_data(footballer_id, start_date=start_date, end_date=end_date)
        
        return jsonify(physical_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close(session)

@physical_bp.route('/physical-data/<footballer_id>/<date>', methods=['GET'])
@token_required
@footballer_access_required
def get_physical_data_by_date(footballer_id, date):
    """Get physical data for a footballer on a specific date."""
    session = db.connect()
    try:
        service = PhysicalService(session)
        physical_entry = service.get_physical_entry_by_date(footballer_id, date)
        
        # Veri yoksa veya hata varsa her zaman 0 değerlerle template döndür
        if not physical_entry:
            # Veri yoksa 0 değerlerle template döndür
            empty_template = {
                'footballer_id': int(footballer_id),
                'date': date,
                'height': 0,
                'weight': 0,
                'body_fat_percentage': 0,
                'muscle_mass': 0,
                'flexibility_score': 0,
                'agility_score': 0,
                'balance_score': 0,
                'coordination_score': 0,
                'reaction_time': 0,
                'vertical_jump': 0,
                'horizontal_jump': 0,
                'created_at': None,
                'message': 'No data found for this date. Default values shown.'
            }
            return jsonify(empty_template), 200
            
        return jsonify(physical_entry), 200
    except Exception as e:
        # Herhangi bir hata durumunda da 0 değerlerle template döndür
        print(f"Error in get_physical_data_by_date: {str(e)}")
        empty_template = {
            'footballer_id': int(footballer_id),
            'date': date,
            'height': 0,
            'weight': 0,
            'body_fat_percentage': 0,
            'muscle_mass': 0,
            'flexibility_score': 0,
            'agility_score': 0,
            'balance_score': 0,
            'coordination_score': 0,
            'reaction_time': 0,
            'vertical_jump': 0,
            'horizontal_jump': 0,
            'created_at': None,
            'message': 'Error occurred or invalid date format. Default values shown.'
        }
        return jsonify(empty_template), 200
    finally:
        db.close(session)

@physical_bp.route('/physical-data/<footballer_id>', methods=['POST'])
@coach_required
@footballer_access_required
def add_physical_data(footballer_id):
    """Add new physical data for a footballer."""
    if not request.is_json:
        return jsonify({"message": "Missing JSON in request"}), 400
    
    session = db.connect()
    try:
        data = request.get_json()
        service = PhysicalService(session)
        
        result, message = service.add_physical_data(footballer_id, data)
        
        if not result:
            return jsonify({"message": message}), 400
        
        return jsonify({
            "message": message,
            "data": result
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close(session)

@physical_bp.route('/physical-data/<entry_id>', methods=['PUT'])
@coach_required
def update_physical_data(entry_id):
    """Update existing physical data."""
    if not request.is_json:
        return jsonify({"message": "Missing JSON in request"}), 400
    
    session = db.connect()
    try:
        data = request.get_json()
        service = PhysicalService(session)
        
        result, message = service.update_physical_data(entry_id, data, user_id=request.user_id)
        
        if not result:
            return jsonify({"message": message}), 400
        
        return jsonify({
            "message": message,
            "data": result
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close(session)

@physical_bp.route('/physical-data/<entry_id>', methods=['DELETE'])
@coach_required
def delete_physical_data(entry_id):
    """Delete physical data entry."""
    session = db.connect()
    try:
        service = PhysicalService(session)
        
        result, message = service.delete_physical_data(entry_id, user_id=request.user_id)
        
        if not result:
            return jsonify({"message": message}), 400
        
        return jsonify({
            "message": message
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close(session)

@physical_bp.route('/physical-history/<footballer_id>', methods=['GET'])
@token_required
@footballer_access_required
def get_physical_history(footballer_id):
    """Get physical data history for a footballer."""
    session = db.connect()
    try:
        limit = request.args.get('limit', 10, type=int)
        
        service = PhysicalService(session)
        history = service.get_physical_history(footballer_id, limit)
        
        return jsonify(history), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close(session)

@physical_bp.route('/physical-data', methods=['POST'])
@token_required
def get_physical_data():
    """Get physical data for a footballer within a date range."""
    session = db.connect()
    data = request.json
    try:
        footballer_id = data.get('footballer_id')
        graph_type = data.get('graph_type')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        service = PhysicalService(session)
        graph_data = service.get_physical_data(footballer_id, graph_type, start_date, end_date)
        return jsonify(graph_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close(session)
        
@physical_bp.route('/generate-graph', methods=['POST'])
@token_required
def generate_graph():
    """Generate graph based on selected type and date range."""
    data = request.json
    graph_type = data.get('graph_type')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    footballer_id = data.get('footballer_id')
    
    session = db.connect()
    
    try:
        # Get physical data
        service = PhysicalService(session)
        physical_data = service.get_physical_data(footballer_id, graph_type, start_date, end_date)

        # Return error if no data available
        if not physical_data:
            return jsonify({'error': 'No data available for the selected criteria'}), 404

        # Convert string dates to datetime objects for plotting
        days = [datetime.strptime(data['created_at'], '%Y-%m-%d') for data in physical_data]
        plt.figure(figsize=(10, 5))
        
        def get_color(value, target):
            percentage = (value / target) * 100
            
            if percentage >= 85:  # Green for 85% and above
                return "#6BBE45"  # Matte Green
            elif percentage >= 70:  # Light orange for 70% to 85%
                return "#FFA500"  # Matte Orange
            else:  # Red for below 70%
                return "#D32F2F"  # Matte Red
            
        def convert_height_to_float(height_str):
                if height_str:
                    # Remove 'm' or 'cm' units and strip spaces
                    height_str = height_str.replace("m", "").replace("cm", "").strip()
                    # Replace commas with dots
                    height_str = height_str.replace(",", ".")
                    try:
                        return float(height_str)
                    except ValueError:
                        return 0.0  # Return 0.0 in case of invalid value
                return 0.0

        if graph_type == "Physical Progress Tracker":
            metrics = {
                "Muscle Mass (kg)": [data['muscle_mass'] for data in physical_data],
                "Muscle Strength (kg)": [data['muscle_strength'] for data in physical_data],
                "Muscle Endurance (reps)": [data['muscle_endurance'] for data in physical_data],
                "Flexibility (cm)": [data['flexibility'] for data in physical_data]
            }

            targets = {metric: max(values) + random.randint(-20, +20) for metric, values in metrics.items()}

            # Tek grafik için oluşturulmuş figür
            fig, ax = plt.subplots(figsize=(10, 6))

            ax.set_facecolor('#f0f0f0')
            card_width = 180
            card_height = 100
            ax.set_xlim(0, card_width * len(metrics))
            ax.set_ylim(0, card_height)

            for i, (metric, values) in enumerate(metrics.items()):
                avg_value = sum(values) / len(values)
                target = targets[metric]
                percentage = (avg_value / target) * 100
                color = get_color(avg_value, target)

                # Metrik kartını çiz
                ax.add_patch(Rectangle((i * card_width, 0), card_width, card_height, color='white', alpha=0.9))
                fill_height = (avg_value / target) * card_height
                ax.add_patch(Rectangle((i * card_width, 0), card_width, fill_height, color=color))

                # Metin etiketleri ekle
                ax.text((i + 0.5) * card_width, 60, f'Avg: {avg_value:.1f}', ha='center', fontsize=10)
                ax.text((i + 0.5) * card_width, 40, f'Target: {target}', ha='center', fontsize=10)
                ax.text((i + 0.5) * card_width, 20, f'{percentage:.1f}%', ha='center', fontsize=10, color=color)
                ax.text((i + 0.5) * card_width, 5, metric, ha='center', fontsize=9)

            ax.axis('off')

        elif graph_type == "Training Progress Time Tracker":
            # Verilerden metrikleri çıkartma
            metrics = {
                "Muscle Mass (kg)": [data['muscle_mass'] for data in physical_data],
                "Muscle Strength (kg)": [data['muscle_strength'] for data in physical_data],
                "Muscle Endurance (reps)": [data['muscle_endurance'] for data in physical_data],
                "Flexibility (cm)": [data['flexibility'] for data in physical_data]
            }

            # Hedef değerlerin dinamik olarak belirlenmesi: Her metrik için max değerin üzerine rastgele bir değer ekleniyor
            targets = {metric: max(values) + random.randint(-20, +20) for metric, values in metrics.items()}

            # Yüzdelik hesaplamalar
            muscle_mass_percentage = [(value / targets["Muscle Mass (kg)"]) * 100 for value in metrics["Muscle Mass (kg)"]]
            muscle_strength_percentage = [(value / targets["Muscle Strength (kg)"]) * 100 for value in metrics["Muscle Strength (kg)"]]
            muscle_endurance_percentage = [(value / targets["Muscle Endurance (reps)"]) * 100 for value in metrics["Muscle Endurance (reps)"]]
            flexibility_percentage = [(value / targets["Flexibility (cm)"]) * 100 for value in metrics["Flexibility (cm)"]]

            # Grafiğin çizilmesi
            plt.plot(days, muscle_mass_percentage, label="Muscle Mass (%)")
            plt.plot(days, muscle_strength_percentage, label="Muscle Strength (%)")
            plt.plot(days, muscle_endurance_percentage, label="Muscle Endurance (%)")
            plt.plot(days, flexibility_percentage, label="Flexibility (%)")

            # Başlık ve etiketler
            plt.title("Training Progress Time Tracker")
            plt.xlabel("Date")
            plt.ylabel("Value (%)")

            # Grafik üzerinde etiketler ve grid
            plt.legend()
            plt.grid(True)

            # X eksenindeki tarihleri daha okunabilir hale getirmek için döndürme
            plt.xticks(rotation=45)

            # Layout düzenlemesi
            plt.tight_layout()

        elif graph_type == "Body Composition Progress Tracker":
            weight_values = [data['weight'] for data in physical_data]
            height_values = [convert_height_to_float(data['heights']) for data in physical_data]
            muscle_mass_values = [data['muscle_mass'] for data in physical_data]

            # Grafik oluşturulması
            plt.figure(figsize=(10, 5))

            # Ağırlık, boy ve kas kütlesi için çizimler
            plt.fill_between(days, weight_values, color='lightblue', alpha=0.5, label='Weight (kg)')
            plt.fill_between(days, height_values, color='lightgreen', alpha=0.5, label='Height (cm)')
            plt.fill_between(days, muscle_mass_values, color='salmon', alpha=0.5, label='Muscle Mass (kg)')

            # Başlık ve etiketler
            plt.title("Body Composition Progress Tracker", fontsize=16)
            plt.xlabel("Date", fontsize=10)
            plt.ylabel("Value", fontsize=14)
            plt.xticks(days, [day.strftime('%d-%m') for day in days], rotation=45, fontsize=10)
            plt.yticks(np.arange(0, max(weight_values + height_values + muscle_mass_values) + 5, 5))

            # Grafik üzerinde etiketler ve grid
            plt.legend(loc='upper right')
            plt.grid(True)
            
        elif graph_type == "Athletic Performance Radar Analysis":
            metrics = {
                "Muscle Mass (kg)": [data['muscle_mass'] for data in physical_data],
                "Muscle Strength (kg)": [data['muscle_strength'] for data in physical_data],
                "Muscle Endurance (reps)": [data['muscle_endurance'] for data in physical_data],
                "Flexibility (cm)": [data['flexibility'] for data in physical_data]
            }

            averages = [sum(values) / len(values) for values in metrics.values()]
            labels = list(metrics.keys())

            angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False).tolist()
            averages += averages[:1]  # Close the radar chart
            angles += angles[:1]

            fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
            ax.fill(angles, averages, color='blue', alpha=0.25)
            ax.plot(angles, averages, color='blue', linewidth=2)
            ax.set_yticks([])
            ax.set_xticks(angles[:-1])
            ax.set_xticklabels(labels)
            ax.set_title("Athletic Performance Radar Analysis", y=1.1)

        elif graph_type == "BMI Distribution Analysis":
            # Verilerin 'physical_data' içinden alınması
            height_values = [convert_height_to_float(data['heights']) for data in physical_data]
            weight_values = [data['weight'] for data in physical_data]

            # BMI Hesaplama
            bmi_values = [weight / (height ** 2) for weight, height in zip(weight_values, height_values)]

            # BMI Dağılımı - Histogram
            plt.hist(bmi_values, bins=10, color='royalblue', edgecolor='black', alpha=0.9)
            plt.title('BMI Distribution (Histogram)', fontsize=16, fontweight='bold')
            plt.xlabel('BMI', fontsize=14)
            plt.ylabel('Frequency', fontsize=14)
            plt.grid(axis='y', alpha=0.75)
            plt.xticks(fontsize=12)
            plt.yticks(fontsize=12)

        elif graph_type == "Comprehensive Physical Metrics Box Plot":
            # Verileri 'physical_data' içinden alıyoruz
            muscle_mass_values = [data['muscle_mass'] for data in physical_data]
            muscle_strength_values = [data['muscle_strength'] for data in physical_data]
            muscle_endurance_values = [data['muscle_endurance'] for data in physical_data]
            flexibility_values = [data['flexibility'] for data in physical_data]
            weight_values = [data['weight'] for data in physical_data]
            height_values = [convert_height_to_float(data['heights']) for data in physical_data]

            # BMI hesaplama: BMI = Ağırlık / (Boy * Boy)
            bmi_values = [weight / (height ** 2) for weight, height in zip(weight_values, height_values)]
            
            # Box plot çizimi: Kas kütlesi, kas gücü, kas dayanıklılığı, esneklik ve BMI verilerini birleştiriyoruz
            sns.boxplot(data=[muscle_mass_values, muscle_strength_values, muscle_endurance_values, flexibility_values, bmi_values], 
                        palette="pastel", orient="h", width=0.4)
            
            # Grafik başlıkları ve etiketleri
            plt.title('Physical Parameters Distribution (Box Plot)', fontsize=16, fontweight='bold')
            
            # Y eksenindeki etiketleri sağa kaydırma
            plt.yticks(ticks=[0, 1, 2, 3, 4], labels=['Muscle Mass (kg)', 'Muscle Strength (kg)', 
                                                        'Muscle Endurance (reps)', 'Flexibility (cm)', 'BMI'], 
                    fontsize=12)
            
            # Y-label'leri sağa kaydırmak için labelpad parametresi kullanıyoruz
            plt.ylabel('Physical Parameters', fontsize=14, labelpad=20)  # labelpad ile sağa kaydırma
            
            # X eksenindeki etiketler
            plt.xlabel('Values', fontsize=14)

        elif graph_type == "Dynamic Body Metrics Tracker":
            thigh_circumference = [data['thigh_circumference'] for data in physical_data]
            shoulder_circumference = [data['shoulder_circumference'] for data in physical_data]
            arm_circumference = [data['arm_circumference'] for data in physical_data]
            chest_circumference = [data['chest_circumference'] for data in physical_data]
            back_circumference = [data['back_circumference'] for data in physical_data]
            waist_circumference = [data['waist_circumference'] for data in physical_data]
            leg_circumference = [data['leg_circumference'] for data in physical_data]
            calf_circumference = [data['calf_circumference'] for data in physical_data]

            plt.plot(days, thigh_circumference, label="Thigh Circumference")
            plt.plot(days, shoulder_circumference, label="Shoulder Circumference")
            plt.plot(days, arm_circumference, label="Arm Circumference")
            plt.plot(days, chest_circumference, label="Chest Circumference")
            plt.plot(days, back_circumference, label="Back Circumference")
            plt.plot(days, waist_circumference, label="Waist Circumference")
            plt.plot(days, leg_circumference, label="Leg Circumference")
            plt.plot(days, calf_circumference, label="Calf Circumference")
            plt.title("Dynamic Body Metrics Tracker")
            plt.xlabel("Date")
            plt.ylabel("Value (%)")

            # Grafik üzerinde etiketler ve grid
            plt.legend()
            plt.grid(True)

        else:
            return jsonify({'error': f'Unknown graph type: {graph_type}'}), 400


        # Statik klasöre kaydet
        static_dir = os.path.join(current_app.root_path, 'static', 'graphs', 'physical_graphs')
        os.makedirs(static_dir, exist_ok=True)
        file_name = f"{footballer_id}_{graph_type.replace(' ', '_')}_{start_date}_{end_date}.png"
        file_path = os.path.join(static_dir, file_name)
        plt.savefig(file_path)
        plt.close()

        # Dosya gerçekten oluşturuldu mu kontrol et
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Graph file not found at {file_path}")

        # Ön uç için göreceli yol döndür
        relative_path = f'/static/graphs/physical_graphs/{file_name}'
        return jsonify({'message': 'Graph generated', 'path': relative_path}), 200

    except Exception as e:
        # Hataları yakala ve logla
        print("Error during graph generation:", str(e))
        return jsonify({'error': str(e)}), 500

    finally:
        # Bağlantıyı kapat
        db.close(session)

@physical_bp.route('/debug/user-access/<team_id>', methods=['GET'])
@token_required
def debug_user_access(team_id):
    """Debug endpoint to check user access to a specific team"""
    from services.authorization_service import AuthorizationService
    
    session = db.connect()
    try:
        auth_service = AuthorizationService(session)
        user = auth_service.get_user_by_id(request.user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        can_access = auth_service.can_access_team(request.user_id, team_id)
        
        debug_info = {
            "user_id": user.id,
            "username": user.username,
            "user_team_id": user.team_id,
            "is_admin": user.is_admin,
            "requested_team_id": team_id,
            "requested_team_id_int": int(team_id),
            "can_access_team": can_access,
            "comparison_result": user.team_id == int(team_id) if not user.is_admin else "Admin - all access"
        }
        
        return jsonify(debug_info), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close(session)