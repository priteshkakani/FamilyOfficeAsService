import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../supabaseClient';

// In-memory cache for table columns
const columnCache = new Map<string, any[]>();

export function useTableColumns(tableName: string) {
    const [columns, setColumns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!tableName) {
            setLoading(false);
            return;
        }

        const fetchColumns = async () => {
            setLoading(true);
            setError(null);

            // Check cache first
            if (columnCache.has(tableName)) {
                setColumns(columnCache.get(tableName) || []);
                setLoading(false);
                return;
            }

            try {
                // First try: Direct query to table_columns view
                const { data, error: viewError } = await supabase
                    .from('table_columns')
                    .select('column_name, data_type, ordinal_position')
                    .eq('table_name', tableName)
                    .order('ordinal_position');

                if (!viewError && data?.length) {
                    columnCache.set(tableName, data);
                    setColumns(data);
                    setLoading(false);
                    return;
                }

                // Fallback: Call RPC if view fails
                const { data: rpcData, error: rpcError } = await supabase
                    .rpc('get_table_columns', { p_table: tableName });

                if (rpcError) throw rpcError;
                if (rpcData) {
                    columnCache.set(tableName, rpcData);
                    setColumns(rpcData);
                }
            } catch (err) {
                console.error('[Schema Fetch Error]', { table: tableName, error: err });
                setError(err as Error);
                toast.error(`Failed to load table schema for ${tableName}`);
            } finally {
                setLoading(false);
            }
        };

        fetchColumns();
    }, [tableName]);

    return { columns, loading, error };
}
