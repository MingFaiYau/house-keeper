import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Switch,
  Chip,
  useTheme,
} from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import StarIcon from '@mui/icons-material/Star';
import { getLangText } from '../../i18n';
import { useBabyStore } from '../../stores/babyStore';
import PageHeader from '../../components/PageHeader';
import { getAllBabyCycleDays, deleteBabyCycleData } from '../../services/fdhStorage';
import type { BabyProfile } from '../../types/fdh';

const BabyProfilePage: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { profiles, defaultBabyId, loadSettings, addProfile, updateProfile, deleteProfile, setDefaultBaby } = useBabyStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<BabyProfile | null>(null);
  const [deletingProfileId, setDeletingProfileId] = useState<string | null>(null);
  const [deletingProfileName, setDeletingProfileName] = useState('');
  const [hasBabyData, setHasBabyData] = useState(false);

  // Form state
  const [nameZh, setNameZh] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const getAgeString = (birthDate: string) => {
    if (!birthDate) return 'NA';
    const birth = new Date(birthDate);
    const today = new Date();

    const diffTime = today.getTime() - birth.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} ${getLangText('天', 'days')}`;
    }

    const totalMonths = Math.floor(diffDays / 30);
    if (totalMonths < 12) {
      return `${totalMonths} ${getLangText('個月', 'months')}`;
    }

    const years = Math.floor(totalMonths / 12);
    return `${years} ${getLangText('歲', 'years')}`;
  };

  const handleOpenDialog = (profile?: BabyProfile) => {
    if (profile) {
      setEditingProfile(profile);
      setNameZh(profile.nameZh);
      setNameEn(profile.nameEn);
      setBirthDate(profile.birthDate);
      setGender(profile.gender);
    } else {
      setEditingProfile(null);
      setNameZh('');
      setNameEn('');
      setBirthDate('');
      setGender('male');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProfile(null);
  };

  const handleSave = async () => {
    if (!nameZh.trim()) return;

    const profile: BabyProfile = {
      id: editingProfile?.id || `baby-${Date.now()}`,
      nameZh: nameZh.trim(),
      nameEn: nameEn.trim() || nameZh.trim(),
      birthDate,
      gender,
    };

    if (editingProfile) {
      await updateProfile(profile);
    } else {
      await addProfile(profile);
    }
    handleCloseDialog();
  };

  const handleOpenDeleteDialog = async (profile: BabyProfile) => {
    setDeletingProfileId(profile.id);
    setDeletingProfileName(profile.nameZh);

    // Check if baby has any data
    try {
      const allData = await getAllBabyCycleDays(profile.id);
      setHasBabyData(allData.length > 0);
    } catch (error) {
      setHasBabyData(false);
    }

    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deletingProfileId) {
      // Delete all baby cycle data first
      await deleteBabyCycleData(deletingProfileId);
      // Then delete the profile
      await deleteProfile(deletingProfileId);
    }
    setDeleteDialogOpen(false);
    setDeletingProfileId(null);
    setHasBabyData(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: isDark ? '#121212' : '#f5f5f5' }}>
      <PageHeader
        title={getLangText('寶寶資料', 'Baby Profile')}
        leftTitle
        backPath="/baby"
        rightButtons={
          <IconButton onClick={() => handleOpenDialog()}>
            <AddIcon />
          </IconButton>
        }
      />

      <Box sx={{ flex: 1, overflow: 'auto', py: 1, pb: 10 }}>
        <Container maxWidth="sm">
          {profiles.length === 0 ? (
            <Card sx={{ bgcolor: isDark ? '#1e1e1e' : 'white', mt: 2 }}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h2" sx={{ mb: 2 }}>👶</Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {getLangText('還沒有寶寶資料', 'No Baby Profiles')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {getLangText('點擊上方 + 按鈕新增寶寶資料', 'Click the + button above to add a baby profile')}
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
                  {getLangText('新增寶寶', 'Add Baby')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <List sx={{ py: 1 }}>
              {profiles.map(profile => (
                <ListItem
                  key={profile.id}
                  sx={{
                    bgcolor: isDark ? '#1e1e1e' : 'white',
                    borderRadius: 2,
                    mb: 1,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: profile.gender === 'male' ? '#1976d2' : '#e91e63' }}>
                      {profile.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {profile.nameZh}
                        </Typography>
                        {profile.id === defaultBabyId && (
                          <Chip
                            size="small"
                            icon={<StarIcon />}
                            label={getLangText('默認', 'Default')}
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {profile.nameEn}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {profile.birthDate ? `${profile.birthDate} (${getAgeString(profile.birthDate)})` : getLangText('未設定出生日期', 'No birth date')}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ mr: 1 }}>
                      {getLangText('默認', 'Default')}
                    </Typography>
                    <Switch
                      size="small"
                      checked={profile.id === defaultBabyId}
                      onChange={() => setDefaultBaby(profile.id)}
                    />
                    <IconButton size="small" onClick={() => handleOpenDialog(profile)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(profile)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Container>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProfile ? getLangText('編輯寶寶', 'Edit Baby') : getLangText('新增寶寶', 'Add Baby')}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={getLangText('中文名稱', 'Chinese Name')}
            fullWidth
            value={nameZh}
            onChange={(e) => setNameZh(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label={getLangText('英文名稱 (可選)', 'English Name (Optional)')}
            fullWidth
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
          />
          <TextField
            margin="dense"
            label={getLangText('出生日期', 'Birth Date')}
            type="date"
            fullWidth
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant={gender === 'male' ? 'contained' : 'outlined'}
              onClick={() => setGender('male')}
              startIcon={<MaleIcon />}
            >
              {getLangText('男', 'Male')}
            </Button>
            <Button
              variant={gender === 'female' ? 'contained' : 'outlined'}
              onClick={() => setGender('female')}
              startIcon={<FemaleIcon />}
            >
              {getLangText('女', 'Female')}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{getLangText('取消', 'Cancel')}</Button>
          <Button onClick={handleSave} variant="contained" disabled={!nameZh.trim()}>
            {getLangText('儲存', 'Save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ color: 'error.main' }}>
          {getLangText('確認刪除', 'Confirm Delete')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {getLangText(`確定要刪除「${deletingProfileName}」嗎？`, `Are you sure you want to delete "${deletingProfileName}"?`)}
          </Typography>
          {hasBabyData && (
            <Typography color="error" sx={{ mt: 2 }}>
              {getLangText('警告：此寶寶的所有餵奶記錄也會被刪除！', 'Warning: All feeding records for this baby will also be deleted!')}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{getLangText('取消', 'Cancel')}</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            {getLangText('確認刪除', 'Confirm Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BabyProfilePage;