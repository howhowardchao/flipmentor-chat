import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { TypewriterText } from './TypewriterText';
import { Message as MessageType } from '@/shared/types/chat';

interface MessageProps {
  message: MessageType;
  isTyping?: boolean;
}

export const Message: React.FC<MessageProps> = ({ message, isTyping = false }) => {
  const isAssistant = message.role === 'assistant';

  const renderContent = () => {
    if (isTyping && isAssistant) {
      return <TypewriterText text={message.content} />;
    }

    return (
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <Typography paragraph>{children}</Typography>,
          h1: ({ children }) => <Typography variant="h1">{children}</Typography>,
          h2: ({ children }) => <Typography variant="h2">{children}</Typography>,
          h3: ({ children }) => <Typography variant="h3">{children}</Typography>,
          h4: ({ children }) => <Typography variant="h4">{children}</Typography>,
          h5: ({ children }) => <Typography variant="h5">{children}</Typography>,
          h6: ({ children }) => <Typography variant="h6">{children}</Typography>,
          ul: ({ children }) => <Box component="ul" sx={{ pl: 2 }}>{children}</Box>,
          ol: ({ children }) => <Box component="ol" sx={{ pl: 2 }}>{children}</Box>,
          li: ({ children }) => <Typography component="li">{children}</Typography>,
          code: ({ inline, children }) => (
            <Typography
              component="code"
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                padding: inline ? '0.2em 0.4em' : '1em',
                borderRadius: '4px',
                display: inline ? 'inline' : 'block',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
              }}
            >
              {children}
            </Typography>
          ),
          blockquote: ({ children }) => (
            <Box
              component="blockquote"
              sx={{
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                pl: 2,
                my: 1,
              }}
            >
              {children}
            </Box>
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isAssistant ? 'flex-start' : 'flex-end',
        mb: 2,
      }}
    >
      {isAssistant && (
        <img
          src="/assets/images/assistant-small.png"
          alt="Assistant"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            marginRight: '8px',
          }}
        />
      )}
      <Box sx={{ maxWidth: '70%' }}>
        <Paper
          elevation={1}
          sx={{
            p: 2,
            backgroundColor: isAssistant ? 'grey.100' : 'primary.main',
            color: isAssistant ? 'text.primary' : 'white',
            borderRadius: 2,
          }}
        >
          {renderContent()}
        </Paper>
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: 'block',
            textAlign: isAssistant ? 'left' : 'right',
            color: 'text.secondary',
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Box>
      {!isAssistant && (
        <img
          src="/assets/images/user-avatar.png"
          alt="User"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            marginLeft: '8px',
          }}
        />
      )}
    </Box>
  );
}; 