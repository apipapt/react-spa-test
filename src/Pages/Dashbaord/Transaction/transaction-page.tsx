import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { getTransactions, type TransactionItem, type TransactionQueryParams } from "@/lib/api/transaction.api";
import { formatCurrency } from "@/lib/utils/format";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SummaryLayout } from "@/components/layout/summary-layout";
import { FilterTransaction } from "./components/filter-transaction";
import { StatusBadge, ErrorCard } from "./components/transaction-components";

export default function TransactionPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<TransactionQueryParams>({
    page: 1,
    perPage: 100,
    sortBy: "created_at",
    sortDirection: "desc",
    startDate: "2023-01-01",
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const columns: ColumnDef<TransactionItem>[] = [
    {
      accessorKey: "customer.name",
      header: "Customer",
    },
    {
      accessorKey: "sales",
      header: "Sales",
      cell: ({ row }) => <StatusBadge status={row.original.sales} />,
    },
    {
      accessorKey: "date_due",
      header: "Date Due",
      cell: ({ row }) => format(new Date(row.original.date_due), "yyyy-MM-dd"),
    },
    {
      accessorKey: "date_order",
      header: "Date Order",
      cell: ({ row }) => format(new Date(row.original.date_order), "yyyy-MM-dd"),
    },
    {
      accessorKey: "amount_due",
      header: "Amount Due",
      cell: ({ row }) => formatCurrency(Number(row.original.amount_due)),
    },
    {
      accessorKey: "amount_untaxed",
      header: "Amount Untaxed",
      cell: ({ row }) => formatCurrency(Number(row.original.amount_untaxed)),
    },
    {
      accessorKey: "amount_total",
      header: "Amount Total",
      cell: ({ row }) => formatCurrency(Number(row.original.amount_total)),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/transaction/${row.original.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTransactions(params);
      setData(response.items);
    } catch (err) {
      const e = err as Error;
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return (
    <SummaryLayout title="Transactions">
      <FilterTransaction 
        params={params}
        onParamsChange={setParams}
        onApplyFilter={() => void fetchData()}
        loading={loading}
      />

      <Card>
        <CardHeader>
          <CardTitle>Transaction List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchColumn="amount_due"
            searchPlaceholder="Search by customer name..."
          />
        </CardContent>
      </Card>

      {error && <ErrorCard message={error} />}
    </SummaryLayout>
  );
}
