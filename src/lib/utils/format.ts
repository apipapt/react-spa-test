export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getColorByGrowth = (growth: number): string => {
  return growth < 0 ? 'text-red-500' : 'text-green-500';
};