import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import BabyChangingStationIcon from '@mui/icons-material/ChildCare';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import { getLangText } from '../../i18n';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getValue = () => {
    if (location.pathname.startsWith('/baby')) return 'baby';
    if (location.pathname.startsWith('/settings')) return 'settings';
    return 'home';
  };

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}
      elevation={3}
    >
      <BottomNavigation
        value={getValue()}
        onChange={(_, newValue) => {
          navigate(`/${newValue}`);
        }}
        showLabels
      >
        <BottomNavigationAction
          label={getLangText('寶寶', 'Baby')}
          value="baby"
          icon={<BabyChangingStationIcon />}
        />
        <BottomNavigationAction
          label={getLangText('膳食與家務', 'Meal & Home')}
          value="home"
          icon={<HomeIcon />}
        />
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