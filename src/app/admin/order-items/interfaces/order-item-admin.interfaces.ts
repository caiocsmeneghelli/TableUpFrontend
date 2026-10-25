import { OrderBillAdminStatus } from '../../order-bills/interfaces/order-bill-admin.interfaces';

// Espelha o enum EStatusOrderItem do backend
export enum OrderItemAdminStatus {
  Pending = 1,
  Completed = 2,
  Canceled = 3,
}

export interface OrderItemAdmin {
  guid: string;
  quantity: number;
  itemMenuName: string;
  unitValue: number;
  total: number;
  statusOrderItem: OrderItemAdminStatus;
  createdAt: string;
}

export interface OrderBillDetailAdmin {
  guidOrderBill: string;
  tableNumber: string;
  restaurantName: string;
  statusOrderBill: OrderBillAdminStatus;
  total: number;
  items: OrderItemAdmin[];
}

export type OrderItemAdminAction = 'complete' | 'cancel';
