import { useState, useEffect } from 'react'
import { Box, Button, IconButton } from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
import { config } from './config/env'
import { LoginPage } from './components/auth/LoginPage'
import { RegisterPage } from './components/auth/RegisterPage'
import { ChatRoom } from './components/chat/ChatRoom'
import { UserManagement } from './components/user/UserManagement'
import { User, UserState } from '@/shared/types/user'
import { RegisterCredentials } from '@/shared/types/user'
import { ChatState } from '@/shared/types/chat'
import { saveChat, loadChat, clearChat } from '@/utils/chat'
import { openAIService } from '@/utils/openai'
import {
  initializeUsers,
  loginUser,
  registerUser,
  loadCurrentUser,
  updateUser,
  changeUserRole,
  loadUsers,
} from '@/utils/user'

function App() {
  // 用戶狀態
  const [userState, setUserState] = useState<UserState>({
    currentUser: null,
    isLoading: true,
    error: null,
  })

  // 聊天狀態
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  })

  // 頁面狀態
  const [showRegister, setShowRegister] = useState(false)
  const [showUserManagement, setShowUserManagement] = useState(false)

  // 初始化
  useEffect(() => {
    initializeUsers()
    const savedUser = loadCurrentUser()
    const savedChat = loadChat()
    if (savedUser) {
      setUserState(prev => ({ ...prev, currentUser: savedUser, isLoading: false }))
      if (savedChat) {
        setChatState(savedChat)
      }
    } else {
      setUserState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  // 登入處理
  const handleLogin = async (username: string, password: string) => {
    try {
      const user = loginUser(username, password)
      setUserState({
        currentUser: user,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setUserState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '登入失敗',
      }))
    }
  }

  // 註冊處理
  const handleRegister = async (credentials: RegisterCredentials) => {
    try {
      const user = registerUser(credentials)
      setUserState({
        currentUser: user,
        isLoading: false,
        error: null,
      })
      setShowRegister(false)
    } catch (error) {
      setUserState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '註冊失敗',
      }))
    }
  }

  // 登出處理
  const handleLogout = () => {
    setUserState({
      currentUser: null,
      isLoading: false,
      error: null,
    })
    setChatState({
      messages: [],
      isLoading: false,
      error: null,
    })
    clearChat()
  }

  // 更新用戶資料
  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    try {
      const updatedUser = updateUser(userId, updates)
      if (userState.currentUser?.id === userId) {
        setUserState(prev => ({
          ...prev,
          currentUser: updatedUser,
        }))
      }
    } catch (error) {
      console.error('更新用戶資料失敗:', error)
    }
  }

  // 更改用戶角色
  const handleChangeRole = (userId: string, role: 'admin' | 'student') => {
    try {
      changeUserRole(userId, role)
    } catch (error) {
      console.error('更改用戶角色失敗:', error)
    }
  }

  if (userState.isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>載入中...</Box>
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
      {!userState.currentUser ? (
        showRegister ? (
          <RegisterPage
            onRegister={handleRegister}
            onBackToLogin={() => setShowRegister(false)}
            error={userState.error}
          />
        ) : (
          <LoginPage
            onLogin={handleLogin}
            onRegister={() => setShowRegister(true)}
            error={userState.error}
          />
        )
      ) : (
        <>
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000, display: 'flex', gap: 1 }}>
            <IconButton
              color="primary"
              onClick={() => setShowUserManagement(!showUserManagement)}
              sx={{ bgcolor: 'background.paper' }}
            >
              <AccountCircle />
            </IconButton>
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{ boxShadow: 2 }}
            >
              登出
            </Button>
          </Box>
          {showUserManagement ? (
            <UserManagement
              currentUser={userState.currentUser}
              users={loadUsers()}
              onUpdateUser={handleUpdateUser}
              onChangeRole={handleChangeRole}
            />
          ) : (
            <ChatRoom
              messages={chatState.messages}
              onSendMessage={async (content) => {
                const newMessage = {
                  id: Date.now().toString(),
                  role: 'user',
                  content,
                  timestamp: Date.now(),
                };

                setChatState(prev => ({
                  ...prev,
                  messages: [...prev.messages, newMessage],
                  isLoading: true,
                }));

                try {
                  const response = await openAIService.sendMessage(content);
                  const aiResponse = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: response,
                    timestamp: Date.now(),
                  };

                  setChatState(prev => {
                    const newState = {
                      ...prev,
                      messages: [...prev.messages, aiResponse],
                      isLoading: false,
                    };
                    saveChat(newState);
                    return newState;
                  });
                } catch (error) {
                  console.error('Error sending message:', error);
                  setChatState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error instanceof Error ? error.message : '發送訊息時發生錯誤',
                  }));
                }
              }}
              isLoading={chatState.isLoading}
              error={chatState.error}
            />
          )}
        </>
      )}
    </Box>
  )
}

export default App 