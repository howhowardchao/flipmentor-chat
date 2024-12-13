interface Config {
  openAI: {
    apiKey: string;
    assistantId: string;
  };
  course: {
    name: string;
    assistantName: string;
  };
  ui: {
    maxChatWidth: number;
  };
}

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  throw new Error('Missing VITE_OPENAI_API_KEY environment variable');
}

if (!import.meta.env.VITE_ASSISTANT_ID) {
  throw new Error('Missing VITE_ASSISTANT_ID environment variable');
}

if (!import.meta.env.VITE_OPENAI_API_KEY.startsWith('sk-proj-')) {
  throw new Error('Invalid OpenAI API key format');
}

if (!import.meta.env.VITE_ASSISTANT_ID.startsWith('asst_')) {
  throw new Error('Invalid Assistant ID format');
}

export const config: Config = {
  openAI: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    assistantId: import.meta.env.VITE_ASSISTANT_ID,
  },
  course: {
    name: import.meta.env.VITE_COURSE_NAME || '藝遊｢雕｣與｢塑｣的世界',
    assistantName: import.meta.env.VITE_ASSISTANT_NAME || 'AI雕塑小助教',
  },
  ui: {
    maxChatWidth: Number(import.meta.env.VITE_MAX_CHAT_WIDTH) || 820,
  },
};