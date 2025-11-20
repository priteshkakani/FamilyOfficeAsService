import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthProvider';
import { supabase } from '../../../supabaseClient';

export default function NewLiabilityPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?.id;
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        type: '',
        institution: '',
        total_amount: '',
        outstanding_amount: '',
        emi_amount: '',
        interest_rate: '',
        schedule: '',
        remaining_emis: '',
        emi_date: '',
        as_of_date: '',
        notes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            setError('User not authenticated');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const payload: any = {
                user_id: userId,
                type: form.type,
                institution: form.institution,
                total_amount: form.total_amount ? Number(form.total_amount) : null,
                outstanding_amount: form.outstanding_amount ? Number(form.outstanding_amount) : null,
                emi_amount: form.emi_amount ? Number(form.emi_amount) : null,
                interest_rate: form.interest_rate ? Number(form.interest_rate) : null,
                schedule: form.schedule || null,
                remaining_emis: form.remaining_emis ? Number(form.remaining_emis) : null,
                emi_date: form.emi_date || null,
                as_of_date: form.as_of_date || null,
                notes: form.notes || null,
            };

            const { error } = await supabase.from('liabilities').insert([payload]);
            if (error) throw error;
            navigate('/dashboard/portfolio/liabilities');
        } catch (err: any) {
            setError(err?.message || 'Failed to add liability');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Add Liability</h1>
                <button
                    onClick={() => navigate('/dashboard/portfolio/liabilities')}
                    className="px-3 py-1.5 border rounded-md"
                >
                    Cancel
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-md border">
                <div className="space-y-1 md:col-span-2">
                    <label className="text-sm text-gray-600">Type</label>
                    <select name="type" value={form.type} onChange={handleChange} required className="border rounded px-2 py-2 w-full">
                        <option value="">Select type</option>
                        <option value="Home Loan">Home Loan</option>
                        <option value="Car Loan">Car Loan</option>
                        <option value="Personal Loan">Personal Loan</option>
                        <option value="Education Loan">Education Loan</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                    <label className="text-sm text-gray-600">Institution</label>
                    <input name="institution" value={form.institution} onChange={handleChange} required className="border rounded px-2 py-2 w-full" />
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-gray-600">Total Amount (₹)</label>
                    <input name="total_amount" type="number" min="0" step="0.01" value={form.total_amount} onChange={handleChange} className="border rounded px-2 py-2 w-full" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm text-gray-600">Outstanding Amount (₹)</label>
                    <input name="outstanding_amount" type="number" min="0" step="0.01" value={form.outstanding_amount} onChange={handleChange} required className="border rounded px-2 py-2 w-full" />
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-gray-600">EMI Amount (₹)</label>
                    <input name="emi_amount" type="number" min="0" step="0.01" value={form.emi_amount} onChange={handleChange} className="border rounded px-2 py-2 w-full" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm text-gray-600">Interest Rate (%)</label>
                    <input name="interest_rate" type="number" min="0" step="0.1" value={form.interest_rate} onChange={handleChange} className="border rounded px-2 py-2 w-full" />
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-gray-600">Schedule</label>
                    <select name="schedule" value={form.schedule} onChange={handleChange} className="border rounded px-2 py-2 w-full">
                        <option value="">Select schedule</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Half-yearly">Half-yearly</option>
                        <option value="Yearly">Yearly</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-sm text-gray-600">Remaining EMIs</label>
                    <input name="remaining_emis" type="number" min="0" value={form.remaining_emis} onChange={handleChange} className="border rounded px-2 py-2 w-full" />
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-gray-600">Next EMI Date</label>
                    <input name="emi_date" type="date" value={form.emi_date} onChange={handleChange} className="border rounded px-2 py-2 w-full" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm text-gray-600">As of Date</label>
                    <input name="as_of_date" type="date" value={form.as_of_date} onChange={handleChange} required className="border rounded px-2 py-2 w-full" />
                </div>

                <div className="space-y-1 md:col-span-2">
                    <label className="text-sm text-gray-600">Notes</label>
                    <textarea name="notes" rows={3} value={form.notes} onChange={handleChange} className="border rounded px-2 py-2 w-full" placeholder="Any additional details" />
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => navigate('/dashboard/portfolio/liabilities')} className="px-4 py-2 border rounded-md">Cancel</button>
                    <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                        {saving ? 'Saving...' : 'Add Liability'}
                    </button>
                </div>
            </form>
        </div>
    );
}
