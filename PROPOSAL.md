# 寶寶成長記錄 PWA - 技術提案

## 1. 專案概述

**專案名稱：**家庭助手 (HomeHelper)
**類型：**漸進式網路應用程式 (PWA)
**核心功能：**一款移動端優先的網路應用程式，包含兩個模組：
1. **寶寶成長記錄** - 記錄寶寶護理活動（餵奶、換尿布、睡眠、成長）
2. **家務與煮飯通訊** - 與菲傭溝通每日煮飯和家務安排
**目標使用者：**有菲傭的家庭成員、嬰幼兒的父母和照護者

---

## 2. 技術堆疊

| 類別 | 技術 | 版本 |
|------|------|------|
| 框架 | React + Vite | React 18.x, Vite 5.x |
| 語言 | TypeScript | 5.x |
| 狀態管理 | Zustand | 4.x |
| UI 框架 | Material UI (MUI) | 5.x |
| 樣式 | Tailwind CSS | 3.x |
| 圖示 | React Icons | 5.x |
| 路由 | React Router DOM | 6.x |
| 本機儲存 | IndexedDB (透過 Dexie.js) | 4.x |
| 國際化 | i18next + react-i18next | 23.x |
| PWA | vite-plugin-pwa | 0.19.x |

---

## 3. 功能列表

### 3.1 模組一：寶寶成長記錄

| 功能 | 描述 |
|------|------|
| **活動記錄** | 記錄餵奶（母乳/奶瓶/副食品）、換尿布、睡眠、洗澡、用藥、成長數據 |
| **歷史記錄** | 按日期/類型檢視和篩選過去的活動 |
| **儀表板** | 今日摘要，快速新增按鈕 |
| **寶寶資料** | 姓名、出生日期、照片、基本資訊 |
| **資料統計** | 簡單圖表展示活動趨勢 |

### 3.2 模組二：家務與煮飯通訊 (FDH Communication)

| 功能 | 描述 |
|------|------|
| **今日安排** | 每日午餐/晚餐時間、菜單、額外客人 |
| **冰箱版** | 可列印的版本，貼在冰箱上方便查看 |
| **圖示選擇** | 預設菜餚圖示，方便快速選擇 |
| **每日更新** | 簡單易用的更新介面 |
| **中英雙語** | 全部内容雙語顯示 |

---

## 4. 模組二：家務通訊詳細設計

### 4.1 每日安排頁面

```
┌─────────────────────────────────────────────────┐
│           今日安排 / Today's Schedule           │
│              2026年3月27日                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  🍽️ 午餐時間 / Lunch Time                      │
│  ┌─────────────────────────────────────────┐   │
│  │  [12:00] PM                             │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  🍳 午餐菜單 / Lunch Menu                       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │ 🍳  │ │ 🍲  │ │ 🥗  │ │ 🍜  │          │
│  │ 炒蛋  │ │ 湯   │ │ 蔬菜  │ │ 麵   │          │
│  │ Scr. │ │ Soup │ │ Veg  │ │ Noodle│          │
│  └──────┘ └──────┘ └──────┘ └──────┘          │
│                                                 │
│  🍽️ 晚餐時間 / Dinner Time                      │
│  ┌─────────────────────────────────────────┐   │
│  │  [19:00] PM                             │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  🍳 晚餐菜單 / Dinner Menu                       │
│  (同午餐選擇方式)                                │
│                                                 │
│  👥 額外客人 / Extra Guests                     │
│  ┌─────────────────────────────────────────┐   │
│  │ [ ] 有 / Yes   [ ] 無 / No              │   │
│  │ 人數 / Number: [  2  ]                  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  📝 備註 / Notes                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 寶寶今天會小睡 / Baby will nap today     │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│           [儲存 / Save]                         │
└─────────────────────────────────────────────────┘
```

### 4.2 冰箱列印版 (Fridge Print Version)

```
╔═══════════════════════════════════════════════════════════╗
║              每日家務安排 / Daily House Tasks              ║
║                    2026年3月27日                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  🍽️ 午餐 / Lunch          🍽️ 晚餐 / Dinner              ║
║  時間 / Time: ___:___        時間 / Time: ___:___         ║
║                                                           ║
║  ┌───┐ ┌───┐ ┌───┐ ┌───┐     ┌───┐ ┌───┐ ┌───┐ ┌───┐     ║
║  │ 🍳│ │ 🍲│ │ 🥗│ │ 🍜│     │ 🍳│ │ 🍲│ │ 🥗│ │ 🍜│     ║
║  ├───┤ ├───┤ ├───┤ ├───┤     ├───┤ ├───┤ ├───┤ ├───┤     ║
║  │   │ │   │ │   │ │   │     │   │ │   │ │   │ │   │     ║
║  └───┘ └───┘ └───┘ └───┘     └───┘ └───┘ └───┘ └───┘     ║
║  炒蛋  湯   蔬菜  麵          炒蛋  湯   蔬菜  麵          ║
║  Egg  Soup Veg  Noodle       Egg  Soup Veg  Noodle        ║
║                                                           ║
║  👥 額外客人 / Extra Guests:  ☐ 是 Yes  ☐ 否 No           ║
║     人數 / Number: ___                                 ║
║                                                           ║
║  📋 其他事項 / Other Tasks:                               ║
║  ☐ 打扫客廳 / Clean living room                          ║
║  ☐ 洗衣服 / Wash clothes                                 ║
║  ☐ 準備明天早餐 / Prepare tomorrow breakfast              ║
║                                                           ║
║  📝 備註 / Notes:                                        ║
║  _________________________________________________        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### 4.3 預設菜餚圖示

| 圖示 | 中文名 | English | 類別 |
|------|--------|---------|------|
| 🍳 | 炒蛋 | Scrambled Egg | 早餐/早餐 |
| 🥚 | 水煮蛋 | Boiled Egg | 早餐 |
| 🍞 | 吐司 | Toast | 早餐 |
| 🥣 | 粥 | Congee | 早餐 |
| 🍝 | 意粉 | Pasta | 主食 |
| 🍚 | 米飯 | Rice | 主食 |
| 🍜 | 麵 | Noodles | 主食 |
| 🥟 | 雲吞 | Dumplings | 主食 |
| 🍲 | 湯 | Soup | 配菜 |
| 🥗 | 蔬菜 | Vegetables | 配菜 |
| 🍗 | 雞肉 | Chicken | 肉類 |
| 🥩 | 牛肉 | Beef | 肉類 |
| 🐟 | 魚 | Fish | 海鮮 |
| 🥦 | 西蘭花 | Broccoli | 蔬菜 |
| 🥬 | 青菜 | Green Veg | 蔬菜 |
| 🍎 | 水果 | Fruit | 甜品 |
| 🧁 | 甜品 | Dessert | 甜品 |

---

## 5. 架構設計

### 5.1 專案結構

```
src/
├── assets/              # 靜態資源（圖示、圖片）
├── components/          # 可複用 UI 元件
│   ├── common/          # 按鈕、卡片、輸入框、對話框
│   ├── layout/          # 頂部、底部、側邊欄、布局
│   ├── baby/            # 寶寶模組元件
│   └── fdh/            # 菲傭通訊模組元件
├── config/              # 應用程式配置
├── hooks/               # 自訂 React Hooks
├── i18n/                # 國際化
├── pages/               # 頁面元件
│   ├── baby/            # 寶寶模組頁面
│   │   ├── Dashboard.tsx
│   │   ├── ActivityForm.tsx
│   │   ├── History.tsx
│   │   ├── BabyProfile.tsx
│   │   └── Stats.tsx
│   └── fdh/             # 菲傭通訊模組頁面
│       ├── DailyPlan.tsx
│       ├── PrintView.tsx
│       └── TaskList.tsx
├── services/            # API 服務
├── stores/              # Zustand 狀態管理
│   ├── activityStore.ts
│   ├── babyStore.ts
│   ├── fdhStore.ts     # 新增：菲傭通訊狀態
│   └── settingsStore.ts
├── types/               # TypeScript 型別定義
└── utils/               # 工具函式
```

### 5.2 資料模型

#### 寶寶模組（原有）

```typescript
interface Baby {
  id: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  photo?: string;
}

interface Activity {
  id: string;
  babyId: string;
  type: ActivityType;
  details: ActivityDetails;
  timestamp: string;
  notes?: string;
  synced: boolean;
}
```

#### 菲傭通訊模組（新增）

```typescript
interface DailyPlan {
  id: string;
  date: string;              // YYYY-MM-DD
  lunchTime: string;         // HH:mm
  lunchMenu: DishItem[];     // 選擇的菜餚
  dinnerTime: string;
  dinnerMenu: DishItem[];
  extraGuests: boolean;
  extraGuestCount: number;
  notes: string;
  otherTasks: string[];      // 打掃、洗衣等
  lastUpdated: string;
}

interface DishItem {
  id: string;
  nameZh: string;
  nameEn: string;
  icon: string;              // emoji 或圖示 ID
  category: 'breakfast' | 'main' | 'side' | 'dessert';
}

interface TaskItem {
  id: string;
  nameZh: string;
  nameEn: string;
  completed: boolean;
}
```

---

## 6. 頁面結構

### 6.1 寶寶模組

| 頁面 | 路由 | 描述 |
|------|------|------|
| 儀表板 | `/baby` | 今日活動，快速統計 |
| 新增活動 | `/baby/add` | 活動輸入表單 |
| 歷史記錄 | `/baby/history` | 可篩選的活動清單 |
| 寶寶資料 | `/baby/profile` | 寶寶資訊管理 |
| 統計圖表 | `/baby/stats` | 活動圖表 |

### 6.2 菲傭通訊模組

| 頁面 | 路由 | 描述 |
|------|------|------|
| 今日安排 | `/fdh/daily` | 每日煮飯和家務安排 |
| 列印版 | `/fdh/print` | 冰箱列印專用頁面 |
| 常用設定 | `/fdh/settings` | 常用菜餚、任務設定 |

---

## 7. 國際化設計

### 7.1 雙語顯示

所有菲傭模組内容都採用上下或左右雙語格式：

```
┌────────────────────────────┐
│  午餐時間 / Lunch Time     │
│  [12:00] PM               │
└────────────────────────────┘
```

### 7.2 翻譯鍵值範例

```json
{
  "fdh": {
    "dailyPlan": {
      "title": "今日安排",
      "titleEn": "Today's Schedule",
      "lunch": "午餐",
      "lunchEn": "Lunch",
      "dinner": "晚餐",
      "dinnerEn": "Dinner",
      "time": "時間",
      "timeEn": "Time",
      "menu": "菜單",
      "menuEn": "Menu",
      "extraGuests": "額外客人",
      "extraGuestsEn": "Extra Guests",
      "yes": "是",
      "yesEn": "Yes",
      "no": "否",
      "noEn": "No",
      "number": "人數",
      "numberEn": "Number",
      "notes": "備註",
      "notesEn": "Notes",
      "save": "儲存",
      "saveEn": "Save",
      "print": "列印",
      "printEn": "Print"
    },
    "dishes": {
      "scrambledEgg": "炒蛋",
      "scrambledEggEn": "Scrambled Egg",
      "soup": "湯",
      "soupEn": "Soup",
      "vegetables": "蔬菜",
      "vegetablesEn": "Vegetables"
    }
  }
}
```

---

## 8. PWA 與離線支援

- **離線模式**：完全離線使用，包括兩個模組
- **本機儲存**：所有資料保存在 IndexedDB
- **列印功能**：瀏覽器列印功能，自動優化列印樣式

---

## 9. 階段計劃

### 第一階段
- [x] 專案初始化 Vite + React + TypeScript
- [x] 核心 UI 元件 MUI + Tailwind
- [x] IndexedDB 整合 Dexie.js
- [x] 寶寶成長記錄 CRUD
- [x] 菲傭通訊模組基礎功能
- [x] 雙語支援
- [x] 冰箱列印版
- [x] 主題系統
- [x] PWA 設定
- [x] 響應式設計

### 第二階段（未來）
- [ ] API 整合實現雲端同步
- [ ] 使用者身份驗證
- [ ] 推播通知
- [ ] 資料備份/還原

---

## 10. 下一步

1. **審核提案**：確認需求和設計決策
2. **初始化專案**：設定 Vite + React + TypeScript
3. **安裝相依套件**：MUI、Zustand、Tailwind 等
4. **實作核心**：建構兩個模組

---

*提案建立日期：2026-03-27*
*版本：1.1*