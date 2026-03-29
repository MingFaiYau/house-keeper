import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useSettingsStore } from '../stores/settingsStore';
import { getLangText } from '../i18n';

interface ModuleGuardProps {
  module: 'household' | 'baby';
  children: React.ReactNode;
}

const ModuleGuard: React.FC<ModuleGuardProps> = ({ module, children }) => {
  const navigate = useNavigate();
  const { isModuleEnabled } = useSettingsStore();

  if (!isModuleEnabled(module)) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
        textAlign: 'center',
      }}>
        <LockIcon sx={{ fontSize: 60, color: 'action', mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 1 }}>
          {getLangText('模組已停用', 'Module Disabled')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {getLangText('此模組已在設定中停用', 'This module has been disabled in settings')}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/settings')}>
          {getLangText('前往設定', 'Go to Settings')}
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
};

export default ModuleGuard;