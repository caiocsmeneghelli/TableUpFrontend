import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { OrderBill, OrderBillStatus, OrderItemStatus, TableSummary } from '../interfaces/table.interfaces';
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

  pendingCount = computed(
    () => this.orderBill()?.items.filter((item) => item.statusOrderItem === OrderItemStatus.Pending).length ?? 0,
  );

  readonly OrderItemStatus = OrderItemStatus;

  constructor(
    private tableService: TableService,
    private orderBillService: OrderBillService,
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

  billStatusLabel(status: OrderBillStatus) {
    return BILL_STATUS_LABELS[status] ?? '';
  }

  itemStatusLabel(status: OrderItemStatus) {
    return ITEM_STATUS_LABELS[status] ?? '';
  }
}
