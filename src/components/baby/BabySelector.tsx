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
  IconButton,
  useTheme,
  Dialog,
  DialogContent,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
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

interface BabySelectorProps {
  compact?: boolean;
  iconOnly?: boolean;
}

const BabySelector: React.FC<BabySelectorProps> = ({ compact = false, iconOnly = false }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { profiles, defaultBabyId, loadSettings, getDefaultBaby } = useBabyStore();
  const { loadDay } = useBabyCycleStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showInfo, setShowInfo] = React.useState(false);
  const [previewBabyId, setPreviewBabyId] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const defaultBaby = getDefaultBaby();
  // Current baby being previewed (defaults to default baby, changes with next/prev)
  const currentPreview = previewBabyId || defaultBabyId || (profiles[0]?.id || '');

  const getPreviewBaby = () => profiles.find(p => p.id === currentPreview);

  // Reset preview when dialog opens
  React.useEffect(() => {
    if (showInfo) {
      setPreviewBabyId(null);
    }
  }, [showInfo]);

  const handleOpen = (event?: React.MouseEvent<HTMLElement>) => {
    if (event?.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectBaby = (profile: BabyProfile) => {
    useBabyStore.getState().setDefaultBaby(profile.id);
    // Reload cycle data for the selected baby
    loadDay(format(new Date(), 'yyyy-MM-dd'), profile.id);
    // Close both dialog and menu
    setShowInfo(false);
    handleClose();
  };

  // Preview next baby (without committing)
  const handlePreviewNext = () => {
    if (profiles.length <= 1) return;
    const currentIndex = profiles.findIndex(p => p.id === currentPreview);
    const nextIndex = (currentIndex + 1) % profiles.length;
    setPreviewBabyId(profiles[nextIndex].id);
  };

  // Preview previous baby (without committing)
  const handlePreviewPrev = () => {
    if (profiles.length <= 1) return;
    const currentIndex = profiles.findIndex(p => p.id === currentPreview);
    const prevIndex = currentIndex - 1 < 0 ? profiles.length - 1 : currentIndex - 1;
    setPreviewBabyId(profiles[prevIndex].id);
  };

  // Confirm the switch
  const handleConfirmSwitch = () => {
    if (currentPreview !== defaultBabyId) {
      useBabyStore.getState().setDefaultBaby(currentPreview);
      loadDay(format(new Date(), 'yyyy-MM-dd'), currentPreview);
    }
    setShowInfo(false);
    setPreviewBabyId(null);
  };

  // Always render the dialog first
  const renderDialog = () => {
    const baby = getPreviewBaby();
    const hasMultiple = profiles.length > 1;
    const isPreviewing = previewBabyId !== null && previewBabyId !== defaultBabyId;

    return (
      <Dialog open={showInfo} onClose={() => setShowInfo(false)} maxWidth="sm" fullWidth>
        <IconButton
          onClick={() => setShowInfo(false)}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        {baby ? (
          <DialogContent sx={{ textAlign: 'center', py: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                bgcolor: baby.gender === 'male' ? '#1976d2' : '#e91e63',
                fontSize: '2rem',
              }}
            >
              {baby.nameEn ? baby.nameEn.charAt(0).toUpperCase() : baby.nameZh.charAt(0)}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {baby.nameZh}
            </Typography>
            {baby.nameEn && (
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {baby.nameEn}
              </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {getLangText('性別', 'Gender')}
                </Typography>
                <Typography>
                  {baby.gender === 'male' ? getLangText('男', 'Male') : getLangText('女', 'Female')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {getLangText('出生日期', 'Birth Date')}
                </Typography>
                <Typography>{baby.birthDate}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {getLangText('年齡', 'Age')}
                </Typography>
                <Typography>{getAgeString(baby.birthDate)}</Typography>
              </Box>
            </Box>
            {hasMultiple ? (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
                <Button variant="outlined" onClick={handlePreviewPrev}>
                  {getLangText('上一個', 'Prev')}
                </Button>
                <Button
                  variant={isPreviewing ? 'contained' : 'outlined'}
                  disabled={!isPreviewing}
                  onClick={handleConfirmSwitch}
                >
                  {getLangText('確認更換', 'Switch')}
                </Button>
                <Button variant="outlined" onClick={handlePreviewNext}>
                  {getLangText('下一個', 'Next')}
                </Button>
              </Box>
            ) : null}
          </DialogContent>
      ) : (
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {getLangText('請先在寶寶資料中添加寶寶', 'Please add a baby in Baby Profile first')}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowInfo(false)}
          >
            {getLangText('前往設定', 'Go to Settings')}
          </Button>
        </DialogContent>
      )}
    </Dialog>
  );
};

  // If no profiles and not iconOnly mode, show message
  if (profiles.length === 0 && !iconOnly) {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {getLangText('請先在寶寶資料中添加寶寶', 'Please add a baby in Baby Profile first')}
        </Typography>
      </Box>
    );
  }

  // If no profiles and iconOnly mode, render icon + dialog
  if (profiles.length === 0 && iconOnly) {
    return (
      <>
        <IconButton
          onClick={() => setShowInfo(true)}
          size="small"
          sx={{ color: isDark ? '#fff' : 'inherit' }}
        >
          <Avatar sx={{ width: 28, height: 28, bgcolor: 'grey.400' }}>
            <Typography sx={{ fontSize: '0.7rem' }}>?</Typography>
          </Avatar>
        </IconButton>
        {renderDialog()}
      </>
    );
  }

  // When iconOnly with profiles, also include dialog
  if (iconOnly) {
    return (
      <>
        <IconButton
          onClick={() => setShowInfo(true)}
          size="small"
          sx={{ color: isDark ? '#fff' : 'inherit' }}
        >
          {defaultBaby ? (
            <Avatar
              sx={{
                width: 28,
                height: 28,
                fontSize: '0.75rem',
                bgcolor: defaultBaby.gender === 'male' ? '#1976d2' : '#e91e63',
              }}
            >
              {defaultBaby.nameEn ? defaultBaby.nameEn.charAt(0).toUpperCase() : defaultBaby.nameZh.charAt(0)}
            </Avatar>
          ) : (
            <Avatar sx={{ width: 28, height: 28, bgcolor: 'grey.400' }}>
              <Typography sx={{ fontSize: '0.7rem' }}>?</Typography>
            </Avatar>
          )}
        </IconButton>
        {renderDialog()}
      </>
    );
  }

  return compact ? (
    <Button
      variant="text"
      onClick={handleOpen}
      endIcon={<ArrowDropDownIcon />}
      sx={{
        textTransform: 'none',
        color: isDark ? '#fff' : 'inherit',
        p: 0.5,
        minWidth: 'auto',
      }}
    >
      {defaultBaby ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Avatar
            sx={{
              width: 20,
              height: 20,
              fontSize: '0.7rem',
              bgcolor: defaultBaby.gender === 'male' ? '#1976d2' : '#e91e63',
            }}
          >
            {defaultBaby.gender === 'male' ? <MaleIcon sx={{ fontSize: 14 }} /> : <FemaleIcon sx={{ fontSize: 14 }} />}
          </Avatar>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{defaultBaby.nameZh}</Typography>
        </Box>
      ) : (
        <Typography sx={{ fontSize: '0.8rem' }}>{getLangText('選擇', 'Select')}</Typography>
      )}
    </Button>
  ) : (
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