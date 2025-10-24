import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DetailItemProps {
  label: string;
  value: string | number;
  loading?: boolean;
}

export function DetailItem({ label, value, loading }: DetailItemProps) {
  return (
    <div className="grid grid-cols-3 py-3 border-b last:border-0">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="col-span-2">
        {loading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <span className="font-medium">{value}</span>
        )}
      </div>
    </div>
  );
}

export function ErrorCard({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="text-red-500 text-sm">{message}</div>
      </CardContent>
    </Card>
  );
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusLower = status.toLowerCase();
  let colorClass = "bg-gray-100 text-gray-800";
  
  switch (statusLower) {
    case "success":
      colorClass = "bg-green-100 text-green-800";
      break;
    case "failed":
      colorClass = "bg-red-100 text-red-800";
      break;
    case "pending":
      colorClass = "bg-yellow-100 text-yellow-800";
      break;
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
}