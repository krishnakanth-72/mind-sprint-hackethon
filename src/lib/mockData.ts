export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  unitPrice: number;
  batches: Batch[];
}

export interface Batch {
  id: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  receivedDate: string;
}

export interface Alert {
  id: string;
  type: 'low-stock' | 'expiring' | 'expired' | 'reorder';
  productId: string;
  productName: string;
  message: string;
  severity: 'warning' | 'critical' | 'info';
  timestamp: string;
  read: boolean;
}

export interface SalesData {
  date: string;
  sales: number;
  revenue: number;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    sku: 'PARA-500',
    category: 'Pain Relief',
    currentStock: 450,
    reorderLevel: 200,
    unitPrice: 2.50,
    batches: [
      { id: 'b1', batchNumber: 'BT2024001', quantity: 200, expiryDate: '2024-03-15', receivedDate: '2023-09-01' },
      { id: 'b2', batchNumber: 'BT2024002', quantity: 250, expiryDate: '2025-06-20', receivedDate: '2024-01-15' },
    ]
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    sku: 'AMOX-250',
    category: 'Antibiotics',
    currentStock: 85,
    reorderLevel: 100,
    unitPrice: 8.75,
    batches: [
      { id: 'b3', batchNumber: 'BT2024003', quantity: 85, expiryDate: '2024-12-30', receivedDate: '2024-02-01' },
    ]
  },
  {
    id: '3',
    name: 'Omeprazole 20mg',
    sku: 'OMEP-20',
    category: 'Gastrointestinal',
    currentStock: 320,
    reorderLevel: 150,
    unitPrice: 5.20,
    batches: [
      { id: 'b4', batchNumber: 'BT2024004', quantity: 150, expiryDate: '2025-02-28', receivedDate: '2024-01-10' },
      { id: 'b5', batchNumber: 'BT2024005', quantity: 170, expiryDate: '2025-08-15', receivedDate: '2024-03-01' },
    ]
  },
  {
    id: '4',
    name: 'Ibuprofen 400mg',
    sku: 'IBUP-400',
    category: 'Pain Relief',
    currentStock: 45,
    reorderLevel: 100,
    unitPrice: 3.80,
    batches: [
      { id: 'b6', batchNumber: 'BT2024006', quantity: 45, expiryDate: '2024-04-10', receivedDate: '2023-10-15' },
    ]
  },
  {
    id: '5',
    name: 'Metformin 500mg',
    sku: 'METF-500',
    category: 'Diabetes',
    currentStock: 580,
    reorderLevel: 200,
    unitPrice: 4.50,
    batches: [
      { id: 'b7', batchNumber: 'BT2024007', quantity: 300, expiryDate: '2025-11-30', receivedDate: '2024-02-20' },
      { id: 'b8', batchNumber: 'BT2024008', quantity: 280, expiryDate: '2026-03-15', receivedDate: '2024-03-10' },
    ]
  },
  {
    id: '6',
    name: 'Aspirin 100mg',
    sku: 'ASPR-100',
    category: 'Cardiovascular',
    currentStock: 25,
    reorderLevel: 150,
    unitPrice: 1.99,
    batches: [
      { id: 'b9', batchNumber: 'BT2024009', quantity: 25, expiryDate: '2024-02-28', receivedDate: '2023-06-01' },
    ]
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    type: 'expired',
    productId: '6',
    productName: 'Aspirin 100mg',
    message: 'Batch BT2024009 has expired. Immediate action required.',
    severity: 'critical',
    timestamp: '2024-12-11T08:00:00Z',
    read: false
  },
  {
    id: 'a2',
    type: 'low-stock',
    productId: '2',
    productName: 'Amoxicillin 250mg',
    message: 'Stock level (85) is below reorder point (100). Reorder recommended.',
    severity: 'warning',
    timestamp: '2024-12-11T07:30:00Z',
    read: false
  },
  {
    id: 'a3',
    type: 'expiring',
    productId: '1',
    productName: 'Paracetamol 500mg',
    message: 'Batch BT2024001 expires in 94 days. Apply FEFO dispensing.',
    severity: 'warning',
    timestamp: '2024-12-11T06:00:00Z',
    read: true
  },
  {
    id: 'a4',
    type: 'low-stock',
    productId: '4',
    productName: 'Ibuprofen 400mg',
    message: 'Stock critically low (45). Urgent reorder needed.',
    severity: 'critical',
    timestamp: '2024-12-10T22:00:00Z',
    read: false
  },
  {
    id: 'a5',
    type: 'reorder',
    productId: '6',
    productName: 'Aspirin 100mg',
    message: 'AI suggests reorder of 300 units based on demand forecast.',
    severity: 'info',
    timestamp: '2024-12-10T18:00:00Z',
    read: true
  },
];

export const mockSalesData: SalesData[] = [
  { date: '2024-12-05', sales: 145, revenue: 1250 },
  { date: '2024-12-06', sales: 132, revenue: 1180 },
  { date: '2024-12-07', sales: 98, revenue: 890 },
  { date: '2024-12-08', sales: 87, revenue: 760 },
  { date: '2024-12-09', sales: 156, revenue: 1420 },
  { date: '2024-12-10', sales: 178, revenue: 1580 },
  { date: '2024-12-11', sales: 142, revenue: 1290 },
];

export const mockForecast = [
  { date: '2024-12-12', predicted: 155, lower: 140, upper: 170 },
  { date: '2024-12-13', predicted: 162, lower: 145, upper: 179 },
  { date: '2024-12-14', predicted: 148, lower: 132, upper: 164 },
  { date: '2024-12-15', predicted: 135, lower: 118, upper: 152 },
  { date: '2024-12-16', predicted: 168, lower: 150, upper: 186 },
  { date: '2024-12-17', predicted: 175, lower: 158, upper: 192 },
  { date: '2024-12-18', predicted: 158, lower: 142, upper: 174 },
];

export const getExpiringProducts = () => {
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  return mockProducts.flatMap(product => 
    product.batches
      .filter(batch => new Date(batch.expiryDate) <= thirtyDaysFromNow)
      .map(batch => ({
        ...batch,
        productName: product.name,
        productId: product.id,
        daysUntilExpiry: Math.ceil((new Date(batch.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      }))
  ).sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
};

export const getLowStockProducts = () => {
  return mockProducts.filter(p => p.currentStock <= p.reorderLevel);
};
