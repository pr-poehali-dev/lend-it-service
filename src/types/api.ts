export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserDtoUpdate {
  id?: number;
  name?: string;
  email?: string;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  available: boolean;
  idUser: number;
}

export interface ItemDto {
  id: number;
  name: string;
  description: string;
  available: boolean;
}

export interface ItemDtoUpdate {
  id?: number;
  name?: string;
  description?: string;
  available?: boolean;
  idUser?: number;
}
