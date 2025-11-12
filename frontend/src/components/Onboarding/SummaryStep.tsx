import React from 'react';
import { useOnboardingState } from '../../hooks/useOnboardingState';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  Group,
  AccountBalance,
  AttachMoney,
  TrendingUp,
  CheckCircle,
  Description,
} from '@mui/icons-material';

type SectionProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

const Section = ({ title, icon, children }: SectionProps) => (
  <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {icon}
      <Typography variant="h6" sx={{ ml: 1 }}>
        {title}
      </Typography>
    </Box>
    {children}
  </Paper>
);

const steps = [
  'Profile',
  'Family',
  'Data Sources',
  'Income & Expenses',
  'Goals',
  'Review & Complete',
];

export default function SummaryStep() {
  const { state, completeOnboarding, isLoading } = useOnboardingState();
  const navigate = useNavigate();

  const handleComplete = async () => {
    try {
      await completeOnboarding();
      toast.success('Onboarding completed successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Calculate totals
  const totalIncome = state.monthly_income || 0;
  const totalExpenses = state.monthly_expenses || 0;
  const netSavings = totalIncome - totalExpenses;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Review Your Information
      </Typography>
      <Typography color="textSecondary" paragraph>
        Please review all the information you've provided. You can go back to make changes or submit to complete your profile.
      </Typography>

      <Stepper activeStep={5} alternativeLabel sx={{ my: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Profile Summary */}
      <Section 
        title="Profile Information" 
        icon={<Person color="primary" />}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">Full Name</Typography>
            <Typography>{state.full_name || 'Not provided'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">Email</Typography>
            <Typography>{state.email || 'Not provided'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
            <Typography>{state.mobile_number || 'Not provided'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">Address</Typography>
            <Typography>{state.address || 'Not provided'}</Typography>
          </Grid>
        </Grid>
      </Section>

      {/* Family Summary */}
      <Section 
        title="Family Members" 
        icon={<Group color="primary" />}
      >
        {state.family_members?.length > 0 ? (
          <List>
            {state.family_members.map((member, index) => (
              <ListItem key={index} divider={index < state.family_members.length - 1}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {member.name?.charAt(0) || '?'}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={member.name}
                  secondary={`${member.relation || ''} • ${member.dob ? new Date(member.dob).toLocaleDateString() : 'No DOB'}`}
                />
                <Chip 
                  label={member.marital_status || 'Not specified'} 
                  size="small" 
                  variant="outlined"
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="textSecondary">No family members added</Typography>
        )}
      </Section>

      {/* Financial Summary */}
      <Section 
        title="Financial Overview" 
        icon={<AccountBalance color="primary" />}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Monthly Income
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp color="success" sx={{ mr: 1 }} />
                  <Typography variant="h5">
                    {formatCurrency(totalIncome)}
                  </Typography>
                </Box>
                {state.monthly_income_details && Object.entries(state.monthly_income_details).length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="textSecondary">Breakdown:</Typography>
                    <List dense disablePadding>
                      {Object.entries(state.monthly_income_details).map(([category, amount]) => (
                        <Box key={category} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">{category}</Typography>
                          <Typography variant="body2">{formatCurrency(Number(amount))}</Typography>
                        </Box>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Monthly Expenses
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp color="error" sx={{ mr: 1 }} />
                  <Typography variant="h5">
                    {formatCurrency(totalExpenses)}
                  </Typography>
                </Box>
                {state.monthly_expenses_details && Object.entries(state.monthly_expenses_details).length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="textSecondary">Breakdown:</Typography>
                    <List dense disablePadding>
                      {Object.entries(state.monthly_expenses_details).map(([category, amount]) => (
                        <Box key={category} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">{category}</Typography>
                          <Typography variant="body2">{formatCurrency(Number(amount))}</Typography>
                        </Box>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Net Monthly Savings
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp 
                    color={netSavings >= 0 ? 'success' : 'error'} 
                    sx={{ mr: 1 }} 
                  />
                  <Typography 
                    variant="h5" 
                    color={netSavings >= 0 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(Math.abs(netSavings))}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {netSavings >= 0 
                    ? 'Great! You have a positive cash flow.' 
                    : 'Consider reviewing your expenses to improve your cash flow.'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Section>

      {/* Goals Summary */}
      <Section 
        title="Financial Goals" 
        icon={<TrendingUp color="primary" />}
      >
        {state.goals?.length > 0 ? (
          <Grid container spacing={2}>
            {state.goals.map((goal, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        {goal.title}
                      </Typography>
                      <Chip 
                        label={goal.priority === 1 ? 'High' : goal.priority === 2 ? 'Medium' : 'Low'}
                        size="small"
                        color={
                          goal.priority === 1 ? 'error' : 
                          goal.priority === 2 ? 'warning' : 'success'
                        }
                        variant="outlined"
                      />
                    </Box>
                    
                    {goal.description && (
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        {goal.description}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Box>
                        <Typography variant="caption" color="textSecondary">Target</Typography>
                        <Typography variant="body2">
                          {goal.target_amount ? formatCurrency(goal.target_amount) : 'Not specified'}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="textSecondary">
                          {goal.target_date 
                            ? 'Target Date' 
                            : goal.target_year 
                              ? 'Target Year' 
                              : 'No target date'}
                        </Typography>
                        <Typography variant="body2">
                          {goal.target_date 
                            ? new Date(goal.target_date).toLocaleDateString() 
                            : goal.target_year || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="textSecondary">No goals added yet</Typography>
        )}
      </Section>

      {/* Data Sources Summary */}
      <Section 
        title="Connected Accounts" 
        icon={<Description color="primary" />}
      >
        {state.connected_sources?.length > 0 ? (
          <Grid container spacing={2}>
            {state.connected_sources.map((source, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <CheckCircle color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2">{source.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Last synced: {new Date(source.last_synced).toLocaleString()}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="textSecondary">No accounts connected</Typography>
        )}
      </Section>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleComplete}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? 'Completing...' : 'Complete Onboarding'}
        </Button>
      </Box>
    </Paper>
  );
}
