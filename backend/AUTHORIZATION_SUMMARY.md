# TYFOR-Coach Authorization System Summary

## Yapılan Değişiklikler

### 1. Authorization Service (`services/authorization_service.py`)
- **Yeni Servis**: Kullanıcı yetkilendirme kontrolleri için merkezi servis
- **Fonksiyonlar**:
  - `can_access_team(user_id, team_id)`: Kullanıcının takıma erişim yetkisi kontrolü
  - `can_access_footballer(user_id, footballer_id)`: Futbolcuya erişim yetkisi kontrolü
  - `get_user_accessible_teams(user_id)`: Kullanıcının erişebileceği takımlar
  - `get_user_accessible_footballers(user_id)`: Kullanıcının erişebileceği futbolcular

### 2. Authentication Middleware Güncellemeleri (`middlewares/auth_middleware.py`)
- **Token Required**: Mevcut token doğrulama
- **Yeni Middleware'ler**:
  - `team_access_required`: Takım erişim kontrolü
  - `footballer_access_required`: Futbolcu erişim kontrolü
- **Token Improvements**: Token'a `team_id` ve `is_admin` bilgileri eklendi

### 3. Service Layer Updates

#### Physical Service (`services/physical_service.py`)
- `get_teams_by_league()`: Kullanıcının sadece kendi takımını görmesi
- `get_footballers_by_team()`: Takım erişim kontrolü
- `can_access_entry()`: Veri girişi erişim kontrolü
- `update_physical_data()`: Güncelleme yetki kontrolü
- `delete_physical_data()`: Silme yetki kontrolü

#### Conditional Service (`services/conditional_service.py`)
- Aynı authorization kontrolleri physical service ile paralel olarak eklendi
- Team ve footballer erişim kontrolleri

#### Endurance Service (`services/endurance_service.py`)
- Aynı authorization kontrolleri physical service ile paralel olarak eklendi
- Team ve footballer erişim kontrolleri

### 4. Controller Layer Updates

#### Physical Controller (`controllers/physical_dev_controller.py`)
- `@team_access_required` middleware eklendi
- `@footballer_access_required` middleware eklendi
- User ID authorization check'leri service çağrılarına eklendi

#### Conditional Controller (`controllers/conditional_dev_controller.py`)
- Aynı middleware'ler eklendi
- Authorization check'leri service çağrılarına eklendi

#### Endurance Controller (`controllers/endurance_dev_controller.py`)
- Aynı middleware'ler eklendi
- Authorization check'leri service çağrılarına eklendi

### 5. Auth Service Updates (`services/auth_service.py`)
- Token generation'a `team_id` bilgisi eklendi
- Login/Register response'larında team bilgileri

## Güvenlik Kuralları

### Admin Kullanıcılar (`is_admin = True`)
- **Tüm takımlara** erişim yetkisi
- **Tüm futbolculara** erişim yetkisi
- **Tüm verileri** okuma, yazma, güncelleme, silme yetkisi

### Normal Kullanıcılar (`is_admin = False`)
- **Sadece atanmış takımlarına** (`team_id`) erişim yetkisi
- **Sadece kendi takımlarının futbolcularına** erişim yetkisi
- **Sadece kendi takımlarının verilerini** okuma, yazma, güncelleme, silme yetkisi

### Korunmuş Endpoint'ler

#### Physical Data Endpoints
```
GET    /physical/teams/<league_id>           # @token_required + team filtering
GET    /physical/footballers/<team_id>       # @token_required + @team_access_required
GET    /physical/physical-data/<footballer_id>  # @token_required + @footballer_access_required
POST   /physical/physical-data/<footballer_id>  # @coach_required + @footballer_access_required
PUT    /physical/physical-data/<entry_id>    # @coach_required + authorization check
DELETE /physical/physical-data/<entry_id>    # @coach_required + authorization check
```

#### Conditional Data Endpoints
```
GET    /conditional/teams/<league_id>        # @token_required + team filtering
GET    /conditional/footballers/<team_id>    # @token_required + @team_access_required
GET    /conditional/conditional-data/<footballer_id>  # @token_required + @footballer_access_required
POST   /conditional/conditional-data/<footballer_id>  # @coach_required + @footballer_access_required
PUT    /conditional/conditional-data/<entry_id>     # @coach_required + authorization check
DELETE /conditional/conditional-data/<entry_id>     # @coach_required + authorization check
```

#### Endurance Data Endpoints
```
GET    /endurance/teams/<league_id>          # @token_required + team filtering
GET    /endurance/footballers/<team_id>      # @token_required + @team_access_required
GET    /endurance/endurance-data/<footballer_id>    # @token_required + @footballer_access_required
POST   /endurance/endurance-data/<footballer_id>    # @coach_required + @footballer_access_required
PUT    /endurance/endurance-data/<entry_id>       # @coach_required + authorization check
DELETE /endurance/endurance-data/<entry_id>       # @coach_required + authorization check
```

## Test Senaryoları

### 1. Admin Kullanıcı Testi
- Admin kullanıcı tüm takımlara erişebilmeli
- Admin kullanıcı tüm futbolculara erişebilmeli
- Admin kullanıcı tüm verileri yönetebilmeli

### 2. Normal Kullanıcı Testi
- Normal kullanıcı sadece kendi takımına erişebilmeli
- Normal kullanıcı başka takımların verilerine erişememeli
- Normal kullanıcı başka takımların verilerini değiştirememeli

### 3. Yetkisiz Erişim Testi
- Token olmadan API erişimi engellenmeli
- Geçersiz token ile erişim engellenmeli
- Yetki dışı takım/futbolcu erişimi engellenmeli

## Hata Mesajları

```json
{
  "message": "Access denied! You can only access your assigned team."
}

{
  "message": "Access denied! You can only access footballers from your assigned team."
}

{
  "message": "Access denied! You can only modify data for your assigned team."
}

{
  "message": "Access denied! You can only delete data for your assigned team."
}
```

## Kullanım

### 1. Kullanıcı Oluşturma
```python
# Admin kullanıcı
user = User(
    username="admin",
    email="admin@example.com", 
    password="hashed_password",
    team_id=None,  # Admin'ler için takım ataması opsiyonel
    is_admin=True
)

# Normal kullanıcı
user = User(
    username="coach1",
    email="coach1@example.com",
    password="hashed_password", 
    team_id=123,  # Belirli bir takıma atanmalı
    is_admin=False
)
```

### 2. Token Kullanımı
```javascript
// Frontend'de token header'ında gönderilmeli
headers: {
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

Bu sistemle birlikte kullanıcılar sadece sorumlu oldukları takımların Physical, Conditional ve Endurance verilerine erişebilir ve bunları yönetebilirler.
