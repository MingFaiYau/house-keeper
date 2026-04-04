import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import { getLangText } from '../../i18n';

const BabyIndex: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const menuItems = [
    {
      id: 'feeding',
      icon: <ChildCareIcon sx={{ fontSize: 40 }} />,
      title: getLangText('餵奶週期', 'Feeding Cycle'),
      desc: getLangText('記錄BB每日餵奶週期', 'Track baby daily feeding cycles'),
      path: '/baby/feeding',
      color: '#EC407A',
      ready: true,
    },
    {
      id: 'profile',
      icon: <ChildCareIcon sx={{ fontSize: 40 }} />,
      title: getLangText('寶寶資料', 'Baby Profile'),
      desc: getLangText('BB基本資料', 'Baby basic info'),
      path: '/baby/profile',
      color: '#AB47BC',
      ready: true,
    },
    {
      id: 'settings',
      icon: <ChildCareIcon sx={{ fontSize: 40 }} />,
      title: getLangText('設定', 'Settings'),
      desc: getLangText('寶寶預設值設定', 'Baby default settings'),
      path: '/baby/settings',
      color: '#5C6BC0',
      ready: true,
    },
    {
      id: 'history',
      icon: <ChildCareIcon sx={{ fontSize: 40 }} />,
      title: getLangText('歷史記錄', 'History'),
      desc: getLangText('查看過往記錄', 'View past records'),
      path: '/baby/history',
      color: '#7E57C2',
      ready: false,
    },
    {
      id: 'stats',
      icon: <ChildCareIcon sx={{ fontSize: 40 }} />,
      title: getLangText('統計', 'Statistics'),
      desc: getLangText('BB成長統計', 'Baby growth stats'),
      path: '/baby/stats',
      color: '#5C6BC0',
      ready: false,
    },
  ];

  const handleCardClick = (item: typeof menuItems[0]) => {
    if (item.ready) {
      navigate(item.path);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: isDark ? '#121212' : '#f5f5f5' }}>
      <Box sx={{ flex: 1, overflow: 'auto', py: 2, pb: 10 }}>
        <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <ChildCareIcon sx={{ fontSize: 60, color: '#EC407A', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {getLangText('嬰兒護理', 'Baby Care')}
          </Typography>
        </Box>

        {/* Menu Cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {menuItems.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleCardClick(item)}
              sx={{
                cursor: item.ready ? 'pointer' : 'default',
                transition: 'all 0.2s',
                bgcolor: isDark ? '#1e1e1e' : 'white',
                opacity: item.ready ? 1 : 0.6,
                '&:hover': item.ready ? {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                } : {},
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 2,
                    bgcolor: `${item.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                  }}
                >
                  {item.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Box>
                {!item.ready && (
                  <Chip
                    label={getLangText('即將推出', 'Coming Soon')}
                    size="small"
                    sx={{ bgcolor: '#666', color: '#fff' }}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
      </Box>
    </Box>
  );
};

export default BabyIndex;