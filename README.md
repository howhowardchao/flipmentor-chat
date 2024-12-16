# FlipMentor Chat

一個基於 OpenAI Assistant API 的智能教學助手系統。

## 版本記錄

+ ### v0.1.4 (2023-12-13)
+ - 更新 AI 助教頭像
+ - 優化圖片資源
+ 
### v0.1.3 (2023-12-13)
- 關聯教材文件到 Assistant
- 優化 AI 回應內容

### v0.1.2 (2023-12-13)
- 重新配置 OpenAI Assistant
- 優化錯誤處理
- 添加運行狀態監控

### v0.1.1 (2023-12-13)
- 完成基本功能架構
- 添加錯誤處理機制
- 實現消息持久化
- 添加打字機效果

### v0.1.0 (2023-12-13)
- 初始專案建立
- 基本專案結構搭建
- 實作登入/登出功能

## 功能特點

- 登入系統
- 即時聊天
- Markdown 支持
- LaTeX 數學公式支持
- 打字機效果
- 消息持久化

## 技術棧

- React
- TypeScript
- Material-UI
- OpenAI API
- Vite

## 開發環境設置

1. 安裝依賴：
```bash
npm install
```

2. 設置環境變數：
將 `.env.example` 複製為 `.env` 並設置以下變數：
```env
VITE_OPENAI_API_KEY=your_api_key
VITE_ASSISTANT_ID=your_assistant_id
VITE_COURSE_NAME=課程名稱
VITE_ASSISTANT_NAME=AI助教名稱
VITE_MAX_CHAT_WIDTH=820
VITE_LOGIN_PASSWORD=your_password
```

3. 啟動開發服務器：
```bash
npm run dev
```

## 部署

### Vercel 部署

1. Fork 此倉庫
2. 在 Vercel 中導入專案
3. 設置環境變數
4. 部署

1. 安裝依賴：
```bash
npm install
```

2. 設置環境變數：
將 `.env.example` 複製為 `.env` 並設置以下變數���
```env
VITE_OPENAI_API_KEY=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
VITE_ASSISTANT_ID=asst_kee49octQQlwut1UgSH3ZZeE
VITE_COURSE_NAME=藝遊｢雕｣與｢塑｣的世界
VITE_ASSISTANT_NAME=AI雕塑小助教
VITE_MAX_CHAT_WIDTH=820
VITE_LOGIN_PASSWORD=888888
```

3. 啟動開發服務器：
```bash
npm run dev
```