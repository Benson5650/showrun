# 高中牲選號機（Flask + Google Drive版）

這是一個使用 Flask 建立的座位選擇系統，支援 Google 帳號登入並使用 Google Drive API 儲存個人化設定。

## 功能特色

- Google 帳號登入整合
- 使用 Google Drive App Data API 儲存資料
- 個人座位表雲端儲存
- 自定義選號方法雲端儲存
- 支援多種預設選號方法
- 直覺的視覺化介面

## 安裝需求

```bash
pip install -r requirements.txt
```

## Google Cloud 專案設定

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新專案或選擇現有專案
3. 啟用以下 API：
   - Google OAuth 2.0
   - Google Drive API
4. 在「憑證」頁面設定：
   - 建立 OAuth 2.0 用戶端 ID
   - 設定授權的重新導向 URI：`http://localhost:5000/oauth2callback`
   - 在 OAuth 同意畫面中加入以下 scope：
     * .../auth/userinfo.email
     * .../auth/userinfo.profile
     * .../auth/drive.appdata
5. 複製用戶端 ID 和密鑰

## 環境變數設定

複製 `.env.example` 到 `.env` 並設定：

```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## 執行方式

```bash
python app.py
```

然後在瀏覽器開啟 `http://localhost:5000`

## 使用方法

1. 使用 Google 帳號登入
2. 建立或載入座位表
3. 選擇選號方法
4. 輸入座號或點擊座位
5. 查看結果

## 雲端儲存功能

- 座位表自動儲存至 Google Drive App Data
- 選號方法自動儲存至 Google Drive App Data
- 跨裝置同步
- 資料安全儲存於個人的 Google 帳號中

## 注意事項

- 首次使用需要授權 Google Drive API 存取權限
- 資料儲存於 Google Drive 的應用程式資料夾中
- 使用者無法直接在 Google Drive 中看到這些檔案
- 建議在開發環境中使用
