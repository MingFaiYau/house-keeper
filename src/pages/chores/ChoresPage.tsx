import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useChoresStore } from '../../stores/fdhStore';
import type { ChoreTask, ChoreCategory } from '../../types/fdh';
import { getLangText } from '../../i18n';

const CATEGORIES: { value: ChoreCategory; labelZh: string; labelEn: string }[] = [
  { value: 'daily', labelZh: '每日', labelEn: 'Daily' },
  { value: 'weekly', labelZh: '每週', labelEn: 'Weekly' },
  { value: 'biweekly', labelZh: '雙週', labelEn: 'Bi-weekly' },
  { value: 'monthly', labelZh: '每月', labelEn: 'Monthly' },
  { value: 'adhoc', labelZh: '臨時', labelEn: 'Ad-hoc' },
];

const ChoresPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const { tasks, loadTasks, toggleTask, addCustomTask, removeCustomTask } = useChoresStore();
  const [selectedCategory, setSelectedCategory] = React.useState<ChoreCategory>('daily');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newTaskZh, setNewTaskZh] = React.useState('');
  const [newTaskEn, setNewTaskEn] = React.useState('');

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const getTitle = () => getLangText('家務清單', 'Household Chores');

  const filteredTasks = tasks.filter(t => t.category === selectedCategory);

  const handleAddTask = () => {
    if (!newTaskZh.trim()) return;
    const newTask: ChoreTask = {
      id: `custom-${Date.now()}`,
      nameZh: newTaskZh.trim(),
      nameEn: newTaskEn.trim() || newTaskZh.trim(),
      category: selectedCategory,
      completed: false,
    };
    addCustomTask(newTask);
    setNewTaskZh('');
    setNewTaskEn('');
    setDialogOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    if (taskId.startsWith('custom-')) {
      removeCustomTask(taskId);
    }
  };

  const getCompletedCount = (category: ChoreCategory) => {
    const categoryTasks = tasks.filter(t => t.category === category);
    return `${categoryTasks.filter(t => t.completed).length}/${categoryTasks.length}`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: isDark ? '#121212' : '#f5f5f5' }}>
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: isDark ? '#1e1e1e' : '#fff' }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate('/meal')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {getTitle()}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, overflow: 'auto', py: 1, pb: 10 }}>

      <Container maxWidth="sm" sx={{ py: 3 }}>
        {/* Category Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={selectedCategory}
            onChange={(_, value) => setSelectedCategory(value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {CATEGORIES.map(cat => (
              <Tab
                key={cat.value}
                value={cat.value}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{getLangText(cat.labelZh, cat.labelEn)}</span>
                    <Box
                      sx={{
                        fontSize: '0.75rem',
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      }}
                    >
                      {getCompletedCount(cat.value)}
                    </Box>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        {/* Task List */}
        <Card sx={{ bgcolor: isDark ? '#1e1e1e' : 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {getLangText(CATEGORIES.find(c => c.value === selectedCategory)?.labelZh || '', CATEGORIES.find(c => c.value === selectedCategory)?.labelEn || '')}
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setDialogOpen(true)}
                size="small"
                variant="outlined"
              >
                {getLangText('新增', 'Add')}
              </Button>
            </Box>

            <List>
              {filteredTasks.map((task) => (
                <ListItem
                  key={task.id}
                  sx={{
                    bgcolor: isDark ? '#2a2a2a' : '#f5f5f5',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      color="primary"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'text.secondary' : 'text.primary',
                        }}
                      >
                        {getLangText(task.nameZh, task.nameEn)}
                      </Typography>
                    }
                  />
                  {task.id.startsWith('custom-') && (
                    <ListItemSecondaryAction>
                      <IconButton edge="end" size="small" onClick={() => handleDeleteTask(task.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>

            {filteredTasks.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                {getLangText('暫無任務', 'No tasks')}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Add Task Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>{getLangText('新增任務', 'Add Task')}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={getLangText('中文名稱', 'Chinese Name')}
              fullWidth
              value={newTaskZh}
              onChange={(e) => setNewTaskZh(e.target.value)}
            />
            <TextField
              margin="dense"
              label={getLangText('英文名稱 (可選)', 'English Name (Optional)')}
              fullWidth
              value={newTaskEn}
              onChange={(e) => setNewTaskEn(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>{getLangText('取消', 'Cancel')}</Button>
            <Button onClick={handleAddTask} variant="contained">{getLangText('新增', 'Add')}</Button>
          </DialogActions>
        </Dialog>
      </Container>
      </Box>
    </Box>
  );
};

export default ChoresPage;