import * as XLSX from 'xlsx';
import { Product } from './mockData';

export function parseExcelFile(data: any): Product[] {
  try {
    const workbook = XLSX.read(data, { type: 'binary' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

    return jsonData.map((row: any, index) => {
      const currentDate = new Date();
      const expiryDate = row['Expiry Date'] || 
        new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)).toISOString().split('T')[0];
      
      return {
        id: `imported-${Date.now()}-${index}`,
        name: row['Product Name'] || `Imported Product ${index + 1}`,
        sku: row['SKU'] || `SKU-${Date.now()}-${index}`,
        category: row['Category'] || 'Uncategorized',
        currentStock: Number(row['Quantity']) || 0,
        reorderLevel: Number(row['Reorder Level']) || 10,
        unitPrice: Number(row['Unit Price']) || 0,
        batches: [
          {
            id: `batch-${Date.now()}-${index}`,
            batchNumber: row['Batch Number'] || `BATCH-${Date.now()}`,
            quantity: Number(row['Quantity']) || 0,
            expiryDate: expiryDate,
            receivedDate: new Date().toISOString().split('T')[0]
          }
        ]
      } as Product;
    });
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    throw error;
  }
}
