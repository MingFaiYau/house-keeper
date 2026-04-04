import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
  TextField,
  Select,
  MenuItem,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSettingsStore } from '../../stores/settingsStore';
import { getLangText } from '../../i18n';
import PageHeader from '../../components/PageHeader';

// Default playing options (migrated from preset)
const DEFAULT_PLAY_OPTIONS = [
  { id: 'black_white_card', icon: '🃏', labelZh: '黑白卡片', labelEn: 'Black & White Card' },
  { id: 'hold_toys', icon: '🧸', labelZh: '拿玩具', labelEn: 'Hold Toys' },
  { id: 'sing_songs', icon: '🎵', labelZh: '唱兒歌', labelEn: 'Sing Songs' },
  { id: 'outdoor', icon: '🌳', labelZh: '戶外', labelEn: 'Outdoor' },
  { id: 'tummy_time', icon: '🤸', labelZh: '趴趴時間', labelEn: 'Tummy Time' },
  { id: 'play_alone', icon: '👶', labelZh: '自己玩', labelEn: 'Play Alone' },
  { id: 'listen_music', icon: '🎧', labelZh: '聽音樂', labelEn: 'Listen to Music' },
  { id: 'others', icon: '✨', labelZh: '其他', labelEn: 'Others' },
];

const BabySettings: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { settings, setBabyDefaults, setDefaultBabySection, addCustomPlayOption, updateCustomPlayOption, deleteCustomPlayOption } = useSettingsStore();
  const { baby, defaultBabySection } = settings;

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editOption, setEditOption] = useState<{ id: string; icon: string; labelZh: string; labelEn: string } | null>(null);
  const [newOption, setNewOption] = useState({ icon: '🎯', labelZh: '', labelEn: '' });

  // Initialize with default play options if empty
  useEffect(() => {
    if (baby.customPlayOptions.length === 0) {
      setBabyDefaults({ customPlayOptions: DEFAULT_PLAY_OPTIONS });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get all options from customPlayOptions
  const allOptions = baby.customPlayOptions;

  const handleAddOption = () => {
    if (newOption.labelZh && newOption.labelEn) {
      const id = 'custom_' + Date.now();
      addCustomPlayOption({ id, icon: newOption.icon, labelZh: newOption.labelZh, labelEn: newOption.labelEn });
      setNewOption({ icon: '🎯', labelZh: '', labelEn: '' });
      setShowAddDialog(false);
    }
  };

  const handleEditOption = () => {
    if (editOption && editOption.labelZh && editOption.labelEn) {
      updateCustomPlayOption(editOption.id, { icon: editOption.icon, labelZh: editOption.labelZh, labelEn: editOption.labelEn });
      setEditOption(null);
    }
  };

  const handleDeleteOption = (id: string) => {
    deleteCustomPlayOption(id);
    // Also remove from playOptions selection if selected
    setBabyDefaults({ playOptions: baby.playOptions.filter(p => p !== id) });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: isDark ? '#121212' : '#f5f5f5' }}>
      <PageHeader
        title={getLangText('寶寶設定', 'Baby Settings')}
        leftTitle
      />

      <Box sx={{ flex: 1, overflow: 'auto', py: 1, pb: 10 }}>
        <Container maxWidth="sm">
          {/* Default Baby Section */}
          <Card sx={{ bgcolor: isDark ? '#1e1e1e' : 'white', mt: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {getLangText('預設進入頁面', 'Default Entry Page')}
              </Typography>
              <ToggleButtonGroup
                value={defaultBabySection || ''}
                exclusive
                onChange={(_, value) => setDefaultBabySection(value || undefined)}
                size="small"
                fullWidth
              >
                <ToggleButton value="">
                  {getLangText('首頁', 'Home')}
                </ToggleButton>
                <ToggleButton value="feeding">
                  {getLangText('餵奶', 'Feeding')}
                </ToggleButton>
                <ToggleButton value="profile">
                  {getLangText('資料', 'Profile')}
                </ToggleButton>
              </ToggleButtonGroup>
            </CardContent>
          </Card>

          {/* Default Values */}
          <Card sx={{ bgcolor: isDark ? '#1e1e1e' : 'white', mt: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {getLangText('預設值', 'Default Values')}
              </Typography>

              {/* Default Milk Amount */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {getLangText('預設奶量 (ml)', 'Default Milk (ml)')}
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={baby.defaultMilkAmount}
                  onChange={(e) => setBabyDefaults({ defaultMilkAmount: Math.min(500, Math.max(0, parseInt(e.target.value) || 150)) })}
                  inputProps={{ min: 0, max: 500, step: 5 }}
                  sx={{ width: 120 }}
                />
              </Box>

              {/* Feeding Cycle Min Time */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {getLangText('週期最少時間 (分鐘)', 'Cycle Min Time (minutes)')}
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={baby.feedingCycleMinTime}
                  onChange={(e) => setBabyDefaults({ feedingCycleMinTime: parseInt(e.target.value) || 180 })}
                  inputProps={{ min: 30, max: 480, step: 30 }}
                  sx={{ width: 120 }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Playing Options */}
          <Card sx={{ bgcolor: isDark ? '#1e1e1e' : 'white', mt: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {getLangText('玩耍選項', 'Playing Options')}
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddDialog(true)}
                >
                  {getLangText('新增', 'Add')}
                </Button>
              </Box>

              {/* Select which options to show */}
              {allOptions.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {getLangText('選擇顯示', 'Select to show')}
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      multiple
                      value={baby.playOptions}
                      onChange={(e) => setBabyDefaults({ playOptions: e.target.value as string[] })}
                      renderValue={(selected) =>
                        (selected as string[])
                          .map((id) => allOptions.find((p) => p.id === id))
                          .filter(Boolean)
                          .map((opt) => getLangText(opt!.labelZh, opt!.labelEn))
                          .join(', ')
                      }
                    >
                      {allOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.icon} {getLangText(option.labelZh, option.labelEn)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {/* All options list */}
              {allOptions.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {getLangText('暫無選項，點擊新增添加', 'No options yet, click Add to add')}
                </Typography>
              ) : (
                <List dense>
                  {allOptions.map((opt) => (
                    <ListItem key={opt.id}>
                      <ListItemText
                        primary={`${opt.icon} ${getLangText(opt.labelZh, opt.labelEn)}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => setEditOption({ id: opt.id, icon: opt.icon, labelZh: opt.labelZh, labelEn: opt.labelEn })}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleDeleteOption(opt.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Add Option Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
        <DialogTitle>{getLangText('新增玩耍選項', 'Add Playing Option')}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label={getLangText('圖示', 'Icon')}
              size="small"
              value={newOption.icon}
              onChange={(e) => setNewOption({ ...newOption, icon: e.target.value })}
              sx={{ width: 100 }}
            />
            <TextField
              label={getLangText('名稱 (中文)', 'Name (Chinese)')}
              size="small"
              value={newOption.labelZh}
              onChange={(e) => setNewOption({ ...newOption, labelZh: e.target.value })}
              fullWidth
            />
            <TextField
              label={getLangText('名稱 (英文)', 'Name (English)')}
              size="small"
              value={newOption.labelEn}
              onChange={(e) => setNewOption({ ...newOption, labelEn: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>{getLangText('取消', 'Cancel')}</Button>
          <Button variant="contained" onClick={handleAddOption}>{getLangText('新增', 'Add')}</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Option Dialog */}
      <Dialog open={!!editOption} onClose={() => setEditOption(null)}>
        <DialogTitle>{getLangText('編輯玩耍選項', 'Edit Playing Option')}</DialogTitle>
        <DialogContent>
          {editOption && (
            <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label={getLangText('圖示', 'Icon')}
                size="small"
                value={editOption.icon}
                onChange={(e) => setEditOption({ ...editOption, icon: e.target.value })}
                sx={{ width: 100 }}
              />
              <TextField
                label={getLangText('名稱 (中文)', 'Name (Chinese)')}
                size="small"
                value={editOption.labelZh}
                onChange={(e) => setEditOption({ ...editOption, labelZh: e.target.value })}
                fullWidth
              />
              <TextField
                label={getLangText('名稱 (英文)', 'Name (English)')}
                size="small"
                value={editOption.labelEn}
                onChange={(e) => setEditOption({ ...editOption, labelEn: e.target.value })}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOption(null)}>{getLangText('取消', 'Cancel')}</Button>
          <Button variant="contained" onClick={handleEditOption}>{getLangText('儲存', 'Save')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BabySettings;