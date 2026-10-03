import { DatePipe } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { matchesSearch } from '../../../core/utils/search';
import { RestaurantAdmin } from '../../restaurants/interfaces/restaurant-admin.interfaces';
import { RestaurantAdminService } from '../../restaurants/services/restaurant-admin.service';
import { TableAdmin, TableAdminCreateForm } from '../interfaces/table-admin.interfaces';
import { TableAdminService } from '../services/table-admin.service';

@Component({
  selector: 'app-table-list',
  imports: [FormsModule, DatePipe],
  templateUrl: './table-list.html',
  styleUrl: './table-list.scss',
})
export class TableList implements OnInit {
  tables = signal<TableAdmin[]>([]);
  restaurants = signal<RestaurantAdmin[]>([]);
  loading = signal(false);
  error = signal('');

  filter = signal('');
  filteredTables = computed(() =>
    this.tables().filter((table) => matchesSearch(this.filter(), table.tableNumber, table.restaurantName)),
  );

  editingId = signal<string | null>(null);
  creating = signal(false);
  form: TableAdminCreateForm = { tableNumber: '', restaurantGuid: '' };
  saving = signal(false);

  constructor(
    private tableAdminService: TableAdminService,
    private restaurantAdminService: RestaurantAdminService,
  ) {}

  ngOnInit() {
    this.load();
    this.restaurantAdminService.getAll().subscribe({
      next: (restaurants) => this.restaurants.set(restaurants),
    });
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.tableAdminService.getAll().subscribe({
      next: (tables) => {
        this.tables.set(tables);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar as mesas.');
        this.loading.set(false);
      },
    });
  }

  startCreate() {
    this.creating.set(true);
    this.form = { tableNumber: '', restaurantGuid: this.restaurants()[0]?.id ?? '' };
  }

  startEdit(table: TableAdmin) {
    this.editingId.set(table.tableGuid);
    this.form = { tableNumber: table.tableNumber, restaurantGuid: table.restaurantGuid };
  }

  cancelForm() {
    this.editingId.set(null);
    this.creating.set(false);
  }

  saveForm() {
    if (this.creating()) {
      this.saveCreate();
      return;
    }

    this.saveEdit();
  }

  private saveCreate() {
    this.saving.set(true);
    this.tableAdminService.create(this.form).subscribe({
      next: (result) => {
        this.saving.set(false);
        if (!result.isSuccess) {
          this.error.set(result.error || 'Não foi possível criar a mesa.');
          return;
        }

        this.creating.set(false);
        this.load();
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Não foi possível criar a mesa.');
      },
    });
  }

  private saveEdit() {
    const id = this.editingId();
    if (!id) {
      return;
    }

    this.saving.set(true);
    this.tableAdminService.update(id, { tableNumber: this.form.tableNumber }).subscribe({
      next: (result) => {
        this.saving.set(false);
        if (!result.isSuccess) {
          this.error.set(result.error || 'Não foi possível salvar as alterações.');
          return;
        }

        this.editingId.set(null);
        this.load();
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Não foi possível salvar as alterações.');
      },
    });
  }

  remove(table: TableAdmin) {
    if (!confirm(`Excluir a mesa "${table.tableNumber}"?`)) {
      return;
    }

    this.tableAdminService.delete(table.tableGuid).subscribe({
      next: () => {
        this.tables.update((list) => list.filter((t) => t.tableGuid !== table.tableGuid));
      },
      error: () => {
        this.error.set('Não foi possível excluir a mesa.');
      },
    });
  }
}
