import { Component, signal } from '@angular/core';
import { AdminEntity } from './interfaces/admin-entity.interfaces';

const ADMIN_ENTITIES: AdminEntity[] = [
  { label: 'Restaurantes' },
  { label: 'Categorias de Menu' },
  { label: 'Itens de Menu' },
  { label: 'Mesas' },
  { label: 'Contas' },
  { label: 'Itens de Conta' },
  { label: 'Usuários' },
];

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  entities = ADMIN_ENTITIES;
  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
