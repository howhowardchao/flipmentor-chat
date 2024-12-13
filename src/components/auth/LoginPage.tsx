import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Fade,
  CircularProgress,
} from '@mui/material';
import { LoginCredentials } from '@/shared/types/auth';

interface LoginPageProps {
  onLogin: (credentials: LoginCredentials) => void;
  error?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error }) => {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 模擬網絡延遲
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onLogin({ password });
    setIsSubmitting(false);
  };

  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <Typography 
              component="h1" 
              variant="h5" 
              gutterBottom
              sx={{
                fontWeight: 500,
                color: theme => theme.palette.primary.main,
              }}
            >
              FlipMentor 登入
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="密碼"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!error}
                helperText={error}
                disabled={isSubmitting}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme => theme.palette.primary.main,
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  height: 48,
                  position: 'relative',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme => theme.shadows[4],
                  },
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                ) : (
                  '登入'
                )}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Fade>
  );
}; 