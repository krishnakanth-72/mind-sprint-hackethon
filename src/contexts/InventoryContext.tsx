import { createContext, useContext, useState, ReactNode } from 'react';
import { Product, mockProducts } from '@/lib/mockData';

interface InventoryContextType {
  products: Product[];
  addProducts: (newProducts: Product[]) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const addProducts = (newProducts: Product[]) => {
    // Add unique IDs to new products
    const productsWithIds = newProducts.map(product => ({
      ...product,
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      batches: product.batches.map(batch => ({
        ...batch,
        id: `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    }));
    
    setProducts(prevProducts => [...prevProducts, ...productsWithIds]);
  };

  return (
    <InventoryContext.Provider value={{ products, addProducts }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
