import React, { useState, useCallback, KeyboardEvent } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MDEditor from '@uiw/react-md-editor';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  disabled = false,
}) => {
  const [content, setContent] = useState('');

  const handleSend = useCallback(() => {
    if (content.trim() && !disabled) {
      onSend(content.trim());
      setContent('');
    }
  }, [content, onSend, disabled]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <MDEditor
            value={content}
            onChange={(value) => setContent(value || '')}
            preview="edit"
            hideToolbar={true}
            height={100}
            onKeyDown={handleKeyDown}
            textareaProps={{
              placeholder: '輸入訊息...',
              disabled: disabled,
            }}
          />
        </Box>
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!content.trim() || disabled}
          sx={{
            mt: 1,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}; 