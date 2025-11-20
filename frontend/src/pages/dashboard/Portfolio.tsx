import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Loader2, MoreHorizontal, Plus } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { useTableColumns } from '../../hooks/useTableColumns';
import { supabase } from '../../supabaseClient';

// Types
type Asset = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  amount: number;
  as_of_date: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
};

type SupabaseAsset = Omit<Asset, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

// TableColumn type is now imported from the useTableColumns hook

// Components
const SkeletonRow = () => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <div className="h-4 bg-gray-200 rounded w-8"></div>
    </td>
  </tr>
);

const AssetRow = ({ asset, onEdit, onDelete }: { asset: Asset; onEdit: (asset: Asset) => void; onDelete: (id: string) => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <tr key={asset.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          {asset.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(asset.amount)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">
          {format(new Date(asset.as_of_date), 'dd MMM yyyy')}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {isMenuOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  onClick={() => {
                    onEdit(asset);
                    setIsMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  role="menuitem"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(asset.id);
                    setIsMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  role="menuitem"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// Main Component
function Portfolio() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { columns: tableColumns, loading: loadingColumns } = useTableColumns('assets');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  // Fetch assets
  const { data: assets = [], isLoading, error } = useQuery<Asset[]>({
    queryKey: ['assets', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // First, get the table structure using a direct query
      const columnNames = tableColumns?.map(col => col.column_name) || [];

      // Build the select columns dynamically based on what exists
      const columns = ['id', 'name', 'category', 'amount', 'as_of_date', 'user_id']
        .filter(col => columnNames.includes(col));

      // Only include created_at and updated_at if they exist
      if (columnNames.includes('created_at')) columns.push('created_at');
      if (columnNames.includes('updated_at')) columns.push('updated_at');
      if (columnNames.includes('metadata')) columns.push('metadata');

      // Execute the query with only existing columns
      const { data, error: fetchError } = await supabase
        .from('assets')
        .select(columns.join(', '))
        .eq('user_id', user.id)
        .order('as_of_date', { ascending: false });

      if (fetchError) {
        console.error('Error fetching assets:', fetchError);
        throw fetchError;
      }

      if (!data) return [];

      // Ensure all required fields have default values and proper types
      return data.map((asset: any) => ({
        id: String(asset.id || ''),
        user_id: String(asset.user_id || user.id),
        name: String(asset.name || ''),
        category: String(asset.category || 'Other'),
        amount: Number(asset.amount) || 0,
        as_of_date: asset.as_of_date ? new Date(asset.as_of_date).toISOString() : new Date().toISOString(),
        metadata: asset.metadata || {},
        ...(asset.created_at && { created_at: asset.created_at }),
        ...(asset.updated_at && { updated_at: asset.updated_at })
      } as Asset));
    },
    enabled: !!user?.id,
  });

  // Create asset mutation
  const createMutation = useMutation({
    mutationFn: async (asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>) => {
      // Only include the fields that exist in the database
      const { metadata, ...dbFields } = asset;
      const dataToInsert: Record<string, any> = {
        name: dbFields.name,
        category: dbFields.category,
        amount: dbFields.amount,
        as_of_date: dbFields.as_of_date,
        user_id: dbFields.user_id
      };

      // Only include metadata if it exists and has values
      if (metadata && Object.keys(metadata).length > 0) {
        dataToInsert.metadata = metadata;
      }

      const { data, error } = await supabase
        .from('assets')
        .insert(dataToInsert)
        .select()
        .single();

      if (error) throw error;
      return { ...data, metadata: data.metadata || {} };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', user?.id] });
      setIsFormOpen(false);
    },
  });

  // Update asset mutation
  const updateMutation = useMutation({
    mutationFn: async (asset: Asset) => {
      // Only include the fields that exist in the database
      const { id, metadata, ...dbFields } = asset;
      const dataToUpdate: Record<string, any> = {
        name: dbFields.name,
        category: dbFields.category,
        amount: dbFields.amount,
        as_of_date: dbFields.as_of_date
      };

      // Only include metadata if it exists and has values
      if (metadata && Object.keys(metadata).length > 0) {
        dataToUpdate.metadata = metadata;
      }

      const { data, error } = await supabase
        .from('assets')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, metadata: data.metadata || {} };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', user?.id] });
      setIsFormOpen(false);
      setEditingAsset(null);
    },
  });

  // Delete asset mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', user?.id] });
    },
  });

  const handleSubmit = async (data: Omit<Asset, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    // Create a properly typed asset data object
    const assetData: SupabaseAsset = {
      name: String(data.name || ''),
      category: String(data.category || 'Other'),
      amount: Number(data.amount) || 0,
      as_of_date: data.as_of_date ? new Date(data.as_of_date).toISOString() : new Date().toISOString(),
      user_id: user.id,
      ...(data.metadata && Object.keys(data.metadata).length > 0 && { metadata: data.metadata })
    };

    if (editingAsset) {
      await updateMutation.mutateAsync({ ...editingAsset, ...assetData });
    } else {
      await createMutation.mutateAsync(assetData);
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const totalValue = assets.reduce((sum, asset) => sum + asset.amount, 0);
  // Get the most recent date, either from updated_at or as_of_date
  const lastUpdated = assets.length > 0
    ? (assets[0].updated_at || assets[0].as_of_date || new Date().toISOString())
    : new Date().toISOString();

  if (!user) {
    return <div className="p-6">Please sign in to view your portfolio.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="assets-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Assets</h2>
              <p className="mt-1 text-sm text-gray-500">
                {assets.length} {assets.length === 1 ? 'asset' : 'assets'} •
                Last updated: {format(lastUpdated, 'dd MMM yyyy, hh:mm a')}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                type="button"
                onClick={() => {
                  setEditingAsset(null);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                data-testid="assets-add-btn"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Add Asset
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        As of Date
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200" data-testid="assets-table">
                    {isLoading ? (
                      // Loading skeleton
                      Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
                    ) : error ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-red-600">
                          Error loading assets: {error.message}
                        </td>
                      </tr>
                    ) : assets.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                          <div className="flex flex-col items-center">
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
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No assets yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by adding your first asset.</p>
                            <div className="mt-6">
                              <button
                                type="button"
                                onClick={() => setIsFormOpen(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                <Plus className="-ml-1 mr-2 h-5 w-5" />
                                Add Asset
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      assets.map((asset) => (
                        <AssetRow
                          key={asset.id}
                          asset={asset}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))
                    )}
                  </tbody>
                  {assets.length > 0 && (
                    <tfoot className="bg-gray-50">
                      <tr>
                        <th colSpan={2} className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                          Total Value
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(totalValue)}
                        </th>
                        <th colSpan={2}></th>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Form Modal */}
      {isFormOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {editingAsset ? 'Edit Asset' : 'Add New Asset'}
                  </h3>
                  <div className="mt-2">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target as HTMLFormElement);
                      handleSubmit({
                        name: formData.get('name') as string,
                        category: formData.get('category') as string,
                        amount: parseFloat(formData.get('amount') as string) || 0,
                        as_of_date: formData.get('as_of_date') as string,
                        metadata: {
                          notes: formData.get('notes') as string || '',
                        },
                      });
                    }}>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Asset Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            defaultValue={editingAsset?.name}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            id="category"
                            name="category"
                            defaultValue={editingAsset?.category || ''}
                            required
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="">Select a category</option>
                            <option value="Cash">Cash</option>
                            <option value="Stocks">Stocks</option>
                            <option value="Bonds">Bonds</option>
                            <option value="Mutual Funds">Mutual Funds</option>
                            <option value="Real Estate">Real Estate</option>
                            <option value="Retirement">Retirement</option>
                            <option value="Crypto">Crypto</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Value (₹)
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">₹</span>
                            </div>
                            <input
                              type="number"
                              name="amount"
                              id="amount"
                              step="0.01"
                              min="0"
                              defaultValue={editingAsset?.amount || ''}
                              required
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="as_of_date" className="block text-sm font-medium text-gray-700">
                            As of Date
                          </label>
                          <input
                            type="date"
                            name="as_of_date"
                            id="as_of_date"
                            defaultValue={editingAsset?.as_of_date ? new Date(editingAsset.as_of_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Notes (Optional)
                          </label>
                          <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            defaultValue={editingAsset?.metadata?.notes || ''}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Any additional details about this asset..."
                          />
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                          disabled={createMutation.isLoading || updateMutation.isLoading}
                        >
                          {(createMutation.isLoading || updateMutation.isLoading) ? (
                            <>
                              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                              {editingAsset ? 'Updating...' : 'Adding...'}
                            </>
                          ) : editingAsset ? 'Update Asset' : 'Add Asset'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsFormOpen(false);
                            setEditingAsset(null);
                          }}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
