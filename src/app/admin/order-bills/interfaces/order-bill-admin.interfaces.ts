// Espelha o enum EStatusOrderBill do backend
export enum OrderBillAdminStatus {
  Opened = 1,
  Closed = 2,
  Canceled = 3,
  Paid = 4,
}

export interface OrderBillAdmin {
  guidOrderBill: string;
  tableNumber: string;
  restaurantName: string;
  createdAt: string;
  updatedAt: string;
  statusOrderBill: OrderBillAdminStatus;
  total: number;
}

export type OrderBillAdminAction = 'close' | 'cancel' | 'pay';
