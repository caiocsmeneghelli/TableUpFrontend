import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuCategoryAdmin } from '../../menu-categories/interfaces/menu-category-admin.interfaces';
import { MenuCategoryAdminService } from '../../menu-categories/services/menu-category-admin.service';
import { RestaurantAdmin } from '../../restaurants/interfaces/restaurant-admin.interfaces';
import { RestaurantAdminService } from '../../restaurants/services/restaurant-admin.service';
import { MenuItemAdmin, MenuItemAdminForm } from '../interfaces/menu-item-admin.interfaces';
import { MenuItemAdminService } from '../services/menu-item-admin.service';

const EMPTY_FORM: MenuItemAdminForm = {
  name: '',
  description: '',
  value: null,
  restaurantGuid: '',
  categoryGuid: '',
};

@Component({
  selector: 'app-menu-item-list',
  imports: [FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './menu-item-list.html',
  styleUrl: './menu-item-list.scss',
})
export class MenuItemList implements OnInit {
  items = signal<MenuItemAdmin[]>([]);
  restaurants = signal<RestaurantAdmin[]>([]);
  categories = signal<MenuCategoryAdmin[]>([]);
  loading = signal(false);
  loadingCategories = signal(false);
  error = signal('');
  formError = signal('');

  editingId = signal<string | null>(null);
  creating = signal(false);
  form: MenuItemAdminForm = { ...EMPTY_FORM };
  saving = signal(false);

  constructor(
    private menuItemAdminService: MenuItemAdminService,
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
    this.menuItemAdminService.getAll().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar os itens de menu.');
        this.loading.set(false);
      },
    });
  }

  startCreate() {
    this.creating.set(true);
    this.formError.set('');
    this.form = { ...EMPTY_FORM };
    this.categories.set([]);
  }

  startEdit(item: MenuItemAdmin) {
    this.editingId.set(item.guid);
    this.formError.set('');
    this.form = {
      name: item.name,
      description: item.description,
      value: item.value,
      restaurantGuid: item.restaurantGuid,
      categoryGuid: item.categoryGuid,
    };
    this.loadCategories(item.restaurantGuid, item.categoryGuid);
  }

  onRestaurantChange(restaurantGuid: string) {
    this.form.categoryGuid = '';
    this.loadCategories(restaurantGuid);
  }

  private loadCategories(restaurantGuid: string, selectedCategoryGuid = '') {
    this.categories.set([]);
    if (!restaurantGuid) {
      return;
    }

    this.loadingCategories.set(true);
    this.menuCategoryAdminService.getByRestaurant(restaurantGuid).subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.form.categoryGuid = selectedCategoryGuid || (categories[0]?.guid ?? '');
        this.loadingCategories.set(false);
      },
      error: () => {
        this.formError.set('Não foi possível carregar as categorias do restaurante.');
        this.loadingCategories.set(false);
      },
    });
  }

  cancelForm() {
    this.editingId.set(null);
    this.creating.set(false);
  }

  saveForm() {
    if (!this.form.categoryGuid) {
      this.formError.set('Selecione o restaurante e a categoria.');
      return;
    }

    this.formError.set('');
    if (this.creating()) {
      this.saveCreate();
      return;
    }

    this.saveEdit();
  }

  private saveCreate() {
    this.saving.set(true);
    this.menuItemAdminService.create(this.form).subscribe({
      next: (result) => {
        this.saving.set(false);
        if (!result.isSuccess) {
          this.formError.set(result.error || 'Não foi possível criar o item.');
          return;
        }

        this.creating.set(false);
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(err.error?.error || 'Não foi possível criar o item.');
      },
    });
  }

  private saveEdit() {
    const id = this.editingId();
    if (!id) {
      return;
    }

    this.saving.set(true);
    this.menuItemAdminService.update(id, this.form).subscribe({
      next: (result) => {
        this.saving.set(false);
        if (!result.isSuccess) {
          this.formError.set(result.error || 'Não foi possível salvar as alterações.');
          return;
        }

        this.editingId.set(null);
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(err.error?.error || 'Não foi possível salvar as alterações.');
      },
    });
  }

  remove(item: MenuItemAdmin) {
    if (!confirm(`Excluir o item "${item.name}"?`)) {
      return;
    }

    this.menuItemAdminService.delete(item.guid).subscribe({
      next: () => {
        this.items.update((list) => list.filter((i) => i.guid !== item.guid));
      },
      error: () => {
        this.error.set('Não foi possível excluir o item.');
      },
    });
  }
}
