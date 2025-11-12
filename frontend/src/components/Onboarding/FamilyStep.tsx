import React, { useState } from 'react';
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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

type FamilyMemberFormData = {
  name: string;
  relation: string;
  pan?: string;
  aadhaar?: string;
  dob?: string;
  profession?: string;
  marital_status?: string;
  marital_date?: string;
  address?: string;
};

const relations = [
  'Spouse',
  'Child',
  'Parent',
  'Sibling',
  'Grandparent',
  'Other',
];

const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];

export default function FamilyStep() {
  const { state, saveFamilyMembers, isLoading, nextStep, prevStep } = useOnboardingState();
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const defaultValues: FamilyMemberFormData = {
    name: '',
    relation: '',
    pan: '',
    aadhaar: '',
    dob: '',
    profession: '',
    marital_status: '',
    marital_date: '',
    address: '',
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FamilyMemberFormData>({ defaultValues });

  const handleOpen = (index: number | null = null) => {
    if (index !== null) {
      const member = state.family_members[index];
      reset(member);
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

  const onSubmit = (data: FamilyMemberFormData) => {
    try {
      const updatedMembers = [...state.family_members];
      
      if (editingIndex !== null) {
        updatedMembers[editingIndex] = data;
      } else {
        updatedMembers.push(data);
      }

      saveFamilyMembers(updatedMembers);
      handleClose();
      toast.success(
        editingIndex !== null ? 'Family member updated' : 'Family member added'
      );
    } catch (error) {
      console.error('Error saving family member:', error);
      toast.error('Failed to save family member');
    }
  };

  const handleDelete = (index: number) => {
    try {
      const updatedMembers = state.family_members.filter((_, i) => i !== index);
      saveFamilyMembers(updatedMembers);
      toast.success('Family member removed');
    } catch (error) {
      console.error('Error deleting family member:', error);
      toast.error('Failed to delete family member');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Family Members
      </Typography>
      <Typography color="textSecondary" paragraph>
        Add your family members to better manage your family's financial planning.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          disabled={isLoading}
        >
          Add Family Member
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Relation</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Profession</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.family_members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="textSecondary">
                    No family members added yet.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              state.family_members.map((member, index) => (
                <TableRow key={index}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.relation}</TableCell>
                  <TableCell>
                    {member.dob ? new Date(member.dob).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>{member.profession || '-'}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpen(index)}
                      disabled={isLoading}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(index)}
                      disabled={isLoading}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
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

      {/* Add/Edit Family Member Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingIndex !== null ? 'Edit Family Member' : 'Add Family Member'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  required
                  disabled={isLoading}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...register('name', { required: 'Name is required' })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.relation}>
                  <InputLabel>Relation</InputLabel>
                  <Select
                    label="Relation"
                    disabled={isLoading}
                    {...register('relation', { required: 'Relation is required' })}
                  >
                    {relations.map((relation) => (
                      <MenuItem key={relation} value={relation}>
                        {relation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="PAN"
                  disabled={isLoading}
                  error={!!errors.pan}
                  helperText={errors.pan?.message}
                  {...register('pan', {
                    pattern: {
                      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                      message: 'Invalid PAN format',
                    },
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Aadhaar Number"
                  disabled={isLoading}
                  error={!!errors.aadhaar}
                  helperText={errors.aadhaar?.message}
                  {...register('aadhaar', {
                    pattern: {
                      value: /^\d{12}$/,
                      message: 'Aadhaar must be 12 digits',
                    },
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={isLoading}
                  {...register('dob')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Profession"
                  disabled={isLoading}
                  {...register('profession')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Marital Status</InputLabel>
                  <Select
                    label="Marital Status"
                    disabled={isLoading}
                    {...register('marital_status')}
                  >
                    {maritalStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Marriage Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={isLoading || !watch('marital_status')}
                  {...register('marital_date')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={3}
                  disabled={isLoading}
                  {...register('address')}
                />
              </Grid>
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
                'Update'
              ) : (
                'Add Member'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
}
