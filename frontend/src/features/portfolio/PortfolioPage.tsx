import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, RefreshCw, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { fetchPortfolio, addAsset, updateAsset, deleteAsset, refreshPrices, type Asset } from './api';

const AssetForm = ({ asset, onSave, onCancel }: {
  asset?: Asset | null;
  onSave: (data: Omit<Asset, 'id' | 'lastUpdated' | 'totalValue' | 'gainLoss' | 'gainLossPercentage'>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: asset?.name || '',
    type: asset?.type || 'stock',
    ticker: asset?.ticker || '',
    quantity: asset?.quantity || 0,
    avgPrice: asset?.avgPrice || 0,
    sector: asset?.sector || '',
    notes: asset?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{asset ? 'Edit Asset' : 'Add New Asset'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Asset Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="mutual_fund">Mutual Fund</SelectItem>
                  <SelectItem value="etf">ETF</SelectItem>
                  <SelectItem value="bond">Bond</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ticker Symbol</label>
              <Input
                value={formData.ticker}
                onChange={(e) => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sector</label>
              <Input
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                step="0.0001"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Average Price</label>
              <Input
                type="number"
                step="0.01"
                value={formData.avgPrice}
                onChange={(e) => setFormData({ ...formData, avgPrice: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Input
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {asset ? 'Update' : 'Add'} Asset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const PortfolioPage = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data, isLoading, error } = useQuery({
    queryKey: ['portfolio'],
    queryFn: fetchPortfolio,
  });

  const addMutation = useMutation({
    mutationFn: addAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setIsAdding(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Asset> }) => updateAsset(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setEditingAsset(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });

  const refreshPricesMutation = useMutation({
    mutationFn: refreshPrices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });

  const handleAddAsset = (data: any) => {
    addMutation.mutate(data);
  };

  const handleUpdateAsset = (data: any) => {
    if (!editingAsset) return;
    updateMutation.mutate({ id: editingAsset.id, updates: data });
  };

  const handleDeleteAsset = (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredAssets = data?.assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.ticker && asset.ticker.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    return matchesSearch && matchesType;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading portfolio: {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = !data?.assets?.length;
  
  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No assets yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding your first asset to your portfolio.
        </p>
        <div className="mt-6">
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Asset
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Overview</h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => refreshPricesMutation.mutate()}
              disabled={refreshPricesMutation.isPending}
              className="text-sm"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshPricesMutation.isPending ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
          <p>Last updated: {new Date().toLocaleString(undefined, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">
            Total Value: {formatCurrency(data?.summary.totalValue || 0)}
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Asset
        </Button>
      </div>

      {(isAdding || editingAsset) && (
        <AssetForm
          asset={editingAsset}
          onSave={editingAsset ? handleUpdateAsset : handleAddAsset}
          onCancel={() => {
            setIsAdding(false);
            setEditingAsset(null);
          }}
        />
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Assets</CardTitle>
              <CardDescription>
                {filteredAssets.length} assets · Gain/Loss: {''}
                <span className={data?.summary.totalGainLoss && data.summary.totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {formatCurrency(data?.summary.totalGainLoss || 0)} (
                  {formatPercentage(data?.summary.totalGainLossPercentage || 0)})
                </span>
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="stock">Stocks</SelectItem>
                  <SelectItem value="mutual_fund">Mutual Funds</SelectItem>
                  <SelectItem value="etf">ETFs</SelectItem>
                  <SelectItem value="bond">Bonds</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Ticker</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg. Price</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    {searchTerm || typeFilter !== 'all' ? 'No matching assets found' : 'No assets added yet'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{asset.ticker || '—'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {asset.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{asset.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(asset.avgPrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(asset.currentPrice)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(asset.totalValue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`flex items-center justify-end ${asset.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {asset.gainLoss >= 0 ? (
                          <ArrowUp className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 mr-1" />
                        )}
                        <span>
                          {formatCurrency(asset.gainLoss)} ({formatPercentage(asset.gainLossPercentage)})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingAsset(asset)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAsset(asset.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Asset Allocation Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.summary.assetAllocation && data.summary.assetAllocation.length > 0 ? (
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div className="flex h-full">
                  {data.summary.assetAllocation.map((allocation, i) => (
                    <div
                      key={i}
                      className="h-full"
                      style={{
                        width: `${allocation.percentage}%`,
                        backgroundColor: `hsl(${i * 40}, 70%, 60%)`,
                      }}
                      title={`${allocation.type}: ${formatPercentage(allocation.percentage / 100)}`}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.summary.assetAllocation.map((allocation, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{
                        backgroundColor: `hsl(${i * 40}, 70%, 60%)`,
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium">{allocation.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(allocation.value)} ({formatPercentage(allocation.percentage / 100)})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No asset allocation data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioPage;
