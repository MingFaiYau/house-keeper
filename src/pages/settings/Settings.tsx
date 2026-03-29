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
  Switch,
  List,
  ListItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';
import HomeIcon from '@mui/icons-material/Home';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import { useSettingsStore } from '../../stores/settingsStore';
import { getLangText } from '../../i18n';

// Version is updated automatically by pre-commit hook
const APP_VERSION = '1.0.0';

const AppSettings: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const { settings: appSettings, setLanguage, setTheme, setModuleEnabled, isModuleEnabled } = useSettingsStore();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: isDark ? '#121212' : '#f5f5f5' }}>
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: isDark ? '#1e1e1e' : '#fff' }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate('/home')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {getLangText('設定', 'Settings')}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, overflow: 'auto', py: 1, pb: 10 }}>
        <Container maxWidth="sm">
          {/* Language & Theme Settings */}
          <Card sx={{ bgcolor: isDark ? '#1e1e1e' : 'white' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {getLangText('語言與主題', 'Language & Theme')}
              </Typography>

              {/* Language Selector */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LanguageIcon fontSize="small" />
                  {getLangText('語言', 'Language')}
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
                  {getLangText('主題', 'Theme')}
                </Typography>
                <ToggleButtonGroup
                  value={appSettings.theme}
                  exclusive
                  onChange={(_, value) => value && setTheme(value)}
                  size="small"
                  fullWidth
                >
                  <ToggleButton value="light">
                    {getLangText('淺色', 'Light')}
                  </ToggleButton>
                  <ToggleButton value="dark">
                    {getLangText('深色', 'Dark')}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </CardContent>
          </Card>

          {/* Module Settings */}
          <Card sx={{ bgcolor: isDark ? '#1e1e1e' : 'white', mt: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {getLangText('模組', 'Modules')}
              </Typography>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <HomeIcon fontSize="small" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1">
                        {getLangText('家務', 'Household')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getLangText('膳食計劃、家務清單', 'Meal plans, chore lists')}
                      </Typography>
                    </Box>
                    <Switch
                      checked={isModuleEnabled('household')}
                      onChange={(e) => setModuleEnabled('household', e.target.checked)}
                    />
                  </Box>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ChildCareIcon fontSize="small" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1">
                        {getLangText('寶寶', 'Baby')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getLangText('餵奶週期、寶寶資料', 'Feeding cycles, baby profile')}
                      </Typography>
                    </Box>
                    <Switch
                      checked={isModuleEnabled('baby')}
                      onChange={(e) => setModuleEnabled('baby', e.target.checked)}
                    />
                  </Box>
                </ListItem>
              </List>
            </CardContent>
          </Card>
          {/* Version */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {getLangText('版本', 'Version')} {APP_VERSION}
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AppSettings;