import React, { useEffect } from 'react';
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
} from '@mui/material';

interface ProfileFormData {
  full_name: string;
  email: string;
  mobile_number: string;
  address: string;
}

export default function ProfileStep() {
  const { state, saveProfile, isLoading, nextStep } = useOnboardingState();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: {
      full_name: state.full_name || '',
      email: state.email || '',
      mobile_number: state.mobile_number || '',
      address: state.address || '',
    },
  });

  // Update form when state changes
  useEffect(() => {
    reset({
      full_name: state.full_name || '',
      email: state.email || '',
      mobile_number: state.mobile_number || '',
      address: state.address || '',
    });
  }, [state, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const success = await saveProfile(data);
      if (success) {
        toast.success('Profile saved successfully');
        nextStep();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Profile Information
      </Typography>
      <Typography color="textSecondary" paragraph>
        Please provide your personal information to get started.
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="full_name"
              label="Full Name"
              autoComplete="name"
              disabled={isLoading}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
              {...register('full_name', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              disabled={true} // Email is read-only
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="mobile_number"
              label="Mobile Number"
              autoComplete="tel"
              disabled={isLoading}
              error={!!errors.mobile_number}
              helperText={errors.mobile_number?.message}
              {...register('mobile_number', {
                required: 'Mobile number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Please enter a valid 10-digit mobile number',
                },
              })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="address"
              label="Address"
              multiline
              rows={3}
              disabled={isLoading}
              error={!!errors.address}
              helperText={errors.address?.message}
              {...register('address', {
                required: 'Address is required',
              })}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !isDirty}
            sx={{ minWidth: 120 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Save & Continue'
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
