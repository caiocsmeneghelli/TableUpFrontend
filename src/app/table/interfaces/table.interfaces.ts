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

// Espelham os enums EStatusOrderBill / EStatusOrderItem do backend
export enum OrderBillStatus {
  Opened = 1,
  Closed = 2,
  Canceled = 3,
  Paid = 4,
}

export enum OrderItemStatus {
  Pending = 1,
  Completed = 2,
  Canceled = 3,
}

export interface OrderBillItem {
  guid: string;
  quantity: number;
  guidItemMenu: string;
  itemMenuName: string;
  unitValue: number;
  total: number;
  statusOrderItem: OrderItemStatus;
  createdAt: string;
}

export interface OrderBill {
  guidOrderBill: string;
  tableNumber: string;
  createdAt: string;
  statusOrderBill: OrderBillStatus;
  total: number;
  items: OrderBillItem[];
}
