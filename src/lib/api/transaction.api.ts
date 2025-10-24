import { api } from './auth.api';

export interface TransactionItem {
  id: string;
  amount: number;
  amount_due: string;
  amount_total: number;
  amount_untaxed: number;
  date_due: string;
  date_order: string;
  paid_at: string;
  created_at: string;
  reference_id: string;
  sales: string;
  customer: {
    name: string;
    code: string;
  }
}

export interface TransactionItemResponse {
  id: string;
  amount: number;
  amountDue: string;
  amountTotal: number;
  amountUntaxed: number;
  dateDue: string;
  dateOrder: string;
  paidAt: string;
  createdAt: string;
  referenceId: string;
  sales: string;
  customer: {
    name: string;
    code: string;
  }
}


export interface TransactionResponse {
  items: TransactionItemResponse[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  responseCode: number;
  responseMessage: string;
}

export interface Transactions {
  items: TransactionItem[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  responseCode: number;
  responseMessage: string;
}

export interface TransactionQueryParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export interface TransactionDetail extends TransactionItem {
  payment_method: string;
  payment_channel: string;
  payment_destination: string;
  fee: number;
  total_amount: number;
}

export const getTransactions = async (params: TransactionQueryParams): Promise<Transactions> => {
  try {
    const response = await api.get('/v1/transactions', { params });

    const raw = response.data as TransactionResponse;

    const items: TransactionItem[] = (raw.items || []).map((item: TransactionItemResponse) => ({
      ...item,
      amount: item.amount,
      amount_due: item.amountDue,
      amount_total: item.amountTotal,
      amount_untaxed: item.amountUntaxed,
      date_due: item.dateDue,
      date_order: item.dateOrder,
      paid_at: item.paidAt,
      created_at: item.createdAt,
      reference_id: item.referenceId,
      sales: item.sales,
    }));

    const normalized: Transactions = {
      items,
      total: raw.total ?? 0,
      currentPage: raw.currentPage ?? 0,
      lastPage: raw.lastPage ?? 0,
      perPage: raw.perPage ?? 0,
      responseCode: Number(raw.responseCode ?? 0),
      responseMessage: raw.responseMessage ?? '',
    };

    return normalized;
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string } | undefined;
    if (e?.response?.data?.message) throw new Error(e.response.data.message);
    if (e?.message) throw new Error(e.message);
    throw new Error('Failed to fetch transactions');
  }
};

export const getTransactionDetail = async (id: string): Promise<TransactionDetail> => {
  try {
    const response = await api.get(`/v1/transactions/${id}`);
    return response.data;
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string } | undefined;
    if (e?.response?.data?.message) throw new Error(e.response.data.message);
    if (e?.message) throw new Error(e.message);
    throw new Error('Failed to fetch transaction detail');
  }
};