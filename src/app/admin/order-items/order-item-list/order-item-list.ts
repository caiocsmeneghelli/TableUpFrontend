import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, input, signal } from '@angular/core';
import {
  OrderBillDetailAdmin,
  OrderItemAdmin,
  OrderItemAdminAction,
  OrderItemAdminStatus,
} from '../interfaces/order-item-admin.interfaces';
import { OrderItemAdminService } from '../services/order-item-admin.service';

const STATUS_LABELS: Record<OrderItemAdminStatus, string> = {
  [OrderItemAdminStatus.Pending]: 'Pendente',
  [OrderItemAdminStatus.Completed]: 'Completo',
  [OrderItemAdminStatus.Canceled]: 'Cancelado',
};

const ACTION_CONFIRMATIONS: Record<OrderItemAdminAction, string> = {
  complete: 'Completar o item',
  cancel: 'Cancelar o item',
};

@Component({
  selector: 'app-order-item-list',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './order-item-list.html',
  styleUrl: './order-item-list.scss',
})
export class OrderItemList {
  // Conta escolhida na listagem de contas; sem ela a aba só orienta o usuário
  orderBillGuid = input<string | null>(null);

  orderBill = signal<OrderBillDetailAdmin | null>(null);
  loading = signal(false);
  error = signal('');
  pendingGuid = signal<string | null>(null);

  readonly Status = OrderItemAdminStatus;

  constructor(private orderItemAdminService: OrderItemAdminService) {
    effect(() => {
      const guid = this.orderBillGuid();
      this.orderBill.set(null);
      if (guid) {
        this.load(guid);
      }
    });
  }

  load(guid = this.orderBillGuid()) {
    if (!guid) {
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.orderItemAdminService.getOrderBill(guid).subscribe({
      next: (orderBill) => {
        this.orderBill.set(orderBill);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar os itens da conta.');
        this.loading.set(false);
      },
    });
  }

  statusLabel(status: OrderItemAdminStatus) {
    return STATUS_LABELS[status] ?? '';
  }

  changeStatus(item: OrderItemAdmin, action: OrderItemAdminAction) {
    if (this.pendingGuid() || !confirm(`${ACTION_CONFIRMATIONS[action]} "${item.itemMenuName}"?`)) {
      return;
    }

    this.pendingGuid.set(item.guid);
    this.error.set('');
    this.orderItemAdminService.changeStatus(item.guid, action).subscribe({
      next: () => {
        this.pendingGuid.set(null);
        this.load();
      },
      error: (response: HttpErrorResponse) => {
        this.pendingGuid.set(null);
        this.error.set(response.error?.error || 'Não foi possível atualizar o item.');
      },
    });
  }
}
