import React from 'react';
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { getLangText } from '../../i18n';
import { useBabyStore } from '../../stores/babyStore';
import { useBabyCycleStore } from '../../stores/babyCycleStore';
import { format } from 'date-fns';
import type { BabyProfile } from '../../types/fdh';

const getAgeString = (birthDate: string) => {
  if (!birthDate) return 'NA';
  const birth = new Date(birthDate);
  const today = new Date();

  const diffTime = today.getTime() - birth.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays}d`;
  }

  const totalMonths = Math.floor(diffDays / 30);
  if (totalMonths < 12) {
    return `${totalMonths}m`;
  }

  const years = Math.floor(totalMonths / 12);
  return `${years}y`;
};

const BabySelector: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { profiles, defaultBabyId, loadSettings, getDefaultBaby } = useBabyStore();
  const { loadDay } = useBabyCycleStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  React.useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const defaultBaby = getDefaultBaby();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectBaby = (profile: BabyProfile) => {
    useBabyStore.getState().setDefaultBaby(profile.id);
    // Reload cycle data for the selected baby
    loadDay(format(new Date(), 'yyyy-MM-dd'), profile.id);
    handleClose();
  };

  if (profiles.length === 0) {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {getLangText('請先在寶寶資料中添加寶寶', 'Please add a baby in Baby Profile first')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Button
        variant="outlined"
        onClick={handleOpen}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          textTransform: 'none',
          borderColor: isDark ? '#555' : '#ccc',
        }}
      >
        {defaultBaby ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: defaultBaby.gender === 'male' ? '#1976d2' : '#e91e63',
              }}
            >
              {defaultBaby.gender === 'male' ? <MaleIcon fontSize="small" /> : <FemaleIcon fontSize="small" />}
            </Avatar>
            <Typography>{defaultBaby.nameZh}</Typography>
            <Typography variant="caption" color="text.secondary">
              ({getAgeString(defaultBaby.birthDate)})
            </Typography>
          </Box>
        ) : (
          <Typography>{getLangText('選擇寶寶', 'Select Baby')}</Typography>
        )}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {profiles.map((profile: BabyProfile) => (
          <MenuItem
            key={profile.id}
            onClick={() => handleSelectBaby(profile)}
            selected={profile.id === defaultBabyId}
          >
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: profile.gender === 'male' ? '#1976d2' : '#e91e63',
                }}
              >
                {profile.gender === 'male' ? <MaleIcon fontSize="small" /> : <FemaleIcon fontSize="small" />}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={profile.nameZh}
              secondary={profile.nameEn || getAgeString(profile.birthDate)}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default BabySelector;