import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getLangText } from '../../i18n';
import { useBabyStore } from '../../stores/babyStore';

interface BabyPageGuardProps {
  children: React.ReactNode;
}

const BabyPageGuard: React.FC<BabyPageGuardProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const { getDefaultBaby, loadSettings } = useBabyStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const defaultBaby = getDefaultBaby();

  if (!defaultBaby) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: isDark ? '#121212' : '#f5f5f5' }}>
        <Box sx={{ flex: 1, overflow: 'auto', py: 1, pb: 10 }}>
          <Container maxWidth="sm">
            <Card sx={{ bgcolor: isDark ? '#1e1e1e' : 'white', mt: 2 }}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h2" sx={{ mb: 2 }}>👶</Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {getLangText('請先選擇寶寶', 'Please Select a Baby')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {getLangText('在寶寶資料中添加並選擇寶寶後才能使用此功能', 'Add and select a baby in Baby Profile first')}
                </Typography>
                <Button variant="contained" onClick={() => navigate('/baby/profile')}>
                  {getLangText('前往寶寶資料', 'Go to Baby Profile')}
                </Button>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </Box>
    );
  }

  return <>{children}</>;
};

export default BabyPageGuard;