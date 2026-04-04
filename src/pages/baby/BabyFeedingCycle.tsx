import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getLangText } from '../../i18n';
import { useTheme } from '@mui/material';
import DateSelector from '../../components/DateSelector';
import PageHeader from '../../components/PageHeader';
import { useBabyCycleStore } from '../../stores/babyCycleStore';
import BabySelector from '../../components/baby/BabySelector';
import { useBabyStore } from '../../stores/babyStore';
import { useSettingsStore, loadSettings } from '../../stores/settingsStore';
import type { StepRecord, NailTrim } from '../../types/fdh';

interface CycleStep {
  id: number;
  nameZh: string;
  nameEn: string;
  icon: string;
}

const CYCLE_STEPS: CycleStep[] = [
  { id: 0, nameZh: '叫醒BB', nameEn: 'Wake Up', icon: '🌅' },
  { id: 1, nameZh: '按摩及清潔', nameEn: 'Massage & Clean', icon: '✋' },
  { id: 2, nameZh: '餵奶及掃風', nameEn: 'Feeding & Burp', icon: '🍼' },
  { id: 3, nameZh: '玩耍', nameEn: 'Playing', icon: '🎨' },
  { id: 4, nameZh: '睡覺', nameEn: 'Sleeping', icon: '💤' },
  { id: 5, nameZh: '修剪指甲', nameEn: 'Trim Nails', icon: '💅' },
  { id: 6, nameZh: '備註', nameEn: 'Remark', icon: '📝' },
];

// Required steps (excluding optional steps 5 and 6)
const REQUIRED_STEPS = [0, 1, 2, 3, 4];

// Steps that require navigation bar (mandatory with time)
const NAV_REQUIRED_STEPS = [0, 2, 4];

// Steps that allow skip with reason (massage, playing)
const SKIP_ALLOWED_STEPS = [1, 3];

// Steps that DON'T need time input (auto-complete when any item updated)
const NO_TIME_STEPS = [1, 3, 5, 6];

// Optional steps (no navigation, always show ?)
const OPTIONAL_STEPS = [5, 6];

// Steps that allow diaper changes (massage, feeding, playing)
const DIAPER_ALLOWED_STEPS = [1, 2, 3];

// Steps that allow burp time (feeding step)
const BURP_ALLOWED_STEPS = [2];

// Steps that allow bath (massage & clean step)
const BATH_ALLOWED_STEPS = [1];

// Steps that allow play options (playing step)
const PLAY_ALLOWED_STEPS = [3];

// Steps that allow nail trim (optional step)
const NAIL_TRIM_ALLOWED_STEPS = [5];

// Steps that allow remark (optional step)
const REMARK_ALLOWED_STEPS = [6];

// Reusable record badge component
const RecordBadge: React.FC<{ record: StepRecord; isDark: boolean; stepId?: number; customPlayOptions?: { id: string; icon: string; labelZh: string; labelEn: string }[] }> = ({ record, isDark, stepId, customPlayOptions = [] }) => {
  if (!record || !(record.time || record.skipped || record.diaperChanges?.urine || record.diaperChanges?.popo || record.diaperChanges?.manyPopo || record.bathDone || record.nailTrim?.leftHand || record.nailTrim?.rightHand || record.nailTrim?.leftFoot || record.nailTrim?.rightFoot || record.burpDone || record.milkAmount || record.massageDone || (record.playOptions && record.playOptions.length > 0) || record.remark)) {
    return null;
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
      {/* Hide time for NO_TIME_STEPS (massage/clean and playing) - but show if exists */}
      {(record.time && !NO_TIME_STEPS.includes(stepId || 0)) && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#1565c0' : '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#1565c0' }}>
            ⏰ {record.time}
          </Typography>
        </Box>
      )}
      {record.massageDone && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#7e57c2' : '#ede7f6', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#673ab7' }}>
            ✋ {getLangText('按摩', 'Massage')}
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
      {record.milkAmount > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#ec407a' : '#fce4ec', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#c2185b' }}>
            🍼 {record.milkAmount}ml
          </Typography>
        </Box>
      )}
      {record.playOptions && record.playOptions.length > 0 && (
        <>
          {record.playOptions.map(id => {
            const option = customPlayOptions.find(p => p.id === id);
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
      {record.remark && (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, bgcolor: isDark ? '#78909c' : '#cfd8dc', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#455a64' }}>
            📝 {record.remark}
          </Typography>
        </Box>
      )}
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

const BabyFeedingCycle: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const { cycleRecords, currentDate, loadDay, updateCycles } = useBabyCycleStore();
  const { getDefaultBaby, loadSettings: loadBabySettings } = useBabyStore();
  const { settings } = useSettingsStore();

  // Get all playing options from settings
  const allPlayOptions = settings.baby.playOptions
    .map(id => settings.baby.customPlayOptions.find(opt => opt.id === id))
    .filter((opt): opt is NonNullable<typeof opt> => opt !== undefined);

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
    loadBabySettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    const updates: any = {
      time: timeStr,
      skipped: false,
      skipReason: '',
    };

    // For step 2 (feeding), auto-set default milk amount if not set
    if (currentStep === 2 && !newRecords[currentDate][currentCycle][currentStep].milkAmount) {
      updates.milkAmount = settings.baby.defaultMilkAmount;
    }

    newRecords[currentDate][currentCycle][currentStep] = {
      ...newRecords[currentDate][currentCycle][currentStep],
      ...updates,
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

    const updates: any = {
      time,
      skipped: false,
      skipReason: '',
    };

    // For step 2 (feeding), auto-set default milk amount if not set
    if (currentStep === 2 && !newRecords[currentDate][currentCycle][currentStep].milkAmount) {
      updates.milkAmount = settings.baby.defaultMilkAmount;
    }

    newRecords[currentDate][currentCycle][currentStep] = {
      ...newRecords[currentDate][currentCycle][currentStep],
      ...updates,
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

    // For NO_TIME_STEPS (massage/clean and playing), set time if any action exists, clear if none
    if (NO_TIME_STEPS.includes(currentStep)) {
      // Get current record to check existing state
      const currentRecord = newRecords[currentDate][currentCycle][currentStep] || {};
      const currentDiaper = updates.diaperChanges || currentRecord.diaperChanges || { urine: 0, popo: 0, manyPopo: 0 };
      const currentPlayOptions = updates.playOptions !== undefined ? updates.playOptions : (currentRecord.playOptions || []);

      const hasAnyAction =
        updates.massageDone !== undefined ? updates.massageDone : currentRecord.massageDone ||
        updates.bathDone !== undefined ? updates.bathDone : currentRecord.bathDone ||
        (currentDiaper.urine > 0) ||
        (currentDiaper.popo > 0) ||
        (currentDiaper.manyPopo > 0) ||
        currentPlayOptions.length > 0;

      if (hasAnyAction) {
        const now = new Date();
        updates.time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      } else {
        // If no actions, clear time (but keep skipped state if present)
        if (!updates.skipped) {
          updates.time = '';
        }
      }
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

  const confirmSkip = () => {
    // Clear all other actions and set skipped
    updateCurrentStep({
      time: '',
      skipped: true,
      skipReason,
      massageDone: false,
      bathDone: false,
      diaperChanges: { urine: 0, popo: 0, manyPopo: 0 },
      nailTrim: { leftHand: false, rightHand: false, leftFoot: false, rightFoot: false },
      burpDone: false,
      milkAmount: 0,
      playOptions: [],
    });
    setShowSkipDialog(false);
    setSkipReason('');
  };

  const handleUndoSkip = () => {
    updateCurrentStep({ time: '', skipped: false, skipReason: '' });
  };

  const isAllStepsCompleted = (cycleIdx: number) => {
    const cycleData = dateCycles[cycleIdx];
    if (!cycleData) return false;
    // Only check required steps (0-4), exclude optional steps 5 (trim nails) and 6 (remark)
    for (const i of REQUIRED_STEPS) {
      const record = cycleData[i];
      // For step 2 (feeding), need time or milkAmount or skipped
      if (i === 2) {
        if (!record || (!record.time && record.milkAmount <= 0 && !record.skipped)) {
          return false;
        }
      } else if (!record || (!record.time && !record.skipped)) {
        return false;
      }
    }
    return true;
  };

  const getIncompleteSteps = (cycleIdx: number) => {
    const cycleData = dateCycles[cycleIdx];
    const incomplete: number[] = [];
    // Only check required steps (0-4), exclude optional steps 5 (trim nails) and 6 (remark)
    for (const i of REQUIRED_STEPS) {
      const record = cycleData?.[i];
      // For step 2 (feeding), allow milkAmount as alternative to time
      if (i === 2) {
        if (!record || (!record.time && record.milkAmount <= 0 && !record.skipped)) {
          incomplete.push(i);
        }
      } else if (!record || (!record.time && !record.skipped)) {
        incomplete.push(i);
      }
    }
    return incomplete;
  };

  const handleNext = () => {
    // Stop at step 4 (sleeping) - complete the cycle
    if (currentStep === 4) {
      // Check if required steps have time or skipped (steps 0-4 only)
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
      return;
    }

    // For other required steps, go to next
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Should not reach here, but just in case
      setCurrentStep(4);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      // If at optional steps (5 or 6), go back to step 4 (sleeping)
      if (currentStep > 4) {
        setCurrentStep(4);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const handleCycleChange = (cycleIdx: number) => {
    setCurrentCycle(cycleIdx);
    setCurrentStep(0);
  };

  const getStepStatus = (stepId: number) => {
    const record = cycleData?.[stepId];
    if (record?.skipped) return 'skipped';
    if (record?.time) return 'completed';
    // For NO_TIME_STEPS (1, 3): check if any action is done
    if (SKIP_ALLOWED_STEPS.includes(stepId)) {
      const hasAnyAction =
        record?.massageDone ||
        record?.bathDone ||
        (record?.diaperChanges?.urine ?? 0) > 0 ||
        (record?.diaperChanges?.popo ?? 0) > 0 ||
        (record?.diaperChanges?.manyPopo ?? 0) > 0 ||
        (record?.playOptions?.length ?? 0) > 0;
      if (hasAnyAction) return 'completed';
    }
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const getCycleRecord = (cycleIdx: number) => {
    const cycleData = dateCycles[cycleIdx] || {};
    return cycleData;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: isDark ? '#121212' : '#f5f5f5' }}>
      <PageHeader
        title={getLangText('餵奶週期', 'Feeding Cycle')}
        leftTitle
        backPath="/baby"
        rightButtons={
          <>
            <BabySelector compact iconOnly />
            <DateSelector
              currentDate={currentDate}
              onDateChange={handleDateChange}
              isDark={isDark}
              compact
              showIcon
            />
            <IconButton onClick={() => navigate('/baby/settings')} sx={{ color: isDark ? '#fff' : 'inherit' }} size="small">
              <SettingsIcon />
            </IconButton>
          </>
        }
      />

      <Box sx={{ flex: 1, overflow: 'auto', py: 1, pb: 10 }}>
        <Container maxWidth="sm">
        {/* Date Display with prev/next */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <IconButton size="small" onClick={() => {
            const prev = new Date(currentDate);
            prev.setDate(prev.getDate() - 1);
            handleDateChange(prev.toISOString().split('T')[0]);
          }}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {currentDate} ({getLangText(
              ['日', '一', '二', '三', '四', '五', '六'][new Date(currentDate).getDay()],
              ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(currentDate).getDay()]
            )})
          </Typography>
          <IconButton size="small" onClick={() => {
            const next = new Date(currentDate);
            next.setDate(next.getDate() + 1);
            handleDateChange(next.toISOString().split('T')[0]);
          }}>
            <ChevronRightIcon />
          </IconButton>
        </Box>

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
                  // Only use step 0 (wake up) and step 4 (sleeping) for time display
                  const startTime = rec[0]?.time;
                  const endTime = rec[4]?.time;
                  const timeDisplay = startTime || endTime
                    ? `(${startTime || ''} - ${endTime || ''})`
                    : '';
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
                  rec && (rec.time || rec.skipped || rec.bathDone || rec.burpDone || rec.massageDone || rec.milkAmount ||
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

            // Determine step state for display
            const isOptional = OPTIONAL_STEPS.includes(index);
            const hasData = stepRecord?.time || stepRecord?.milkAmount || stepRecord?.massageDone || stepRecord?.bathDone || stepRecord?.nailTrim?.leftHand || stepRecord?.nailTrim?.rightHand || stepRecord?.nailTrim?.leftFoot || stepRecord?.nailTrim?.rightFoot || (stepRecord?.playOptions && stepRecord.playOptions.length > 0) || stepRecord?.remark;
            const isCompleted = status === 'completed';
            const isSkipped = status === 'skipped';
            const isOptionalIncomplete = isOptional && !hasData && !isSkipped;

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
                {/* Step status icon */}
                {isCompleted ? (
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                ) : isSkipped ? (
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#ff9800', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
                    <Typography sx={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>S</Typography>
                  </Box>
                ) : isOptionalIncomplete ? (
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#ff9800', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
                    <Typography sx={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>?</Typography>
                  </Box>
                ) : status === 'current' ? (
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid', borderColor: 'primary.main', mr: 1 }} />
                ) : (
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid', borderColor: 'grey.400', mr: 1 }} />
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
                {(stepRecord?.time || stepRecord?.skipped || stepRecord?.diaperChanges?.urine || stepRecord?.diaperChanges?.popo || stepRecord?.diaperChanges?.manyPopo || stepRecord?.bathDone || stepRecord?.nailTrim?.leftHand || stepRecord?.nailTrim?.rightHand || stepRecord?.nailTrim?.leftFoot || stepRecord?.nailTrim?.rightFoot || stepRecord?.burpDone || stepRecord?.milkAmount || stepRecord?.massageDone || (stepRecord?.playOptions && stepRecord?.playOptions.length > 0) || stepRecord?.remark) && (
                  <RecordBadge record={stepRecord} isDark={isDark} stepId={index} customPlayOptions={settings.baby.customPlayOptions} />
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

            {stepRecord?.skipped && (
              <Box sx={{ mb: 2, p: 1, bgcolor: isDark ? '#ff9800' : '#fff3e0', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ color: isDark ? '#fff' : '#e65100', fontWeight: 600 }}>
                  {getLangText('已跳過', 'Skipped')}
                </Typography>
                {stepRecord.skipReason && (
                  <Typography variant="caption" sx={{ color: isDark ? '#fff' : '#e65100' }}>
                    {getLangText('原因', 'Reason')}: {stepRecord.skipReason}
                  </Typography>
                )}
              </Box>
            )}

            {/* All actions - only show if not skipped */}
            {!stepRecord?.skipped && (
              <Box>
            {/* Time Input - hide for NO_TIME_STEPS */}
            {!NO_TIME_STEPS.includes(currentStep) && (
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
              </Box>
            )}

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

            {/* Massage - for massage & clean step */}
            {BATH_ALLOWED_STEPS.includes(currentStep) && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  {getLangText('按摩', 'Massage')}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                  <Button
                    variant={stepRecord?.massageDone ? 'contained' : 'outlined'}
                    color={stepRecord?.massageDone ? 'success' : 'primary'}
                    size="small"
                    onClick={() => updateCurrentStep({ massageDone: !stepRecord?.massageDone })}
                  >
                    ✋ {getLangText('按摩', 'Massage')}
                  </Button>
                </Box>
              </Box>
            )}

            {/* Bath - for massage & clean step */}
            {BATH_ALLOWED_STEPS.includes(currentStep) && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  {getLangText('淋浴', 'Shower')}
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
                </Box>
              </Box>
            )}

            {/* Milk Amount - for feeding step */}
            {currentStep === 2 && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  {getLangText('奶量 (ml)', 'Milk (ml)')}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      const current = stepRecord?.milkAmount ?? settings.baby.defaultMilkAmount;
                      updateCurrentStep({ milkAmount: Math.max(0, current - 5) });
                    }}
                    sx={{ minWidth: 40 }}
                  >
                    -
                  </Button>
                  <TextField
                    type="number"
                    size="small"
                    value={stepRecord?.milkAmount ?? settings.baby.defaultMilkAmount}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      updateCurrentStep({ milkAmount: Math.max(0, value) });
                    }}
                    inputProps={{ min: 0, max: 500, step: 5 }}
                    sx={{ width: 80 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      const current = stepRecord?.milkAmount ?? settings.baby.defaultMilkAmount;
                      updateCurrentStep({ milkAmount: Math.min(500, current + 5) });
                    }}
                    sx={{ minWidth: 40 }}
                  >
                    +
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
                  {allPlayOptions.map(option => (
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

            {/* Nail Trim - for nail trim step */}
            {NAIL_TRIM_ALLOWED_STEPS.includes(currentStep) && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  {getLangText('修剪指甲', 'Trim Nails')}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, flexWrap: 'wrap' }}>
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

            {/* Remark - for remark step */}
            {REMARK_ALLOWED_STEPS.includes(currentStep) && (
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  {getLangText('備註', 'Remark')}
                </Typography>
                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  value={stepRecord?.remark || ''}
                  onChange={(e) => updateCurrentStep({ remark: e.target.value })}
                  placeholder={getLangText('輸入備註...', 'Enter remark...')}
                  size="small"
                />
              </Box>
            )}
              </Box>
            )}

            {/* Navigation - show for required steps (0, 2, 4) and skip-allowed steps (1, 3) */}
            {(NAV_REQUIRED_STEPS.includes(currentStep) || SKIP_ALLOWED_STEPS.includes(currentStep)) && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2, pt: 2, borderTop: `1px solid ${isDark ? '#444' : '#eee'}` }}>
                <Button variant="outlined" size="small" onClick={handlePrev} disabled={currentStep === 0 || currentStep > 4}>
                  {getLangText('上一步', 'Prev')}
                </Button>
                {SKIP_ALLOWED_STEPS.includes(currentStep) && (
                  <Button
                    variant={stepRecord?.skipped ? 'contained' : 'outlined'}
                    color="warning"
                    size="small"
                    onClick={stepRecord?.skipped ? handleUndoSkip : () => setShowSkipDialog(true)}
                  >
                    {stepRecord?.skipped ? getLangText('取消跳過', 'Undo Skip') : getLangText('跳過', 'Skip')}
                  </Button>
                )}
                <Button variant="contained" size="small" onClick={handleNext}>
                  {currentStep === 4 ? getLangText('完成', 'Done') : getLangText('下一步', 'Next')}
                </Button>
              </Box>
            )}
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