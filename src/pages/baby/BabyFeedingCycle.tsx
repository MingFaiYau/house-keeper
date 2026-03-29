import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { getLangText } from '../../i18n';
import { useTheme } from '@mui/material';
import DateSelector from '../../components/DateSelector';
import { useBabyCycleStore } from '../../stores/babyCycleStore';
import BabySelector from '../../components/baby/BabySelector';
import { useBabyStore } from '../../stores/babyStore';
import type { StepRecord, NailTrim } from '../../types/fdh';

interface CycleStep {
  id: number;
  nameZh: string;
  nameEn: string;
  icon: string;
}

interface PlayOption {
  id: string;
  icon: string;
  labelZh: string;
  labelEn: string;
}

const PLAY_OPTIONS: PlayOption[] = [
  { id: 'black_white_card', icon: '🃏', labelZh: '黑白卡片', labelEn: 'Black & White Card' },
  { id: 'hold_toys', icon: '🧸', labelZh: '拿玩具', labelEn: 'Hold Toys' },
  { id: 'sing_songs', icon: '🎵', labelZh: '唱兒歌', labelEn: 'Sing Songs' },
  { id: 'outdoor', icon: '🌳', labelZh: '戶外', labelEn: 'Outdoor' },
  { id: 'tummy_time', icon: '🤸', labelZh: '趴趴時間', labelEn: 'Tummy Time' },
  { id: 'play_alone', icon: '👶', labelZh: '自己玩', labelEn: 'Play Alone' },
  { id: 'listen_music', icon: '🎧', labelZh: '聽音樂', labelEn: 'Listen to Music' },
  { id: 'others', icon: '✨', labelZh: '其他', labelEn: 'Others' },
];

const CYCLE_STEPS: CycleStep[] = [
  { id: 0, nameZh: '叫醒BB', nameEn: 'Wake Up', icon: '🌅' },
  { id: 1, nameZh: '按摩及清潔', nameEn: 'Massage & Clean', icon: '✋' },
  { id: 2, nameZh: '餵奶及掃風', nameEn: 'Feeding & Burp', icon: '🍼' },
  { id: 3, nameZh: '玩耍', nameEn: 'Playing', icon: '🎨' },
  { id: 4, nameZh: '睡覺', nameEn: 'Sleeping', icon: '💤' },
];

// Steps that allow diaper changes
const DIAPER_ALLOWED_STEPS = [1, 2, 3];

// Steps that allow skip with reason
const SKIP_ALLOWED_STEPS = [1, 3];

// Steps that allow burp time (feeding step)
const BURP_ALLOWED_STEPS = [2];

// Steps that allow bath and nail trim (massage & clean step)
const BATH_ALLOWED_STEPS = [1];

// Steps that allow play options (playing step)
const PLAY_ALLOWED_STEPS = [3];

// Reusable record badge component
const RecordBadge: React.FC<{ record: StepRecord; isDark: boolean }> = ({ record, isDark }) => {
  if (!record || !(record.time || record.diaperChanges?.urine || record.diaperChanges?.popo || record.diaperChanges?.manyPopo || record.bathDone || record.nailTrim?.leftHand || record.nailTrim?.rightHand || record.nailTrim?.leftFoot || record.nailTrim?.rightFoot || record.burpDone || (record.playOptions && record.playOptions.length > 0))) {
    return null;
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
      {record.skipped && (
        <Chip size="small" label={getLangText('已跳過', 'Skipped')} color="warning" variant="outlined" />
      )}
      {record.time && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#1565c0' : '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#1565c0' }}>
            ⏰ {record.time}
          </Typography>
        </Box>
      )}
      {record.bathDone && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#29b6f6' : '#e1f5fe', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#0288d1' }}>
            🛁 {getLangText('淋浴', 'Shower')}
          </Typography>
        </Box>
      )}
      {record.nailTrim && (
        <>
          {record.nailTrim.leftHand && (
            <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#66bb6a' : '#e8f5e9', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#388e3c' }}>✋L</Typography>
            </Box>
          )}
          {record.nailTrim.rightHand && (
            <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#66bb6a' : '#e8f5e9', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#388e3c' }}>✋R</Typography>
            </Box>
          )}
          {record.nailTrim.leftFoot && (
            <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#66bb6a' : '#e8f5e9', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#388e3c' }}>🦶L</Typography>
            </Box>
          )}
          {record.nailTrim.rightFoot && (
            <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#66bb6a' : '#e8f5e9', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#388e3c' }}>🦶R</Typography>
            </Box>
          )}
        </>
      )}
      {record.diaperChanges?.urine > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#26a69a' : '#e0f2f1', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#00796b' }}>
            💧x{record.diaperChanges.urine}
          </Typography>
        </Box>
      )}
      {record.diaperChanges?.popo > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#ff7043' : '#fff3e0', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#e64a19' }}>
            💩x{record.diaperChanges.popo}
          </Typography>
        </Box>
      )}
      {record.diaperChanges?.manyPopo > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#ab47bc' : '#f3e5f5', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#7b1fa2' }}>
            💩💩x{record.diaperChanges.manyPopo}
          </Typography>
        </Box>
      )}
      {record.burpDone && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#7e57c2' : '#ede7f6', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#512da8' }}>
            ✓ {getLangText('掃風', 'Burp')}
          </Typography>
        </Box>
      )}
      {record.playOptions && record.playOptions.length > 0 && (
        <>
          {record.playOptions.map(id => {
            const option = PLAY_OPTIONS.find(p => p.id === id);
            if (!option) return null;
            return (
              <Box key={id} sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#ec407a' : '#fce4ec', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#c2185b' }}>
                  {option.icon}
                </Typography>
              </Box>
            );
          })}
        </>
      )}
    </Box>
  );
};

const BabyFeedingCycle: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const { cycleRecords, currentDate, loadDay, updateCycles } = useBabyCycleStore();
  const { getDefaultBaby, loadSettings } = useBabyStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [showIncompleteDialog, setShowIncompleteDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [incompleteSteps, setIncompleteSteps] = useState<number[]>([]);
  const [completedCycleNum, setCompletedCycleNum] = useState(0);
  const [skipReason, setSkipReason] = useState('');

  // Load data when component mounts and when date changes
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const defaultBaby = getDefaultBaby();

  // Load day data when baby or date changes
  useEffect(() => {
    if (defaultBaby) {
      loadDay(currentDate, defaultBaby.id);
    }
  }, [defaultBaby, currentDate, loadDay]);

  // Get records for current date - use any for flexibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dateCycles: any = cycleRecords[currentDate] || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cycleData: any = dateCycles[currentCycle] || {};
  const stepRecord: StepRecord | undefined = cycleData[currentStep];

  const step = CYCLE_STEPS[currentStep];

  const handleSetNow = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newRecords: any = JSON.parse(JSON.stringify(cycleRecords));
    if (!newRecords[currentDate]) {
      newRecords[currentDate] = {};
    }
    if (!newRecords[currentDate][currentCycle]) {
      newRecords[currentDate][currentCycle] = {};
    }
    if (!newRecords[currentDate][currentCycle][currentStep]) {
      newRecords[currentDate][currentCycle][currentStep] = {};
    }
    newRecords[currentDate][currentCycle][currentStep] = {
      ...newRecords[currentDate][currentCycle][currentStep],
      time: timeStr,
      skipped: false,
      skipReason: '',
    };
    updateCycles(newRecords);
  };

  const handleDateChange = (date: string) => {
    if (defaultBaby) {
      loadDay(date, defaultBaby.id);
    }
  };

  const handleTimeChange = (time: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newRecords: any = JSON.parse(JSON.stringify(cycleRecords));
    if (!newRecords[currentDate]) {
      newRecords[currentDate] = {};
    }
    if (!newRecords[currentDate][currentCycle]) {
      newRecords[currentDate][currentCycle] = {};
    }
    if (!newRecords[currentDate][currentCycle][currentStep]) {
      newRecords[currentDate][currentCycle][currentStep] = {};
    }
    newRecords[currentDate][currentCycle][currentStep] = {
      ...newRecords[currentDate][currentCycle][currentStep],
      time,
      skipped: false,
      skipReason: '',
    };
    updateCycles(newRecords);
  };

  const updateCurrentStep = (updates: Partial<StepRecord>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newRecords: any = JSON.parse(JSON.stringify(cycleRecords));
    if (!newRecords[currentDate]) {
      newRecords[currentDate] = {};
    }
    if (!newRecords[currentDate][currentCycle]) {
      newRecords[currentDate][currentCycle] = {};
    }
    if (!newRecords[currentDate][currentCycle][currentStep]) {
      newRecords[currentDate][currentCycle][currentStep] = {};
    }
    newRecords[currentDate][currentCycle][currentStep] = {
      ...newRecords[currentDate][currentCycle][currentStep],
      ...updates,
    };
    updateCycles(newRecords);
  };

  const handleDiaperChange = (type: 'urine' | 'popo' | 'manyPopo') => {
    const current = stepRecord?.diaperChanges || { urine: 0, popo: 0, manyPopo: 0 };
    updateCurrentStep({
      diaperChanges: {
        urine: type === 'urine' ? (current.urine + 1) % 5 : current.urine,
        popo: type === 'popo' ? (current.popo + 1) % 5 : current.popo,
        manyPopo: type === 'manyPopo' ? (current.manyPopo + 1) % 5 : current.manyPopo,
      }
    });
  };

  const handleBurpToggle = () => {
    updateCurrentStep({ burpDone: !stepRecord?.burpDone });
  };

  const handleBathToggle = () => {
    updateCurrentStep({ bathDone: !stepRecord?.bathDone });
  };

  const handleNailTrimToggle = (limb: keyof NailTrim) => {
    const current = stepRecord?.nailTrim || { leftHand: false, rightHand: false, leftFoot: false, rightFoot: false };
    updateCurrentStep({
      nailTrim: { ...current, [limb]: !current[limb] }
    });
  };

  const handlePlayOptionToggle = (optionId: string) => {
    const current = stepRecord?.playOptions || [];
    const updated = current.includes(optionId)
      ? current.filter((id: string) => id !== optionId)
      : [...current, optionId];
    updateCurrentStep({ playOptions: updated });
  };

  const handleSkip = () => {
    setShowSkipDialog(true);
  };

  const confirmSkip = () => {
    updateCurrentStep({ time: '', skipped: true, skipReason });
    setShowSkipDialog(false);
    setSkipReason('');
  };

  const isAllStepsCompleted = (cycleIdx: number) => {
    const cycleData = dateCycles[cycleIdx];
    if (!cycleData) return false;
    for (let i = 0; i < CYCLE_STEPS.length; i++) {
      const record = cycleData[i];
      if (!record || (!record.time && !record.skipped)) {
        return false;
      }
    }
    return true;
  };

  const getIncompleteSteps = (cycleIdx: number) => {
    const cycleData = dateCycles[cycleIdx];
    const incomplete: number[] = [];
    for (let i = 0; i < CYCLE_STEPS.length; i++) {
      const record = cycleData?.[i];
      if (!record || (!record.time && !record.skipped)) {
        incomplete.push(i);
      }
    }
    return incomplete;
  };

  const handleNext = () => {
    if (currentStep < CYCLE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Check if all steps have time or skipped
      if (!isAllStepsCompleted(currentCycle)) {
        const incomplete = getIncompleteSteps(currentCycle);
        setShowIncompleteDialog(true);
        setIncompleteSteps(incomplete);
        return;
      }
      // Create new cycle slot
      const nextCycle = currentCycle + 1;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newRecords: any = JSON.parse(JSON.stringify(cycleRecords));
      if (!newRecords[currentDate]) {
        newRecords[currentDate] = {};
      }
      newRecords[currentDate][nextCycle] = {};
      updateCycles(newRecords);
      setCurrentCycle(nextCycle);
      setCurrentStep(0);
      setCompletedCycleNum(currentCycle + 1);
      setShowCompleteDialog(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCycleChange = (cycleIdx: number) => {
    setCurrentCycle(cycleIdx);
    setCurrentStep(0);
  };

  const getStepStatus = (stepId: number) => {
    const record = cycleData?.[stepId];
    if (record && (record.time || record.skipped)) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const getCycleRecord = (cycleIdx: number) => {
    const cycleData = dateCycles[cycleIdx] || {};
    return cycleData;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: isDark ? '#121212' : '#f5f5f5' }}>
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: isDark ? '#1e1e1e' : '#fff' }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate('/baby')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {getLangText('餵奶週期', 'Feeding Cycle')}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, overflow: 'auto', py: 1, pb: 10 }}>
        <Container maxWidth="sm">
        {/* Date Selector */}
        <DateSelector
          currentDate={currentDate}
          onDateChange={handleDateChange}
          isDark={isDark}
        />

        <BabySelector />

        {/* Cycle Selector - only show when there are cycles */}
        {Object.keys(dateCycles).length > 0 && (
          <Card sx={{ mb: 2, bgcolor: isDark ? '#1e1e1e' : 'white' }}>
            <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                {getLangText('選擇週期', 'Select Cycle')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {Object.keys(dateCycles).map((cycleIdx) => {
                  const rec = dateCycles[parseInt(cycleIdx)] || {};
                  const startTime = rec[0]?.time;
                  const endTime = rec[4]?.time;
                  const timeDisplay = startTime || endTime
                    ? `(${startTime || ''} - ${endTime || ''})`
                    : '(TBC)';
                  const cycleLabel = getLangText('第' + (parseInt(cycleIdx) + 1) + '週期', 'Cycle ' + (parseInt(cycleIdx) + 1));
                  const isCycleComplete = isAllStepsCompleted(parseInt(cycleIdx));
                  return (
                    <Box
                      key={cycleIdx}
                      onClick={() => handleCycleChange(parseInt(cycleIdx))}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        cursor: 'pointer',
                        bgcolor: isCycleComplete ? (isDark ? '#2e7d32' : '#c8e6c9') : currentCycle === parseInt(cycleIdx) ? 'primary.main' : 'transparent',
                        border: `1px solid ${isCycleComplete ? (isDark ? '#4caf50' : '#4caf50') : currentCycle === parseInt(cycleIdx) ? 'primary.main' : isDark ? '#555' : '#ccc'}`,
                        color: currentCycle === parseInt(cycleIdx) || isCycleComplete ? '#fff' : 'inherit',
                        '&:hover': { bgcolor: isCycleComplete ? (currentCycle === parseInt(cycleIdx) ? 'primary.dark' : isDark ? '#388e3c' : '#a5d6a7') : currentCycle === parseInt(cycleIdx) ? 'primary.dark' : isDark ? '#333' : '#f5f5f5' },
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {cycleLabel}
                      </Typography>
                      <Typography variant="caption">
                        {timeDisplay}
                      </Typography>
                      {isCycleComplete && <Typography variant="caption">✓</Typography>}
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Cycle Info - only show when there are cycles */}
        {Object.keys(dateCycles).length > 0 && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {getLangText('第', 'Cycle ')}{currentCycle + 1}{getLangText('個週期', '')}
            </Typography>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => {
                const cycleData = dateCycles[currentCycle];
                const hasRecords = cycleData && Object.values(cycleData).some((rec: any) =>
                  rec && (rec.time || rec.skipped || rec.bathDone || rec.burpDone ||
                    (rec.diaperChanges && (rec.diaperChanges.urine || rec.diaperChanges.popo || rec.diaperChanges.manyPopo)) ||
                    (rec.playOptions && rec.playOptions.length > 0) ||
                    (rec.nailTrim && (rec.nailTrim.leftHand || rec.nailTrim.rightHand || rec.nailTrim.leftFoot || rec.nailTrim.rightFoot)))
                );
                if (hasRecords) {
                  setShowDeleteDialog(true);
                } else {
                  // No records, delete directly
                  const newRecords = JSON.parse(JSON.stringify(cycleRecords)) as typeof cycleRecords;
                  delete newRecords[currentDate][currentCycle];
                  updateCycles(newRecords);
                  if (currentCycle > 0) {
                    setCurrentCycle(currentCycle - 1);
                  }
                  setCurrentStep(0);
                }
              }}
            >
              {getLangText('刪除週期', 'Delete')}
            </Button>
          </Box>
        )}

        {/* Step Flow */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: isDark ? '#ddd' : '#333' }}>
            {getLangText('週期流程', 'Cycle Steps')}
          </Typography>
          {CYCLE_STEPS.map((s, index) => {
            const status = getStepStatus(index);
            const stepRecord = getCycleRecord(currentCycle)[index] as StepRecord | undefined;
            return (
              <Box
                key={s.id}
                onClick={() => setCurrentStep(index)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 0.5,
                  p: 0.75,
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: status === 'current' ? (isDark ? '#1e3a2f' : '#e0f2f1') : 'transparent',
                  opacity: status === 'pending' ? 0.5 : 1,
                  '&:hover': { bgcolor: isDark ? '#252525' : '#f5f5f5' },
                }}
              >
                {status === 'completed' ? (
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
                ) : status === 'current' ? (
                  <RadioButtonUncheckedIcon sx={{ color: 'primary.main', mr: 1 }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ color: 'grey.400', mr: 1 }} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: status === 'current' ? 600 : 400,
                    color: status === 'current' ? 'primary.main' : 'inherit',
                    flex: 1,
                  }}
                >
                  {s.icon} {getLangText(s.nameZh, s.nameEn)}
                </Typography>
                {stepRecord?.skipped && !stepRecord?.time && (
                  <Chip size="small" label={getLangText('已跳過', 'Skipped')} color="warning" variant="outlined" />
                )}
                {(stepRecord?.time || stepRecord?.diaperChanges?.urine || stepRecord?.diaperChanges?.popo || stepRecord?.diaperChanges?.manyPopo || stepRecord?.bathDone || stepRecord?.nailTrim?.leftHand || stepRecord?.nailTrim?.rightHand || stepRecord?.nailTrim?.leftFoot || stepRecord?.nailTrim?.rightFoot || stepRecord?.burpDone || (stepRecord?.playOptions && stepRecord?.playOptions.length > 0)) && (
                  <RecordBadge record={stepRecord} isDark={isDark} />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Current Step */}
        <Card sx={{ mb: 1, bgcolor: isDark ? '#1e1e1e' : 'white' }}>
          <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600, color: 'primary.main' }}>
              {step.icon} {getLangText(step.nameZh, step.nameEn)}
            </Typography>

            {/* Time Input */}
            <Box sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <TextField
                  type="time"
                  value={stepRecord?.time || ''}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  size="small"
                  sx={{
                    width: 140,
                    '& input': { textAlign: 'center', fontSize: '1.1rem', padding: '8px 4px' },
                    '& input[type="time"]::-webkit-calendar-picker-indicator': {
                      filter: isDark ? 'invert(1)' : 'none',
                    },
                  }}
                />
                <Button variant="contained" size="small" onClick={handleSetNow}>
                  {getLangText('現在', 'Now')}
                </Button>
              </Box>

              {/* Record Status - same style as step flow */}
              {stepRecord && (stepRecord.time || stepRecord.skipped || stepRecord.diaperChanges?.urine || stepRecord.diaperChanges?.popo || stepRecord.diaperChanges?.manyPopo || stepRecord.burpDone || (stepRecord.playOptions && stepRecord.playOptions.length > 0)) && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <RecordBadge record={stepRecord} isDark={isDark} />
                </Box>
              )}
            </Box>

            {/* Diaper Change - for allowed steps */}
            {DIAPER_ALLOWED_STEPS.includes(currentStep) && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  {getLangText('尿片', 'Diaper')}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant={stepRecord?.diaperChanges?.urine ? 'contained' : 'outlined'}
                    color={stepRecord?.diaperChanges?.urine ? 'success' : 'primary'}
                    size="small"
                    onClick={() => handleDiaperChange('urine')}
                  >
                    💧{stepRecord?.diaperChanges?.urine ? `x${stepRecord.diaperChanges.urine}` : ''}
                  </Button>
                  <Button
                    variant={stepRecord?.diaperChanges?.popo ? 'contained' : 'outlined'}
                    color={stepRecord?.diaperChanges?.popo ? 'success' : 'primary'}
                    size="small"
                    onClick={() => handleDiaperChange('popo')}
                  >
                    💩{stepRecord?.diaperChanges?.popo ? `x${stepRecord.diaperChanges.popo}` : ''}
                  </Button>
                  <Button
                    variant={stepRecord?.diaperChanges?.manyPopo ? 'contained' : 'outlined'}
                    color={stepRecord?.diaperChanges?.manyPopo ? 'success' : 'primary'}
                    size="small"
                    onClick={() => handleDiaperChange('manyPopo')}
                  >
                    💩💩{stepRecord?.diaperChanges?.manyPopo ? `x${stepRecord.diaperChanges.manyPopo}` : ''}
                  </Button>
                </Box>
              </Box>
            )}

            {/* Bath & Nail Trim - for massage & clean step */}
            {BATH_ALLOWED_STEPS.includes(currentStep) && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  {getLangText('清潔選項', 'Clean Options')}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                  <Button
                    variant={stepRecord?.bathDone ? 'contained' : 'outlined'}
                    color={stepRecord?.bathDone ? 'success' : 'primary'}
                    size="small"
                    onClick={handleBathToggle}
                  >
                    🛁 {getLangText('淋浴', 'Shower')}
                  </Button>
                  <Button
                    variant={stepRecord?.nailTrim?.leftHand ? 'contained' : 'outlined'}
                    color={stepRecord?.nailTrim?.leftHand ? 'success' : 'primary'}
                    size="small"
                    onClick={() => handleNailTrimToggle('leftHand')}
                  >
                    ✋L
                  </Button>
                  <Button
                    variant={stepRecord?.nailTrim?.rightHand ? 'contained' : 'outlined'}
                    color={stepRecord?.nailTrim?.rightHand ? 'success' : 'primary'}
                    size="small"
                    onClick={() => handleNailTrimToggle('rightHand')}
                  >
                    ✋R
                  </Button>
                  <Button
                    variant={stepRecord?.nailTrim?.leftFoot ? 'contained' : 'outlined'}
                    color={stepRecord?.nailTrim?.leftFoot ? 'success' : 'primary'}
                    size="small"
                    onClick={() => handleNailTrimToggle('leftFoot')}
                  >
                    🦶L
                  </Button>
                  <Button
                    variant={stepRecord?.nailTrim?.rightFoot ? 'contained' : 'outlined'}
                    color={stepRecord?.nailTrim?.rightFoot ? 'success' : 'primary'}
                    size="small"
                    onClick={() => handleNailTrimToggle('rightFoot')}
                  >
                    🦶R
                  </Button>
                </Box>
              </Box>
            )}

            {/* Burp - for feeding step */}
            {BURP_ALLOWED_STEPS.includes(currentStep) && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  {getLangText('掃風', 'Burp')}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Button
                    variant={stepRecord?.burpDone ? 'contained' : 'outlined'}
                    color={stepRecord?.burpDone ? 'success' : 'primary'}
                    size="small"
                    onClick={handleBurpToggle}
                  >
                    ✓ {getLangText('掃風', 'Burp')}
                  </Button>
                </Box>
              </Box>
            )}

            {/* Play Options - for playing step */}
            {PLAY_ALLOWED_STEPS.includes(currentStep) && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  {getLangText('玩耍選項', 'Play Options')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                  {PLAY_OPTIONS.map(option => (
                    <Button
                      key={option.id}
                      variant={stepRecord?.playOptions?.includes(option.id) ? 'contained' : 'outlined'}
                      color={stepRecord?.playOptions?.includes(option.id) ? 'primary' : 'inherit'}
                      size="small"
                      onClick={() => handlePlayOptionToggle(option.id)}
                      sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}
                    >
                      {option.icon}
                      <Typography variant="caption">{getLangText(option.labelZh, option.labelEn)}</Typography>
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
              <Button variant="outlined" size="small" onClick={handlePrev} disabled={currentStep === 0}>
                {getLangText('上一步', 'Prev')}
              </Button>
              {SKIP_ALLOWED_STEPS.includes(currentStep) && !stepRecord?.skipped && (
                <Button variant="outlined" color="warning" size="small" onClick={handleSkip}>
                  {getLangText('跳過', 'Skip')}
                </Button>
              )}
              <Button variant="contained" size="small" onClick={handleNext}>
                {currentStep === CYCLE_STEPS.length - 1 ? getLangText('完成', 'Done') : getLangText('下一步', 'Next')}
              </Button>
            </Box>
          </CardContent>
        </Card>
        </Container>
      </Box>

      {/* Skip Dialog */}
      <Dialog open={showSkipDialog} onClose={() => setShowSkipDialog(false)}>
        <DialogTitle>{getLangText('跳過原因', 'Skip Reason')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={2}
            value={skipReason}
            onChange={(e) => setSkipReason(e.target.value)}
            placeholder={getLangText('請輸入跳過原因...', 'Enter reason for skip...')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSkipDialog(false)}>{getLangText('取消', 'Cancel')}</Button>
          <Button variant="contained" onClick={confirmSkip}>{getLangText('確認跳過', 'Confirm Skip')}</Button>
        </DialogActions>
      </Dialog>

      {/* Cycle Complete Dialog */}
      <Dialog open={showCompleteDialog} onClose={() => setShowCompleteDialog(false)}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          {getLangText('週期完成', 'Cycle Complete')}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center' }}>
            {getLangText(
              '恭喜！已完成第' + completedCycleNum + '個週期。',
              'Great job! Cycle ' + completedCycleNum + ' completed.'
            )}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => setShowCompleteDialog(false)}>
            {getLangText('確認', 'OK')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Incomplete Steps Warning Dialog */}
      <Dialog open={showIncompleteDialog} onClose={() => setShowIncompleteDialog(false)}>
        <DialogTitle sx={{ textAlign: 'center', color: 'warning.main' }}>
          {getLangText('無法完成週期', 'Cannot Complete Cycle')}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center' }}>
            {getLangText('請先完成以下步驟：', 'Please complete the following steps first:')}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {incompleteSteps.map(stepIdx => {
              const step = CYCLE_STEPS[stepIdx];
              return (
                <Box key={stepIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">{step.icon}</Typography>
                  <Typography variant="body2">{getLangText(step.nameZh, step.nameEn)}</Typography>
                </Box>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => setShowIncompleteDialog(false)}>
            {getLangText('確定', 'OK')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Cycle Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle sx={{ textAlign: 'center', color: 'error.main' }}>
          {getLangText('確認刪除', 'Confirm Delete')}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center' }}>
            {getLangText('確定要刪除這個週期嗎？此操作無法撤銷。', 'Are you sure you want to delete this cycle? This action cannot be undone.')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={() => setShowDeleteDialog(false)}>
            {getLangText('取消', 'Cancel')}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              const newRecords = JSON.parse(JSON.stringify(cycleRecords)) as typeof cycleRecords;
              delete newRecords[currentDate][currentCycle];
              updateCycles(newRecords);
              if (currentCycle > 0) {
                setCurrentCycle(currentCycle - 1);
              }
              setCurrentStep(0);
              setShowDeleteDialog(false);
            }}
          >
            {getLangText('確認刪除', 'Confirm Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BabyFeedingCycle;