import React, { useState, useEffect } from 'react';
import ModalWrapper from '../ModalWrapper';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { format, parseISO } from 'date-fns';

const INSURANCE_TYPES = [
  'Term Life',
  'Whole Life',
  'Endowment',
  'ULIP',
  'Health',
  'Motor',
  'Home',
  'Travel',
  'Other'
];

const POLICY_STATUSES = [
  'active',
  'inactive',
  'expired',
  'surrendered',
  'lapsed'
];

export function InsuranceFormModal({ 
  isOpen, 
  onClose, 
  initialData = null,
  onSubmit,
  isSubmitting = false
}) {
  const [formData, setFormData] = useState({
    provider: '',
    policy_no: '',
    type: '',
    sum_assured: '',
    premium: '',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: '',
    status: 'active',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        provider: initialData.provider || '',
        policy_no: initialData.policy_no || '',
        type: initialData.type || '',
        sum_assured: initialData.sum_assured ? initialData.sum_assured.toString() : '',
        premium: initialData.premium ? initialData.premium.toString() : '',
        start_date: initialData.start_date 
          ? format(parseISO(initialData.start_date), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
        end_date: initialData.end_date 
          ? format(parseISO(initialData.end_date), 'yyyy-MM-dd')
          : '',
        status: initialData.status || 'active',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        provider: '',
        policy_no: '',
        type: '',
        sum_assured: '',
        premium: '',
        start_date: format(new Date(), 'yyyy-MM-dd'),
        end_date: '',
        status: 'active',
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.provider.trim()) newErrors.provider = 'Provider is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.status) newErrors.status = 'Status is required';
    
    if (formData.sum_assured && (isNaN(parseFloat(formData.sum_assured)) || parseFloat(formData.sum_assured) < 0)) {
      newErrors.sum_assured = 'Please enter a valid sum assured';
    }
    
    if (formData.premium && (isNaN(parseFloat(formData.premium)) || parseFloat(formData.premium) < 0)) {
      newErrors.premium = 'Please enter a valid premium amount';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    
    if (formData.end_date && formData.start_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    const submissionData = {
      ...formData,
      sum_assured: formData.sum_assured ? parseFloat(formData.sum_assured) : null,
      premium: formData.premium ? parseFloat(formData.premium) : null,
      ...(initialData?.id && { id: initialData.id })
    };
    
    onSubmit(submissionData);
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper 
      open={isOpen} 
      onClose={onClose}
      ariaLabelledby="insurance-form-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 
            id="insurance-form-title"
            className="text-lg font-medium text-gray-900"
          >
            {initialData ? 'Edit Insurance Policy' : 'Add New Insurance Policy'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="provider">Insurance Provider *</Label>
              <Input
                id="provider"
                name="provider"
                type="text"
                value={formData.provider}
                onChange={handleChange}
                placeholder="e.g., LIC, HDFC Life, etc."
                className={errors.provider ? 'border-red-500' : ''}
              />
              {errors.provider && (
                <p className="mt-1 text-sm text-red-600">{errors.provider}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="policy_no">Policy Number</Label>
              <Input
                id="policy_no"
                name="policy_no"
                type="text"
                value={formData.policy_no}
                onChange={handleChange}
                placeholder="Policy number (if any)"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Insurance Type *</Label>
              <Select
                name="type"
                value={formData.type}
                onValueChange={(value) => 
                  handleChange({ target: { name: 'type', value } })
                }
              >
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select insurance type" />
                </SelectTrigger>
                <SelectContent>
                  {INSURANCE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={(value) => 
                  handleChange({ target: { name: 'status', value } })
                }
              >
                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {POLICY_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sum_assured">Sum Assured (₹)</Label>
              <Input
                id="sum_assured"
                name="sum_assured"
                type="number"
                min="0"
                step="1"
                value={formData.sum_assured}
                onChange={handleChange}
                placeholder="Coverage amount"
                className={errors.sum_assured ? 'border-red-500' : ''}
              />
              {errors.sum_assured && (
                <p className="mt-1 text-sm text-red-600">{errors.sum_assured}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="premium">Premium (₹)</Label>
              <Input
                id="premium"
                name="premium"
                type="number"
                min="0"
                step="0.01"
                value={formData.premium}
                onChange={handleChange}
                placeholder="Premium amount"
                className={errors.premium ? 'border-red-500' : ''}
              />
              {errors.premium && (
                <p className="mt-1 text-sm text-red-600">{errors.premium}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                className={errors.start_date ? 'border-red-500' : ''}
                max={format(new Date(), 'yyyy-MM-dd')}
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                className={errors.end_date ? 'border-red-500' : ''}
                min={formData.start_date}
              />
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              placeholder="Any additional details about this policy"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {initialData ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>{initialData ? 'Update Policy' : 'Add Policy'}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}
