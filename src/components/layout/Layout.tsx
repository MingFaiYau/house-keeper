import React from 'react';
import { Box, useTheme } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.mode === 'dark' ? '#121212' : '#fafafa',
        pb: 8,
      }}
    >
      {children}
    </Box>
  );
};

export default Layout;