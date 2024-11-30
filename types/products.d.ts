declare module '@/products.json' {
  interface ProductItem {
    name: string;
    price: number;
  }

  interface ProductData {
    [key: string]: ProductItem[];
  }

  const value: ProductData;
  export default value;
} 