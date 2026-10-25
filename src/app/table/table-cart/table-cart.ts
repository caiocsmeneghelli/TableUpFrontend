import { CurrencyPipe } from '@angular/common';
import { Component, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableSummary } from '../interfaces/table.interfaces';
import { CartService } from '../services/cart.service';
import { OrderBillService } from '../services/order-bill.service';
import { TableService } from '../services/table.service';

@Component({
  selector: 'app-table-cart',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './table-cart.html',
  styleUrl: './table-cart.scss',
})
export class TableCart implements OnInit {
  tableToken = input.required<string>();

  table = signal<TableSummary | null>(null);
  loading = signal(true);
  error = signal('');
  submitting = signal(false);
  submitError = signal('');
  ordered = signal(false);

  constructor(
    private tableService: TableService,
    private orderBillService: OrderBillService,
    protected cart: CartService,
  ) {}

  ngOnInit() {
    this.cart.load(this.tableToken());

    this.tableService.getByToken(this.tableToken()).subscribe({
      next: (table) => {
        this.table.set(table);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Mesa não encontrada. Escaneie o QR code novamente.');
        this.loading.set(false);
      },
    });
  }

  removeItem(menuItemGuid: string) {
    this.cart.remove(menuItemGuid);
  }

  placeOrder() {
    const table = this.table();
    const items = this.cart.items();
    if (!table || !items.length || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.submitError.set('');

    this.orderBillService.addItems(table.tableNumber, table.restaurantGuid, items).subscribe({
      next: () => {
        this.cart.clear();
        this.ordered.set(true);
        this.submitting.set(false);
      },
      error: () => {
        // Mantém o carrinho para o cliente tentar de novo
        this.submitError.set('Não foi possível enviar o pedido. Tente novamente.');
        this.submitting.set(false);
      },
    });
  }
}
