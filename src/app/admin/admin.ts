import { Component, signal } from '@angular/core';
import { AdminEntity } from './interfaces/admin-entity.interfaces';
import { MenuCategoryList } from './menu-categories/menu-category-list/menu-category-list';
import { MenuItemList } from './menu-items/menu-item-list/menu-item-list';
import { OrderBillAdmin } from './order-bills/interfaces/order-bill-admin.interfaces';
import { OrderBillList } from './order-bills/order-bill-list/order-bill-list';
import { OrderItemList } from './order-items/order-item-list/order-item-list';
import { RestaurantList } from './restaurants/restaurant-list/restaurant-list';
import { TableList } from './tables/table-list/table-list';

const ADMIN_ENTITIES: AdminEntity[] = [
  { label: 'Restaurantes', key: 'restaurants' },
  { label: 'Categorias de Menu', key: 'menu-categories' },
  { label: 'Itens de Menu', key: 'menu-items' },
  { label: 'Mesas', key: 'tables' },
  { label: 'Contas', key: 'order-bills' },
  { label: 'Itens de Conta', key: 'order-items' },
  { label: 'Usuários', key: 'users' },
];

const DEFAULT_ENTITY_KEY = 'restaurants';

@Component({
  selector: 'app-admin',
  imports: [RestaurantList, MenuCategoryList, MenuItemList, TableList, OrderBillList, OrderItemList],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  entities = ADMIN_ENTITIES;
  menuOpen = signal(false);
  selectedKey = signal(DEFAULT_ENTITY_KEY);
  selectedOrderBillGuid = signal<string | null>(null);

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  selectEntity(entity: AdminEntity) {
    this.selectedKey.set(entity.key);
    this.closeMenu();
  }

  openOrderBillItems(orderBill: OrderBillAdmin) {
    this.selectedOrderBillGuid.set(orderBill.guidOrderBill);
    this.selectedKey.set('order-items');
  }
}
