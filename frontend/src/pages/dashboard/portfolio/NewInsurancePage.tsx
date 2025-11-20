import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthProvider';
import { supabase } from '../../../supabaseClient';

export default function NewInsurancePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?.id;

    const [form, setForm] = useState({
        provider: '',
        policy_no: '',
        type: '',
        sum_assured: '',
        premium: '',
        start_date: '',
        end_date: '',
        status: 'active',
        notes: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            setError('You must be logged in.');
            return;
        }

        setSubmitting(true);
        setError(null);

        const payload: any = {
            user_id: userId,
            provider: form.provider.trim(),
            policy_no: form.policy_no.trim() || null,
            type: form.type.trim(),
            sum_assured: form.sum_assured !== '' ? Number(form.sum_assured) : null,
            premium: form.premium !== '' ? Number(form.premium) : null,
            start_date: form.start_date || null,
            end_date: form.end_date || null,
            status: form.status || 'active',
            notes: form.notes?.trim() || null,
        };

        try {
            const { error } = await supabase.from('insurance').insert([payload]);
            if (error) throw error;
            navigate('/dashboard/portfolio/insurance');
        } catch (err: any) {
            setError(err?.message || 'Failed to add policy');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto" data-testid="new-insurance-page">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Add Insurance Policy</h1>
                <Button variant="outline" onClick={() => navigate('/dashboard/portfolio/insurance')}>Cancel</Button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="provider">Provider *</Label>
                        <Input id="provider" name="provider" value={form.provider} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="policy_no">Policy Number</Label>
                        <Input id="policy_no" name="policy_no" value={form.policy_no} onChange={handleChange} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="type">Type *</Label>
                        <Input id="type" name="type" value={form.type} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Input id="status" name="status" value={form.status} onChange={handleChange} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="sum_assured">Sum Assured (₹)</Label>
                        <Input id="sum_assured" name="sum_assured" type="number" min="0" step="1" value={form.sum_assured} onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="premium">Premium (₹)</Label>
                        <Input id="premium" name="premium" type="number" min="0" step="0.01" value={form.premium} onChange={handleChange} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input id="start_date" name="start_date" type="date" value={form.start_date} onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="end_date">End Date</Label>
                        <Input id="end_date" name="end_date" type="date" value={form.end_date} onChange={handleChange} />
                    </div>
                </div>

                <div>
                    <Label htmlFor="notes">Notes</Label>
                    <textarea id="notes" name="notes" rows={3} className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" onChange={(e) => handleChange(e as any)} />
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                        {submitting ? 'Adding...' : 'Add Policy'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
