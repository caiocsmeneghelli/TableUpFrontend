import { Component, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderBill, TableSummary } from './interfaces/table.interfaces';
import { OrderBillService } from './services/order-bill.service';
import { TableService } from './services/table.service';

@Component({
  selector: 'app-table',
  imports: [RouterLink],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table implements OnInit {
  tableToken = input.required<string>();

  table = signal<TableSummary | null>(null);
  loading = signal(true);
  error = signal('');
  orderBill = signal<OrderBill | null>(null);

  constructor(
    private tableService: TableService,
    private orderBillService: OrderBillService,
  ) {}

  ngOnInit() {
    this.tableService.getByToken(this.tableToken()).subscribe({
      next: (table) => {
        this.table.set(table);
        this.loading.set(false);
        this.loadOrderBill(table.tableGuid);
      },
      error: () => {
        this.error.set('Mesa não encontrada. Escaneie o QR code novamente.');
        this.loading.set(false);
      },
    });
  }

  // Sem conta ativa (ou se a consulta falhar) o botão da conta simplesmente não aparece
  private loadOrderBill(tableGuid: string) {
    this.orderBillService.getActiveByTable(tableGuid).subscribe({
      next: (orderBill) => this.orderBill.set(orderBill),
      error: () => this.orderBill.set(null),
    });
  }
}
