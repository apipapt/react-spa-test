import { api } from './auth.api';

export interface Transaction {
  date: string;
  status: string;
  amount: number;
}

export interface DailySummaryResponse {
  items: Transaction[];
  totalRecords: number;
  totalPages: number;
}

export const getDailySummary = async (startDate: string, endDate: string): Promise<DailySummaryResponse> => {
  try {
    const response = await api.get(`/v1/summaries/daily-transactions`, {
      params: {
        startDate,
        endDate
      }
    });
    return response.data;
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string } | undefined;
    if (e?.response?.data?.message) throw new Error(e.response.data.message);
    if (e?.message) throw new Error(e.message);
    throw new Error('Failed to fetch daily summary');
  }
};
