export interface MenuItemAdmin {
  guid: string;
  name: string;
  description: string;
  value: number;
  categoryGuid: string;
  categoryName: string;
  restaurantGuid: string;
  restaurantName: string;
  createdAt: string;
  createdBy: string;
}

export interface MenuItemAdminForm {
  name: string;
  description: string;
  value: number | null;
  restaurantGuid: string;
  categoryGuid: string;
}
