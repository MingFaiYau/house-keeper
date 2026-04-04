import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  useTheme,
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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { format } from 'date-fns';
import { useMealPrepStore } from '../../stores/fdhStore';
import { type DishCourse, type Meal, type MealPeopleInfo } from '../../types/fdh';
import { getLangText } from '../../i18n';
import DateSelector from '../../components/DateSelector';
import PageHeader from '../../components/PageHeader';

const MEAL_TYPES = [
  { id: 'breakfast', icon: '🌅', labelZh: '早餐', labelEn: 'Breakfast' },
  { id: 'lunch', icon: '🍽️', labelZh: '午餐', labelEn: 'Lunch' },
  { id: 'afternoon_tea', icon: '☕', labelZh: '下午茶', labelEn: 'Afternoon Tea' },
  { id: 'dinner', icon: '🌙', labelZh: '晚餐', labelEn: 'Dinner' },
];

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
  const [addMealDialogOpen, setAddMealDialogOpen] = useState(false);
  const [newMealType, setNewMealType] = useState('breakfast');

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

  // Get meals as array for rendering
  const meals = currentPlan?.meals || {};
  const mealList = Object.entries(meals).map(([type, meal]) => ({ type, meal }));

  if (!currentPlan) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>{getLangText('載入中...', 'Loading...')}</Typography>
      </Box>
    );
  }

  const getTitle = () => getLangText('膳食安排', 'Meal Preparation');

  // Check if need to show meal details (familyMembers > 0 or guests > 0)
  const shouldShowMealDetails = (peopleInfo: MealPeopleInfo) => {
    return peopleInfo.familyMembers > 0 || peopleInfo.guests > 0;
  };

  // Update meal
  const updateMeal = (mealType: string, field: string, value: unknown) => {
    const meal = meals[mealType];
    if (!meal) return;
    const updatedMeal = { ...meal, [field]: value };
    updateDailyPlan({ meals: { ...meals, [mealType]: updatedMeal } });
  };

  // Update people info
  const updatePeopleInfo = (mealType: string, field: keyof MealPeopleInfo, value: unknown) => {
    const meal = meals[mealType];
    if (!meal) return;
    const updatedPeopleInfo = { ...meal.peopleInfo, [field]: value };
    updateMeal(mealType, 'peopleInfo', updatedPeopleInfo);
  };

  // Update a specific course in a meal
  const updateCourse = (mealType: string, courseIndex: number, field: string, value: unknown) => {
    const meal = meals[mealType];
    if (!meal) return;
    const courses = [...meal.courses];
    courses[courseIndex] = { ...courses[courseIndex], [field]: value };
    updateMeal(mealType, 'courses', courses);
  };

  // Add a new course
  const addCourse = (mealType: string) => {
    const meal = meals[mealType];
    if (!meal) return;
    const newCourse: DishCourse = {
      id: `${meal.courses.length + 1}`,
      courseNumber: meal.courses.length + 1,
      dish: null,
      ingredients: '',
    };
    updateMeal(mealType, 'courses', [...meal.courses, newCourse]);
  };

  // Remove a course
  const removeCourse = (mealType: string, courseIndex: number) => {
    const meal = meals[mealType];
    if (!meal) return;
    const courses = meal.courses.filter((_, i) => i !== courseIndex).map((c, i) => ({ ...c, courseNumber: i + 1 }));
    updateMeal(mealType, 'courses', courses);
  };

  // Add new meal
  const handleAddMeal = () => {
    if (meals[newMealType]) {
      setAddMealDialogOpen(false);
      return;
    }
    const emptyMeal: Meal = {
      type: newMealType,
      time: newMealType === 'breakfast' ? '08:00' : newMealType === 'afternoon_tea' ? '15:00' : '12:00',
      peopleInfo: { familyMembers: 0, guests: 0, remarks: '' },
      courses: [{ id: '1', courseNumber: 1, dish: null, ingredients: '' }],
      notes: '',
    };
    updateDailyPlan({ meals: { ...meals, [newMealType]: emptyMeal } });
    setAddMealDialogOpen(false);
  };

  // Remove meal
  const removeMeal = (mealType: string) => {
    const newMeals = { ...meals };
    delete newMeals[mealType];
    updateDailyPlan({ meals: newMeals });
  };

  const getMealLabel = (type: string) => {
    const mealType = MEAL_TYPES.find(m => m.id === type);
    if (mealType) {
      return getLangText(mealType.labelZh, mealType.labelEn);
    }
    return type;
  };

  const getMealIcon = (type: string) => {
    const mealType = MEAL_TYPES.find(m => m.id === type);
    return mealType?.icon || '🍽️';
  };

  const renderMealSection = (mealType: string, meal: Meal) => {
    const showDetails = shouldShowMealDetails(meal.peopleInfo);

    return (
      <Card key={mealType} sx={{ mb: 3, bgcolor: isDark ? '#1e1e1e' : 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {getMealIcon(mealType)} {getMealLabel(mealType)}
            </Typography>
            <IconButton size="small" color="error" onClick={() => removeMeal(mealType)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* People Info - Always show */}
          <Box sx={{ mb: 2, p: 2, bgcolor: isDark ? '#252525' : '#f8f8f8', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: isDark ? '#ddd' : '#333' }}>
              {getLangText('用餐人數', 'Number of Diners')}
            </Typography>

            {/* Family members */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, color: isDark ? '#aaa' : '#666' }}>
                {getLangText('家庭成員 (主人)', 'Family Members (Sir & Madam)')}
              </Typography>
              <ToggleButtonGroup
                value={meal.peopleInfo.familyMembers}
                exclusive
                onChange={(_, value) => value !== null && updatePeopleInfo(mealType, 'familyMembers', value)}
                size="small"
              >
                <ToggleButton value={0}>0</ToggleButton>
                <ToggleButton value={1}>1</ToggleButton>
                <ToggleButton value={2}>2</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Guests */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, color: isDark ? '#aaa' : '#666' }}>
                {getLangText('客人數量', 'Number of Guests')}
              </Typography>
              <TextField
                type="number"
                value={meal.peopleInfo.guests}
                onChange={(e) => updatePeopleInfo(mealType, 'guests', parseInt(e.target.value) || 0)}
                size="small"
                inputProps={{ min: 0 }}
                sx={{ width: 100 }}
              />
            </Box>

            {/* Guest remarks */}
            {(meal.peopleInfo.guests > 0 || meal.peopleInfo.familyMembers > 0) && (
              <TextField
                label={getLangText('特別備註 (例如：客人是誰？幾點到？)', 'Special Remarks (e.g., Who? What time?)')}
                value={meal.peopleInfo.remarks}
                onChange={(e) => updatePeopleInfo(mealType, 'remarks', e.target.value)}
                size="small"
                fullWidth
                multiline
                rows={2}
                placeholder={getLangText('例如：3位朋友，下午3點到', 'e.g., 3 friends, arriving at 3pm')}
              />
            )}
          </Box>

          {/* If both family members and guests are 0, FDH can plan her own meal */}
          {!showDetails && (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 2 }}>
              {getLangText('工人姐姐可以自行安排膳食', 'FDH can plan her own meal')}
            </Typography>
          )}

          {/* Time - only show if need to prepare for others */}
          {showDetails && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: isDark ? '#ccc' : 'inherit' }}>
                  {getLangText('用餐時間', 'Meal Time')}
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
            </>
          )}

          {/* Courses - only show if need to prepare for others */}
          {showDetails && (
            <>
              <Divider sx={{ my: 2 }} />

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
            </>
          )}

          {/* Notes - only show if need to prepare for others */}
          {showDetails && (
            <>
              <Divider sx={{ my: 2 }} />
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
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: isDark ? '#121212' : '#f5f5f5' }}>
      <PageHeader
        title={getTitle()}
        leftTitle
        backPath="/household"
        rightButtons={
          <>
            <IconButton onClick={() => setResetDialogOpen(true)} title={getLangText('重設', 'Reset')}>
              <RestartAltIcon />
            </IconButton>
            <IconButton onClick={() => navigate(`/household/meal/summary?date=${currentDate}`)} title={getLangText('總結', 'Summary')}>
              <ListAltIcon />
            </IconButton>
          </>
        }
      />

      <Box sx={{ flex: 1, overflow: 'auto', py: 1, pb: 10 }}>
        <Container maxWidth="sm">
          <DateSelector
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            isDark={isDark}
          />

        {/* Render all meals */}
        {mealList.map(({ type, meal }) => renderMealSection(type, meal))}

        {/* Add Meal Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={() => setAddMealDialogOpen(true)}
            fullWidth
          >
            {getLangText('新增用餐時段', 'Add Meal Section')}
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 2, mb: 4 }}>
          <Typography variant="body2" color="text.secondary">
            {getLangText('最後更新', 'Last Updated')}: {new Date(currentPlan.lastUpdated).toLocaleString()}
          </Typography>
        </Box>
      </Container>
      </Box>

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

      {/* Add Meal Dialog */}
      <Dialog open={addMealDialogOpen} onClose={() => setAddMealDialogOpen(false)}>
        <DialogTitle>{getLangText('新增用餐時段', 'Add Meal Section')}</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            {getLangText('選擇要新增的用餐時段', 'Select meal section to add')}
          </Typography>
          <FormControl fullWidth>
            <InputLabel>{getLangText('用餐時段', 'Meal Section')}</InputLabel>
            <Select
              value={newMealType}
              label={getLangText('用餐時段', 'Meal Section')}
              onChange={(e) => setNewMealType(e.target.value)}
            >
              {MEAL_TYPES.map(type => (
                <MenuItem
                  key={type.id}
                  value={type.id}
                  disabled={!!meals[type.id]}
                >
                  {type.icon} {getLangText(type.labelZh, type.labelEn)} {meals[type.id] ? `(${getLangText('已存在', 'Already exists')})` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMealDialogOpen(false)}>
            {getLangText('取消', 'Cancel')}
          </Button>
          <Button onClick={handleAddMeal} variant="contained">
            {getLangText('新增', 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DailyPlan;