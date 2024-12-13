import { Message, ChatState } from '@/shared/types/chat';

const CHAT_KEY = 'flipmentor_chat';

export const saveChat = (chat: ChatState): void => {
  localStorage.setItem(CHAT_KEY, JSON.stringify(chat));
};

export const loadChat = (): ChatState | null => {
  const saved = localStorage.getItem(CHAT_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const clearChat = (): void => {
  localStorage.removeItem(CHAT_KEY);
}; 