import { AlertTriangle, Clock, Package, TrendingUp } from 'lucide-react';
import { Alert } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface AlertsListProps {
  alerts: Alert[];
  limit?: number;
}

const alertIcons = {
  'low-stock': Package,
  'expiring': Clock,
  'expired': AlertTriangle,
  'reorder': TrendingUp,
};

const severityStyles = {
  critical: 'border-l-destructive bg-destructive/5',
  warning: 'border-l-warning bg-warning/5',
  info: 'border-l-primary bg-primary/5',
};

const badgeVariants = {
  critical: 'destructive' as const,
  warning: 'outline' as const,
  info: 'secondary' as const,
};

export function AlertsList({ alerts, limit }: AlertsListProps) {
  const displayAlerts = limit ? alerts.slice(0, limit) : alerts;

  return (
    <div className="space-y-3">
      {displayAlerts.map((alert, index) => {
        const Icon = alertIcons[alert.type];
        return (
          <div
            key={alert.id}
            className={cn(
              "p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md animate-slide-up",
              severityStyles[alert.severity],
              !alert.read && "ring-1 ring-primary/20"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                alert.severity === 'critical' && "bg-destructive/20 text-destructive",
                alert.severity === 'warning' && "bg-warning/20 text-warning",
                alert.severity === 'info' && "bg-primary/20 text-primary"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground truncate">
                    {alert.productName}
                  </span>
                  <Badge variant={badgeVariants[alert.severity]} className="text-xs">
                    {alert.type.replace('-', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
