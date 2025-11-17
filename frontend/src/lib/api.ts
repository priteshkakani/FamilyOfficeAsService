import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Asset, PortfolioSummary } from '../features/portfolio/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Portfolio'],
  endpoints: (builder) => ({
    getPortfolio: builder.query<{ assets: Asset[]; summary: PortfolioSummary }, void>({
      query: () => '/portfolio',
      providesTags: ['Portfolio'],
    }),
    addAsset: builder.mutation<Asset, Omit<Asset, 'id' | 'lastUpdated' | 'totalValue' | 'gainLoss' | 'gainLossPercentage'>>({
      query: (asset) => ({
        url: '/portfolio',
        method: 'POST',
        body: asset,
      }),
      invalidatesTags: ['Portfolio'],
    }),
    updateAsset: builder.mutation<Asset, { id: string; updates: Partial<Asset> }>({
      query: ({ id, updates }) => ({
        url: `/portfolio/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['Portfolio'],
    }),
    deleteAsset: builder.mutation<void, string>({
      query: (id) => ({
        url: `/portfolio/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Portfolio'],
    }),
    refreshPrices: builder.mutation<{ assets: Asset[]; summary: PortfolioSummary }, void>({
      query: () => ({
        url: '/portfolio/refresh-prices',
        method: 'POST',
      }),
      invalidatesTags: ['Portfolio'],
    }),
  }),
});

export const {
  useGetPortfolioQuery,
  useAddAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
  useRefreshPricesMutation,
} = api;
