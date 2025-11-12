import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useOnboardingState } from '../../hooks/useOnboardingState';
import { toast } from 'react-hot-toast';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  CardActionArea,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';

type GoalFormData = {
  title: string;
  description?: string;
  target_amount?: number;
  target_date?: string;
  target_year?: number;
  priority: number;
  is_completed?: boolean;
};

const priorityOptions = [
  { value: 1, label: 'High', color: 'error' },
  { value: 2, label: 'Medium', color: 'warning' },
  { value: 3, label: 'Low', color: 'success' },
];

const goalTemplates = [
  {
    title: 'Retirement',
    description: 'Plan for a comfortable retirement',
    priority: 1,
    icon: '🏖️',
  },
  {
    title: 'Child Education',
    description: 'Save for your child\'s education',
    priority: 1,
    icon: '🎓',
  },
  {
    title: 'Home Purchase',
    description: 'Down payment for your dream home',
    priority: 1,
    icon: '🏠',
  },
  {
    title: 'Emergency Fund',
    description: '3-6 months of living expenses',
    priority: 1,
    icon: '🆘',
  },
  {
    title: 'Vacation',
    description: 'Dream vacation fund',
    priority: 3,
    icon: '✈️',
  },
  {
    title: 'New Car',
    description: 'Down payment for a new vehicle',
    priority: 2,
    icon: '🚗',
  },
];

export default function GoalsStep() {
  const { state, saveGoals, isLoading, nextStep, prevStep } = useOnboardingState();
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const defaultValues: GoalFormData = {
    title: '',
    description: '',
    target_amount: undefined,
    target_date: '',
    target_year: new Date().getFullYear(),
    priority: 2, // Medium priority by default
    is_completed: false,
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<GoalFormData>({ defaultValues });

  const hasTargetAmount = watch('target_amount') !== undefined;
  const hasTargetDate = watch('target_date') !== '';
  const hasTargetYear = watch('target_year') !== undefined;

  const handleOpen = (index: number | null = null) => {
    if (index !== null) {
      const goal = state.goals[index];
      reset({
        ...goal,
        target_date: goal.target_date ? (goal.target_date as string).split('T')[0] : '',
      });
      setEditingIndex(index);
    } else {
      reset(defaultValues);
      setEditingIndex(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset(defaultValues);
    setEditingIndex(null);
  };

  const onSubmit = async (data: GoalFormData) => {
    try {
      const updatedGoals = [...state.goals];
      const goalData = {
        ...data,
        target_amount: data.target_amount ? Number(data.target_amount) : null,
        target_year: data.target_year ? Number(data.target_year) : null,
      };

      if (editingIndex !== null) {
        updatedGoals[editingIndex] = goalData;
      } else {
        updatedGoals.push(goalData);
      }

      await saveGoals(updatedGoals);
      handleClose();
      toast.success(editingIndex !== null ? 'Goal updated' : 'Goal added');
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
    }
  };

  const handleDelete = async (index: number) => {
    try {
      const updatedGoals = state.goals.filter((_, i) => i !== index);
      await saveGoals(updatedGoals);
      toast.success('Goal removed');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const toggleComplete = async (index: number) => {
    try {
      const updatedGoals = [...state.goals];
      updatedGoals[index] = {
        ...updatedGoals[index],
        is_completed: !updatedGoals[index].is_completed,
      };
      await saveGoals(updatedGoals);
    } catch (error) {
      console.error('Error updating goal status:', error);
      toast.error('Failed to update goal status');
    }
  };

  const applyTemplate = (template: typeof goalTemplates[number]) => {
    reset({
      ...defaultValues,
      title: template.title,
      description: template.description,
      priority: template.priority,
    });
    setOpen(true);
  };

  // Calculate total target amount for all goals
  const totalTargetAmount = state.goals.reduce(
    (sum, goal) => sum + (goal.target_amount || 0),
    0
  );

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Financial Goals
      </Typography>
      <Typography color="textSecondary" paragraph>
        Set your financial goals to help plan your financial future.
      </Typography>

      {/* Goal Templates */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Quick Start Templates
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          {goalTemplates.map((template, index) => (
            <Card 
              key={index} 
              variant="outlined"
              sx={{ minWidth: 180, cursor: 'pointer' }}
              onClick={() => applyTemplate(template)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {template.icon}
                </Typography>
                <Typography variant="subtitle1">{template.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {template.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          Add Custom Goal
        </Button>
      </Box>

      {/* Goals Summary */}
      <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Goals Summary
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="textSecondary">Total Goals</Typography>
            <Typography variant="h4">{state.goals.length}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="textSecondary">Total Target Amount</Typography>
            <Typography variant="h4">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(totalTargetAmount)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="textSecondary">Completed</Typography>
            <Typography variant="h4">
              {state.goals.filter(g => g.is_completed).length} of {state.goals.length}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Goals List */}
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Goal</TableCell>
              <TableCell>Target Amount</TableCell>
              <TableCell>Target Date</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.goals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="textSecondary">
                    No goals added yet. Add your first goal using the button above or select a template.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              state.goals.map((goal, index) => {
                const priority = priorityOptions.find(p => p.value === goal.priority) || priorityOptions[1];
                return (
                  <TableRow 
                    key={index} 
                    sx={{ 
                      opacity: goal.is_completed ? 0.7 : 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleComplete(index)}
                        color={goal.is_completed ? 'success' : 'default'}
                        title={goal.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {goal.is_completed ? <CheckCircle /> : <RadioButtonUnchecked />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="subtitle2"
                        sx={{ 
                          textDecoration: goal.is_completed ? 'line-through' : 'none',
                          color: goal.is_completed ? 'text.secondary' : 'text.primary',
                        }}
                      >
                        {goal.title}
                      </Typography>
                      {goal.description && (
                        <Typography variant="body2" color="textSecondary">
                          {goal.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {goal.target_amount 
                        ? new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(goal.target_amount)
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {goal.target_date 
                        ? new Date(goal.target_date).toLocaleDateString() 
                        : goal.target_year || '-'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={priority.label}
                        size="small"
                        color={priority.color as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpen(index)}
                        disabled={isLoading}
                        title="Edit"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(index)}
                        disabled={isLoading}
                        color="error"
                        title="Delete"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={prevStep}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={nextStep}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Continue'}
        </Button>
      </Box>

      {/* Add/Edit Goal Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingIndex !== null ? 'Edit Goal' : 'Add New Goal'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Goal Title"
                  required
                  disabled={isLoading}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  {...register('title', { required: 'Title is required' })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  disabled={isLoading}
                  {...register('description')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Target Amount (₹)"
                  type="number"
                  disabled={isLoading}
                  InputProps={{ 
                    inputProps: { 
                      min: 0, 
                      step: 1000 
                    },
                    startAdornment: '₹ ',
                  }}
                  {...register('target_amount', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Amount must be positive' },
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    label="Priority"
                    defaultValue={2}
                    disabled={isLoading}
                    {...register('priority', { valueAsNumber: true })}
                  >
                    {priorityOptions.map((p) => (
                      <MenuItem key={p.value} value={p.value}>
                        {p.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Target Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  disabled={isLoading}
                  {...register('target_date')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Target Year"
                  type="number"
                  InputProps={{
                    inputProps: { 
                      min: new Date().getFullYear(),
                      max: new Date().getFullYear() + 50
                    }
                  }}
                  disabled={isLoading || hasTargetDate}
                  {...register('target_year', {
                    valueAsNumber: true,
                    min: new Date().getFullYear(),
                    max: new Date().getFullYear() + 50,
                  })}
                />
              </Grid>
              {editingIndex !== null && (
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...register('is_completed')}
                        disabled={isLoading}
                      />
                    }
                    label="Mark as completed"
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : editingIndex !== null ? (
                'Update Goal'
              ) : (
                'Add Goal'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
}
