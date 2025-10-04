import { User, UserDtoUpdate, Item, ItemDtoUpdate } from '@/types/api';

let users: User[] = [
  { id: 1, name: 'Иван Петров', email: 'ivan@example.com' },
  { id: 2, name: 'Мария Смирнова', email: 'maria@example.com' },
  { id: 3, name: 'Алексей Козлов', email: 'alexey@example.com' },
];

let items: Item[] = [
  { id: 1, name: 'Велосипед горный', description: 'Отличное состояние, 21 скорость', available: true, idUser: 1 },
  { id: 2, name: 'Палатка туристическая', description: '4-местная, водонепроницаемая', available: true, idUser: 2 },
  { id: 3, name: 'Фотоаппарат Canon', description: 'Зеркальная камера с объективом', available: false, idUser: 3 },
  { id: 4, name: 'Сноуборд', description: 'Размер 156см, с креплениями', available: true, idUser: 1 },
  { id: 5, name: 'Швейная машинка', description: 'Электрическая, многофункциональная', available: true, idUser: 2 },
  { id: 6, name: 'Дрель ударная', description: 'Мощная, с набором сверл', available: true, idUser: 3 },
];

let nextUserId = 4;
let nextItemId = 7;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiService {
  async getUsers(): Promise<User[]> {
    await delay(300);
    return [...users];
  }

  async getUser(userId: number): Promise<User> {
    await delay(200);
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    await delay(300);
    const newUser: User = {
      id: nextUserId++,
      ...user,
    };
    users.push(newUser);
    return newUser;
  }

  async updateUser(userId: number, userData: UserDtoUpdate): Promise<UserDtoUpdate> {
    await delay(300);
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    
    users[index] = {
      ...users[index],
      ...(userData.name && { name: userData.name }),
      ...(userData.email && { email: userData.email }),
    };
    return users[index];
  }

  async deleteUser(userId: number): Promise<void> {
    await delay(200);
    users = users.filter(u => u.id !== userId);
    items = items.filter(i => i.idUser !== userId);
  }

  async getItems(userId?: number): Promise<Item[]> {
    await delay(300);
    if (userId) {
      return items.filter(i => i.idUser === userId);
    }
    return [...items];
  }

  async getItem(itemId: number): Promise<Item> {
    await delay(200);
    const item = items.find(i => i.id === itemId);
    if (!item) throw new Error('Item not found');
    return item;
  }

  async createItem(userId: number, itemData: Omit<Item, 'id' | 'idUser'>): Promise<Item> {
    await delay(300);
    const newItem: Item = {
      id: nextItemId++,
      ...itemData,
      idUser: userId,
    };
    items.push(newItem);
    return newItem;
  }

  async updateItem(userId: number, itemId: number, itemData: ItemDtoUpdate): Promise<ItemDtoUpdate> {
    await delay(300);
    const index = items.findIndex(i => i.id === itemId);
    if (index === -1) throw new Error('Item not found');
    if (items[index].idUser !== userId) throw new Error('Not your item');
    
    items[index] = {
      ...items[index],
      ...(itemData.name && { name: itemData.name }),
      ...(itemData.description && { description: itemData.description }),
      ...(itemData.available !== undefined && { available: itemData.available }),
    };
    return items[index];
  }

  async deleteItem(itemId: number): Promise<void> {
    await delay(200);
    items = items.filter(i => i.id !== itemId);
  }

  async searchItems(text: string): Promise<Item[]> {
    await delay(400);
    const query = text.toLowerCase();
    return items.filter(
      item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }
}

export const mockApiService = new MockApiService();
