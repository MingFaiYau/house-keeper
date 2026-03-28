import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { getLangText } from '../../i18n';
import { parseISO, getDay } from 'date-fns';

const MEAL_TYPES = [
  { id: 'breakfast', icon: '🌅', labelZh: '早餐', labelEn: 'Breakfast' },
  { id: 'lunch', icon: '🍽️', labelZh: '午餐', labelEn: 'Lunch' },
  { id: 'afternoon_tea', icon: '☕', labelZh: '下午茶', labelEn: 'Afternoon Tea' },
  { id: 'dinner', icon: '🌙', labelZh: '晚餐', labelEn: 'Dinner' },
];

// Helper to format date with day of week
const formatDateWithDay = (dateStr: string): string => {
  const date = parseISO(dateStr);
  const dayNamesZh = ['日', '一', '二', '三', '四', '五', '六'];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayIndex = getDay(date);
  return `${dateStr} (${getLangText('星期' + dayNamesZh[dayIndex], dayNamesEn[dayIndex])})`;
};

// Simplified data format from encoding - new flexible format
interface SharedPeopleInfo {
  familyMembers: number;
  guests: number;
  remarks: string;
}

interface SharedMealData {
  t: string; // time
  p: SharedPeopleInfo; // people info
  c: { n: string; i: string }[]; // courses (name + ingredients)
  n: string; // notes
}

interface SharedData {
  d: string; // date
  m: Record<string, SharedMealData>; // meals
  u: string; // lastUpdated
}

// Decode plan data from shared URL
const decodePlanData = (encoded: string): SharedData | null => {
  try {
    const decoded = decodeURIComponent(atob(encoded));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const SharedView: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [planData, setPlanData] = useState<SharedData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      const decoded = decodePlanData(data);
      if (decoded) {
        setPlanData(decoded);
      } else {
        setError(true);
      }
    } else {
      setError(true);
    }
  }, []);

  if (error || !planData) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: isDark ? '#121212' : '#f5f5f5', p: 3 }}>
        <Typography color="error">
          {getLangText('無法載入分享的資料', 'Unable to load shared data')}
        </Typography>
      </Box>
    );
  }

  const { d: date, m: meals, u: lastUpdated } = planData;
  const getTitle = () => getLangText('分享膳食', 'Share Meal');

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

  const renderMealSection = (type: string, mealData: SharedMealData) => {
    const showDetails = mealData.p.familyMembers > 0 || mealData.p.guests > 0;

    return (
      <Card key={type} sx={{ bgcolor: isDark ? '#1e1e1e' : 'white', mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: isDark ? '#fff' : '#000' }}>
            {getMealIcon(type)} {getLangText(getMealLabel(type), getMealLabel(type))}
          </Typography>

          {/* People Info */}
          <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#666', mb: 1 }}>
            {getLangText('用餐人數', 'Diners')}:
            {mealData.p.familyMembers > 0 && ` ${getLangText('主人', 'Family')}${mealData.p.familyMembers}${getLangText('位', '')}`}
            {mealData.p.guests > 0 && `, ${getLangText('客人', 'Guests')}${mealData.p.guests}${getLangText('位', '')}`}
            {mealData.p.familyMembers === 0 && mealData.p.guests === 0 && ` ${getLangText('工人姐姐自行安排', 'FDH plans her own')}`}
          </Typography>

          {mealData.p.remarks && (
            <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666', mb: 2 }}>
              {getLangText('客人備註', 'Guest Remarks')}: {mealData.p.remarks}
            </Typography>
          )}

          {/* If no one to cook for */}
          {!showDetails && (
            <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666', fontStyle: 'italic', mb: 2 }}>
              {getLangText('工人姐姐可以自行安排膳食', 'FDH can plan her own meal')}
            </Typography>
          )}

          {/* Time - only if need to prepare */}
          {showDetails && (
            <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#666', mb: 2 }}>
              {getLangText('時間', 'Time')}: {mealData.t}
            </Typography>
          )}

          {/* Courses - only if need to prepare */}
          {showDetails && (
            <>
              <Typography variant="body2" sx={{ fontWeight: 500, color: isDark ? '#ccc' : '#666', mb: 1 }}>
                {getLangText('菜式', 'Dishes')}:
              </Typography>
              {mealData.c.map((course, idx) => (
                <Box key={idx} sx={{ mb: 1, p: 1, bgcolor: isDark ? '#2a2a2a' : '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#fff' : '#000' }}>
                    {idx + 1}. {course.n}
                  </Typography>
                  {course.i && (
                    <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666' }}>
                      {getLangText('食材', 'Ingredients')}: {course.i}
                    </Typography>
                  )}
                </Box>
              ))}
              {mealData.c.length === 0 && (
                <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666' }}>-</Typography>
              )}
            </>
          )}

          {/* Notes - only if need to prepare */}
          {showDetails && mealData.n && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: isDark ? '#ccc' : '#666' }}>
                {getLangText('備註', 'Notes')}:
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#666' }}>
                {mealData.n}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const mealList = Object.entries(meals);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? '#121212' : '#f5f5f5', pt: 3 }}>
      <Container maxWidth="sm">
        <Card sx={{ bgcolor: isDark ? '#333' : 'white', p: 3, mb: 3, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#000', mb: 1 }}>
            {getTitle()}
          </Typography>
          <Typography variant="h6" sx={{ color: isDark ? '#ccc' : '#666' }}>
            {formatDateWithDay(date)}
          </Typography>
        </Card>

        {mealList.map(([type, mealData]) => renderMealSection(type, mealData))}

        {mealList.length === 0 && (
          <Typography variant="body1" sx={{ textAlign: 'center', color: isDark ? '#aaa' : '#666' }}>
            {getLangText('當天沒有安排膳食', 'No meals scheduled for this day')}
          </Typography>
        )}

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666' }}>
            {getLangText('最後更新', 'Last Updated')}: {new Date(lastUpdated).toLocaleString()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SharedView;