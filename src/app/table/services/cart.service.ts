import { computed, Injectable, signal } from '@angular/core';
import { CartItem, MenuCategoryItem } from '../interfaces/table.interfaces';

const STORAGE_PREFIX = 'cart:';

// Carrinho da mesa atual. Fica no sessionStorage (por token da mesa) para sobreviver
// à navegação entre cardápio e carrinho e a um recarregamento da página.
@Injectable({ providedIn: 'root' })
export class CartService {
  private tableToken: string | null = null;
  private readonly state = signal<CartItem[]>([]);

  readonly items = this.state.asReadonly();
  readonly count = computed(() => this.state().reduce((sum, item) => sum + item.quantity, 0));
  readonly total = computed(() => this.state().reduce((sum, item) => sum + item.quantity * item.value, 0));

  load(tableToken: string) {
    const token = tableToken.toUpperCase();
    if (this.tableToken === token) {
      return;
    }

    this.tableToken = token;
    this.state.set(this.readStorage());
  }

  add(item: MenuCategoryItem, quantity: number) {
    this.state.update((items) => {
      const existing = items.find((cartItem) => cartItem.menuItemGuid === item.guid);
      if (existing) {
        return items.map((cartItem) =>
          cartItem === existing ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem,
        );
      }

      return [...items, { menuItemGuid: item.guid, name: item.name, value: item.value, quantity }];
    });
    this.writeStorage();
  }

  remove(menuItemGuid: string) {
    this.state.update((items) => items.filter((item) => item.menuItemGuid !== menuItemGuid));
    this.writeStorage();
  }

  clear() {
    this.state.set([]);
    this.writeStorage();
  }

  private get storageKey() {
    return `${STORAGE_PREFIX}${this.tableToken}`;
  }

  private readStorage(): CartItem[] {
    try {
      const raw = sessionStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private writeStorage() {
    if (!this.tableToken) {
      return;
    }

    try {
      if (this.state().length) {
        sessionStorage.setItem(this.storageKey, JSON.stringify(this.state()));
      } else {
        sessionStorage.removeItem(this.storageKey);
      }
    } catch {
      // sessionStorage indisponível (ex.: navegação privada); o carrinho em memória continua valendo
    }
  }
}
