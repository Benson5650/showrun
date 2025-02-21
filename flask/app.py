import json
import os
from datetime import datetime
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from io import BytesIO
from config import Config

# 初始化 Flask 應用
app = Flask(__name__)
app.config.from_object(Config)

# 設定登入管理
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin):
    def __init__(self, user_info):
        # 嘗試使用 sub 作為主要 ID,如果不存在則使用 email 或 id
        self.id = user_info.get('sub') or user_info.get('email') or user_info.get('id')
        if not self.id:
            raise ValueError('無法取得有效的使用者識別碼')
        self.name = user_info.get('given_name', '')
        self.email = user_info.get('email', '')
        self.credentials = None

    def get_drive_service(self):
        if not self.credentials:
            return None
        return build('drive', 'v3', credentials=self.credentials)

@login_manager.user_loader
def load_user(user_id):
    if 'user_info' not in session:
        return None
    user_info = session['user_info']
    stored_user_id = user_info.get('sub') or user_info.get('email') or user_info.get('id')
    if stored_user_id != user_id:
        return None
    user = User(user_info)
    if 'credentials' in session:
        user.credentials = Credentials(**session['credentials'])
    return user

def save_to_drive(service, filename, data):
    # 檢查檔案是否已存在
    results = service.files().list(
        spaces='appDataFolder',
        fields='files(id, name)',
        q=f"name='{filename}'"
    ).execute()
    files = results.get('files', [])

    # 準備檔案內容
    file_content = json.dumps(data).encode('utf-8')
    media = MediaIoBaseUpload(
        BytesIO(file_content),
        mimetype='application/json',
        resumable=True
    )

    if files:
        # 更新現有檔案
        file_id = files[0]['id']
        service.files().update(
            fileId=file_id,
            media_body=media
        ).execute()
    else:
        # 建立新檔案
        file_metadata = {
            'name': filename,
            'parents': ['appDataFolder']
        }
        service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id'
        ).execute()

def load_from_drive(service, filename):
    results = service.files().list(
        spaces='appDataFolder',
        fields='files(id, name)',
        q=f"name='{filename}'"
    ).execute()
    files = results.get('files', [])
    
    if not files:
        return None
        
    file_id = files[0]['id']
    content = service.files().get_media(fileId=file_id).execute()
    return json.loads(content)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": app.config['GOOGLE_CLIENT_ID'],
                "client_secret": app.config['GOOGLE_CLIENT_SECRET'],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token"
            }
        },
        scopes=app.config['GOOGLE_SCOPES']
    )
    flow.redirect_uri = url_for('oauth2callback', _external=True)
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    session['state'] = state
    return redirect(authorization_url)

@app.route('/oauth2callback')
def oauth2callback():
    state = session['state']
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": app.config['GOOGLE_CLIENT_ID'],
                "client_secret": app.config['GOOGLE_CLIENT_SECRET'],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token"
            }
        },
        scopes=app.config['GOOGLE_SCOPES'],
        state=state
    )
    flow.redirect_uri = url_for('oauth2callback', _external=True)
    
    authorization_response = request.url
    flow.fetch_token(authorization_response=authorization_response)
    
    credentials = flow.credentials
    session['credentials'] = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }
    
    oauth2_client = build('oauth2', 'v2', credentials=credentials)
    user_info = oauth2_client.userinfo().get().execute()
    session['user_info'] = user_info
    
    user = User(user_info)
    user.credentials = credentials
    login_user(user)
    
    return redirect(url_for('index'))

@app.route('/logout')
@login_required
def logout():
    session.clear()
    logout_user()
    return redirect(url_for('index'))

@app.route('/api/seating-charts', methods=['GET', 'POST'])
@login_required
def handle_seating_charts():
    service = current_user.get_drive_service()
    if not service:
        return jsonify({'error': '無法存取 Google Drive'}), 400

    if request.method == 'GET':
        data = load_from_drive(service, app.config['SEATING_CHARTS_FILE'])
        if data is None:
            data = []
        return jsonify(data)
    
    if request.method == 'POST':
        data = load_from_drive(service, app.config['SEATING_CHARTS_FILE'])
        if data is None:
            data = []
            
        new_chart = request.get_json()
        new_chart['id'] = len(data) + 1
        new_chart['created_at'] = datetime.utcnow().isoformat()
        data.append(new_chart)
        
        save_to_drive(service, app.config['SEATING_CHARTS_FILE'], data)
        return jsonify(new_chart), 201

@app.route('/api/methods', methods=['GET', 'POST'])
@login_required
def handle_methods():
    service = current_user.get_drive_service()
    if not service:
        return jsonify({'error': '無法存取 Google Drive'}), 400

    if request.method == 'GET':
        data = load_from_drive(service, app.config['METHODS_FILE'])
        if data is None:
            data = []
        return jsonify(data)
    
    if request.method == 'POST':
        data = load_from_drive(service, app.config['METHODS_FILE'])
        if data is None:
            data = []
            
        new_method = request.get_json()
        new_method['id'] = len(data) + 1
        new_method['created_at'] = datetime.utcnow().isoformat()
        data.append(new_method)
        
        save_to_drive(service, app.config['METHODS_FILE'], data)
        return jsonify(new_method), 201

if __name__ == '__main__':
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # 開發環境使用
    app.run(debug=True)
