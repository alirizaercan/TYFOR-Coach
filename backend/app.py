# backend/app.py
import os
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from controllers.auth_controller import auth_controller
from controllers.physical_dev_controller import physical_bp as physical_controller
from controllers.conditional_dev_controller import conditional_bp as conditional_controller
from controllers.endurance_dev_controller import endurance_bp as endurance_controller

load_dotenv()

app = Flask(__name__, static_folder='static')


CORS(app, resources={
    r"/api/*": {
        "origins": "*", 
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Blueprint'i kayıt ediyoruz
app.register_blueprint(physical_controller, url_prefix='/api/physical')
app.register_blueprint(conditional_controller, url_prefix='/api/conditional')
app.register_blueprint(endurance_controller, url_prefix='/api/endurance')
app.register_blueprint(auth_controller, url_prefix='/api/auth')

@app.route('/')
def home():
    return "Welcome to the IQAnadoluScout API!"

@app.route('/static/graphs/physical_graphs/<path:filename>')
def serve_physical_graph(filename):
    return send_from_directory(os.path.join('static', 'graphs', 'physical_graphs'), filename)

@app.route('/static/graphs/conditional_graphs/<path:filename>')
def serve_conditional_graph(filename):
    return send_from_directory(os.path.join('static', 'graphs', 'conditional_graphs'), filename)

@app.route('/static/graphs/endurance_graphs/<path:filename>')
def serve_endurance_graph(filename):
    return send_from_directory(os.path.join('static', 'graphs', 'endurance_graphs'), filename)

@app.route('/api')
def api_info():
    return jsonify({
        "name": "IQAS Coach API",
        "version": "1.0",
        "endpoints": {
            "auth": "/api/auth",
            "physical": "/api/physical",
            "conditional": "/api/conditional",
            "endurance": "/api/endurance"
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
