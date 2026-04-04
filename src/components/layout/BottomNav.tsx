import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import BabyChangingStationIcon from '@mui/icons-material/ChildCare';
import SettingsIcon from '@mui/icons-material/Settings';
import { getLangText } from '../../i18n';
import { useSettingsStore } from '../../stores/settingsStore';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isModuleEnabled, settings } = useSettingsStore();

  const getValue = () => {
    if (location.pathname === '/home') return 'home';
    if (location.pathname.startsWith('/baby')) return 'baby';
    if (location.pathname.startsWith('/settings')) return 'settings';
    if (location.pathname.startsWith('/household')) return 'household';
    return 'household';
  };

  const handleBabyClick = () => {
    const defaultSection = settings.defaultBabySection;
    if (defaultSection) {
      navigate(`/baby/${defaultSection}`);
    } else {
      navigate('/baby');
    }
  };

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}
      elevation={3}
    >
      <BottomNavigation
        value={getValue()}
        onChange={(_, newValue) => {
          if (newValue === 'baby') {
            handleBabyClick();
          } else {
            navigate(`/${newValue}`);
          }
        }}
        showLabels
      >
        <BottomNavigationAction
          label={getLangText('首頁', 'Home')}
          value="home"
          icon={<HomeIcon />}
        />
        {isModuleEnabled('baby') && (
          <BottomNavigationAction
            label={getLangText('寶寶', 'Baby')}
            value="baby"
            icon={<BabyChangingStationIcon />}
          />
        )}
        {isModuleEnabled('household') && (
          <BottomNavigationAction
            label={getLangText('家務', 'Household')}
            value="household"
            icon={<HomeIcon />}
          />
        )}
        <BottomNavigationAction
          label={getLangText('設定', 'Settings')}
          value="settings"
          icon={<SettingsIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;