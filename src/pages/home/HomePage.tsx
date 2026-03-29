import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../stores/settingsStore';
import { getLangText } from '../../i18n';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';
  const { isModuleEnabled } = useSettingsStore();

  const modules = [
    {
      id: 'household' as const,
      icon: <HomeIcon sx={{ fontSize: 40 }} />,
      title: getLangText('家務', 'Household'),
      desc: getLangText('膳食計劃、家務清單', 'Meal plans & chore lists'),
      color: theme.palette.primary.main,
      path: '/household',
    },
    {
      id: 'baby' as const,
      icon: <ChildCareIcon sx={{ fontSize: 40 }} />,
      title: getLangText('寶寶', 'Baby'),
      desc: getLangText('餵奶週期、寶寶資料', 'Feeding cycles & profile'),
      color: '#EC407A',
      path: '/baby',
    },
  ];

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: isDark ? '#121212' : '#f5f5f5',
      justifyContent: 'center',
      alignItems: 'center',
      p: 3,
    }}>
      <Box sx={{ maxWidth: 500, width: '100%' }}>
        {/* Welcome Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>👋</Typography>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
            {getLangText('歡迎', 'Welcome')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {getLangText('家庭日程管理', 'Family Schedule Manager')}
          </Typography>
        </Box>

        {/* Module Cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {modules.map((mod) => {
            const enabled = isModuleEnabled(mod.id);
            return (
              <Card
                key={mod.id}
                sx={{
                  bgcolor: isDark ? '#1e1e1e' : 'white',
                  opacity: enabled ? 1 : 0.6,
                }}
              >
                <CardActionArea
                  onClick={() => enabled && navigate(mod.path)}
                  disabled={!enabled}
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        bgcolor: `${mod.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: mod.color,
                      }}
                    >
                      {mod.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {mod.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {mod.desc}
                      </Typography>
                    </Box>
                    {!enabled && (
                      <LockIcon sx={{ fontSize: 24, color: '#999' }} />
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>

        {/* Footer Hint */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <LockIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {getLangText('解鎖更多功能', 'Unlock More Features')}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {getLangText('連接伺服器並登入以啟用更多模組', 'Connect to server and login to enable more modules')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;