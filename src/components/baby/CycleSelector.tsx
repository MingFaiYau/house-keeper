import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface CycleSelectorProps {
  currentCycle: number;
  cycles: number[];
  isDark: boolean;
  isCycleComplete: boolean;
  onCycleChange: (cycle: number) => void;
  onAddCycle: () => void;
}

export const CycleSelector: React.FC<CycleSelectorProps> = ({
  currentCycle,
  cycles,
  isDark,
  isCycleComplete,
  onCycleChange,
  onAddCycle,
}) => {
  if (cycles.length === 0) return null;

  return (
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
      <IconButton
        size="small"
        onClick={() => onCycleChange(currentCycle - 1)}
        disabled={currentCycle === 0}
      >
        <ChevronLeftIcon />
      </IconButton>

      {cycles.map((cycleIdx) => (
        <Box
          key={cycleIdx}
          onClick={() => onCycleChange(cycleIdx)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            px: 2,
            py: 1,
            borderRadius: 1,
            cursor: 'pointer',
            bgcolor: isCycleComplete
              ? (isDark ? '#2e7d32' : '#c8e6c9')
              : currentCycle === cycleIdx
                ? 'primary.main'
                : 'transparent',
            border: `1px solid ${
              isCycleComplete
                ? (isDark ? '#4caf50' : '#4caf50')
                : currentCycle === cycleIdx
                  ? 'primary.main'
                  : isDark ? '#555' : '#ccc'
            }`,
            color: currentCycle === cycleIdx || isCycleComplete ? '#fff' : 'inherit',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            #{cycleIdx + 1}
          </Typography>
          {isCycleComplete && (
            <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
              ✓
            </Typography>
          )}
        </Box>
      ))}

      <IconButton size="small" onClick={onAddCycle}>
        <AddIcon />
      </IconButton>

      <IconButton
        size="small"
        onClick={() => onCycleChange(currentCycle + 1)}
        disabled={currentCycle >= cycles.length - 1}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
};

export default CycleSelector;