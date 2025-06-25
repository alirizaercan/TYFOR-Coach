# TYFOR Coach - Mobile Data Collection Application

![TYFOR Coach](src/assets/images/tyfor-coach-banner.png)

[![TYFOR Platform](https://img.shields.io/badge/Main%20Platform-tyfor.online-blue)](https://tyfor.online)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#copyright-and-intellectual-property)
[![React Native](https://img.shields.io/badge/React%20Native-0.72+-green)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-49+-purple)](https://expo.dev)
[![Python](https://img.shields.io/badge/Python-3.11+-blue)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.3+-orange)](https://flask.palletsprojects.com)

## 🚀 Overview

**TYFOR Coach** is a professional mobile data collection application designed specifically for football coaches and performance analysts. This companion app integrates seamlessly with the main **TYFOR Platform** ([tyfor.online](https://tyfor.online)), enabling real-time data collection and athlete performance tracking directly from the field.

### 🎯 Purpose & Integration

TYFOR Coach serves as the **mobile data entry interface** for the comprehensive TYFOR analytics ecosystem, allowing coaches to:
- Collect real-time performance data during training sessions
- Track individual athlete development across multiple metrics
- Synchronize data instantly with the main TYFOR platform
- Access professional-grade analytics tools optimized for mobile use

## 📱 Application Screenshots

### Authentication & Dashboard
<div align="center">
  <img src="src/assets/images/screenshots/login-screen.png" width="250" alt="Login Screen" />
  <img src="src/assets/images/screenshots/dashboard.png" width="250" alt="Dashboard" />
  <img src="src/assets/images/screenshots/profile.png" width="250" alt="User Profile" />
</div>

### Data Collection Interface
<div align="center">
  <img src="src/assets/images/screenshots/player-selection.png" width="250" alt="Player Selection" />
  <img src="src/assets/images/screenshots/physical-data.png" width="250" alt="Physical Data Entry" />
  <img src="src/assets/images/screenshots/endurance-data.png" width="250" alt="Endurance Tracking" />
</div>

### Performance Analytics
<div align="center">
  <img src="src/assets/images/screenshots/conditional-data.png" width="250" alt="Conditional Performance" />
  <img src="src/assets/images/screenshots/analytics-view.png" width="250" alt="Analytics Dashboard" />
  <img src="src/assets/images/screenshots/progress-charts.png" width="250" alt="Progress Charts" />
</div>

## 🎯 Key Features

### 📊 **Multi-Domain Performance Tracking**
- **Physical Development**: Speed, agility, strength, and coordination metrics
- **Endurance Monitoring**: Cardiovascular performance and stamina tracking
- **Conditional Assessment**: Training load optimization and recovery analysis
- **Real-time Data Sync**: Instant synchronization with TYFOR platform

### 🏆 **Professional Coach Interface**
- **Intuitive Data Entry**: Streamlined forms optimized for field use
- **Player Selection System**: Hierarchical league → team → player navigation
- **Visual Progress Tracking**: Interactive charts and performance visualization
- **Historical Data Access**: Complete performance history and trend analysis

### 🔒 **Secure Authentication System**
- **JWT-based Security**: Industry-standard token authentication
- **Role-based Access**: Coach and admin permission levels
- **Session Management**: Secure login/logout with token refresh
- **Data Protection**: Encrypted communication with backend services

### 📱 **Mobile-Optimized Experience**
- **Cross-Platform Compatibility**: iOS and Android support via React Native
- **Responsive Design**: Optimized for tablets and smartphones
- **Offline Capability**: Local data storage with sync when connected
- **Professional UI/UX**: Clean, modern interface designed for sports professionals

## 🛠️ Technology Stack

### **Mobile Frontend**
- **React Native 0.72+**: Cross-platform mobile development
- **Expo 49+**: Professional development and deployment platform
- **React Navigation**: Advanced screen navigation and state management
- **React Hook Form**: Optimized form handling and validation
- **Victory Native**: Professional data visualization for mobile
- **AsyncStorage**: Secure local data persistence

### **Backend Infrastructure**
- **Python Flask 2.3+**: Robust API framework
- **PostgreSQL**: Enterprise-grade database system
- **SQLAlchemy**: Advanced ORM with relationship management
- **JWT Authentication**: Secure token-based authorization
- **CORS Support**: Cross-origin resource sharing configuration

### **Data Management**
- **Real-time Synchronization**: Live data sync with TYFOR platform
- **Multi-league Support**: Comprehensive league and team management
- **Performance Analytics**: Advanced statistical computation and trending
- **Data Validation**: Client and server-side data integrity checks

## 📋 Installation & Setup

### **Prerequisites**
- **Node.js 16+** with npm or yarn
- **Python 3.11+** with pip
- **PostgreSQL 12+** database server
- **Expo CLI** for mobile development
- **Android Studio** or **Xcode** for device testing

### 🚀 **Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# IMPORTANT: Edit .env with your actual database credentials and generate secure keys

# Initialize database
python -c "from app import create_tables; create_tables()"

# Start backend server
python app.py
```

**Backend runs on:** `http://localhost:5000`

### 📱 **Mobile App Setup**

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Run on specific platform
npx expo start --android  # Android
npx expo start --ios      # iOS
npx expo start --web      # Web browser
```

### 🔧 **Environment Configuration**

**⚠️ IMPORTANT SECURITY SETUP:**

1. **Copy the environment template:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit `.env` file with your actual credentials:**
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/tyfor_coach
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_secure_password
   POSTGRES_DB=tyfor_coach

   # Security Keys - GENERATE NEW KEYS FOR PRODUCTION
   SECRET_KEY=your-flask-secret-key-here-minimum-32-characters
   SECURITY_PASSWORD_SALT=your-security-salt-here-minimum-16-characters

   # Application Settings
   FLASK_APP=app.py
   FLASK_ENV=development
   FLASK_DEBUG=1
   JWT_EXPIRATION=86400

   # API Configuration
   API_BASE_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:3000
   ```

3. **Generate secure keys using Python:**
   ```python
   import secrets
   # For Flask SECRET_KEY (32+ characters)
   print("SECRET_KEY:", secrets.token_urlsafe(32))
   # For SECURITY_PASSWORD_SALT (16+ characters)
   print("SECURITY_PASSWORD_SALT:", secrets.token_urlsafe(16))
   ```

**🔒 SECURITY NOTES:**
- Never commit the `.env` file to version control
- Always use strong, unique passwords for production
- Generate new secret keys for each environment
- Use environment variables in production deployments

### 📱 **Mobile App Configuration**

Update `src/constants/api.js`:

```javascript
export const API_BASE_URL = 'http://your-backend-url:5000';
export const API_ENDPOINTS = {
  auth: '/auth',
  players: '/api/players',
  physical: '/api/physical-development',
  endurance: '/api/endurance-development',
  conditional: '/api/conditional-development'
};
```

## 🏗️ Project Structure

```
TYFOR-Coach/
├── 📱 mobile/                    # React Native Mobile App
│   ├── src/
│   │   ├── 🖼️ assets/           # Images, fonts, and static resources
│   │   │   └── images/
│   │   │       └── screenshots/ # App screenshots for documentation
│   │   ├── 🧩 components/       # Reusable UI components
│   │   │   ├── AuthForm.js      # Authentication form component
│   │   │   ├── DatePicker.js    # Custom date selection component
│   │   │   ├── JerseyNumber.js  # Player jersey number input
│   │   │   ├── MetricInput.js   # Performance metric input component
│   │   │   └── WebScrollView.js # Cross-platform scroll view
│   │   ├── 🔧 constants/        # App configuration and constants
│   │   │   └── api.js           # API endpoints and configuration
│   │   ├── 🏛️ contexts/         # React Context providers
│   │   │   └── AuthContext.js   # Authentication state management
│   │   ├── 🧭 navigation/       # App navigation configuration
│   │   │   ├── AppNavigator.js  # Main app navigation
│   │   │   └── AuthNavigator.js # Authentication flow navigation
│   │   ├── 📱 screens/          # Application screens
│   │   │   ├── DashboardScreen.js
│   │   │   ├── Auth/            # Authentication screens
│   │   │   └── Development/     # Performance tracking screens
│   │   ├── 🌐 services/         # API communication services
│   │   │   ├── api.js           # Base API configuration
│   │   │   ├── auth.js          # Authentication services
│   │   │   ├── conditionalService.js
│   │   │   ├── enduranceService.js
│   │   │   └── physicalService.js
│   │   ├── 🎨 styles/           # Styling and theming
│   │   │   ├── authStyles.js
│   │   │   ├── commonStyles.js
│   │   │   └── ...
│   │   └── 🔧 utils/            # Utility functions and helpers
│   ├── App.js                   # Main application component
│   ├── app.json                 # Expo configuration
│   ├── package.json             # Dependencies and scripts
│   └── 📄 Configuration Files
├── 🔧 backend/                   # Python Flask Backend API
│   ├── 📊 models/               # Database models and schemas
│   │   ├── user.py             # User authentication model
│   │   ├── footballer.py       # Player information model
│   │   ├── football_team.py    # Team management model
│   │   ├── league.py           # League configuration model
│   │   ├── physical.py         # Physical performance model
│   │   ├── endurance.py        # Endurance tracking model
│   │   ├── conditional.py      # Conditional assessment model
│   │   └── notification.py     # Notification system model
│   ├── 🎛️ controllers/          # Request handling and business logic
│   │   ├── auth_controller.py
│   │   ├── physical_dev_controller.py
│   │   ├── endurance_dev_controller.py
│   │   └── conditional_dev_controller.py
│   ├── 🌐 services/             # Business logic and data processing
│   │   ├── auth_service.py
│   │   ├── authorization_service.py
│   │   ├── physical_service.py
│   │   ├── endurance_service.py
│   │   └── conditional_service.py
│   ├── 🔒 middlewares/          # Security and validation middleware
│   │   └── auth_middleware.py
│   ├── ⚙️ config/               # Application configuration
│   │   ├── database.py         # Database connection setup
│   │   └── __init__.py
│   ├── 🔧 utils/                # Utility functions and helpers
│   │   ├── database.py         # Database utilities
│   │   └── helpers.py          # General helper functions
│   ├── 📁 static/               # Static file storage
│   │   ├── graphs/             # Generated performance graphs
│   │   └── uploads/            # File upload storage
│   ├── app.py                  # Main Flask application
│   └── requirements.txt        # Python dependencies
├── 📄 INTELLECTUAL_PROPERTY.md  # Comprehensive IP rights declaration
├── 📄 README.md                 # This documentation file
└── 📄 .env                      # Environment configuration (not in repo)
```

## 🎯 Core Modules

### 1. 💪 **Physical Development Tracking**
- **Speed Measurements**: Sprint times and acceleration metrics
- **Agility Assessment**: Cone drills and directional change analysis
- **Strength Evaluation**: Power output and resistance measurements
- **Coordination Testing**: Technical skill and ball control metrics

### 2. 🏃 **Endurance Monitoring**
- **Cardiovascular Assessment**: Heart rate zones and recovery analysis
- **Stamina Tracking**: Distance covered and pace maintenance
- **Aerobic Capacity**: VO2 max estimation and improvement tracking
- **Recovery Metrics**: Rest heart rate and recovery time analysis

### 3. 🎯 **Conditional Development**
- **Training Load Management**: Intensity and volume optimization
- **Performance Benchmarking**: Comparison against position standards
- **Fatigue Monitoring**: Overtraining prevention and load balancing
- **Periodization Support**: Training cycle planning and adjustment

### 4. 📈 **Analytics & Visualization**
- **Progress Tracking**: Historical performance trend analysis
- **Comparative Analytics**: Player-to-player and team benchmarking
- **Visual Dashboards**: Interactive charts and performance graphs
- **Export Capabilities**: PDF reports and data export functionality

## 🔗 Integration with TYFOR Platform

### **Seamless Data Synchronization**
- **Real-time Updates**: Instant data sync with main platform
- **Unified Analytics**: Combined mobile and web-based insights
- **Cross-platform Access**: Data available across all TYFOR interfaces
- **Historical Integration**: Complete performance history maintenance

### **Enhanced Workflow**
- **Field Data Collection** → TYFOR Coach Mobile App
- **Advanced Analytics** → TYFOR Web Platform ([tyfor.online](https://tyfor.online))
- **Report Generation** → Integrated reporting across platforms
- **Strategic Planning** → Combined insights for decision-making

## 🔒 Security & Data Protection

### **Authentication Security**
- **JWT Token Management**: Secure, time-limited authentication tokens
- **Password Encryption**: Industry-standard bcrypt password hashing
- **Session Security**: Automatic token refresh and secure logout
- **Role-based Authorization**: Granular permission control

### **Data Protection**
- **Encrypted Communication**: SSL/TLS encryption for all API calls
- **Local Data Security**: Encrypted local storage for sensitive information
- **Privacy Compliance**: GDPR-compliant data handling procedures
- **Audit Logging**: Comprehensive activity tracking and monitoring

## 📊 Performance Metrics

### **Application Performance**
- ⚡ **Fast Load Times**: < 3 seconds app initialization
- 📱 **Responsive Interface**: 60fps smooth animations and transitions
- 🔄 **Efficient Sync**: Real-time data synchronization under 1 second
- 💾 **Optimized Storage**: Minimal device storage footprint

### **User Experience**
- 👥 **Coach-Friendly Design**: Interface optimized for sports professionals
- 📋 **Streamlined Data Entry**: Minimal taps for maximum data collection
- 📊 **Visual Feedback**: Immediate performance visualization
- 🔍 **Easy Navigation**: Intuitive player and data access

## 🚀 Future Development

### **Planned Features**
- 📷 **Video Integration**: Performance video recording and analysis
- 🤖 **AI Insights**: Machine learning-powered performance predictions
- 📡 **IoT Integration**: Wearable device data collection
- 🌐 **Multi-language Support**: Localization for international use

### **Technical Enhancements**
- 🔄 **Offline Mode**: Full functionality without internet connection
- 📊 **Advanced Analytics**: Enhanced statistical analysis and reporting
- 🔗 **Third-party Integration**: External sports platform connectivity
- 📱 **Tablet Optimization**: Enhanced interface for larger screens

## 🤝 Contributing

While TYFOR Coach is proprietary software, we welcome collaboration opportunities:

- **Football Club Partnerships**: Professional clubs seeking mobile data collection solutions
- **Sports Technology Integration**: Compatible system integration and API partnerships
- **Research Collaboration**: Academic institutions studying sports performance analytics
- **Consultation Services**: Expert advice on mobile sports application development

## 📞 Contact & Support

### **Professional Inquiries**
- **Email**: info.tyfor@gmail.com
- **Main Platform**: [tyfor.online](https://tyfor.online)
- **GitHub**: [alirizaercan](https://github.com/alirizaercan)

### **Technical Support**
For technical support, integration inquiries, or partnership opportunities, please contact us through the official channels above.

### **Business Development**
For commercial licensing, club partnerships, or enterprise integrations, please reach out via email with:
- Organization details and requirements
- Intended use case and scope
- Technical integration needs
- Timeline and deployment plans

## Copyright and Intellectual Property

**© 2024-2025 Ali Rıza Ercan. All Rights Reserved.**

**TYFOR Coach Mobile Application**, including all software components, algorithms, designs, methodologies, and intellectual property, is the **exclusive property** of **Ali Rıza Ercan**. This software is protected under Turkish copyright law (Law No. 5846) and international copyright treaties.

**Unauthorized use, reproduction, modification, distribution, or commercial exploitation is strictly prohibited.** For comprehensive intellectual property information, please refer to [INTELLECTUAL_PROPERTY.md](./INTELLECTUAL_PROPERTY.md).

### **Legal Protection**
This application is protected under:
- Turkish Copyright Law (Law No. 5846)
- International Copyright Treaties
- Berne Convention for the Protection of Literary and Artistic Works
- WIPO Copyright Treaty (WCT)

---

**🚀 Professional football data collection made simple and powerful with TYFOR Coach**

**📱 Seamlessly integrated with [TYFOR Platform](https://tyfor.online) for complete analytics solutions**

---

*Last Updated: June 2025*
*Version: 1.0*
*Platform Integration: TYFOR Web Platform v2.0*
