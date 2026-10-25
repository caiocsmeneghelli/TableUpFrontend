export interface TableSummary {
  tableGuid: string;
  tableToken: string;
  tableNumber: string;
  restaurantGuid: string;
  restaurantName: string;
}

export interface MenuCategoryItem {
  guid: string;
  name: string;
  description: string;
  value: number;
}

export interface MenuCategoryWithItems {
  guid: string;
  name: string;
  items: MenuCategoryItem[];
}

export interface CartItem {
  menuItemGuid: string;
  name: string;
  value: number;
  quantity: number;
}
