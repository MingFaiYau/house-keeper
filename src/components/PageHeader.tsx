import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';

interface PageHeaderProps {
  title: string;
  titleEn?: string;
  showBack?: boolean;
  backPath?: string;
  rightButtons?: React.ReactNode;
  leftTitle?: boolean; // Show title on left side for large screens
  onBack?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  titleEn,
  showBack = true,
  backPath,
  rightButtons,
  leftTitle = false,
  onBack,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  // Title text - use bilingual if titleEn provided
  const titleText = titleEn ? `${title} (${titleEn})` : title;

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={1}
      sx={{ bgcolor: isDark ? '#1e1e1e' : '#fff' }}
    >
      <Toolbar variant="dense" sx={{ minHeight: 48 }}>
        {/* Left side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {showBack && (
            <IconButton edge="start" onClick={handleBack} size="small">
              <ArrowBackIcon />
            </IconButton>
          )}
          {leftTitle ? (
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}
            >
              {titleText}
            </Typography>
          ) : !rightButtons ? (
            // No right buttons - show title on left
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}
            >
              {titleText}
            </Typography>
          ) : null}
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Right side - action buttons */}
        {rightButtons && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {rightButtons}
          </Box>
        )}

        {/* If has right buttons but showBack is false, show title on right side */}
        {!showBack && rightButtons && (
          <Typography variant="h6" sx={{ fontWeight: 600, ml: 1 }}>
            {titleText}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default PageHeader;