export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Price {
  id: number;
  value: number;
  storeUrl: string;
  date: string;
  itemId: number;
}

export interface Item {
  id: number;
  name: string;
  quantity: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  categoryId: number;
  category?: Category;
  prices?: Price[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}