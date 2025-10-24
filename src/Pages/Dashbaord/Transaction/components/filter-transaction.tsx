import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { TransactionQueryParams } from "@/lib/api/transaction.api";

interface FilterTransactionProps {
  params: TransactionQueryParams;
  onParamsChange: (params: TransactionQueryParams) => void;
  onApplyFilter: () => void;
  loading?: boolean;
}

export function FilterTransaction({
  params,
  onParamsChange,
  onApplyFilter,
  loading
}: FilterTransactionProps) {
  const updateParams = (key: keyof TransactionQueryParams, value: string) => {
    onParamsChange({ ...params, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="grid gap-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={params.startDate}
              onChange={(e) => updateParams("startDate", e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label>End Date</Label>
            <Input
              type="date"
              value={params.endDate}
              onChange={(e) => updateParams("endDate", e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label>Sort By</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
              value={params.sortBy}
              onChange={(e) => updateParams("sortBy", e.target.value)}
              disabled={loading}
            >
              <option value="created_at">Date</option>
              <option value="amount_due">Amount</option>
              <option value="status">Status</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Sort Direction</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
              value={params.sortDirection}
              onChange={(e) => updateParams("sortDirection", e.target.value as 'asc' | 'desc')}
              disabled={loading}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onApplyFilter} disabled={loading}>
            {loading ? "Loading..." : "Apply Filter"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}