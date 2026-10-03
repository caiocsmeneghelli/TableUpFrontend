export interface MenuCategoryAdmin {
  guid: string;
  name: string;
  createdAt: string;
  createdBy: string;
  restaurantName: string;
  restaurantGuid: string;
}

export interface MenuCategoryAdminForm {
  name: string;
  restaurantGuid: string;
}
