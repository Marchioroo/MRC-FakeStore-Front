export interface Product {
  id: number;
  externalId: number;
  title: string;
  barcode: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface PaginatedProducts {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  data: Product[];
}

export interface ProductInput {
  title: string;
  price: number;
  barcode?: string;
  category?: string;
  description: string;
  image?: File | null;
}
