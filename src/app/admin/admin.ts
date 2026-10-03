import { Component, signal } from '@angular/core';
import { AdminEntity } from './interfaces/admin-entity.interfaces';
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
  imports: [RestaurantList, TableList],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  entities = ADMIN_ENTITIES;
  menuOpen = signal(false);
  selectedKey = signal(DEFAULT_ENTITY_KEY);

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
}
