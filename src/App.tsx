import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Pages
import HomePage from './pages/home/HomePage';
import MealPrepIndex from './pages/meal/MealPrepIndex';
import DailyPlan from './pages/meal/DailyPlan';
import SummaryView from './pages/meal/SummaryView';
import DishMaintenance from './pages/meal/DishMaintenance';
import SharedView from './pages/meal/SharedView';
import ChoresPage from './pages/chores/ChoresPage';
import AppSettings from './pages/settings/Settings';
import NotFoundPage from './pages/NotFound';
import BabyFeedingCycle from './pages/baby/BabyFeedingCycle';
import BabyIndex from './pages/baby/BabyIndex';
import BabyProfilePage from './pages/baby/BabyProfilePage';
import BabySettings from './pages/baby/BabySettings';
import BabyPageGuard from './components/baby/BabyPageGuard';

// Components
import BottomNav from './components/layout/BottomNav';
import ModuleGuard from './components/ModuleGuard';

// Initialize i18n
import './i18n';
import { useSettingsStore, loadSettings } from './stores/settingsStore';

const App: React.FC = () => {
  const { settings, getEffectiveTheme } = useSettingsStore();
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    const theme = getEffectiveTheme();
    console.log('[App] settings.theme:', settings.theme, 'effectiveTheme:', theme);
    setEffectiveTheme(theme);
  }, [settings.theme, getEffectiveTheme]);

  const theme = createTheme({
    palette: {
      mode: effectiveTheme,
      primary: {
        main: '#26A69A',
      },
      secondary: {
        main: '#FF7043',
      },
      background: {
        default: effectiveTheme === 'dark' ? '#121212' : '#fafafa',
        paper: effectiveTheme === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Home Module */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />

          {/* Household Module */}
          <Route path="/household" element={<ModuleGuard module="household"><MealPrepIndex /></ModuleGuard>} />
          <Route path="/household/meal" element={<ModuleGuard module="household"><DailyPlan /></ModuleGuard>} />
          <Route path="/household/meal/summary" element={<ModuleGuard module="household"><SummaryView /></ModuleGuard>} />
          <Route path="/household/meal/share" element={<ModuleGuard module="household"><SharedView /></ModuleGuard>} />
          <Route path="/household/meal/dishes" element={<ModuleGuard module="household"><DishMaintenance /></ModuleGuard>} />
          <Route path="/household/chores" element={<ModuleGuard module="household"><ChoresPage /></ModuleGuard>} />

          {/* App Settings (Language & Theme) */}
          <Route path="/settings" element={<AppSettings />} />

          {/* Baby Module */}
          <Route path="/baby" element={<ModuleGuard module="baby"><BabyIndex /></ModuleGuard>} />
          <Route path="/baby/feeding" element={<ModuleGuard module="baby"><BabyPageGuard><BabyFeedingCycle /></BabyPageGuard></ModuleGuard>} />
          <Route path="/baby/add" element={<ModuleGuard module="baby"><BabyPageGuard><PlaceholderPage title="新增活動" subtitle="Add Activity" /></BabyPageGuard></ModuleGuard>} />
          <Route path="/baby/history" element={<ModuleGuard module="baby"><BabyPageGuard><PlaceholderPage title="歷史記錄" subtitle="History" /></BabyPageGuard></ModuleGuard>} />
          <Route path="/baby/profile" element={<ModuleGuard module="baby"><BabyProfilePage /></ModuleGuard>} />
          <Route path="/baby/settings" element={<ModuleGuard module="baby"><BabySettings /></ModuleGuard>} />
          <Route path="/baby/stats" element={<ModuleGuard module="baby"><BabyPageGuard><PlaceholderPage title="統計" subtitle="Statistics" /></BabyPageGuard></ModuleGuard>} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <BottomNavWrapper />
      </BrowserRouter>
    </ThemeProvider>
  );
};

// Wrapper to hide BottomNav on share page
const BottomNavWrapper: React.FC = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/household/meal/share')) return null;
  return <BottomNav />;
};

const PlaceholderPage: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h2>{title}</h2>
    <p>{subtitle}</p>
    <p style={{ color: '#666', marginTop: '20px' }}>Coming Soon / 即將推出</p>
  </div>
);

export default App;