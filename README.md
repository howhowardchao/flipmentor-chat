# FlipMentor Chat

一個基於 OpenAI Assistant API 的智能教學助手系統。

## 版本記錄

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