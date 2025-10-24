import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactionDetail, type TransactionDetail } from "@/lib/api/transaction.api";
import { formatCurrency } from "@/lib/utils/format";
import { format } from "date-fns";
import { SummaryLayout } from "@/components/layout/summary-layout";
import { DetailItem, ErrorCard } from "./components/transaction-components";

export default function DetailTransactionPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await getTransactionDetail(id);
        setData(response);
      } catch (err) {
        const e = err as Error;
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [id]);

  return (
    <SummaryLayout title="Transaction Detail">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <DetailItem 
            label="Reference ID" 
            value={data?.reference_id ?? ''} 
            loading={loading}
          />
          <DetailItem 
            label="Date" 
            value={data ? format(new Date(data.created_at), "dd MMM yyyy HH:mm:ss") : ''} 
            loading={loading}
          />
          <DetailItem 
            label="Status" 
            value={data ? data.sales : ''} 
            loading={loading}
          />
          <DetailItem 
            label="Customer Name" 
            value={data?.customer?.name ?? ''} 
            loading={loading}
          />
          <DetailItem 
            label="Customer Email" 
            value={data?.customer?.code ?? ''} 
            loading={loading}
          />
          <DetailItem 
            label="Amount" 
            value={data ? formatCurrency(data.amount) : ''} 
            loading={loading}
          />
          <DetailItem 
            label="Fee" 
            value={data ? formatCurrency(data.fee) : ''} 
            loading={loading}
          />
          <DetailItem 
            label="Total Amount" 
            value={data ? formatCurrency(data.total_amount) : ''} 
            loading={loading}
          />
          <DetailItem 
            label="Payment Method" 
            value={data?.payment_method ?? ''} 
            loading={loading}
          />
          <DetailItem 
            label="Payment Channel" 
            value={data?.payment_channel ?? ''} 
            loading={loading}
          />
          <DetailItem 
            label="Payment Destination" 
            value={data?.payment_destination ?? ''} 
            loading={loading}
          />
        </CardContent>
      </Card>

      {error && <ErrorCard message={error} />}
    </SummaryLayout>
  );
}
