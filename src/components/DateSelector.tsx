import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { format, parseISO, addDays, getDay, isToday } from 'date-fns';
import { getLangText } from '../i18n';

interface DateSelectorProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  isDark?: boolean;
  compact?: boolean;
  showIcon?: boolean;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  currentDate,
  onDateChange,
  isDark = false,
  compact = false,
  showIcon = false,
}) => {
  // Helper to format date with day of week
  const formatDateWithDay = (dateStr: string) => {
    const date = parseISO(dateStr);
    const dayNamesZh = ['日', '一', '二', '三', '四', '五', '六'];
    const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayIndex = getDay(date);
    return `${dateStr} (${getLangText('星期' + dayNamesZh[dayIndex], dayNamesEn[dayIndex])})`;
  };

  // Compact date display
  const formatDateCompact = (dateStr: string) => {
    const date = parseISO(dateStr);
    const dayNamesZh = ['日', '一', '二', '三', '四', '五', '六'];
    const dayNamesEn = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const dayIndex = getDay(date);
    if (isToday(date)) {
      return getLangText('今天', 'Today');
    }
    return `${format(date, 'MM/dd')} ${getLangText(dayNamesZh[dayIndex], dayNamesEn[dayIndex])}`;
  };

  // Date picker dialog state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(currentDate);

  // Handle date navigation
  const handlePrevDay = () => {
    onDateChange(format(addDays(parseISO(currentDate), -1), 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    onDateChange(format(addDays(parseISO(currentDate), 1), 'yyyy-MM-dd'));
  };

  const handleToday = () => {
    onDateChange(format(new Date(), 'yyyy-MM-dd'));
  };

return showIcon ? (
    <Box>
      <IconButton
        size="small"
        onClick={() => { setPickerDate(currentDate); setShowDatePicker(true); }}
        sx={{ color: isDark ? '#fff' : 'inherit' }}
      >
        <CalendarMonthIcon />
      </IconButton>
      <Dialog open={showDatePicker} onClose={() => setShowDatePicker(false)}>
        <IconButton
          onClick={() => setShowDatePicker(false)}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle>{getLangText('選擇日期', 'Select Date')}</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            value={pickerDate}
            onChange={(e) => setPickerDate(e.target.value)}
            fullWidth
            sx={{
              mt: 1,
              '& input': { color: isDark ? '#fff' : 'inherit' },
              '& input[type="date"]::-webkit-calendar-picker-indicator': {
                filter: isDark ? 'invert(1)' : 'none',
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { onDateChange(format(new Date(), 'yyyy-MM-dd')); setShowDatePicker(false); }}>
            {getLangText('今天', 'Today')}
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={() => setShowDatePicker(false)}>{getLangText('取消', 'Cancel')}</Button>
          <Button variant="contained" onClick={() => { onDateChange(pickerDate); setShowDatePicker(false); }}>
            {getLangText('確認', 'Confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  ) : compact ? (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <IconButton onClick={handlePrevDay} size="small" sx={{ color: isDark ? '#fff' : 'inherit', p: 0.5 }}>
        <ChevronLeftIcon fontSize="small" />
      </IconButton>
      <Typography
        variant="body2"
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'date';
          input.value = currentDate;
          input.showPicker?.();
          input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if (target.value) onDateChange(target.value);
          };
          input.click();
        }}
        sx={{
          color: isDark ? '#fff' : 'inherit',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: '0.8rem',
          minWidth: 70,
          textAlign: 'center',
        }}
      >
        {formatDateCompact(currentDate)}
      </Typography>
      <IconButton onClick={handleNextDay} size="small" sx={{ color: isDark ? '#fff' : 'inherit', p: 0.5 }}>
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Box>
  ) : (
    <Box sx={{ mb: 3, textAlign: 'center' }}>
      {/* Date Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
        <IconButton onClick={handlePrevDay} size="small" sx={{ color: isDark ? '#fff' : 'inherit' }}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? '#fff' : 'inherit', minWidth: 200, textAlign: 'center' }}>
          {isToday(parseISO(currentDate))
            ? `${getLangText('今天', 'Today')} (${formatDateWithDay(currentDate).split('(')[1].replace(')', '')})`
            : formatDateWithDay(currentDate)}
        </Typography>
        <IconButton onClick={handleNextDay} size="small" sx={{ color: isDark ? '#fff' : 'inherit' }}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Date picker and Today button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <TextField
          type="date"
          value={currentDate}
          onChange={(e) => onDateChange(e.target.value)}
          size="small"
          sx={{
            '& .MuiInputLabel-root': { color: isDark ? '#aaa' : 'inherit' },
            '& .MuiOutlinedInput-root': {
              color: isDark ? '#fff' : 'inherit',
              '& fieldset': { borderColor: isDark ? '#444' : '#ccc' },
            },
            '& input[type="date"]::-webkit-calendar-picker-indicator': {
              filter: isDark ? 'invert(1)' : 'none',
            },
          }}
        />
        <Button size="small" variant="outlined" onClick={handleToday} sx={{ color: isDark ? '#fff' : 'inherit' }}>
          {getLangText('今天', 'Today')}
        </Button>
      </Box>
    </Box>
  );
};

export default DateSelector;