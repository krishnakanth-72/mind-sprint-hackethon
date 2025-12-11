import { useState } from 'react';
import { Bell, Filter, CheckCheck, AlertTriangle, Clock, Package, TrendingUp } from 'lucide-react';
import { mockAlerts, Alert } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertsList } from '@/components/dashboard/AlertsList';

export default function Alerts() {
  const [alerts, setAlerts] = useState(mockAlerts);

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;

  const markAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  const filterByType = (type: string) => {
    if (type === 'all') return alerts;
    return alerts.filter(a => a.type === type);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Alerts</h1>
          <p className="text-muted-foreground mt-1">
            Stock notifications and AI recommendations
          </p>
        </div>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck className="w-4 h-4" />
          Mark All Read
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{criticalCount}</p>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-warning/5 border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{warningCount}</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{unreadCount}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Bell className="w-5 h-5" />
            All Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all" className="gap-2">
                All
                <Badge variant="secondary" className="ml-1">{alerts.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="low-stock" className="gap-2">
                <Package className="w-4 h-4" />
                Low Stock
              </TabsTrigger>
              <TabsTrigger value="expiring" className="gap-2">
                <Clock className="w-4 h-4" />
                Expiring
              </TabsTrigger>
              <TabsTrigger value="reorder" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                AI Suggestions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <AlertsList alerts={alerts} />
            </TabsContent>
            <TabsContent value="low-stock">
              <AlertsList alerts={filterByType('low-stock')} />
            </TabsContent>
            <TabsContent value="expiring">
              <AlertsList alerts={[...filterByType('expiring'), ...filterByType('expired')]} />
            </TabsContent>
            <TabsContent value="reorder">
              <AlertsList alerts={filterByType('reorder')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
