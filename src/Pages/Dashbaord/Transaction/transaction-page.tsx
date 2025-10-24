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
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [params, setParams] = useState<TransactionQueryParams>({
    page: 1,
    perPage: 10,
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
      id: "reference_no",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/transaction/${row.original.reference_no}`)}
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
      setTotalPages(response.lastPage ?? 0);
      setTotalRecords(response.total ?? 0);
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
            loading={loading}
            pageSize={data.length}
          />
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted-foreground">Per page</label>
              <select
                className="ml-2 rounded border px-2 py-1 text-sm"
                value={params.perPage}
                onChange={(e) => {
                  const per = Number(e.target.value) || 10;
                  setParams((p) => ({ ...p, perPage: per, page: 1 }));
                }}
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <div className="ml-4 text-sm text-muted-foreground">{totalRecords} records</div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setParams((p) => ({ ...p, page: Math.max(1, (p.page || 1) - 1) }))}
                disabled={params.page === 1}
              >
                Prev
              </Button>

              <div className="flex items-center gap-2">
                <label className="text-sm">Page</label>
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, totalPages)}
                  value={params.page}
                  onChange={(e) => {
                    const pg = Number(e.target.value) || 1;
                    setParams((p) => ({ ...p, page: Math.min(Math.max(1, pg), Math.max(1, totalPages)) }));
                  }}
                  className="w-20 rounded border px-2 py-1 text-sm"
                />
                <span className="text-sm text-muted-foreground">of {totalPages || 1}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setParams((p) => ({ ...p, page: Math.min(totalPages || 1, (p.page || 1) + 1) }))}
                disabled={params.page === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <ErrorCard message={error} />}
    </SummaryLayout>
  );
}
