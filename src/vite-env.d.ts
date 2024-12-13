/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_ASSISTANT_ID: string
  readonly VITE_COURSE_NAME: string
  readonly VITE_ASSISTANT_NAME: string
  readonly VITE_MAX_CHAT_WIDTH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '@mui/material/styles' {
  interface Theme {
    // 在這裡添加自定義主題屬性
  }
  interface ThemeOptions {
    // 在這裡添加自定義主題選項
  }
} 