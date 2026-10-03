import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RestaurantAdmin } from '../../restaurants/interfaces/restaurant-admin.interfaces';
import { RestaurantAdminService } from '../../restaurants/services/restaurant-admin.service';
import { MenuCategoryAdmin, MenuCategoryAdminForm } from '../interfaces/menu-category-admin.interfaces';
import { MenuCategoryAdminService } from '../services/menu-category-admin.service';

@Component({
  selector: 'app-menu-category-list',
  imports: [FormsModule, DatePipe],
  templateUrl: './menu-category-list.html',
  styleUrl: './menu-category-list.scss',
})
export class MenuCategoryList implements OnInit {
  categories = signal<MenuCategoryAdmin[]>([]);
  restaurants = signal<RestaurantAdmin[]>([]);
  loading = signal(false);
  error = signal('');

  editingId = signal<string | null>(null);
  creating = signal(false);
  form: MenuCategoryAdminForm = { name: '', restaurantGuid: '' };
  saving = signal(false);

  constructor(
    private menuCategoryAdminService: MenuCategoryAdminService,
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
    this.menuCategoryAdminService.getAll().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar as categorias.');
        this.loading.set(false);
      },
    });
  }

  startCreate() {
    this.creating.set(true);
    this.form = { name: '', restaurantGuid: this.restaurants()[0]?.id ?? '' };
  }

  startEdit(category: MenuCategoryAdmin) {
    this.editingId.set(category.guid);
    this.form = { name: category.name, restaurantGuid: category.restaurantGuid };
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
    this.menuCategoryAdminService.create(this.form).subscribe({
      next: (result) => {
        this.saving.set(false);
        if (!result.isSuccess) {
          this.error.set(result.error || 'Não foi possível criar a categoria.');
          return;
        }

        this.creating.set(false);
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.error || 'Não foi possível criar a categoria.');
      },
    });
  }

  private saveEdit() {
    const id = this.editingId();
    if (!id) {
      return;
    }

    this.saving.set(true);
    this.menuCategoryAdminService.update(id, this.form).subscribe({
      next: (result) => {
        this.saving.set(false);
        if (!result.isSuccess) {
          this.error.set(result.error || 'Não foi possível salvar as alterações.');
          return;
        }

        this.editingId.set(null);
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.error || 'Não foi possível salvar as alterações.');
      },
    });
  }

  remove(category: MenuCategoryAdmin) {
    if (!confirm(`Excluir a categoria "${category.name}"? Os itens de menu dela também serão inativados.`)) {
      return;
    }

    this.menuCategoryAdminService.delete(category.guid).subscribe({
      next: () => {
        this.categories.update((list) => list.filter((c) => c.guid !== category.guid));
      },
      error: () => {
        this.error.set('Não foi possível excluir a categoria.');
      },
    });
  }
}
