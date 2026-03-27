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

// Helper to format date with day of week
const formatDateWithDay = (dateStr: string): string => {
  const date = parseISO(dateStr);
  const dayNamesZh = ['日', '一', '二', '三', '四', '五', '六'];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayIndex = getDay(date);
  return `${dateStr} (${getLangText('星期' + dayNamesZh[dayIndex], dayNamesEn[dayIndex])})`;
};

// Simplified data format from encoding
interface SharedData {
  d: string; // date
  l: { // lunch
    t: string; // time
    c: { n: string; i: string }[]; // courses (name + ingredients)
    eg: boolean; // extra guests
    egc: number; // extra guest count
    n: string; // notes
  };
  dn: { // dinner
    t: string;
    c: { n: string; i: string }[];
    eg: boolean;
    egc: number;
    n: string;
  };
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

  const { d: date, l: lunch, dn: dinner, u: lastUpdated } = planData;
  const getTitle = () => getLangText('分享膳食', 'Share Meal');

  const renderMealSection = (label: string, time: string, courses: { n: string; i: string }[], extraGuests: boolean, extraGuestCount: number, notes: string, icon: string) => (
    <Card sx={{ bgcolor: isDark ? '#1e1e1e' : 'white', mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: isDark ? '#fff' : '#000' }}>
          {icon} {label}
        </Typography>
        <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#666', mb: 2 }}>
          {getLangText('時間', 'Time')}: {time}
        </Typography>

        {courses.map((course, idx) => (
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

        {extraGuests && (
          <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#666', mt: 1 }}>
            {getLangText('額外客人', 'Extra Guests')}: {getLangText('是', 'Yes')} ({extraGuestCount} {getLangText('人', 'persons')})
          </Typography>
        )}

        {notes && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: isDark ? '#ccc' : '#666' }}>
              {getLangText('備註', 'Notes')}:
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#666' }}>
              {notes}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

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

        {renderMealSection(
          getLangText('午餐', 'Lunch'),
          lunch.t,
          lunch.c,
          lunch.eg,
          lunch.egc,
          lunch.n,
          '🍽️'
        )}
        {renderMealSection(
          getLangText('晚餐', 'Dinner'),
          dinner.t,
          dinner.c,
          dinner.eg,
          dinner.egc,
          dinner.n,
          '🌙'
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