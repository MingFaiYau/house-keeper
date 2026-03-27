import React from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { format, parseISO, addDays, getDay, isToday } from 'date-fns';
import { getLangText } from '../i18n';

interface DateSelectorProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  isDark?: boolean;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  currentDate,
  onDateChange,
  isDark = false,
}) => {
  // Helper to format date with day of week
  const formatDateWithDay = (dateStr: string) => {
    const date = parseISO(dateStr);
    const dayNamesZh = ['日', '一', '二', '三', '四', '五', '六'];
    const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayIndex = getDay(date);
    return `${dateStr} (${getLangText('星期' + dayNamesZh[dayIndex], dayNamesEn[dayIndex])})`;
  };

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

  return (
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