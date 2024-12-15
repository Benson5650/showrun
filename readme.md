# 🎲 高中牲選號機

嗨！這是一個用來隨機選號碼（通常是座號）的小工具。可以自定義選號方式，或是用內建的有趣選號模式來玩～

## 📁 專案結構
```
.
├── python/
│   ├── random_select.py   # CLI 主程式
│   ├── methods.json       # 選號方法設定
│   └── seating_chart.txt  # 座位表設定
└── html/
    ├── Web.html          # 網頁獨立版本
    └── Django_Flatpages.html  # Django嵌入版本
```

## 🌟 功能特色

- 支援多種選號方式:
  - 小十字、大十字（選擇上下左右）
  - 小叉叉、大叉叉（選擇對角線）
  - 九宮格（選擇周圍八格）
  - 其他特殊圖形：Σ、π、積分...等
- 可自訂新選號規則
- 支援「穿牆」設定（超出邊界時繞到對面）
- 提供命令列和網頁兩種介面
- 座位表大小自由調整

## 💻 使用方式

### CLI 版本
```bash
cd python
python random_select.py
```

### 網頁版本
直接開啟```Web.html```

或將 `Django_Flatpages.html` 內容複製到 Django 專案中使用

## 🎯 選號規則說明

- wrap_around: 設定是否允許穿牆
- directions: 設定選取方向，格式為 `[x,y]`
  - x: 往右為正，往左為負
  - y: 往上為負，往下為正

例如：小十字的設定為
```json
{
    "wrap_around": true,
    "directions": [[1,0], [-1,0], [0,1], [0,-1]]
}
```
