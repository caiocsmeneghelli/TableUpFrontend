export interface MenuItem {
  guid: string;
  name: string;
  description: string;
  price: number;
  categoryGuid: string;
  categoryName: string;
}

export interface MenuCategory {
  categoryGuid: string;
  categoryName: string;
  items: MenuItem[];
}