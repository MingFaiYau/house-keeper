import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PrintIcon from '@mui/icons-material/Print';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { getLangText } from '../../i18n';

const MealPrepIndex: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const menuItems = [
    {
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      title: getLangText('膳食安排', 'Meal Preparation'),
      desc: getLangText('設置午餐晚餐時間和菜單', 'Set lunch & dinner time and menu'),
      path: '/meal/daily',
      color: theme.palette.primary.main,
    },
    {
      icon: <FastfoodIcon sx={{ fontSize: 40 }} />,
      title: getLangText('菜餚維護', 'Dish Maintenance'),
      desc: getLangText('新增和管理菜餚選項', 'Add and manage dish options'),
      path: '/meal/dishes',
      color: '#4caf50',
    },
    {
      icon: <PrintIcon sx={{ fontSize: 40 }} />,
      title: getLangText('分享膳食', 'Share Meal'),
      desc: getLangText('生成QR碼或連結分享給傭工', 'Generate QR code or link to share with helper'),
      path: '/meal/print',
      color: theme.palette.secondary.main,
    },
    {
      icon: <CleaningServicesIcon sx={{ fontSize: 40 }} />,
      title: getLangText('家務', 'Household Chores'),
      desc: getLangText('日常家務清單', 'Daily chores checklist'),
      path: '/chores',
      color: '#9c27b0',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? '#121212' : '#f5f5f5', pb: 8 }}>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <RestaurantIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {getLangText('膳食與家務', 'Meal & Household')}
          </Typography>
        </Box>

        {/* Menu Cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {menuItems.map((item) => (
            <Card
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                bgcolor: isDark ? '#1e1e1e' : 'white',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
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
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default MealPrepIndex;