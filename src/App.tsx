import { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import { config } from './config/env'
import { LoginPage } from './components/auth/LoginPage'
import { ChatRoom } from './components/chat/ChatRoom'
import { AuthState, LoginCredentials } from '@/shared/types/auth'
import { ChatState, Message } from '@/shared/types/chat'
import { saveAuth, loadAuth, clearAuth } from '@/utils/auth'
import { saveChat, loadChat, clearChat } from '@/utils/chat'
import { openAIService } from '@/utils/openai'

function App() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const [chat, setChat] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    const savedAuth = loadAuth();
    const savedChat = loadChat();
    if (savedAuth) {
      setAuth(savedAuth);
      if (savedChat) {
        setChat(savedChat);
      }
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const handleLogin = (credentials: LoginCredentials) => {
    if (credentials.password === import.meta.env.VITE_LOGIN_PASSWORD) {
      const newAuth = {
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      setAuth(newAuth);
      saveAuth(newAuth);
      
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '您好，讓我們一起進入藝遊｢雕｣與｢塑｣的世界吧！\n\n我是簡俊成老師的AI小助教，您可以叫我「簡老師AI小助教」，我已經整理了老師的"藝遊「雕」與「塑」的世界"教材，包括課本與網路上資訊。我可以輔助您進行課程學習，例如您可以詢問課本中「認識雕塑」、「宗教與象徵」、「雕塑的表現形態」、「雕塑的表現形式」、「雕塑常用的表現媒材」等與我討論，當然，您也可以依照簡老師課堂上的要求詢問我問題或進行測驗。',
        timestamp: Date.now(),
      };
      
      setChat(prev => {
        const newState = {
          ...prev,
          messages: [...prev.messages, welcomeMessage],
        };
        saveChat(newState);
        return newState;
      });
    } else {
      setAuth({
        isAuthenticated: false,
        isLoading: false,
        error: '密碼錯誤',
      });
    }
  };

  const handleLogout = () => {
    clearAuth();
    clearChat();
    setAuth({
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    setChat({
      messages: [],
      isLoading: false,
      error: null,
    });
  };

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setChat(prev => {
      const newState = {
        ...prev,
        messages: [...prev.messages, newMessage],
        isLoading: true,
      };
      saveChat(newState);
      return newState;
    });

    try {
      const response = await openAIService.sendMessage(content);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      setChat(prev => {
        const newState = {
          ...prev,
          messages: [...prev.messages, aiResponse],
          isLoading: false,
        };
        saveChat(newState);
        return newState;
      });
    } catch (error) {
      console.error('Error sending message:', error instanceof Error ? error.message : error);
      setChat(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : '發送訊息時發生錯誤',
      }));
    }
  };

  if (auth.isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        載入中...
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: config.ui.maxChatWidth,
        margin: '0 auto',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {!auth.isAuthenticated ? (
        <LoginPage onLogin={handleLogin} error={auth.error} />
      ) : (
        <>
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleLogout}
              sx={{ 
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              登出
            </Button>
          </Box>
          <ChatRoom
            messages={chat.messages}
            onSendMessage={handleSendMessage}
            isLoading={chat.isLoading}
            error={chat.error}
          />
        </>
      )}
    </Box>
  );
}

export default App; 