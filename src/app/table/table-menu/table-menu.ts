import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { MenuCategoryItem, MenuCategoryWithItems, TableSummary } from '../interfaces/table.interfaces';
import { MenuCategoryService } from '../services/menu-category.service';
import { TableService } from '../services/table.service';

@Component({
  selector: 'app-table-menu',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './table-menu.html',
  styleUrl: './table-menu.scss',
})
export class TableMenu implements OnInit {
  tableToken = input.required<string>();

  table = signal<TableSummary | null>(null);
  categories = signal<MenuCategoryWithItems[]>([]);
  expandedCategories = signal(new Set<string>());
  loading = signal(true);
  error = signal('');

  addingItem = signal<MenuCategoryItem | null>(null);
  quantity = signal(1);
  addingTotal = computed(() => (this.addingItem()?.value ?? 0) * this.quantity());

  constructor(
    private tableService: TableService,
    private menuCategoryService: MenuCategoryService,
  ) {}

  ngOnInit() {
    this.tableService
      .getByToken(this.tableToken())
      .pipe(
        tap((table) => this.table.set(table)),
        switchMap((table) => this.menuCategoryService.getMenuByRestaurant(table.restaurantGuid)),
      )
      .subscribe({
        next: (categories) => {
          this.categories.set(categories);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Não foi possível carregar o cardápio.');
          this.loading.set(false);
        },
      });
  }

  toggleCategory(categoryGuid: string) {
    this.expandedCategories.update((expanded) => {
      const next = new Set(expanded);
      if (!next.delete(categoryGuid)) {
        next.add(categoryGuid);
      }
      return next;
    });
  }

  isExpanded(categoryGuid: string) {
    return this.expandedCategories().has(categoryGuid);
  }

  startAdding(item: MenuCategoryItem) {
    this.addingItem.set(item);
    this.quantity.set(1);
  }

  cancelAdding() {
    this.addingItem.set(null);
  }

  isAdding(item: MenuCategoryItem) {
    return this.addingItem()?.guid === item.guid;
  }

  changeQuantity(delta: number) {
    this.quantity.update((quantity) => Math.max(1, quantity + delta));
  }

  confirmAdding() {
    // TODO: enviar o item para o pedido da mesa
    this.addingItem.set(null);
  }
}
