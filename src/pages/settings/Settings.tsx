import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';
import { useSettingsStore } from '../../stores/settingsStore';
import { getLangText } from '../../i18n';

const AppSettings: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const { settings: appSettings, setLanguage, setTheme } = useSettingsStore();

  const getTitle = () => getLangText('設定', 'Settings');
  const getBilingualText = (zh: string, en: string) => getLangText(zh, en);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? '#121212' : '#f5f5f5' }}>
      <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: isDark ? '#1e1e1e' : '#fff' }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {getTitle()}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 3 }}>
        {/* Language & Theme Settings */}
        <Card sx={{ bgcolor: isDark ? '#1e1e1e' : 'white' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              ⚙️ {getBilingualText('語言與主題', 'Language & Theme')}
            </Typography>

            {/* Language Selector */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LanguageIcon fontSize="small" />
                {getBilingualText('語言', 'Language')}
              </Typography>
              <ToggleButtonGroup
                value={appSettings.language}
                exclusive
                onChange={(_, value) => value && setLanguage(value)}
                size="small"
                fullWidth
              >
                <ToggleButton value="zh-TW">繁體中文</ToggleButton>
                <ToggleButton value="en">English</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Theme Toggle */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                {isDark ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
                {getBilingualText('主題', 'Theme')}
              </Typography>
              <ToggleButtonGroup
                value={appSettings.theme}
                exclusive
                onChange={(_, value) => value && setTheme(value)}
                size="small"
                fullWidth
              >
                <ToggleButton value="light">
                  ☀️ {getBilingualText('淺色', 'Light')}
                </ToggleButton>
                <ToggleButton value="dark">
                  🌙 {getBilingualText('深色', 'Dark')}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AppSettings;