import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { MenuCategoryItem, MenuCategoryWithItems, OrderBill, TableSummary } from '../interfaces/table.interfaces';
import { CartService } from '../services/cart.service';
import { MenuCategoryService } from '../services/menu-category.service';
import { OrderBillService } from '../services/order-bill.service';
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
  orderBill = signal<OrderBill | null>(null);

  addingItem = signal<MenuCategoryItem | null>(null);
  quantity = signal(1);
  addingTotal = computed(() => (this.addingItem()?.value ?? 0) * this.quantity());

  constructor(
    private tableService: TableService,
    private menuCategoryService: MenuCategoryService,
    private orderBillService: OrderBillService,
    protected cart: CartService,
  ) {}

  ngOnInit() {
    this.cart.load(this.tableToken());

    this.tableService
      .getByToken(this.tableToken())
      .pipe(
        tap((table) => {
          this.table.set(table);
          this.loadOrderBill(table.tableGuid);
        }),
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

  // Sem conta ativa (ou se a consulta falhar) o atalho da conta simplesmente não aparece
  private loadOrderBill(tableGuid: string) {
    this.orderBillService.getActiveByTable(tableGuid).subscribe({
      next: (orderBill) => this.orderBill.set(orderBill),
      error: () => this.orderBill.set(null),
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
    const item = this.addingItem();
    if (item) {
      this.cart.add(item, this.quantity());
    }
    this.addingItem.set(null);
  }
}
