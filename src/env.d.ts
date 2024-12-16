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