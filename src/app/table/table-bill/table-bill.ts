import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { OrderBill, OrderBillStatus, OrderItemStatus, TableSummary } from '../interfaces/table.interfaces';
import { CartService } from '../services/cart.service';
import { OrderBillService } from '../services/order-bill.service';
import { TableService } from '../services/table.service';

const BILL_STATUS_LABELS: Record<OrderBillStatus, string> = {
  [OrderBillStatus.Opened]: 'Conta aberta',
  [OrderBillStatus.Closed]: 'Conta fechada',
  [OrderBillStatus.Canceled]: 'Conta cancelada',
};

const ITEM_STATUS_LABELS: Record<OrderItemStatus, string> = {
  [OrderItemStatus.Pending]: 'Em preparo',
  [OrderItemStatus.Completed]: 'Entregue',
  [OrderItemStatus.Canceled]: 'Cancelado',
};

@Component({
  selector: 'app-table-bill',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './table-bill.html',
  styleUrl: './table-bill.scss',
})
export class TableBill implements OnInit {
  tableToken = input.required<string>();

  table = signal<TableSummary | null>(null);
  orderBill = signal<OrderBill | null>(null);
  loading = signal(true);
  refreshing = signal(false);
  error = signal('');
  confirmingClose = signal(false);
  closing = signal(false);
  closeError = signal('');
  closedTotal = signal<number | null>(null);

  pendingCount = computed(
    () => this.orderBill()?.items.filter((item) => item.statusOrderItem === OrderItemStatus.Pending).length ?? 0,
  );

  readonly OrderItemStatus = OrderItemStatus;

  constructor(
    private tableService: TableService,
    private orderBillService: OrderBillService,
    private cart: CartService,
  ) {}

  ngOnInit() {
    this.tableService
      .getByToken(this.tableToken())
      .pipe(
        tap((table) => this.table.set(table)),
        switchMap((table) => this.orderBillService.getActiveByTable(table.tableGuid)),
      )
      .subscribe({
        next: (orderBill) => {
          this.orderBill.set(orderBill);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Não foi possível carregar a conta.');
          this.loading.set(false);
        },
      });
  }

  // Recarrega a conta para o cliente acompanhar o status dos itens
  refresh() {
    const table = this.table();
    if (!table || this.refreshing()) {
      return;
    }

    this.refreshing.set(true);
    this.orderBillService.getActiveByTable(table.tableGuid).subscribe({
      next: (orderBill) => {
        this.orderBill.set(orderBill);
        this.refreshing.set(false);
      },
      error: () => this.refreshing.set(false),
    });
  }

  closeBill() {
    const bill = this.orderBill();
    if (!bill || this.closing()) {
      return;
    }

    this.closing.set(true);
    this.closeError.set('');

    this.orderBillService.close(bill.guidOrderBill).subscribe({
      next: () => {
        // O total final desconsidera os itens em preparo, que foram cancelados
        const total = bill.items
          .filter((item) => item.statusOrderItem === OrderItemStatus.Completed)
          .reduce((sum, item) => sum + item.total, 0);
        this.closedTotal.set(total);
        this.orderBill.set(null);
        this.cart.load(this.tableToken());
        this.cart.clear();
        this.closing.set(false);
        this.confirmingClose.set(false);
      },
      error: () => {
        this.closeError.set('Não foi possível finalizar a conta. Tente novamente.');
        this.closing.set(false);
      },
    });
  }

  billStatusLabel(status: OrderBillStatus) {
    return BILL_STATUS_LABELS[status] ?? '';
  }

  itemStatusLabel(status: OrderItemStatus) {
    return ITEM_STATUS_LABELS[status] ?? '';
  }
}
