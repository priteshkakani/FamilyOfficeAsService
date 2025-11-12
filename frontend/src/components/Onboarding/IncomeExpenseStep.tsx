import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useOnboardingState } from '../../hooks/useOnboardingState';
import { toast } from 'react-hot-toast';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Add, Edit, Delete, AttachMoney, AccountBalance, TrendingUp, TrendingDown } from '@mui/icons-material';

type IncomeExpenseItem = {
  id?: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly' | 'one-time';
  description?: string;
};

const defaultCategories = {
  income: [
    'Salary',
    'Business Income',
    'Rental Income',
    'Dividends',
    'Interest Income',
    'Pension',
    'Social Security',
    'Other Income',
  ],
  expense: [
    'Housing',
    'Utilities',
    'Groceries',
    'Transportation',
    'Healthcare',
    'Insurance',
    'Education',
    'Entertainment',
    'Shopping',
    'Travel',
    'Debt Payments',
    'Savings',
    'Investments',
    'Charity',
    'Other Expenses',
  ],
};

const frequencyOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'one-time', label: 'One-time' },
];

export default function IncomeExpenseStep() {
  const { state, saveIncomeExpense, isLoading, nextStep, prevStep } = useOnboardingState();
  const [items, setItems] = useState<IncomeExpenseItem[]>([]);
  const [editingItem, setEditingItem] = useState<IncomeExpenseItem | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IncomeExpenseItem>({
    defaultValues: {
      type: 'income',
      category: '',
      amount: 0,
      frequency: 'monthly',
      description: '',
    },
  });

  const currentType = watch('type');
  
  // Load saved data on component mount
  useEffect(() => {
    if (state.monthly_income_details || state.monthly_expenses_details) {
      const incomeItems: IncomeExpenseItem[] = Object.entries(state.monthly_income_details || {}).map(([category, amount]) => ({
        id: `income-${category}`,
        type: 'income',
        category,
        amount: Number(amount),
        frequency: 'monthly',
      }));
      
      const expenseItems: IncomeExpenseItem[] = Object.entries(state.monthly_expenses_details || {}).map(([category, amount]) => ({
        id: `expense-${category}`,
        type: 'expense',
        category,
        amount: Number(amount),
        frequency: 'monthly',
      }));
      
      setItems([...incomeItems, ...expenseItems]);
    }
  }, [state]);

  const handleOpenDialog = (type: 'income' | 'expense', item: IncomeExpenseItem | null = null) => {
    if (item) {
      // Editing existing item
      setEditingItem(item);
      setValue('type', item.type);
      setValue('category', item.category);
      setValue('amount', item.amount);
      setValue('frequency', item.frequency);
      setValue('description', item.description || '');
      setActiveTab(item.type);
    } else {
      // Adding new item
      setEditingItem(null);
      setValue('type', type);
      setValue('category', '');
      setValue('amount', 0);
      setValue('frequency', 'monthly');
      setValue('description', '');
      setActiveTab(type);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    reset();
  };

  const handleSaveItem = async (data: IncomeExpenseItem) => {
    try {
      const itemData = {
        ...data,
        id: editingItem?.id || `${data.type}-${Date.now()}`,
        amount: Number(data.amount),
      };

      let updatedItems = [];
      
      if (editingItem) {
        // Update existing item
        updatedItems = items.map(item => 
          item.id === editingItem.id ? itemData : item
        );
      } else {
        // Add new item
        updatedItems = [...items, itemData];
      }
      
      setItems(updatedItems);
      
      // Save to database
      const incomeDetails: Record<string, number> = {};
      const expenseDetails: Record<string, number> = {};
      
      updatedItems.forEach(item => {
        if (item.type === 'income') {
          incomeDetails[item.category] = item.amount;
        } else {
          expenseDetails[item.category] = item.amount;
        }
      });
      
      await saveIncomeExpense({
        monthly_income: Object.values(incomeDetails).reduce((sum, amount) => sum + amount, 0),
        monthly_expenses: Object.values(expenseDetails).reduce((sum, amount) => sum + amount, 0),
        monthly_income_details: incomeDetails,
        monthly_expenses_details: expenseDetails,
      });
      
      handleCloseDialog();
      toast.success(editingItem ? 'Item updated' : 'Item added');
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      
      // Update database
      const incomeDetails: Record<string, number> = {};
      const expenseDetails: Record<string, number> = {};
      
      updatedItems.forEach(item => {
        if (item.type === 'income') {
          incomeDetails[item.category] = item.amount;
        } else {
          expenseDetails[item.category] = item.amount;
        }
      });
      
      await saveIncomeExpense({
        monthly_income: Object.values(incomeDetails).reduce((sum, amount) => sum + amount, 0),
        monthly_expenses: Object.values(expenseDetails).reduce((sum, amount) => sum + amount, 0),
        monthly_income_details: incomeDetails,
        monthly_expenses_details: expenseDetails,
      });
      
      toast.success('Item deleted');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const totalIncome = items
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const totalExpenses = items
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const netSavings = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Income & Expenses
      </Typography>
      <Typography color="textSecondary" paragraph>
        Track your monthly income and expenses to better understand your cash flow.
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            flex: 1, 
            minWidth: 200, 
            border: '1px solid',
            borderColor: 'success.light',
            bgcolor: 'success.50',
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">Total Monthly Income</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TrendingUp color="success" sx={{ mr: 1 }} />
            <Typography variant="h5" color="success.dark">
              {formatCurrency(totalIncome)}
            </Typography>
          </Box>
        </Paper>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            flex: 1, 
            minWidth: 200,
            border: '1px solid',
            borderColor: 'error.light',
            bgcolor: 'error.50',
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">Total Monthly Expenses</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TrendingDown color="error" sx={{ mr: 1 }} />
            <Typography variant="h5" color="error.dark">
              {formatCurrency(totalExpenses)}
            </Typography>
          </Box>
        </Paper>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            flex: 1, 
            minWidth: 200,
            border: '1px solid',
            borderColor: netSavings >= 0 ? 'primary.light' : 'warning.light',
            bgcolor: netSavings >= 0 ? 'primary.50' : 'warning.50',
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">Monthly Savings</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {netSavings >= 0 ? (
              <TrendingUp color="primary" sx={{ mr: 1 }} />
            ) : (
              <TrendingDown color="warning" sx={{ mr: 1 }} />
            )}
            <Typography 
              variant="h5" 
              color={netSavings >= 0 ? 'primary.dark' : 'warning.dark'}
            >
              {formatCurrency(Math.abs(netSavings))} {netSavings < 0 ? 'Deficit' : ''}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Income Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Income Sources</Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('income')}
            size="small"
          >
            Add Income
          </Button>
        </Box>
        
        {items.filter(item => item.type === 'income').length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items
                  .filter(item => item.type === 'income')
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.category}</TableCell>
                      <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                      <TableCell>
                        {frequencyOptions.find(f => f.value === item.frequency)?.label || item.frequency}
                      </TableCell>
                      <TableCell>{item.description || '-'}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog('income', item)}
                          disabled={isLoading}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => item.id && handleDeleteItem(item.id)}
                          disabled={isLoading}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No income sources added yet. Click "Add Income" to get started.
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Expenses Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Expenses</Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('expense')}
            size="small"
          >
            Add Expense
          </Button>
        </Box>
        
        {items.filter(item => item.type === 'expense').length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items
                  .filter(item => item.type === 'expense')
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.category}</TableCell>
                      <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                      <TableCell>
                        {frequencyOptions.find(f => f.value === item.frequency)?.label || item.frequency}
                      </TableCell>
                      <TableCell>{item.description || '-'}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog('expense', item)}
                          disabled={isLoading}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => item.id && handleDeleteItem(item.id)}
                          disabled={isLoading}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No expenses added yet. Click "Add Expense" to get started.
            </Typography>
          </Paper>
        )}
      </Box>

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

      {/* Add/Edit Item Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit Item' : `Add ${currentType === 'income' ? 'Income' : 'Expense'}`}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveItem)}>
          <DialogContent>
            <input type="hidden" {...register('type')} />
            
            <FormControl fullWidth margin="normal" error={!!errors.category}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                label="Category"
                {...register('category', { required: 'Category is required' })}
                defaultValue=""
              >
                <MenuItem value="">
                  <em>Select a category</em>
                </MenuItem>
                {(currentType === 'income' ? defaultCategories.income : defaultCategories.expense).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <FormHelperText>{errors.category.message}</FormHelperText>
              )}
            </FormControl>
            
            <TextField
              fullWidth
              margin="normal"
              label="Amount"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney />
                  </InputAdornment>
                ),
                inputProps: { min: 0, step: 1000 },
              }}
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 0, message: 'Amount must be positive' },
                valueAsNumber: true,
              })}
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="frequency-label">Frequency</InputLabel>
              <Select
                labelId="frequency-label"
                label="Frequency"
                {...register('frequency')}
                defaultValue="monthly"
              >
                {frequencyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              margin="normal"
              label="Description (Optional)"
              multiline
              rows={2}
              {...register('description')}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
}
