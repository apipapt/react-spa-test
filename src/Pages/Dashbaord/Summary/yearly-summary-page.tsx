import { useState, useEffect, useCallback } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getYearlySummary, type YearlySummaryResponse } from "@/lib/api/summary.api";
import { Skeleton } from "@/components/ui/skeleton";

export default function YearlySummaryPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [data, setData] = useState<YearlySummaryResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: YearlySummaryResponse = await getYearlySummary(String(year));
      setData(response);
    } catch (err) {
      const e = err as Error;
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    void fetchSummary();
  }, [fetchSummary]);

  const totalCurrent = data?.current.amount || 0;
  const totalPrevious = data?.previous.amount || 0;
  const avgGrowth = data?.percentage || 0;
  const colorText = avgGrowth < 0 ? 'text-red-500' : 'text-green-500';

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "19rem",
      } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Yearly Summary {error}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Year</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground">Year</label>
                    <input
                      type="number"
                      min={2000}
                      max={2100}
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className={cn("w-full rounded border px-3 py-2")}
                    />
                  </div>
                  <div>
                    <Button onClick={fetchSummary} disabled={loading}>
                      {loading ? 'Loading...' : 'Get Summary'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Current</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-8 w-32" /> : (
                    <div className="text-2xl font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalCurrent)}</div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Previous</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-8 w-32" /> : (
                    <div className={`text-2xl font-bold ${colorText}`}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPrevious)}</div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Avg Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? <Skeleton className="h-8 w-24" /> : (
                    <div>
                      <div className={`text-2xl font-bold ${colorText}`}>
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalCurrent - totalPrevious)}
                      </div>
                      <div className={`text-lg
                         font-bold ${colorText}`}>{avgGrowth} %</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
