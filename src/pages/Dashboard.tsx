import { Package, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { useInventory } from '@/contexts/InventoryContext';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AlertsList } from '@/components/dashboard/AlertsList';
import { ExpiryTracker } from '@/components/dashboard/ExpiryTracker';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

export default function Dashboard() {
  const { products } = useInventory();
  
  // Calculate statistics
  const { totalProducts, totalStock, lowStockCount, expiringCount, criticalAlerts } = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    // Calculate expiring batches
    const expiringBatches = products.flatMap(product => 
      product.batches
        .filter(batch => {
          const expiryDate = new Date(batch.expiryDate);
          return expiryDate <= thirtyDaysFromNow && expiryDate >= now;
        })
        .map(batch => ({
          ...batch,
          productName: product.name,
          productId: product.id,
          daysUntilExpiry: Math.ceil((new Date(batch.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        }))
    );
    
    // Calculate low stock items
    const lowStockItems = products.filter(p => p.currentStock <= p.reorderLevel);
    
    // Calculate critical alerts (products below 50% of reorder level)
    const criticalItems = products.filter(p => p.currentStock <= (p.reorderLevel * 0.5));
    
    return {
      totalProducts: products.length,
      totalStock: products.reduce((acc, p) => acc + p.currentStock, 0),
      lowStockCount: lowStockItems.length,
      expiringCount: expiringBatches.length,
      criticalAlerts: criticalItems.length
    };
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time inventory overview and AI insights
          </p>
        </div>
        <Button asChild className="gradient-primary text-primary-foreground shadow-glow">
          <Link to="/import">Import Stock Data</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          subtitle={`${totalStock.toLocaleString()} units in stock`}
          icon={Package}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Low Stock Items"
          value={lowStockCount}
          subtitle="Below reorder level"
          icon={AlertTriangle}
          variant={lowStockCount > 0 ? 'warning' : 'success'}
        />
        <StatsCard
          title="Expiring Soon"
          value={expiringCount}
          subtitle="Within 30 days"
          icon={Clock}
          variant={expiringCount > 0 ? 'warning' : 'success'}
        />
        <StatsCard
          title="AI Forecast"
          value="+15%"
          subtitle="Predicted demand increase"
          icon={TrendingUp}
          variant="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Forecast Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display">Sales & Demand Forecast</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Historical data with AI predictions
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(199_89%_48%)]" />
                <span className="text-muted-foreground">Forecast</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>

        {/* Expiry Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">FEFO Expiry Queue</CardTitle>
            <p className="text-sm text-muted-foreground">
              First-Expired-First-Out priority
            </p>
          </CardHeader>
          <CardContent>
            <ExpiryTracker />
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-display">
              Active Alerts
              {criticalAlerts > 0 && (
                <span className="ml-2 text-sm font-normal text-destructive">
                  ({criticalAlerts} critical)
                </span>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Stock and expiry notifications
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/alerts">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <AlertsList alerts={[]} limit={4} />
        </CardContent>
      </Card>
    </div>
  );
}
