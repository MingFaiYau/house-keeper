import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Pages
import MealPrepIndex from './pages/meal/MealPrepIndex';
import DailyPlan from './pages/meal/DailyPlan';
import PrintView from './pages/meal/PrintView';
import DishMaintenance from './pages/meal/DishMaintenance';
import SharedView from './pages/meal/SharedView';
import ChoresPage from './pages/chores/ChoresPage';
import AppSettings from './pages/settings/Settings';
import NotFoundPage from './pages/NotFound';

// Components
import BottomNav from './components/layout/BottomNav';

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
          {/* Home / Meal & Household Index - now at root */}
          <Route path="/" element={<MealPrepIndex />} />
          <Route path="/home" element={<Navigate to="/" replace />} />

          {/* Meal Preparation Module */}
          <Route path="/meal" element={<Navigate to="/" replace />} />
          <Route path="/meal/daily" element={<DailyPlan />} />
          <Route path="/meal/print" element={<PrintView />} />
          <Route path="/meal/dishes" element={<DishMaintenance />} />

          {/* Share View - Read only page for helper - NO nav bars */}
          <Route path="/share" element={<SharedView />} />

          {/* Household Chores Module */}
          <Route path="/chores" element={<ChoresPage />} />

          {/* App Settings (Language & Theme) */}
          <Route path="/settings" element={<AppSettings />} />

          {/* Baby Module - Placeholder */}
          <Route path="/baby" element={<PlaceholderPage title="寶寶成長記錄" subtitle="Baby Care Tracker" />} />
          <Route path="/baby/add" element={<PlaceholderPage title="新增活動" subtitle="Add Activity" />} />
          <Route path="/baby/history" element={<PlaceholderPage title="歷史記錄" subtitle="History" />} />
          <Route path="/baby/profile" element={<PlaceholderPage title="寶寶資料" subtitle="Baby Profile" />} />
          <Route path="/baby/stats" element={<PlaceholderPage title="統計" subtitle="Statistics" />} />

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
  if (location.pathname === '/share') return null;
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