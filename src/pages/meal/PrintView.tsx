import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import { format, parseISO, getDay } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import { useMealPrepStore } from '../../stores/fdhStore';
import { getLangText } from '../../i18n';
import DateSelector from '../../components/DateSelector';

// Encode plan data for sharing - simplified version
const encodePlanData = (date: string, plan: DailyPlan): string => {
  // Only include essential display data
  const simplified = {
    d: date,
    l: {
      t: plan.lunch.time,
      c: plan.lunch.courses.filter(c => c.dish).map(c => ({
        n: c.dish?.icon + ' ' + c.dish?.nameZh,
        i: c.ingredients || '',
      })),
      eg: plan.lunch.extraGuests,
      egc: plan.lunch.extraGuestCount,
      n: plan.lunch.notes || '',
    },
    dn: {
      t: plan.dinner.time,
      c: plan.dinner.courses.filter(c => c.dish).map(c => ({
        n: c.dish?.icon + ' ' + c.dish?.nameZh,
        i: c.ingredients || '',
      })),
      eg: plan.dinner.extraGuests,
      egc: plan.dinner.extraGuestCount,
      n: plan.dinner.notes || '',
    },
    u: plan.lastUpdated,
  };
  return btoa(encodeURIComponent(JSON.stringify(simplified)));
};

interface DailyPlan {
  date: string;
  lunch: Meal;
  dinner: Meal;
  lastUpdated: string;
}

interface Meal {
  time: string;
  courses: DishCourse[];
  extraGuests: boolean;
  extraGuestCount: number;
  notes: string;
}

interface DishCourse {
  id: string;
  courseNumber: number;
  dish: { id: string; nameZh: string; nameEn: string; icon: string } | null;
  ingredients: string;
}

const PrintView: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme.palette.mode === 'dark';

  // Check for date query parameter
  const searchParams = new URLSearchParams(location.search);
  const dateParam = searchParams.get('date');
  const initialDate = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : format(new Date(), 'yyyy-MM-dd');

  const [currentDate, setCurrentDate] = useState(initialDate);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  // Helper to format date with day of week
  const formatDateWithDay = (dateStr: string) => {
    const date = parseISO(dateStr);
    const dayNamesZh = ['日', '一', '二', '三', '四', '五', '六'];
    const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayIndex = getDay(date);
    return `${dateStr} (${getLangText('星期' + dayNamesZh[dayIndex], dayNamesEn[dayIndex])})`;
  };

  const {
    currentPlan,
    loadSettings,
    loadDailyPlan,
  } = useMealPrepStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    loadDailyPlan(currentDate);
  }, [currentDate, loadDailyPlan]);

  if (!currentPlan) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>{getLangText('載入中...', 'Loading...')}</Typography>
      </Box>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const getTitle = () => getLangText('分享膳食', 'Share Meal');

  const renderMealSection = (mealType: 'lunch' | 'dinner') => {
    const meal = currentPlan[mealType];
    const isLunch = mealType === 'lunch';
    const mealLabel = isLunch ? getLangText('午餐', 'Lunch') : getLangText('晚餐', 'Dinner');
    const timeLabel = isLunch ? getLangText('午餐時間', 'Lunch Time') : getLangText('晚餐時間', 'Dinner Time');

    return (
      <Box sx={{ border: isDark ? '1px solid #555' : '1px solid #ccc', p: 2, borderRadius: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textAlign: 'center', color: isDark ? '#fff' : '#000' }}>
          🍽️ {mealLabel}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: isDark ? '#ccc' : '#000' }}>
            {timeLabel}: {meal.time}
          </Typography>
        </Box>

        {/* Courses */}
        {meal.courses.filter(c => c.dish).map((course) => (
          <Box
            key={course.id}
            sx={{
              mb: 1,
              p: 1,
              bgcolor: isDark ? '#444' : '#f0f0f0',
              borderRadius: 1,
              border: isDark ? '1px solid #555' : '1px solid #ddd',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#fff' : '#000' }}>
              #{course.courseNumber} {course.dish?.icon} {getLangText(course.dish?.nameZh || '', course.dish?.nameEn || '')}
            </Typography>
            {course.ingredients && (
              <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666' }}>
                {getLangText('食材', 'Ingredients')}: {course.ingredients}
              </Typography>
            )}
          </Box>
        ))}
        {meal.courses.filter(c => c.dish).length === 0 && (
          <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666' }}>-</Typography>
        )}

        {/* Extra Guests */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#000' }}>
            {getLangText('額外客人', 'Extra Guests')}: {meal.extraGuests ? `${getLangText('是', 'Yes')} (${meal.extraGuestCount} ${getLangText('人', 'persons')})` : getLangText('否', 'No')}
          </Typography>
        </Box>

        {/* Notes */}
        {meal.notes && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: isDark ? '#ccc' : '#000' }}>
              {getLangText('備註', 'Notes')}:
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: isDark ? '#ccc' : '#000' }}>
              {meal.notes}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? '#121212' : '#f5f5f5' }}>
      <AppBar position="static" color="default" elevation={1} className="no-print" sx={{ bgcolor: isDark ? '#1e1e1e' : '#fff' }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate('/')} sx={{ color: isDark ? '#fff' : 'inherit' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: isDark ? '#fff' : 'inherit' }}>
            {getTitle()}
          </Typography>
          <IconButton onClick={() => navigate(`/meal/daily?date=${currentDate}`)} sx={{ color: isDark ? '#26A69A' : 'inherit' }} title={getLangText('編輯', 'Edit')}>
            <RestaurantIcon />
          </IconButton>
          <IconButton onClick={() => setQrDialogOpen(true)} sx={{ color: isDark ? '#26A69A' : 'inherit' }} title={getLangText('分享', 'Share')}>
            <QrCodeIcon />
          </IconButton>
          <IconButton onClick={handlePrint} sx={{ color: isDark ? '#26A69A' : 'inherit' }} title={getLangText('列印', 'Print')}>
            <PrintIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3, bgcolor: isDark ? '#121212' : 'transparent' }}>
        <Box sx={{ mb: 3, textAlign: 'center' }} className="no-print">
          <DateSelector
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            isDark={isDark}
          />
        </Box>

        {/* Print Area */}
        <Box
          sx={{
            bgcolor: isDark ? '#333' : 'white',
            color: isDark ? '#fff' : '#000',
            p: 4,
            borderRadius: 2,
            border: '2px solid #333',
          }}
          className="print-area"
        >
          <Box sx={{ textAlign: 'center', mb: 4, borderBottom: '2px solid #333', pb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: isDark ? '#fff' : '#000' }}>
              {getTitle()}
            </Typography>
            <Typography variant="h6" sx={{ color: isDark ? '#ccc' : '#666' }}>
              {formatDateWithDay(currentDate)}
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666', mt: 1 }}>
              {getLangText('掃描QR碼或複製連結分享給傭工', 'Scan QR code or copy link to share with helper')}
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 4 }}>
            {renderMealSection('lunch')}
            {renderMealSection('dinner')}
          </Box>
        </Box>
      </Container>

      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-area { page-break-inside: avoid; }
        }
      `}</style>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {getLangText('分享給傭工', 'Share to Helper')}
          <IconButton onClick={() => setQrDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" sx={{ mb: 2, color: isDark ? '#aaa' : '#666' }}>
            {getLangText('讓傭工掃描此QR碼查看今日膳食安排', 'Scan this QR code to view today\'s meal plan')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, bgcolor: 'white', borderRadius: 2, mb: 2 }}>
            <QRCodeSVG
              value={`${window.location.origin}/share?data=${encodePlanData(currentDate, currentPlan!)}`}
              size={120}
              level="L"
              includeMargin={false}
            />
          </Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: isDark ? '#aaa' : '#666' }}>
            {getLangText('或复制链接', 'Or copy link')}:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                flex: 1,
                p: 1,
                bgcolor: isDark ? '#2a2a2a' : '#f5f5f5',
                borderRadius: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '0.75rem',
              }}
            >
              {`${window.location.origin}/share?data=${encodePlanData(currentDate, currentPlan!).substring(0, 30)}...`}
            </Typography>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                const url = `${window.location.origin}/share?data=${encodePlanData(currentDate, currentPlan!)}`;
                navigator.clipboard.writeText(url);
              }}
              sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
            >
              {getLangText('复制', 'Copy')}
            </Button>
          </Box>
          <Typography variant="caption" sx={{ display: 'block', mt: 2, color: isDark ? '#aaa' : '#666' }}>
            {getLangText('日期', 'Date')}: {currentDate}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PrintView;