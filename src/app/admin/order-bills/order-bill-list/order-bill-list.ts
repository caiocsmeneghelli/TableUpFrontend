import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { matchesSearch } from '../../../core/utils/search';
import { OrderBillAdmin, OrderBillAdminAction, OrderBillAdminStatus } from '../interfaces/order-bill-admin.interfaces';
import { OrderBillAdminService } from '../services/order-bill-admin.service';

const STATUS_LABELS: Record<OrderBillAdminStatus, string> = {
  [OrderBillAdminStatus.Opened]: 'Aberta',
  [OrderBillAdminStatus.Closed]: 'Fechada',
  [OrderBillAdminStatus.Canceled]: 'Cancelada',
  [OrderBillAdminStatus.Paid]: 'Paga',
};

const ACTION_CONFIRMATIONS: Record<OrderBillAdminAction, string> = {
  close: 'Fechar a conta da mesa',
  cancel: 'Cancelar a conta da mesa',
  pay: 'Confirmar o pagamento da conta da mesa',
};

@Component({
  selector: 'app-order-bill-list',
  imports: [FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './order-bill-list.html',
  styleUrl: './order-bill-list.scss',
})
export class OrderBillList implements OnInit {
  orderBills = signal<OrderBillAdmin[]>([]);
  loading = signal(false);
  error = signal('');
  pendingGuid = signal<string | null>(null);

  filter = signal('');
  filteredOrderBills = computed(() =>
    this.orderBills().filter((bill) =>
      matchesSearch(this.filter(), bill.tableNumber, bill.restaurantName, this.statusLabel(bill.statusOrderBill)),
    ),
  );

  readonly Status = OrderBillAdminStatus;

  // Pede ao admin para abrir a aba de itens desta conta
  openItems = output<OrderBillAdmin>();

  constructor(private orderBillAdminService: OrderBillAdminService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.orderBillAdminService.getToday().subscribe({
      next: (orderBills) => {
        this.orderBills.set(orderBills);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar as contas.');
        this.loading.set(false);
      },
    });
  }

  statusLabel(status: OrderBillAdminStatus) {
    return STATUS_LABELS[status] ?? '';
  }

  changeStatus(bill: OrderBillAdmin, action: OrderBillAdminAction) {
    if (this.pendingGuid() || !confirm(`${ACTION_CONFIRMATIONS[action]} ${bill.tableNumber}?`)) {
      return;
    }

    this.pendingGuid.set(bill.guidOrderBill);
    this.error.set('');
    this.orderBillAdminService.changeStatus(bill.guidOrderBill, action).subscribe({
      next: () => {
        this.pendingGuid.set(null);
        this.load();
      },
      error: (response: HttpErrorResponse) => {
        this.pendingGuid.set(null);
        this.error.set(response.error?.error || 'Não foi possível atualizar a conta.');
      },
    });
  }
}
