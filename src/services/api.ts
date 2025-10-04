import { User, UserDtoUpdate, Item, ItemDtoUpdate } from '@/types/api';

const API_BASE_URL = 'http://localhost:8080';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  async getUser(userId: number): Promise<User> {
    return this.request<User>(`/users/${userId}`);
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(userId: number, user: UserDtoUpdate): Promise<UserDtoUpdate> {
    return this.request<UserDtoUpdate>(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(userId: number): Promise<void> {
    return this.request<void>(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getItems(userId?: number): Promise<Item[]> {
    const headers: HeadersInit = {};
    if (userId) {
      headers['X-Sharer-User-Id'] = userId.toString();
    } else {
      headers['X-Sharer-User-Id'] = 'All';
    }

    return this.request<Item[]>('/items', { headers });
  }

  async getItem(itemId: number): Promise<Item> {
    return this.request<Item>(`/items/${itemId}`);
  }

  async createItem(userId: number, item: Omit<Item, 'id' | 'idUser'>): Promise<Item> {
    return this.request<Item>('/items', {
      method: 'POST',
      headers: {
        'X-Sharer-User-Id': userId.toString(),
      },
      body: JSON.stringify(item),
    });
  }

  async updateItem(
    userId: number,
    itemId: number,
    item: ItemDtoUpdate
  ): Promise<ItemDtoUpdate> {
    return this.request<ItemDtoUpdate>(`/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'X-Sharer-User-Id': userId.toString(),
      },
      body: JSON.stringify(item),
    });
  }

  async deleteItem(itemId: number): Promise<void> {
    return this.request<void>(`/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async searchItems(text: string): Promise<Item[]> {
    return this.request<Item[]>(`/items/search?text=${encodeURIComponent(text)}`);
  }
}

export const apiService = new ApiService();
