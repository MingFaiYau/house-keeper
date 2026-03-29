import React from 'react';
import { Box, Container, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { getLangText } from '../i18n';

const NotFoundPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: isDark ? '#121212' : '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {getLangText('頁面不存在', 'Page Not Found')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {getLangText('抱歉，您訪問的頁面不存在', 'Sorry, the page you visited does not exist')}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/household/meal')}
          size="large"
        >
          {getLangText('返回首頁', 'Go to Home')}
        </Button>
      </Container>
    </Box>
  );
};

export default NotFoundPage;