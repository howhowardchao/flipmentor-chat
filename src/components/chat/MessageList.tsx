import React, { useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Message as MessageType } from '@/shared/types/chat';
import { Message } from './Message';

interface MessageListProps {
  messages: MessageType[];
  isLoading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
}; 