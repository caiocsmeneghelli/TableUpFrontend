import { Component, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { MenuCategory, TableSummary } from '../interfaces/table.interfaces';
import { MenuCategoryService } from '../services/menu-category.service';
import { TableService } from '../services/table.service';

@Component({
  selector: 'app-table-menu',
  imports: [RouterLink],
  templateUrl: './table-menu.html',
  styleUrl: './table-menu.scss',
})
export class TableMenu implements OnInit {
  tableGuid = input.required<string>();

  table = signal<TableSummary | null>(null);
  categories = signal<MenuCategory[]>([]);
  loading = signal(true);
  error = signal('');

  constructor(
    private tableService: TableService,
    private menuCategoryService: MenuCategoryService,
  ) {}

  ngOnInit() {
    this.tableService
      .getByGuid(this.tableGuid())
      .pipe(
        tap((table) => this.table.set(table)),
        switchMap((table) => this.menuCategoryService.getByRestaurant(table.restaurantGuid)),
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
}
