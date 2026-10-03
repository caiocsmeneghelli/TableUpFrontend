export interface TableAdmin {
  tableGuid: string;
  tableNumber: string;
  createdAt: string;
  createdBy: string;
  restaurantName: string;
  restaurantGuid: string;
}

export interface TableAdminCreateForm {
  tableNumber: string;
  restaurantGuid: string;
}

export interface TableAdminEditForm {
  tableNumber: string;
  restaurantGuid: string;
}
