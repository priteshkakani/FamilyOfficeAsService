import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Option, Select } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useAuth } from "../../contexts/AuthProvider";
import { supabase } from "../../supabaseClient";
import { Policy, POLICY_TYPES, Premium, PREMIUM_FREQS, PREMIUM_STATUS } from "../../types/insurance";

function usePolicies(userId?: string) {
  return useQuery<Policy[]>({
    queryKey: ["insurance_policies", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("insurance_policies")
        .select("*")
        .eq("user_id", userId)
        .order("start_date", { ascending: false });
      if (error) throw error;
      return (data || []) as any;
    },
    enabled: !!userId,
  });
}

function usePremiums(userId?: string) {
  return useQuery<Premium[]>({
    queryKey: ["insurance_premiums", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("insurance_premiums")
        .select("*, policy:insurance_policies(id,user_id,policy_name)")
        .order("premium_date", { ascending: false });
      if (error) throw error;
      return ((data || []) as any).filter((p: Premium) => p.policy?.user_id === userId);
    },
    enabled: !!userId,
  });
}

export default function Insurance() {
  const { user } = useAuth();
  const userId = user?.id;
  const qc = useQueryClient();
  const policiesQ = usePolicies(userId);
  const premiumsQ = usePremiums(userId);

  const insertPolicy = useMutation({
    mutationFn: async (payload: Partial<Policy>) => {
      const { error } = await supabase.from("insurance_policies").insert([{ ...payload, user_id: userId }]);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["insurance_policies", userId] });
      toast.success("Policy saved successfully");
    },
    onError: (e: any) => {
      toast.error(e?.code === "42501" ? "You’re not authorized to access this insurance data. Please re-login or contact support." : (e?.message || "Failed to save policy"));
      console.error("[Insurance] insert policy", { userId, error: e });
    },
  });
  const updatePolicy = useMutation({
    mutationFn: async (payload: Partial<Policy> & { id: string }) => {
      const { id, ...rest } = payload;
      const { error } = await supabase
        .from("insurance_policies")
        .update({ ...rest })
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["insurance_policies", userId] });
      toast.success("Policy updated");
    },
    onError: (e: any) => {
      toast.error(e?.code === "42501" ? "You’re not authorized to access this insurance data. Please re-login or contact support." : (e?.message || "Failed to update policy"));
      console.error("[Insurance] update policy", { userId, error: e });
    },
  });
  const deletePolicy = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("insurance_policies").delete().eq("id", id).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["insurance_policies", userId] });
      toast.success("Policy deleted");
    },
    onError: (e: any) => {
      toast.error(e?.code === "42501" ? "You’re not authorized to access this insurance data. Please re-login or contact support." : (e?.message || "Failed to delete policy"));
      console.error("[Insurance] delete policy", { userId, error: e });
    },
  });
  const insertPremium = useMutation({
    mutationFn: async (payload: Partial<Premium>) => {
      const { error } = await supabase.from("insurance_premiums").insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["insurance_premiums", userId] });
      toast.success("Premium recorded");
    },
    onError: (e: any) => {
      toast.error(e?.code === "42501" ? "You’re not authorized to access this insurance data. Please re-login or contact support." : (e?.message || "Failed to record premium"));
      console.error("[Insurance] insert premium", { userId, error: e });
    },
  });
  const updatePremium = useMutation({
    mutationFn: async (payload: Partial<Premium> & { id: string }) => {
      const { id, policy, ...rest } = payload as any;
      const { error } = await supabase
        .from("insurance_premiums")
        .update({ ...rest })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["insurance_premiums", userId] });
      toast.success("Premium updated");
    },
    onError: (e: any) => {
      toast.error(e?.code === "42501" ? "You’re not authorized to access this insurance data. Please re-login or contact support." : (e?.message || "Failed to update premium"));
      console.error("[Insurance] update premium", { userId, error: e });
    },
  });
  const deletePremium = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("insurance_premiums")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["insurance_premiums", userId] });
      toast.success("Premium deleted");
    },
    onError: (e: any) => {
      toast.error(e?.code === "42501" ? "You’re not authorized to access this insurance data. Please re-login or contact support." : (e?.message || "Failed to delete premium"));
      console.error("[Insurance] delete premium", { userId, error: e });
    },
  });

  const [tab, setTab] = React.useState("overview");
  const [policyModalOpen, setPolicyModalOpen] = React.useState(false);
  const [editingPolicy, setEditingPolicy] = React.useState<Policy | null>(null);
  const [policyForm, setPolicyForm] = React.useState<Partial<Policy>>({
    policy_number: "",
    insurance_company: "",
    policy_type: "life",
    policy_name: "",
    sum_assured: undefined,
    premium_amount: 0,
    premium_frequency: "yearly",
    start_date: "",
    end_date: "",
    next_premium_date: "",
    is_active: true,
    beneficiary_name: "",
    beneficiary_relationship: "",
    nominee_name: "",
    notes: "",
  });
  const [premiumModalOpen, setPremiumModalOpen] = React.useState(false);
  const [editingPremium, setEditingPremium] = React.useState<Premium | null>(null);
  const [premiumForm, setPremiumForm] = React.useState<Partial<Premium>>({
    policy_id: undefined,
    premium_date: "",
    amount: 0,
    status: "paid",
    payment_method: "",
    receipt_number: "",
    due_date: "",
    paid_date: "",
    notes: "",
  });

  const policies = policiesQ.data || [];
  const premiums = premiumsQ.data || [];

  const totals = React.useMemo(() => {
    const by: Record<string, { count: number; sumAssured: number; annualPremium: number }> = {};
    for (const t of POLICY_TYPES) by[t] = { count: 0, sumAssured: 0, annualPremium: 0 };
    for (const p of policies) {
      const amt = p.premium_amount || 0;
      const annual = p.premium_frequency === "monthly" ? amt * 12 : p.premium_frequency === "quarterly" ? amt * 4 : p.premium_frequency === "half_yearly" ? amt * 2 : amt;
      by[p.policy_type].count += p.is_active ? 1 : 0;
      by[p.policy_type].sumAssured += p.sum_assured || 0;
      by[p.policy_type].annualPremium += annual;
    }
    const totalAnnualPremium = Object.values(by).reduce((s, v) => s + v.annualPremium, 0);
    const totalSumAssured = Object.values(by).reduce((s, v) => s + v.sumAssured, 0);
    return { by, totalAnnualPremium, totalSumAssured };
  }, [policies]);

  const openAddPolicy = () => {
    setEditingPolicy(null);
    setPolicyForm({ ...policyForm, policy_number: "", insurance_company: "", policy_type: "life", premium_amount: 0, premium_frequency: "yearly", start_date: "", is_active: true });
    setPolicyModalOpen(true);
  };
  const onSubmitPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    // basic validation
    if (!policyForm.policy_number || !policyForm.insurance_company || !policyForm.policy_type || !policyForm.premium_amount || !policyForm.premium_frequency || !policyForm.start_date) {
      toast.error("Please fill all required fields");
      return;
    }
    if ((policyForm.sum_assured ?? 0) < 0 || (policyForm.premium_amount ?? 0) < 0) {
      toast.error("Amounts must be non-negative");
      return;
    }
    if (policyForm.end_date && policyForm.start_date && new Date(policyForm.end_date) < new Date(policyForm.start_date)) {
      toast.error("End date must be after start date");
      return;
    }
    if (editingPolicy) updatePolicy.mutate({ id: editingPolicy.id, ...policyForm } as any, { onSuccess: () => setPolicyModalOpen(false) });
    else insertPolicy.mutate(policyForm as any, { onSuccess: () => setPolicyModalOpen(false) });
  };

  const onSubmitPremium = (e: React.FormEvent) => {
    e.preventDefault();
    if (!premiumForm.policy_id || !premiumForm.premium_date || !premiumForm.amount || !premiumForm.status) {
      toast.error("Please fill all required fields");
      return;
    }
    if ((premiumForm.amount ?? 0) <= 0) {
      toast.error("Amount must be > 0");
      return;
    }
    if (premiumForm.paid_date && premiumForm.due_date && new Date(premiumForm.paid_date) < new Date(premiumForm.due_date)) {
      toast.error("Paid date cannot be before due date");
      return;
    }
    if (editingPremium) {
      updatePremium.mutate({ id: editingPremium.id, ...premiumForm } as any, { onSuccess: () => setPremiumModalOpen(false) });
    } else {
      insertPremium.mutate(premiumForm as any, { onSuccess: () => setPremiumModalOpen(false) });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Insurance</h1>
        <div className="flex gap-2">
          <Button onClick={openAddPolicy}>Add Policy</Button>
          <Button variant="outline" onClick={() => setPremiumModalOpen(true)}>Add Premium</Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="premiums">Premiums / Payments</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Gaps / Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {policiesQ.isLoading ? (
            <div>Loading overview…</div>
          ) : policiesQ.isError ? (
            <div className="p-3 bg-red-50 text-red-600 rounded">Failed to load overview</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {POLICY_TYPES.map((t) => (
                <Card key={t}>
                  <CardHeader><CardTitle className="capitalize">{t} Policies</CardTitle></CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">Active Count</div>
                    <div className="text-2xl font-bold">{totals.by[t].count}</div>
                    <div className="mt-2 text-sm text-muted-foreground">Sum Assured</div>
                    <div className="font-semibold">₹{Math.round(totals.by[t].sumAssured).toLocaleString('en-IN')}</div>
                    <div className="mt-2 text-sm text-muted-foreground">Annual Premium</div>
                    <div className="font-semibold">₹{Math.round(totals.by[t].annualPremium).toLocaleString('en-IN')}</div>
                  </CardContent>
                </Card>
              ))}
              <Card className="md:col-span-2">
                <CardHeader><CardTitle>Totals</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Annual Premium</div>
                      <div className="text-xl font-bold">₹{Math.round(totals.totalAnnualPremium).toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Sum Assured</div>
                      <div className="text-xl font-bold">₹{Math.round(totals.totalSumAssured).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="policies">
          {policiesQ.isLoading ? (
            <div>Loading policies…</div>
          ) : policiesQ.isError ? (
            <div className="p-3 bg-red-50 text-red-600 rounded">Failed to load policies</div>
          ) : (policies.length === 0 ? (
            <div className="p-6 text-center bg-blue-50 border border-blue-200 rounded">No insurance policies yet. Click "Add Policy" to get started.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Policy Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Policy Number</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Sum Assured</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Premium</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Next Premium Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Active?</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {policies.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">{p.policy_name || '-'}</td>
                      <td className="px-4 py-2 text-sm capitalize">{p.policy_type}</td>
                      <td className="px-4 py-2 text-sm">{p.insurance_company}</td>
                      <td className="px-4 py-2 text-sm">{p.policy_number}</td>
                      <td className="px-4 py-2 text-sm text-right">₹{Number(p.sum_assured || 0).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2 text-sm text-right">₹{Number(p.premium_amount || 0).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2 text-sm">{p.premium_frequency.replace('_', ' ')}</td>
                      <td className="px-4 py-2 text-sm">{p.next_premium_date || '-'}</td>
                      <td className="px-4 py-2 text-sm">{p.is_active ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-2 text-sm text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setEditingPolicy(p); setPolicyForm(p); setPolicyModalOpen(true); }}>Edit</Button>
                          <Button variant="outline" size="sm" onClick={() => deletePolicy.mutate(p.id)} disabled={deletePolicy.isLoading}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="premiums">
          {premiumsQ.isLoading ? (
            <div>Loading premiums…</div>
          ) : premiumsQ.isError ? (
            <div className="p-3 bg-red-50 text-red-600 rounded">Failed to load premiums</div>
          ) : (premiums.length === 0 ? (
            <div className="p-6 text-center bg-blue-50 border border-blue-200 rounded">No premium payments recorded. Click "Add Premium" to record one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Policy</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Premium Date</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Receipt</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {premiums.map((pr) => (
                    <tr key={pr.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">{pr.policy?.policy_name || pr.policy_id}</td>
                      <td className="px-4 py-2 text-sm">{pr.premium_date}</td>
                      <td className="px-4 py-2 text-sm text-right">₹{Number(pr.amount || 0).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2 text-sm capitalize">{pr.status}</td>
                      <td className="px-4 py-2 text-sm">{pr.payment_method || '-'}</td>
                      <td className="px-4 py-2 text-sm">{pr.receipt_number || '-'}</td>
                      <td className="px-4 py-2 text-sm text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setEditingPremium(pr as any); setPremiumForm({ ...pr, policy_id: pr.policy_id }); setPremiumModalOpen(true); }}>Edit</Button>
                          <Button variant="outline" size="sm" onClick={() => deletePremium.mutate(pr.id)} disabled={deletePremium.isLoading}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="coverage">
          <Card>
            <CardHeader><CardTitle>Coverage Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {POLICY_TYPES.map((t) => (
                  <div key={t} className="p-4 border rounded">
                    <div className="text-sm text-muted-foreground capitalize">{t} sum assured</div>
                    <div className="text-xl font-semibold">₹{Math.round(totals.by[t].sumAssured).toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-sm text-muted-foreground">
                Your life cover to annual income ratio is X; recommended is Y. Consider increasing coverage if below guidance.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Policy Modal */}
      {policyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <form onSubmit={onSubmitPolicy} className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editingPolicy ? 'Edit Policy' : 'Add Policy'}</h3>
              <button type="button" onClick={() => setPolicyModalOpen(false)} className="text-sm">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="policy_type">Policy Type *</Label>
                <Select value={policyForm.policy_type as any} onChange={(e) => setPolicyForm({ ...policyForm, policy_type: e.target.value as any })}>
                  {POLICY_TYPES.map(t => (<Option key={t} value={t}>{t}</Option>))}
                </Select>
              </div>
              <div>
                <Label htmlFor="insurance_company">Insurance Company *</Label>
                <Input value={policyForm.insurance_company || ''} onChange={(e) => setPolicyForm({ ...policyForm, insurance_company: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="policy_name">Policy Name</Label>
                <Input value={policyForm.policy_name || ''} onChange={(e) => setPolicyForm({ ...policyForm, policy_name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="policy_number">Policy Number *</Label>
                <Input value={policyForm.policy_number || ''} onChange={(e) => setPolicyForm({ ...policyForm, policy_number: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="sum_assured">Sum Assured</Label>
                <Input type="number" min={0} value={policyForm.sum_assured as any as string || ''} onChange={(e) => setPolicyForm({ ...policyForm, sum_assured: e.target.value === '' ? undefined : Number(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="premium_amount">Premium Amount *</Label>
                <Input type="number" min={0} value={policyForm.premium_amount as any as string || ''} onChange={(e) => setPolicyForm({ ...policyForm, premium_amount: e.target.value === '' ? 0 : Number(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="premium_frequency">Premium Frequency *</Label>
                <Select value={policyForm.premium_frequency as any} onChange={(e) => setPolicyForm({ ...policyForm, premium_frequency: e.target.value as any })}>
                  {PREMIUM_FREQS.map(f => (<Option key={f} value={f}>{f.replace('_', ' ')}</Option>))}
                </Select>
              </div>
              <div>
                <Label htmlFor="start_date">Start Date *</Label>
                <Input type="date" value={policyForm.start_date || ''} onChange={(e) => setPolicyForm({ ...policyForm, start_date: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input type="date" value={policyForm.end_date || ''} onChange={(e) => setPolicyForm({ ...policyForm, end_date: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="next_premium_date">Next Premium Date</Label>
                <Input type="date" value={policyForm.next_premium_date || ''} onChange={(e) => setPolicyForm({ ...policyForm, next_premium_date: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="is_active">Active?</Label>
                <Select value={policyForm.is_active ? 'yes' : 'no'} onChange={(e) => setPolicyForm({ ...policyForm, is_active: e.target.value === 'yes' })}>
                  <Option value="yes">Yes</Option>
                  <Option value="no">No</Option>
                </Select>
              </div>
              <div>
                <Label htmlFor="beneficiary_name">Beneficiary Name</Label>
                <Input value={policyForm.beneficiary_name || ''} onChange={(e) => setPolicyForm({ ...policyForm, beneficiary_name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="beneficiary_relationship">Beneficiary Relationship</Label>
                <Input value={policyForm.beneficiary_relationship || ''} onChange={(e) => setPolicyForm({ ...policyForm, beneficiary_relationship: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="nominee_name">Nominee Name</Label>
                <Input value={policyForm.nominee_name || ''} onChange={(e) => setPolicyForm({ ...policyForm, nominee_name: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2" rows={3} value={policyForm.notes || ''} onChange={(e) => setPolicyForm({ ...policyForm, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setPolicyModalOpen(false)} disabled={insertPolicy.isLoading || updatePolicy.isLoading}>Cancel</Button>
              <Button type="submit" disabled={insertPolicy.isLoading || updatePolicy.isLoading}>{editingPolicy ? 'Save Changes' : 'Add Policy'}</Button>
            </div>
          </form>
        </div>
      )}

      {/* Premium Modal */}
      {premiumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <form onSubmit={onSubmitPremium} className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editingPremium ? 'Edit Premium Payment' : 'Add Premium Payment'}</h3>
              <button type="button" onClick={() => setPremiumModalOpen(false)} className="text-sm">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Policy *</Label>
                <Select value={(premiumForm.policy_id as string) || ''} onChange={(e) => setPremiumForm({ ...premiumForm, policy_id: e.target.value as any })}>
                  {policies.map(p => (
                    <Option key={p.id} value={p.id}>{p.policy_name || p.policy_number}</Option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Premium Date *</Label>
                <Input type="date" value={premiumForm.premium_date || ''} onChange={(e) => setPremiumForm({ ...premiumForm, premium_date: e.target.value })} />
              </div>
              <div>
                <Label>Amount *</Label>
                <Input type="number" min={0} value={premiumForm.amount as any as string || ''} onChange={(e) => setPremiumForm({ ...premiumForm, amount: e.target.value === '' ? 0 : Number(e.target.value) })} />
              </div>
              <div>
                <Label>Status *</Label>
                <Select value={premiumForm.status as any} onChange={(e) => setPremiumForm({ ...premiumForm, status: e.target.value as any })}>
                  {PREMIUM_STATUS.map(s => (<Option key={s} value={s}>{s}</Option>))}
                </Select>
              </div>
              <div>
                <Label>Payment Method</Label>
                <Input value={premiumForm.payment_method || ''} onChange={(e) => setPremiumForm({ ...premiumForm, payment_method: e.target.value })} />
              </div>
              <div>
                <Label>Receipt Number</Label>
                <Input value={premiumForm.receipt_number || ''} onChange={(e) => setPremiumForm({ ...premiumForm, receipt_number: e.target.value })} />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" value={premiumForm.due_date || ''} onChange={(e) => setPremiumForm({ ...premiumForm, due_date: e.target.value })} />
              </div>
              <div>
                <Label>Paid Date</Label>
                <Input type="date" value={premiumForm.paid_date || ''} onChange={(e) => setPremiumForm({ ...premiumForm, paid_date: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Notes</Label>
                <textarea className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2" rows={3} value={premiumForm.notes || ''} onChange={(e) => setPremiumForm({ ...premiumForm, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setPremiumModalOpen(false)} disabled={insertPremium.isLoading || updatePremium.isLoading}>Cancel</Button>
              <Button type="submit" disabled={insertPremium.isLoading || updatePremium.isLoading}>{editingPremium ? 'Save Changes' : 'Add Payment'}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
