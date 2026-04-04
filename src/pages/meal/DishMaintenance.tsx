import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  useTheme,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PageHeader from '../../components/PageHeader';
import { useMealPrepStore } from '../../stores/fdhStore';
import { DEFAULT_DISHES, type DishItem } from '../../types/fdh';
import { getLangText } from '../../i18n';
import IconPicker from '../../components/IconPicker';

const DishMaintenance: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { settings, loadSettings, updateSettings } = useMealPrepStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const getTitle = () => getLangText('菜餚維護', 'Dish Maintenance');

  const handleAddDish = () => {
    const newDish: DishItem = {
      id: `custom-${Date.now()}`,
      nameZh: '',
      nameEn: '',
      icon: '🍽️',
      category: 'main',
    };
    updateSettings({
      customDishes: [...settings.customDishes, newDish],
    });
  };

  const handleUpdateDish = (index: number, field: keyof DishItem, value: string) => {
    const updated = [...settings.customDishes];
    updated[index] = { ...updated[index], [field]: value };
    updateSettings({ customDishes: updated });
  };

  const handleDeleteDish = (index: number) => {
    const updated = settings.customDishes.filter((_, i) => i !== index);
    updateSettings({ customDishes: updated });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: isDark ? '#121212' : '#f5f5f5' }}>
      <PageHeader
        title={getTitle()}
        leftTitle
        backPath="/household"
      />

      <Box sx={{ flex: 1, overflow: 'auto', py: 1, pb: 10 }}>
        <Container maxWidth="lg">
        {/* Add Custom Dish Section */}
        <Card sx={{ mb: 3, bgcolor: isDark ? '#1e1e1e' : 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                🍳 {getLangText('自訂菜餚', 'Custom Dishes')}
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddDish}
                variant="contained"
                color="primary"
              >
                {getLangText('新增菜餚', 'Add Dish')}
              </Button>
            </Box>

            {settings.customDishes.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {getLangText('暫無自訂菜餚', 'No custom dishes yet')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getLangText('點擊上方「新增菜餚」按鈕添加', 'Click "Add Dish" button above to add')}
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {settings.customDishes.map((dish, index) => (
                  <Box
                    key={dish.id}
                    sx={{
                      p: 2,
                      bgcolor: isDark ? '#2a2a2a' : '#f9f9f9',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: isDark ? '#444' : '#e0e0e0',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <IconPicker
                        value={dish.icon}
                        onChange={(icon) => handleUpdateDish(index, 'icon', icon)}
                        label={getLangText('圖示', 'Icon')}
                      />
                      <TextField
                        label={getLangText('中文名', 'Chinese')}
                        value={dish.nameZh}
                        onChange={(e) => handleUpdateDish(index, 'nameZh', e.target.value)}
                        size="small"
                        sx={{ flexGrow: 1, minWidth: 120 }}
                        placeholder={getLangText('例如：清蒸魚', 'e.g., Steamed Fish')}
                      />
                      <TextField
                        label={getLangText('英文名', 'English')}
                        value={dish.nameEn}
                        onChange={(e) => handleUpdateDish(index, 'nameEn', e.target.value)}
                        size="small"
                        sx={{ flexGrow: 1, minWidth: 120 }}
                        placeholder="e.g., Steamed Fish"
                      />
                      <IconButton
                        onClick={() => handleDeleteDish(index)}
                        color="error"
                        sx={{ flexShrink: 0 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* Default Dishes */}
        <Card sx={{ bgcolor: isDark ? '#1e1e1e' : 'white' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              📋 {getLangText('預設菜餚', 'Default Dishes')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {DEFAULT_DISHES.map((dish) => (
                <Chip
                  key={dish.id}
                  icon={<span style={{ fontSize: '1.2rem' }}>{dish.icon}</span>}
                  label={getLangText(dish.nameZh, dish.nameEn)}
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Container>
      </Box>
    </Box>
  );
};

export default DishMaintenance;