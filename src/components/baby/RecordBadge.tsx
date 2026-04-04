import React from 'react';
import { Box, Typography } from '@mui/material';
import type { StepRecord } from '../../types/feeding';
import { getLangText } from '../../i18n';
import { NO_TIME_STEPS } from '../../types/feeding';

interface RecordBadgeProps {
  record: StepRecord | undefined;
  isDark: boolean;
  stepId?: number;
}

export const RecordBadge: React.FC<RecordBadgeProps> = ({ record, isDark, stepId }) => {
  if (!record || !(
    record.time ||
    record.skipped ||
    record.diaperChanges?.urine ||
    record.diaperChanges?.popo ||
    record.diaperChanges?.manyPopo ||
    record.bathDone ||
    record.nailTrim?.leftHand ||
    record.nailTrim?.rightHand ||
    record.nailTrim?.leftFoot ||
    record.nailTrim?.rightFoot ||
    record.burpDone ||
    record.milkAmount ||
    record.massageDone ||
    (record.playOptions && record.playOptions.length > 0) ||
    record.remark
  )) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
      {/* Time badge */}
      {record.time && !NO_TIME_STEPS.includes(stepId || 0) && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#1565c0' : '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#1565c0' }}>
            ⏰ {record.time}
          </Typography>
        </Box>
      )}

      {/* Massage badge */}
      {record.massageDone && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#7e57c2' : '#ede7f6', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#673ab7' }}>
            ✋ {getLangText('按摩', 'Massage')}
          </Typography>
        </Box>
      )}

      {/* Bath badge */}
      {record.bathDone && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#29b6f6' : '#e1f5fe', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#0288d1' }}>
            🛁 {getLangText('淋浴', 'Shower')}
          </Typography>
        </Box>
      )}

      {/* Nail trim badges */}
      {record.nailTrim && (
        <>
          {record.nailTrim.leftHand && (
            <BadgeBox isDark={isDark}>✋L</BadgeBox>
          )}
          {record.nailTrim.rightHand && (
            <BadgeBox isDark={isDark}>✋R</BadgeBox>
          )}
          {record.nailTrim.leftFoot && (
            <BadgeBox isDark={isDark}>🦶L</BadgeBox>
          )}
          {record.nailTrim.rightFoot && (
            <BadgeBox isDark={isDark}>🦶R</BadgeBox>
          )}
        </>
      )}

      {/* Diaper: urine */}
      {record.diaperChanges?.urine > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#26a69a' : '#e0f2f1', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#00796b' }}>
            💧x{record.diaperChanges.urine}
          </Typography>
        </Box>
      )}

      {/* Diaper: popo */}
      {record.diaperChanges?.popo > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#ff7043' : '#fff3e0', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#e64a19' }}>
            💩x{record.diaperChanges.popo}
          </Typography>
        </Box>
      )}

      {/* Diaper: many popo */}
      {record.diaperChanges?.manyPopo > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#ab47bc' : '#f3e5f5', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#7b1fa2' }}>
            💩💩x{record.diaperChanges.manyPopo}
          </Typography>
        </Box>
      )}

      {/* Burp badge */}
      {record.burpDone && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#7e57c2' : '#ede7f6', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#512da8' }}>
            ✓ {getLangText('掃風', 'Burp')}
          </Typography>
        </Box>
      )}

      {/* Milk amount badge */}
      {record.milkAmount > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#ec407a' : '#fce4ec', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#c2185b' }}>
            🍼{record.milkAmount}ml
          </Typography>
        </Box>
      )}

      {/* Play options */}
      {record.playOptions && record.playOptions.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#ffa726' : '#fff3e0', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#e65100' }}>
            🎨 {record.playOptions.length}
          </Typography>
        </Box>
      )}

      {/* Skip reason */}
      {record.skipReason && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#ff9800' : '#fff3e0', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#e65100' }}>
            ⏱️ {record.skipReason}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Simple badge helper
const BadgeBox: React.FC<{ isDark: boolean; children: React.ReactNode }> = ({ isDark, children }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#66bb6a' : '#e8f5e9', borderRadius: 1 }}>
    <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#388e3c' }}>
      {children}
    </Typography>
  </Box>
);

export default RecordBadge;