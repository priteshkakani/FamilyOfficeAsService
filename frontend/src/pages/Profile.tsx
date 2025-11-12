import React, { useState } from 'react';
import { useProfile, useUpdateProfile, useUploadAvatar } from '../hooks/useProfile';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Paper,
  Grid,
  CircularProgress,
  IconButton,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

type ProfileFormData = {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
};

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const [isUploading, setIsUploading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>();

  React.useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        date_of_birth: profile.date_of_birth || '',
        phone: profile.phone || '',
        address: {
          street: profile.address?.street || '',
          city: profile.address?.city || '',
          state: profile.address?.state || '',
          country: profile.address?.country || '',
          postal_code: profile.address?.postal_code || '',
        },
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync({
        ...data,
        updated_at: new Date().toISOString(),
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      const avatarUrl = await uploadAvatar.mutateAsync(file);
      await updateProfile.mutateAsync({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });
      toast.success('Profile picture updated');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth="md" mx="auto">
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Box position="relative">
            <Avatar
              src={profile?.avatar_url}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <Input
              accept="image/*"
              id="avatar-upload"
              type="file"
              sx={{ display: 'none' }}
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
            <label htmlFor="avatar-upload">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                disabled={isUploading}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'background.paper',
                }}
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>
          <Typography variant="subtitle1">
            {profile?.first_name} {profile?.last_name}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                {...register('first_name')}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                {...register('last_name')}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                {...register('date_of_birth')}
                error={!!errors.date_of_birth}
                helperText={errors.date_of_birth?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                {...register('phone')}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Address
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                variant="outlined"
                {...register('address.street')}
                error={!!errors.address?.street}
                helperText={errors.address?.street?.message}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                variant="outlined"
                {...register('address.city')}
                error={!!errors.address?.city}
                helperText={errors.address?.city?.message}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State/Province"
                variant="outlined"
                {...register('address.state')}
                error={!!errors.address?.state}
                helperText={errors.address?.state?.message}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                variant="outlined"
                {...register('address.country')}
                error={!!errors.address?.country}
                helperText={errors.address?.country?.message}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                variant="outlined"
                {...register('address.postal_code')}
                error={!!errors.address?.postal_code}
                helperText={errors.address?.postal_code?.message}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={updateProfile.isLoading}
              >
                {updateProfile.isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
