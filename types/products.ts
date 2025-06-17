export interface Product {
  id: number;
  externalId: number;
  title: string;
  barcode: number;
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
  barcode?: number | null;
  category?: string;
  description: string;
  image?: File | null;
}
