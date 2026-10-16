import { Component, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableSummary } from './interfaces/table.interfaces';
import { TableService } from './services/table.service';

@Component({
  selector: 'app-table',
  imports: [RouterLink],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table implements OnInit {
  tableGuid = input.required<string>();

  table = signal<TableSummary | null>(null);
  loading = signal(true);
  error = signal('');

  constructor(private tableService: TableService) {}

  ngOnInit() {
    this.tableService.getByGuid(this.tableGuid()).subscribe({
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
}
