import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  Divider,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { format } from 'date-fns';
import { useMealPrepStore } from '../../stores/fdhStore';
import { type DishCourse, type Meal } from '../../types/fdh';
import { getLangText } from '../../i18n';
import DateSelector from '../../components/DateSelector';

const DailyPlan: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme.palette.mode === 'dark';

  // Check for date query parameter
  const searchParams = new URLSearchParams(location.search);
  const dateParam = searchParams.get('date');
  const initialDate = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : format(new Date(), 'yyyy-MM-dd');

  const [currentDate, setCurrentDate] = useState(initialDate);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const {
    currentPlan,
    loadSettings,
    loadDailyPlan,
    updateDailyPlan,
    getAllDishes,
    resetDailyPlan,
  } = useMealPrepStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    loadDailyPlan(currentDate);
  }, [currentDate, loadDailyPlan]);

  const allDishes = getAllDishes();

  if (!currentPlan) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>{getLangText('載入中...', 'Loading...')}</Typography>
      </Box>
    );
  }

  const getTitle = () => getLangText('膳食安排', 'Meal Preparation');

  // Update meal (lunch or dinner)
  const updateMeal = (mealType: 'lunch' | 'dinner', field: string, value: unknown) => {
    const meal = currentPlan[mealType];
    const updatedMeal = { ...meal, [field]: value };
    updateDailyPlan({ [mealType]: updatedMeal });
  };

  // Update a specific course in a meal
  const updateCourse = (mealType: 'lunch' | 'dinner', courseIndex: number, field: string, value: unknown) => {
    const meal = currentPlan[mealType];
    const courses = [...meal.courses];
    courses[courseIndex] = { ...courses[courseIndex], [field]: value };
    updateMeal(mealType, 'courses', courses);
  };

  // Add a new course
  const addCourse = (mealType: 'lunch' | 'dinner') => {
    const meal = currentPlan[mealType];
    const newCourse: DishCourse = {
      id: `${meal.courses.length + 1}`,
      courseNumber: meal.courses.length + 1,
      dish: null,
      ingredients: '',
    };
    updateMeal(mealType, 'courses', [...meal.courses, newCourse]);
  };

  // Remove a course
  const removeCourse = (mealType: 'lunch' | 'dinner', courseIndex: number) => {
    const meal = currentPlan[mealType];
    const courses = meal.courses.filter((_, i) => i !== courseIndex).map((c, i) => ({ ...c, courseNumber: i + 1 }));
    updateMeal(mealType, 'courses', courses);
  };

  const renderMealSection = (mealType: 'lunch' | 'dinner', meal: Meal, icon: string) => {
    const isLunch = mealType === 'lunch';
    const timeLabel = isLunch ? getLangText('午餐時間', 'Lunch Time') : getLangText('晚餐時間', 'Dinner Time');
    const mealLabel = isLunch ? getLangText('午餐', 'Lunch') : getLangText('晚餐', 'Dinner');

    return (
      <Card sx={{ mb: 3, bgcolor: isDark ? '#1e1e1e' : 'white' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: isLunch ? 'primary.main' : 'secondary.main' }}>
            {icon} {mealLabel}
          </Typography>

          {/* Time */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: isDark ? '#ccc' : 'inherit' }}>
              {timeLabel}
            </Typography>
            <TextField
              type="time"
              value={meal.time}
              onChange={(e) => updateMeal(mealType, 'time', e.target.value)}
              size="small"
              fullWidth
              sx={{
                '& .MuiInputLabel-root': { color: isDark ? '#aaa' : 'inherit' },
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#fff' : 'inherit',
                  '& fieldset': { borderColor: isDark ? '#444' : '#ccc' },
                },
                '& input[type="time"]::-webkit-calendar-picker-indicator': {
                  filter: isDark ? 'invert(1)' : 'none',
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Courses */}
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            {getLangText('菜式', 'Dishes')}
          </Typography>
          {meal.courses.map((course, index) => (
            <Box key={course.id} sx={{ mb: 2, p: 2, bgcolor: isDark ? '#2a2a2a' : '#f5f5f5', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 60 }}>
                  #{course.courseNumber}
                </Typography>
                <FormControl size="small" fullWidth>
                  <InputLabel>{getLangText('選擇菜餚', 'Select Dish')}</InputLabel>
                  <Select
                    value={course.dish?.id || ''}
                    label={getLangText('選擇菜餚', 'Select Dish')}
                    onChange={(e) => {
                      const dish = allDishes.find(d => d.id === e.target.value);
                      updateCourse(mealType, index, 'dish', dish || null);
                    }}
                  >
                    <MenuItem value="">{getLangText('無', 'None')}</MenuItem>
                    {allDishes.map(dish => (
                      <MenuItem key={dish.id} value={dish.id}>
                        {dish.icon} {getLangText(dish.nameZh, dish.nameEn)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {meal.courses.length > 1 && (
                  <IconButton size="small" color="error" onClick={() => removeCourse(mealType, index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <TextField
                label={getLangText('食材/份量', 'Ingredients/Portion')}
                value={course.ingredients}
                onChange={(e) => updateCourse(mealType, index, 'ingredients', e.target.value)}
                size="small"
                fullWidth
                placeholder={getLangText('例如：牛肉200g，洋蔥1個', 'e.g., Beef 200g, Onion 1')}
              />
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => addCourse(mealType)}
            size="small"
            variant="outlined"
            sx={{ mt: 1 }}
          >
            {getLangText('新增菜式', 'Add Dish')}
          </Button>

          <Divider sx={{ my: 2 }} />

          {/* Extra Guests */}
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            {getLangText('額外客人', 'Extra Guests')}
          </Typography>
          <RadioGroup
            row
            value={meal.extraGuests ? 'yes' : 'no'}
            onChange={(e) => updateMeal(mealType, 'extraGuests', e.target.value === 'yes')}
          >
            <FormControlLabel value="yes" control={<Radio />} label={getLangText('是', 'Yes')} />
            <FormControlLabel value="no" control={<Radio />} label={getLangText('否', 'No')} />
          </RadioGroup>
          {meal.extraGuests && (
            <TextField
              type="number"
              label={getLangText('人數', 'Number of guests')}
              value={meal.extraGuestCount}
              onChange={(e) => updateMeal(mealType, 'extraGuestCount', parseInt(e.target.value) || 0)}
              size="small"
              sx={{ mt: 1, width: '100%' }}
              inputProps={{ min: 1 }}
            />
          )}

          <Divider sx={{ my: 2 }} />

          {/* Notes */}
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            {getLangText('備註', 'Notes')}
          </Typography>
          <TextField
            multiline
            rows={2}
            fullWidth
            placeholder={getLangText('輸入備註...', 'Enter notes...')}
            value={meal.notes}
            onChange={(e) => updateMeal(mealType, 'notes', e.target.value)}
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? '#121212' : '#f5f5f5' }}>
      <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: isDark ? '#1e1e1e' : '#fff' }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {getTitle()}
          </Typography>
          <IconButton onClick={() => setResetDialogOpen(true)} title={getLangText('重設', 'Reset')}>
            <RestartAltIcon />
          </IconButton>
          <IconButton onClick={() => navigate(`/meal/print?date=${currentDate}`)} title={getLangText('分享', 'Share')}>
            <PrintIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 3 }}>
        <DateSelector
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          isDark={isDark}
        />

        {renderMealSection('lunch', currentPlan.lunch, '🍽️')}
        {renderMealSection('dinner', currentPlan.dinner, '🌙')}

        <Box sx={{ textAlign: 'center', mt: 2, mb: 4 }}>
          <Typography variant="body2" color="text.secondary">
            {getLangText('最後更新', 'Last Updated')}: {new Date(currentPlan.lastUpdated).toLocaleString()}
          </Typography>
        </Box>
      </Container>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
        <DialogTitle>{getLangText('確認重設', 'Confirm Reset')}</DialogTitle>
        <DialogContent>
          <Typography>
            {getLangText('確定要重設當天所有安排嗎？', 'Are you sure you want to reset all plans for this day?')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>
            {getLangText('取消', 'Cancel')}
          </Button>
          <Button
            onClick={() => {
              resetDailyPlan();
              setResetDialogOpen(false);
            }}
            color="error"
            variant="contained"
          >
            {getLangText('確認重設', 'Confirm Reset')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DailyPlan;