import * as XLSX from 'xlsx';

export function generateTemplate() {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Sample data for the template
  const templateData = [
    {
      'Product Name': 'Paracetamol 500mg',
      'SKU': 'PARA-500',
      'Category': 'Pain Relief',
      'Batch Number': 'BT' + new Date().getFullYear() + '001',
      'Quantity': '100',
      'Expiry Date': '2025-12-31',
      'Unit Price': '2.50',
      'Reorder Level': '20'
    },
    {
      'Product Name': 'Ibuprofen 400mg',
      'SKU': 'IBU-400',
      'Category': 'Pain Relief',
      'Batch Number': 'BT' + new Date().getFullYear() + '002',
      'Quantity': '150',
      'Expiry Date': '2025-12-31',
      'Unit Price': '3.20',
      'Reorder Level': '30'
    },
    {
      'Product Name': 'Amoxicillin 250mg',
      'SKU': 'AMOX-250',
      'Category': 'Antibiotics',
      'Batch Number': 'BT' + new Date().getFullYear() + '003',
      'Quantity': '80',
      'Expiry Date': '2024-12-31',
      'Unit Price': '4.50',
      'Reorder Level': '15'
    }
  ];

  // Convert the data to a worksheet
  const ws = XLSX.utils.json_to_sheet(templateData);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Products');
  
  // Generate the Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
  // Convert to a Blob
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Create a download link and trigger it
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'inventory_import_template.xlsx';
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}
