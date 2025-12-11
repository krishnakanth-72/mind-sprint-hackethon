import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { getExpiringProducts } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export function ExpiryTracker() {
  const expiringProducts = getExpiringProducts();

  const getStatusInfo = (days: number) => {
    if (days < 0) return { label: 'Expired', color: 'destructive', icon: AlertTriangle };
    if (days <= 7) return { label: 'Critical', color: 'destructive', icon: AlertTriangle };
    if (days <= 30) return { label: 'Soon', color: 'warning', icon: Clock };
    return { label: 'OK', color: 'success', icon: CheckCircle };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">FEFO Priority Queue</span>
        <span className="font-medium text-foreground">{expiringProducts.length} batches</span>
      </div>

      <div className="space-y-3">
        {expiringProducts.slice(0, 5).map((item, index) => {
          const status = getStatusInfo(item.daysUntilExpiry);
          const StatusIcon = status.icon;
          const progress = Math.max(0, Math.min(100, (item.daysUntilExpiry / 90) * 100));

          return (
            <div
              key={item.id}
              className={cn(
                "p-3 rounded-lg bg-secondary/50 border border-border animate-slide-up"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusIcon className={cn(
                    "w-4 h-4",
                    status.color === 'destructive' && "text-destructive",
                    status.color === 'warning' && "text-warning",
                    status.color === 'success' && "text-success"
                  )} />
                  <span className="font-medium text-sm text-foreground truncate max-w-[150px]">
                    {item.productName}
                  </span>
                </div>
                <span className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                  status.color === 'destructive' && "bg-destructive/10 text-destructive",
                  status.color === 'warning' && "bg-warning/10 text-warning",
                  status.color === 'success' && "bg-success/10 text-success"
                )}>
                  {item.daysUntilExpiry < 0 ? 'Expired' : `${item.daysUntilExpiry}d`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span>Batch: {item.batchNumber}</span>
                <span>•</span>
                <span>{item.quantity} units</span>
              </div>
              <Progress 
                value={progress} 
                className={cn(
                  "h-1.5",
                  status.color === 'destructive' && "[&>div]:bg-destructive",
                  status.color === 'warning' && "[&>div]:bg-warning",
                  status.color === 'success' && "[&>div]:bg-success"
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
