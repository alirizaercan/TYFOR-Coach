# backend/controllers/conditional_dev_controller.py
import os 
from flask import Blueprint, request, jsonify, current_app
from services.conditional_service import ConditionalService
from utils.database import Database
from middlewares.auth_middleware import token_required, coach_required, team_access_required, footballer_access_required
import random
import numpy as np
import seaborn as sns
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from datetime import datetime
from sklearn.linear_model import LinearRegression

conditional_bp = Blueprint('conditional', __name__)
db = Database()

@conditional_bp.route('/leagues', methods=['GET'])
@token_required
def get_leagues():
    """Get all leagues."""
    session = db.connect()
    try:
        service = ConditionalService(session)
        leagues = service.get_all_leagues()
        if not leagues:
            return jsonify({'message': 'No leagues found'}), 404
        return jsonify(leagues), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close(session)

@conditional_bp.route('/teams/<league_id>', methods=['GET'])
@token_required
def get_teams(league_id):
    """Get teams by league_id that user can access."""
    session = db.connect()
    try:
        service = ConditionalService(session)
        teams = service.get_teams_by_league(league_id, user_id=request.user_id)
        return jsonify(teams), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close(session)

@conditional_bp.route('/footballers/<team_id>', methods=['GET'])
@token_required
@team_access_required  # Artık düzeltildi, tekrar aktif
def get_footballers(team_id):
    """Get footballers by team_id."""
    print(f"DEBUG: Received team_id: {team_id} (type: {type(team_id)})")
    
    # team_id'yi integer'a çevir
    try:
        team_id = int(team_id)
        print(f"DEBUG: Converted team_id to: {team_id} (type: {type(team_id)})")
    except ValueError:
        print(f"DEBUG: Failed to convert team_id to int: {team_id}")
        return jsonify({'error': 'Invalid team ID format'}), 400
    
    session = db.connect()
    try:
        service = ConditionalService(session)
        print(f"DEBUG: Calling get_footballers_by_team with team_id={team_id}, user_id={request.user_id}")
        footballers = service.get_footballers_by_team(team_id, user_id=request.user_id)
        print(f"DEBUG: Found {len(footballers)} footballers")
        return jsonify(footballers), 200
    except Exception as e:
        print(f"DEBUG: Exception in get_footballers: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Error fetching footballers: {str(e)}'}), 500
    finally:
        db.close(session)

@conditional_bp.route('/conditional-data/<footballer_id>', methods=['GET'])
@token_required
@footballer_access_required
def get_footballer_conditional_data(footballer_id):
    """Get conditional data for a specific footballer."""
    session = db.connect()
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        service = ConditionalService(session)
        conditional_data = service.get_conditional_data(footballer_id, start_date=start_date, end_date=end_date)
        
        return jsonify(conditional_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close(session)

@conditional_bp.route('/conditional-data/<footballer_id>/<date>', methods=['GET'])
@token_required
@footballer_access_required
def get_conditional_data_by_date(footballer_id, date):
    """Get conditional data for a footballer on a specific date."""
    session = db.connect()
    try:
        service = ConditionalService(session)
        conditional_entry = service.get_conditional_entry_by_date(footballer_id, date)
        
        # Veri yoksa veya hata varsa her zaman 0 değerlerle template döndür
        if not conditional_entry:
            # Veri yoksa 0 değerlerle template döndür
            empty_template = {
                'footballer_id': int(footballer_id),
                'date': date,
                'vo2_max': 0,
                'lactate_levels': 0,
                'training_intensity': 0,
                'recovery_times': 0,
                'current_vo2_max': 0,
                'current_lactate_levels': 0,
                'current_muscle_strength': 0,
                'target_vo2_max': 0,
                'target_lactate_level': 0,
                'target_muscle_strength': 0,
                'created_at': None,
                'message': 'No data found for this date. Default values shown.'
            }
            return jsonify(empty_template), 200
        
        return jsonify(conditional_entry), 200
    except Exception as e:
        # Herhangi bir hata durumunda da 0 değerlerle template döndür
        print(f"Error in get_conditional_data_by_date: {str(e)}")
        empty_template = {
            'footballer_id': int(footballer_id),
            'date': date,
            'vo2_max': 0,
            'lactate_levels': 0,
            'training_intensity': 0,
            'recovery_times': 0,
            'current_vo2_max': 0,
            'current_lactate_levels': 0,
            'current_muscle_strength': 0,
            'target_vo2_max': 0,
            'target_lactate_level': 0,
            'target_muscle_strength': 0,
            'created_at': None,
            'message': 'Error occurred or invalid date format. Default values shown.'
        }
        return jsonify(empty_template), 200
    finally:
        db.close(session)

@conditional_bp.route('/conditional-data/<footballer_id>', methods=['POST'])
@coach_required
@footballer_access_required
def add_conditional_data(footballer_id):
    """Add new conditional data for a footballer."""
    if not request.is_json:
        return jsonify({"message": "Missing JSON in request"}), 400
    
    session = db.connect()
    try:
        data = request.get_json()
        service = ConditionalService(session)
        
        result, message = service.add_conditional_data(footballer_id, data)
        
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

@conditional_bp.route('/conditional-data/<entry_id>', methods=['PUT'])
@coach_required
def update_conditional_data(entry_id):
    """Update existing conditional data."""
    if not request.is_json:
        return jsonify({"message": "Missing JSON in request"}), 400
    
    session = db.connect()
    try:
        data = request.get_json()
        service = ConditionalService(session)
        
        result, message = service.update_conditional_data(entry_id, data, user_id=request.user_id)
        
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

@conditional_bp.route('/conditional-data/<entry_id>', methods=['DELETE'])
@coach_required
def delete_conditional_data(entry_id):
    """Delete conditional data entry."""
    session = db.connect()
    try:
        service = ConditionalService(session)
        
        result, message = service.delete_conditional_data(entry_id, user_id=request.user_id)
        
        if not result:
            return jsonify({"message": message}), 400
        
        return jsonify({
            "message": message
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close(session)

@conditional_bp.route('/conditional-history/<footballer_id>', methods=['GET'])
@token_required
@footballer_access_required
def get_conditional_history(footballer_id):
    """Get conditional data history for a footballer."""
    session = db.connect()
    try:
        limit = request.args.get('limit', 10, type=int)
        
        service = ConditionalService(session)
        history = service.get_conditional_history(footballer_id, limit)
        
        return jsonify(history), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close(session)

@conditional_bp.route('/conditional-data', methods=['POST'])
@token_required
def get_conditional_data():
    """Get conditional data for a footballer within a date range."""
    session = db.connect()
    data = request.json
    try:
        footballer_id = data.get('footballer_id')
        graph_type = data.get('graph_type')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        service = ConditionalService(session)
        graph_data = service.get_conditional_data(footballer_id, graph_type, start_date, end_date)
        return jsonify(graph_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close(session)
        
@conditional_bp.route('/generate-graph', methods=['POST'])
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
        # Fiziksel verileri al
        service = ConditionalService(session)
        conditional_data = service.get_conditional_data(footballer_id, graph_type, start_date, end_date)

        # Eğer veri yoksa hata döndür
        if not conditional_data:
            return jsonify({'error': 'No data available for the selected criteria'}), 404

        # Verilere göre grafik oluştur
        days = [data['created_at'] for data in conditional_data]
        plt.figure(figsize=(10, 5))

        if graph_type == "VO2 Max Progression Over 30 Days":
            vo2_max_values = [data['vo2_max'] for data in conditional_data]
            
            plt.plot(days, vo2_max_values, marker='o',label="VO₂ Max (ml/kg/min)", color='blue')
            plt.title('VO₂ Max Over 30 Days', fontsize=16, fontweight='bold')
            plt.xlabel('Days', fontsize=10)
            plt.ylabel('VO₂ Max (ml/kg/min)', fontsize=14)
            plt.xticks(days, [day.strftime('%d-%m') for day in days], rotation=45, fontsize=10)
            plt.yticks(fontsize=12)
            plt.grid(True)
            plt.legend()
            plt.tight_layout()
            
            
        elif graph_type == "Daily Lactate Levels Monitoring":
            lactate_levels_values = [data['lactate_levels'] for data in conditional_data]
            
            plt.bar(days, lactate_levels_values, color='orange')
            plt.title('Lactate Levels Over 30 Days', fontsize=16, fontweight='bold')
            plt.xlabel('Days', fontsize=10)
            plt.ylabel('Lactate Levels (mmol/L)', fontsize=14)
            plt.xticks(days, [day.strftime('%d-%m') for day in days], rotation=45, fontsize=10)
            plt.yticks(fontsize=12)
            plt.grid(axis='y')
            plt.tight_layout()


        elif graph_type == "Training Intensity Progression":
            training_intensity_values = [data['training_intensity'] for data in conditional_data]

            plt.plot(days, training_intensity_values, marker='o', label='Training Intensity', color='green')
            plt.title('Training Intensity Over 30 Days', fontsize=16, fontweight='bold')
            plt.xlabel('Days', fontsize=10)
            plt.ylabel('Training Intensity', fontsize=14)
            plt.xticks(days, [day.strftime('%d-%m') for day in days], rotation=45, fontsize=10)
            plt.yticks(fontsize=12)
            plt.grid(True)
            plt.legend()
            plt.tight_layout()


        elif graph_type == "Recovery Distribution":
            recovery_times_values = [data['recovery_times'] for data in conditional_data]
            
            plt.scatter(days, recovery_times_values, color='purple', s=100)
            plt.title('Recovery Times Over 30 Days', fontsize=16, fontweight='bold')
            plt.xlabel('Days', fontsize=10)
            plt.ylabel('Recovery Times (hours)', fontsize=14)
            plt.xticks(days, [day.strftime('%d-%m') for day in days], rotation=45, fontsize=10)
            plt.yticks(fontsize=12)
            plt.grid(True)
            plt.tight_layout()

            
        elif graph_type == "VO2 Max Trend with Regression":
            vo2_max_values = [data['vo2_max'] for data in conditional_data]
            days_numeric = [(day - days[0]).days for day in days]  # Gün cinsinden farkları hesapla
            
            # NumPy dizisine dönüştür
            vo2_max_values = np.array(vo2_max_values)  # NumPy array'e çevir
            days_numeric = np.array(days_numeric)  # NumPy array'e çevir

            # Veriyi reshape et
            vo2_max_values_reshaped = vo2_max_values.reshape(-1, 1)
            days_reshaped = days_numeric.reshape(-1, 1)
            
            # Doğrusal regresyon modeli oluştur ve eğit
            model = LinearRegression()
            model.fit(days_reshaped, vo2_max_values_reshaped)
            predictions = model.predict(days_reshaped)
            
            # Grafiği çiz
            plt.plot(days_numeric, vo2_max_values, marker='o', label='VO₂ Max (ml/kg/min)', color='blue')
            plt.plot(days_numeric, predictions, label='Trend Line', color='red', linestyle='--')
            plt.title('VO₂ Max Trend Over 30 Days', fontsize=16, fontweight='bold')
            plt.xlabel('Days', fontsize=14)
            plt.ylabel('VO₂ Max (ml/kg/min)', fontsize=14)
            plt.xticks(fontsize=12)
            plt.yticks(fontsize=12)
            plt.grid(True)
            plt.legend()
            plt.tight_layout()



        elif graph_type == "Conditional Goal Progress Overview":

            # Verileri 'conditional_data' içinden alıyoruz
            current_vo2_max_values = [data['current_vo2_max'] for data in conditional_data]
            current_lactate_levels_values = [data['current_lactate_levels'] for data in conditional_data]
            current_muscle_strength_values = [data['current_muscle_strength'] for data in conditional_data]
            target_vo2_max_values = [data['target_vo2_max'] for data in conditional_data]
            target_lactate_level_values = [data['target_lactate_level'] for data in conditional_data]
            target_muscle_strength_values = [data['target_muscle_strength'] for data in conditional_data]

            # Hedef ve mevcut değerler
            goals = ['VO2 Max', 'Lactate Levels', 'Muscle Strength']
            current_values = [
                np.mean(current_vo2_max_values),
                np.mean(current_lactate_levels_values),
                np.mean(current_muscle_strength_values),
            ]
            target_values = [
                np.mean(target_vo2_max_values),
                np.mean(target_lactate_level_values),
                np.mean(target_muscle_strength_values),
            ]

            # X ekseninde çubuklar için pozisyonlar
            x = np.arange(len(goals))
            width = 0.35  # Çubuk genişliği

            # Bar plot
            plt.figure(figsize=(10, 6))
            plt.bar(x - width/2, current_values, width, label='Current Values', color='lightblue')
            plt.bar(x + width/2, target_values, width, label='Target Values', color='lightgreen')

            # Grafik başlık ve eksen etiketleri
            plt.title('Conditional Goal Progress Overview', fontsize=16, fontweight='bold')
            plt.xlabel('Goals', fontsize=14)
            plt.ylabel('Values', fontsize=14)
            plt.xticks(x, goals, fontsize=12)
            plt.yticks(fontsize=12)
            plt.grid(axis='y', linestyle='--', alpha=0.7)
            plt.legend(fontsize=12)
            plt.tight_layout()
            

        else:
            return jsonify({'error': f'Unknown graph type: {graph_type}'}), 400


        # Statik klasöre kaydet
        static_dir = os.path.join(current_app.root_path, 'static', 'graphs', 'conditional_graphs')
        os.makedirs(static_dir, exist_ok=True)
        file_name = f"{footballer_id}_{graph_type.replace(' ', '_')}_{start_date}_{end_date}.png"
        file_path = os.path.join(static_dir, file_name)
        plt.savefig(file_path)
        plt.close()

        # Dosya gerçekten oluşturuldu mu kontrol et
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Graph file not found at {file_path}")

        # Ön uç için göreceli yol döndür
        relative_path = f'/static/graphs/conditional_graphs/{file_name}'
        return jsonify({'message': 'Graph generated', 'path': relative_path}), 200

    except Exception as e:
        # Hataları yakala ve logla
        print("Error during graph generation:", str(e))
        return jsonify({'error': str(e)}), 500

    finally:
        # Bağlantıyı kapat
        db.close(session)