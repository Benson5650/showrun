import os
import json
from dotenv import load_dotenv

# 載入 .env 檔案的環境變數
load_dotenv()

class Config:
    # Flask設定
    SECRET_KEY = os.getenv('SECRET_KEY') or os.urandom(24)
    
    # Google OAuth 和 Drive API 設定
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
    GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"

    # 檢查必要的設定
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise ValueError("請確認已在 .env 檔案中設定 GOOGLE_CLIENT_ID 和 GOOGLE_CLIENT_SECRET")
    
    # OAuth scope
    GOOGLE_SCOPES = [
        "openid",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/drive.appdata"
    ]

    # 注意：請確保在 Google Cloud Console 使用同一個專案的 OAuth 憑證
    
    # 應用程式資料檔案名稱
    SEATING_CHARTS_FILE = 'seating_charts.json'
    METHODS_FILE = 'methods.json'
