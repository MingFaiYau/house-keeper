import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Popover,
  Typography,
} from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

// Common food emojis for picker
const FOOD_ICONS = [
  '🍚', '🍜', '🍝', '🍲', '🥣', '🍞', '🥐', '🥯',
  '🥗', '🥬', '🥦', '🥒', '🥕', '🍅', '🍆', '🥑',
  '🥩', '🍗', '🍖', '🥓', '🍤', '🍣', '🍱', '🥟',
  '🥚', '🧈', '🧀', '🍖', '🐟', '🐠', '🦐', '🦑',
  '🍄', '🥜', '🌰', '🍎', '🍌', '🍇', '🍉', '🍓',
  '🧁', '🍰', '🍮', '🍭', '🍫', '🍿', '🍩', '🍪',
  '🥤', '☕', '🧃', '🧋', '🍵', '🍶', '🍺', '🍷',
];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  label?: string;
}

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, label }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (icon: string) => {
    onChange(icon);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          label={label || 'Icon'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          sx={{ width: 80 }}
          placeholder="🍽️"
        />
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 0.5,
          }}
        >
          <SentimentSatisfiedAltIcon />
        </IconButton>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, width: 280 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            Select Icon
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 0.5 }}>
            {FOOD_ICONS.map((icon) => (
              <Box
                key={icon}
                onClick={() => handleSelect(icon)}
                sx={{
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  textAlign: 'center',
                  p: 0.5,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  border: value === icon ? '2px solid' : '2px solid transparent',
                  borderColor: value === icon ? 'primary.main' : 'transparent',
                }}
              >
                {icon}
              </Box>
            ))}
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default IconPicker;