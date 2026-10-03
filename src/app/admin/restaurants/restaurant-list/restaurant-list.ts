import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RestaurantAdmin, RestaurantAdminForm } from '../interfaces/restaurant-admin.interfaces';
import { RestaurantAdminService } from '../services/restaurant-admin.service';

@Component({
  selector: 'app-restaurant-list',
  imports: [FormsModule],
  templateUrl: './restaurant-list.html',
  styleUrl: './restaurant-list.scss',
})
export class RestaurantList implements OnInit {
  restaurants = signal<RestaurantAdmin[]>([]);
  loading = signal(false);
  error = signal('');

  editingId = signal<string | null>(null);
  editForm: RestaurantAdminForm = { name: '', slug: '', email: '', description: '' };
  saving = signal(false);

  constructor(private restaurantAdminService: RestaurantAdminService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.restaurantAdminService.getAll().subscribe({
      next: (restaurants) => {
        this.restaurants.set(restaurants);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar os restaurantes.');
        this.loading.set(false);
      },
    });
  }

  startEdit(restaurant: RestaurantAdmin) {
    this.editingId.set(restaurant.id);
    this.editForm = {
      name: restaurant.name,
      slug: restaurant.slug,
      email: restaurant.email,
      description: restaurant.description,
    };
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  saveEdit() {
    const id = this.editingId();
    if (!id) {
      return;
    }

    this.saving.set(true);
    this.restaurantAdminService.update(id, this.editForm).subscribe({
      next: (result) => {
        this.saving.set(false);
        if (!result.isSuccess) {
          this.error.set(result.error || 'Não foi possível salvar as alterações.');
          return;
        }

        this.restaurants.update((list) =>
          list.map((r) => (r.id === id ? { ...r, ...this.editForm } : r)),
        );
        this.editingId.set(null);
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Não foi possível salvar as alterações.');
      },
    });
  }

  remove(restaurant: RestaurantAdmin) {
    if (!confirm(`Excluir o restaurante "${restaurant.name}"?`)) {
      return;
    }

    this.restaurantAdminService.delete(restaurant.id).subscribe({
      next: () => {
        this.restaurants.update((list) => list.filter((r) => r.id !== restaurant.id));
      },
      error: () => {
        this.error.set('Não foi possível excluir o restaurante.');
      },
    });
  }
}
