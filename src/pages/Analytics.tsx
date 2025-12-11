import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Package, Clock } from 'lucide-react';
import { mockProducts, mockSalesData } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesChart } from '@/components/dashboard/SalesChart';

const categoryData = mockProducts.reduce((acc, product) => {
  const existing = acc.find(c => c.name === product.category);
  if (existing) {
    existing.value += product.currentStock;
    existing.products += 1;
  } else {
    acc.push({ name: product.category, value: product.currentStock, products: 1 });
  }
  return acc;
}, [] as { name: string; value: number; products: number }[]);

const COLORS = [
  'hsl(174 72% 40%)',
  'hsl(199 89% 48%)',
  'hsl(38 92% 50%)',
  'hsl(142 72% 40%)',
  'hsl(0 72% 51%)',
];

const revenueData = mockSalesData.map(d => ({
  ...d,
  date: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
}));

export default function Analytics() {
  const totalRevenue = mockSalesData.reduce((acc, d) => acc + d.revenue, 0);
  const totalSales = mockSalesData.reduce((acc, d) => acc + d.sales, 0);
  const avgOrderValue = totalRevenue / totalSales;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Insights and performance metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  ${totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Weekly Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  {totalSales.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Items Sold</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  ${avgOrderValue.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Avg. Order Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  98.5%
                </p>
                <p className="text-sm text-muted-foreground">Stock Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Sales & AI Forecast</CardTitle>
            <p className="text-sm text-muted-foreground">7-day history with predictions</p>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>

        {/* Revenue by Day */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Daily Revenue</CardTitle>
            <p className="text-sm text-muted-foreground">This week's performance</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(210 20% 90%)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(210 15% 45%)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(210 15% 45%)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(0 0% 100%)',
                      border: '1px solid hsl(210 20% 90%)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`$${value}`, 'Revenue']}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="hsl(174 72% 40%)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stock by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Stock Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Inventory by category</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(0 0% 100%)',
                      border: '1px solid hsl(210 20% 90%)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => [`${value} units`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              {categoryData.map((cat, index) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-muted-foreground">{cat.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Top Products by Stock</CardTitle>
            <p className="text-sm text-muted-foreground">Highest inventory levels</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...mockProducts]
                .sort((a, b) => b.currentStock - a.currentStock)
                .slice(0, 5)
                .map((product, index) => {
                  const maxStock = mockProducts[0].currentStock;
                  const percentage = (product.currentStock / maxStock) * 100;
                  return (
                    <div key={product.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{product.name}</span>
                        <span className="text-muted-foreground">
                          {product.currentStock.toLocaleString()} units
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
