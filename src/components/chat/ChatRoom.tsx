import React, { useState, useEffect } from 'react';
import { Box, Paper, Alert, Snackbar } from '@mui/material';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message } from '@/shared/types/chat';

interface ChatRoomProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
  error = null,
}) => {
  const [showError, setShowError] = useState(!!error);

  useEffect(() => {
    setShowError(!!error);
  }, [error]);

  return (
    <Paper
      elevation={3}
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <ChatHeader />
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSend={onSendMessage} disabled={isLoading} />
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert severity="error" onClose={() => setShowError(false)}>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
}; 