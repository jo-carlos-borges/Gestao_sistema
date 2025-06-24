import { User, Item, Category, Price, LoginCredentials, RegisterData } from '../types';

// Simulate local storage as a database
const STORAGE_KEYS = {
  USERS: 'pantry_users',
  ITEMS: 'pantry_items',
  CATEGORIES: 'pantry_categories',
  PRICES: 'pantry_prices',
};

// Initialize with sample data if empty
function initializeStorage() {
  // Users
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const users: User[] = [
      { id: 1, username: 'demo', email: 'demo@example.com' },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
  
  // Categories
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    const categories: Category[] = [
      { id: 1, name: 'Dairy' },
      { id: 2, name: 'Fruits' },
      { id: 3, name: 'Vegetables' },
      { id: 4, name: 'Grains' },
      { id: 5, name: 'Canned Goods' },
    ];
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }
  
  // Items
  if (!localStorage.getItem(STORAGE_KEYS.ITEMS)) {
    const items: Item[] = [
      { id: 1, name: 'Milk', quantity: 1, priority: 'HIGH', categoryId: 1 },
      { id: 2, name: 'Apples', quantity: 5, priority: 'MEDIUM', categoryId: 2 },
      { id: 3, name: 'Rice', quantity: 2, priority: 'LOW', categoryId: 4 },
      { id: 4, name: 'Canned Beans', quantity: 4, priority: 'LOW', categoryId: 5 },
      { id: 5, name: 'Carrots', quantity: 6, priority: 'MEDIUM', categoryId: 3 },
    ];
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  }
  
  // Prices
  if (!localStorage.getItem(STORAGE_KEYS.PRICES)) {
    const now = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const prices: Price[] = [
      { id: 1, value: 3.99, storeUrl: 'https://store-a.com', date: now.toISOString(), itemId: 1 },
      { id: 2, value: 4.29, storeUrl: 'https://store-b.com', date: lastWeek.toISOString(), itemId: 1 },
      { id: 3, value: 4.49, storeUrl: 'https://store-c.com', date: twoWeeksAgo.toISOString(), itemId: 1 },
      { id: 4, value: 2.99, storeUrl: 'https://store-a.com', date: now.toISOString(), itemId: 2 },
      { id: 5, value: 1.49, storeUrl: 'https://store-b.com', date: now.toISOString(), itemId: 3 },
    ];
    localStorage.setItem(STORAGE_KEYS.PRICES, JSON.stringify(prices));
  }
}

// Initialize storage on load
initializeStorage();

// Helper functions to get and save data
function getData<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Auth mock functions
export const mockAuthApi = {
  login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (!credentials.email || !credentials.password) {
          return reject(new Error('Email and password are required'));
        }
        
        const users = getData<User>(STORAGE_KEYS.USERS);
        const user = users.find(u => u.email === credentials.email);
        
        if (!user) {
          return reject(new Error('User not found'));
        }
        
        // In a real app, you would verify the password hash here
        // For demo purposes, we'll accept any password for the demo user
        if (user.email === 'demo@example.com') {
          const token = `mock-jwt-token-${Date.now()}`;
          return resolve({ token, user });
        }
        
        reject(new Error('Invalid credentials'));
      }, 500); // Simulate network delay
    });
  },
  
  register(data: RegisterData): Promise<{ token: string; user: User }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (!data.username || !data.email || !data.password) {
          return reject(new Error('All fields are required'));
        }
        
        const users = getData<User>(STORAGE_KEYS.USERS);
        
        // Check if user already exists
        if (users.some(u => u.email === data.email)) {
          return reject(new Error('User with this email already exists'));
        }
        
        // Create new user
        const newUser: User = {
          id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
          username: data.username,
          email: data.email,
        };
        
        users.push(newUser);
        saveData(STORAGE_KEYS.USERS, users);
        
        const token = `mock-jwt-token-${Date.now()}`;
        resolve({ token, user: newUser });
      }, 500); // Simulate network delay
    });
  }
};

// Items mock API
export const mockItemsApi = {
  getItems(): Promise<Item[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = getData<Item>(STORAGE_KEYS.ITEMS);
        resolve(items);
      }, 300);
    });
  },
  
  getItemById(id: number): Promise<Item> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const items = getData<Item>(STORAGE_KEYS.ITEMS);
        const item = items.find(i => i.id === id);
        
        if (!item) {
          return reject(new Error('Item not found'));
        }
        
        // Include prices and category data
        const prices = getData<Price>(STORAGE_KEYS.PRICES)
          .filter(p => p.itemId === id);
          
        const categories = getData<Category>(STORAGE_KEYS.CATEGORIES);
        const category = categories.find(c => c.id === item.categoryId);
        
        resolve({
          ...item,
          prices,
          category
        });
      }, 300);
    });
  },
  
  createItem(item: Omit<Item, 'id'>): Promise<Item> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = getData<Item>(STORAGE_KEYS.ITEMS);
        
        const newItem: Item = {
          ...item,
          id: items.length ? Math.max(...items.map(i => i.id)) + 1 : 1,
        };
        
        items.push(newItem);
        saveData(STORAGE_KEYS.ITEMS, items);
        
        resolve(newItem);
      }, 300);
    });
  },
  
  updateItem(id: number, updates: Partial<Item>): Promise<Item> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const items = getData<Item>(STORAGE_KEYS.ITEMS);
        const index = items.findIndex(i => i.id === id);
        
        if (index === -1) {
          return reject(new Error('Item not found'));
        }
        
        const updatedItem: Item = { ...items[index], ...updates };
        items[index] = updatedItem;
        
        saveData(STORAGE_KEYS.ITEMS, items);
        
        // Include prices and category data
        const prices = getData<Price>(STORAGE_KEYS.PRICES)
          .filter(p => p.itemId === id);
          
        const categories = getData<Category>(STORAGE_KEYS.CATEGORIES);
        const category = categories.find(c => c.id === updatedItem.categoryId);
        
        resolve({
          ...updatedItem,
          prices,
          category
        });
      }, 300);
    });
  },
  
  deleteItem(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const items = getData<Item>(STORAGE_KEYS.ITEMS);
        const index = items.findIndex(i => i.id === id);
        
        if (index === -1) {
          return reject(new Error('Item not found'));
        }
        
        items.splice(index, 1);
        saveData(STORAGE_KEYS.ITEMS, items);
        
        // Also delete associated prices
        const prices = getData<Price>(STORAGE_KEYS.PRICES);
        const filteredPrices = prices.filter(p => p.itemId !== id);
        saveData(STORAGE_KEYS.PRICES, filteredPrices);
        
        resolve();
      }, 300);
    });
  },
  
  addPriceToItem(itemId: number, priceData: { value: number, storeUrl: string }): Promise<Item> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const items = getData<Item>(STORAGE_KEYS.ITEMS);
        const item = items.find(i => i.id === itemId);
        
        if (!item) {
          return reject(new Error('Item not found'));
        }
        
        const prices = getData<Price>(STORAGE_KEYS.PRICES);
        
        const newPrice: Price = {
          id: prices.length ? Math.max(...prices.map(p => p.id)) + 1 : 1,
          value: priceData.value,
          storeUrl: priceData.storeUrl,
          date: new Date().toISOString(),
          itemId
        };
        
        prices.push(newPrice);
        saveData(STORAGE_KEYS.PRICES, prices);
        
        // Return full item with updated prices
        const updatedPrices = prices.filter(p => p.itemId === itemId);
        const categories = getData<Category>(STORAGE_KEYS.CATEGORIES);
        const category = categories.find(c => c.id === item.categoryId);
        
        resolve({
          ...item,
          prices: updatedPrices,
          category
        });
      }, 300);
    });
  }
};

// Categories mock API
export const mockCategoriesApi = {
  getCategories(): Promise<Category[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = getData<Category>(STORAGE_KEYS.CATEGORIES);
        resolve(categories);
      }, 300);
    });
  },
  
  createCategory(data: { name: string }): Promise<Category> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = getData<Category>(STORAGE_KEYS.CATEGORIES);
        
        const newCategory: Category = {
          id: categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1,
          name: data.name
        };
        
        categories.push(newCategory);
        saveData(STORAGE_KEYS.CATEGORIES, categories);
        
        resolve(newCategory);
      }, 300);
    });
  },
  
  updateCategory(id: number, data: { name: string }): Promise<Category> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const categories = getData<Category>(STORAGE_KEYS.CATEGORIES);
        const index = categories.findIndex(c => c.id === id);
        
        if (index === -1) {
          return reject(new Error('Category not found'));
        }
        
        const updatedCategory: Category = { ...categories[index], ...data };
        categories[index] = updatedCategory;
        
        saveData(STORAGE_KEYS.CATEGORIES, categories);
        resolve(updatedCategory);
      }, 300);
    });
  },
  
  deleteCategory(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if any items are using this category
        const items = getData<Item>(STORAGE_KEYS.ITEMS);
        if (items.some(item => item.categoryId === id)) {
          return reject(new Error('Cannot delete category that is in use'));
        }
        
        const categories = getData<Category>(STORAGE_KEYS.CATEGORIES);
        const index = categories.findIndex(c => c.id === id);
        
        if (index === -1) {
          return reject(new Error('Category not found'));
        }
        
        categories.splice(index, 1);
        saveData(STORAGE_KEYS.CATEGORIES, categories);
        
        resolve();
      }, 300);
    });
  }
};