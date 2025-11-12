import React, { useState, useEffect } from 'react';
import ModalWrapper from '../ModalWrapper';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { format } from 'date-fns';

const ASSET_CATEGORIES = [
  'Cash & Equivalents',
  'Equities',
  'Fixed Income',
  'Real Estate',
  'Alternative Investments',
  'Retirement Accounts',
  'Other'
];

export function AssetFormModal({ 
  isOpen, 
  onClose, 
  initialData = null,
  onSubmit,
  isSubmitting = false
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: '',
    as_of_date: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        amount: initialData.amount ? initialData.amount.toString() : '',
        as_of_date: initialData.as_of_date 
          ? format(new Date(initialData.as_of_date), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
        notes: initialData.notes || ''
      });
    } else {
      // Reset form when opening for new asset
      setFormData({
        name: '',
        category: '',
        amount: '',
        as_of_date: format(new Date(), 'yyyy-MM-dd'),
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
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
    
    // Clear error when user starts typing
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
      amount: parseFloat(formData.amount),
      // If editing, include the id
      ...(initialData?.id && { id: initialData.id })
    };
    
    onSubmit(submissionData);
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper 
      open={isOpen} 
      onClose={onClose}
      ariaLabelledby="asset-form-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 
            id="asset-form-title"
            className="text-lg font-medium text-gray-900"
          >
            {initialData ? 'Edit Asset' : 'Add New Asset'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Asset Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., HDFC Bank, ICICI MF, etc."
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              name="category"
              value={formData.category}
              onValueChange={(value) => 
                handleChange({ target: { name: 'category', value } })
              }
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {ASSET_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="amount">Amount (₹) *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              className={errors.amount ? 'border-red-500' : ''}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
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
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              placeholder="Any additional details about this asset"
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
                <>{initialData ? 'Update Asset' : 'Add Asset'}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}
