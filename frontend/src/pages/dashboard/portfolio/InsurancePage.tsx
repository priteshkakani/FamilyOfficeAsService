import { InsuranceFormModal } from '@/components/portfolio/InsuranceFormModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/supabaseClient';
import { useCallback, useEffect, useState } from 'react';

export default function InsurancePage() {
  const { user } = useAuth();
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addSubmitting, setAddSubmitting] = useState(false);

  const fetchPolicies = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('insurance')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })
      .limit(100);
    if (error) {
      setError(error.message);
    }
    setPolicies(data || []);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const handleAddSubmit = async (formData: any) => {
    if (!user?.id) { setError('You must be logged in.'); return; }
    setAddSubmitting(true);
    setError(null);
    try {
      const payload = { ...formData, user_id: user.id };
      const { error } = await supabase.from('insurance').insert([payload]);
      if (error) throw error;
      setAddOpen(false);
      await fetchPolicies();
    } catch (e: any) {
      setError(e?.message || 'Failed to add policy');
    } finally {
      setAddSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Insurance</h1>
        <Button onClick={() => setAddOpen(true)}>Add Policy</Button>
      </div>
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md" role="alert">{error}</div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Your Policies</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading policies…</div>
          ) : policies.length === 0 ? (
            <div className="text-sm text-muted-foreground">No policies found. Click "Add Policy" to create one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy No</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sum Assured</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {policies.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">{p.provider}</td>
                      <td className="px-4 py-2 text-sm">{p.policy_no || '-'}</td>
                      <td className="px-4 py-2 text-sm">{p.type}</td>
                      <td className="px-4 py-2 text-sm text-right">₹{Number(p.sum_assured || 0).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2 text-sm text-right">₹{Number(p.premium || 0).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2 text-sm">{p.status || '-'}</td>
                      <td className="px-4 py-2 text-sm">{p.start_date || '-'}</td>
                      <td className="px-4 py-2 text-sm">{p.end_date || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Life Insurance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Term Life Policy</p>
                  <p className="text-sm text-muted-foreground">20-year term</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Coverage Amount</p>
                  <p className="font-medium">$1,000,000</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Beneficiary</p>
                  <p className="font-medium">Spouse</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm">View Details</Button>
                <Button variant="outline" size="sm">File Claim</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property & Casualty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Homeowners Insurance</p>
                  <p className="text-sm text-muted-foreground">Primary Residence</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Coverage</p>
                  <p className="font-medium">$500,000</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deductible</p>
                  <p className="font-medium">$2,500</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm">View Details</Button>
                <Button variant="outline" size="sm">File Claim</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Insurance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Insurance coverage visualization will be displayed here</p>
          </div>
        </CardContent>
      </Card>

      <InsuranceFormModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        initialData={null}
        onSubmit={handleAddSubmit}
        isSubmitting={addSubmitting}
      />
    </div>
  );
}
