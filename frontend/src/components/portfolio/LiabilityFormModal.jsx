import React, { useState, useEffect } from 'react';
import ModalWrapper from '../ModalWrapper';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { format } from 'date-fns';

const LIABILITY_TYPES = [
  'Home Loan',
  'Personal Loan',
  'Car Loan',
  'Education Loan',
  'Credit Card',
  'Other'
];

export function LiabilityFormModal({ 
  isOpen, 
  onClose, 
  initialData = null,
  onSubmit,
  isSubmitting = false
}) {
  const [formData, setFormData] = useState({
    type: '',
    institution: '',
    outstanding_amount: '',
    emi: '',
    interest_rate: '',
    as_of_date: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || '',
        institution: initialData.institution || '',
        outstanding_amount: initialData.outstanding_amount ? initialData.outstanding_amount.toString() : '',
        emi: initialData.emi ? initialData.emi.toString() : '',
        interest_rate: initialData.interest_rate ? initialData.interest_rate.toString() : '',
        as_of_date: initialData.as_of_date 
          ? format(new Date(initialData.as_of_date), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        type: '',
        institution: '',
        outstanding_amount: '',
        emi: '',
        interest_rate: '',
        as_of_date: format(new Date(), 'yyyy-MM-dd'),
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.institution.trim()) newErrors.institution = 'Institution is required';
    if (!formData.outstanding_amount || isNaN(parseFloat(formData.outstanding_amount)) || parseFloat(formData.outstanding_amount) < 0) {
      newErrors.outstanding_amount = 'Please enter a valid amount';
    }
    if (formData.emi && (isNaN(parseFloat(formData.emi)) || parseFloat(formData.emi) < 0)) {
      newErrors.emi = 'Please enter a valid EMI amount';
    }
    if (formData.interest_rate && (isNaN(parseFloat(formData.interest_rate)) || parseFloat(formData.interest_rate) < 0)) {
      newErrors.interest_rate = 'Please enter a valid interest rate';
    }
    if (!formData.as_of_date) newErrors.as_of_date = 'Date is required';
    
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
      outstanding_amount: parseFloat(formData.outstanding_amount) || 0,
      emi: formData.emi ? parseFloat(formData.emi) : null,
      interest_rate: formData.interest_rate ? parseFloat(formData.interest_rate) : null,
      ...(initialData?.id && { id: initialData.id })
    };
    
    onSubmit(submissionData);
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper 
      open={isOpen} 
      onClose={onClose}
      ariaLabelledby="liability-form-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 
            id="liability-form-title"
            className="text-lg font-medium text-gray-900"
          >
            {initialData ? 'Edit Liability' : 'Add New Liability'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="type">Liability Type *</Label>
            <Select
              name="type"
              value={formData.type}
              onValueChange={(value) => 
                handleChange({ target: { name: 'type', value } })
              }
            >
              <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {LIABILITY_TYPES.map(type => (
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
            <Label htmlFor="institution">Institution *</Label>
            <Input
              id="institution"
              name="institution"
              type="text"
              value={formData.institution}
              onChange={handleChange}
              placeholder="e.g., HDFC Bank, SBI, etc."
              className={errors.institution ? 'border-red-500' : ''}
            />
            {errors.institution && (
              <p className="mt-1 text-sm text-red-600">{errors.institution}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="outstanding_amount">Outstanding Amount (₹) *</Label>
              <Input
                id="outstanding_amount"
                name="outstanding_amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.outstanding_amount}
                onChange={handleChange}
                placeholder="0.00"
                className={errors.outstanding_amount ? 'border-red-500' : ''}
              />
              {errors.outstanding_amount && (
                <p className="mt-1 text-sm text-red-600">{errors.outstanding_amount}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="emi">EMI (₹)</Label>
              <Input
                id="emi"
                name="emi"
                type="number"
                min="0"
                step="0.01"
                value={formData.emi}
                onChange={handleChange}
                placeholder="0.00"
                className={errors.emi ? 'border-red-500' : ''}
              />
              {errors.emi && (
                <p className="mt-1 text-sm text-red-600">{errors.emi}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="interest_rate">Interest Rate (%)</Label>
              <Input
                id="interest_rate"
                name="interest_rate"
                type="number"
                min="0"
                step="0.01"
                value={formData.interest_rate}
                onChange={handleChange}
                placeholder="0.00"
                className={errors.interest_rate ? 'border-red-500' : ''}
              />
              {errors.interest_rate && (
                <p className="mt-1 text-sm text-red-600">{errors.interest_rate}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="as_of_date">As of Date *</Label>
              <Input
                id="as_of_date"
                name="as_of_date"
                type="date"
                value={formData.as_of_date}
                onChange={handleChange}
                className={errors.as_of_date ? 'border-red-500' : ''}
                max={format(new Date(), 'yyyy-MM-dd')}
              />
              {errors.as_of_date && (
                <p className="mt-1 text-sm text-red-600">{errors.as_of_date}</p>
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
              placeholder="Any additional details about this liability"
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
                <>{initialData ? 'Update Liability' : 'Add Liability'}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}
