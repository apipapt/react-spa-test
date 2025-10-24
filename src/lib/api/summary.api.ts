import { api } from './auth.api';

export interface Transaction {
  date: string;
  status: string;
  amount: number;
}

export interface MonthTransaction {
  current: number;
  growth: number;
  month: string;
  previous: number;
}

export interface DailySummaryResponse {
  items: Transaction[];
  totalRecords: number;
  totalPages: number;
}

export interface MonthlySummaryResponse {
  items: MonthTransaction[];
  totalRecords: number;
  totalPages: number;
}

export const getDailySummary = async (startDate: string, endDate: string): Promise<DailySummaryResponse> => {
  try {
    const response = await api.get(`/v1/summaries/daily-transactions`, {
      params: {
        startDate,
        endDate,
      },
    });
    return response.data;
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string } | undefined;
    if (e?.response?.data?.message) throw new Error(e.response.data.message);
    if (e?.message) throw new Error(e.message);
    throw new Error('Failed to fetch daily summary');
  }
};

// The monthly summary endpoint expects `startMonth` and `endMonth` in the format YYYY-MM
export const getMonthlySummary = async (startMonth: string, endMonth: string): Promise<MonthlySummaryResponse> => {
  try {
    const response = await api.get(`/v1/summaries/monthly-transactions`, {
      params: {
        startMonth,
        endMonth,
      },
    });
    return response.data;
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string } | undefined;
    if (e?.response?.data?.message) throw new Error(e.response.data.message);
    if (e?.message) throw new Error(e.message);
    throw new Error('Failed to fetch monthly summary');
  }
};

// Yearly summary types and API
export interface YearTransaction {
  year: string;
  amount: number;
}

export interface YearlySummaryResponse {
  current: YearTransaction;
  previous: YearTransaction;
  percentage: number;
  responseCode: number;
  responseMessage: string;
}

export const getYearlySummary = async (year: string): Promise<YearlySummaryResponse> => {
  try {
    const response = await api.get(`/v1/summaries/yearly-transactions`, {
      params: {
        year,
      },
    });
    return response.data;
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string } | undefined;
    if (e?.response?.data?.message) throw new Error(e.response.data.message);
    if (e?.message) throw new Error(e.message);
    throw new Error('Failed to fetch yearly summary');
  }
};

// Top customers types and API
export interface Customer {
  name: string;
  code: string;
  companyType: string;
}
export interface TopCustomer {
  amount: number;
  customer: Customer;
}

export interface TopCustomerResponse {
  items: TopCustomer[];
  totalRecords: number;
  totalPages: number;
  responseCode: number;
  responseMessage: string;
}

export const getTopCustomersSummary = async (
  startDate: string,
  endDate: string,
  limit: number = 5
): Promise<TopCustomerResponse> => {
  try {
    const response = await api.get(`/v1/summaries/top-customers`, {
      params: {
        startDate,
        endDate,
        limit,
      },
    });
    return response.data;
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string } | undefined;
    if (e?.response?.data?.message) throw new Error(e.response.data.message);
    if (e?.message) throw new Error(e.message);
    throw new Error('Failed to fetch top customers summary');
  }
};

