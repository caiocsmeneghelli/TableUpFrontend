export interface RestaurantAdmin {
  id: string;
  name: string;
  slug: string;
  email: string;
  description: string;
  imageUrl: string;
}

export interface RestaurantAdminForm {
  name: string;
  slug: string;
  email: string;
  description: string;
}
