import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockSalesData, mockForecast } from '@/lib/mockData';

export function SalesChart() {
  const combinedData = [
    ...mockSalesData.map(d => ({ ...d, type: 'actual' })),
    ...mockForecast.map(d => ({ 
      date: d.date, 
      sales: d.predicted,
      predicted: d.predicted,
      lower: d.lower,
      upper: d.upper,
      type: 'forecast' 
    })),
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={combinedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(174 72% 40%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(174 72% 40%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false}
            stroke="hsl(210 20% 90%)"
          />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            tick={{ fill: 'hsl(210 15% 45%)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: 'hsl(210 15% 45%)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(0 0% 100%)',
              border: '1px solid hsl(210 20% 90%)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px hsl(210 40% 11% / 0.1)',
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="hsl(174 72% 40%)"
            strokeWidth={2}
            fill="url(#salesGradient)"
          />
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="hsl(199 89% 48%)"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="url(#forecastGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
