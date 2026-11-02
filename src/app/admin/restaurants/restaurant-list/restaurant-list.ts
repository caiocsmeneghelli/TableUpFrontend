import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { resolveImageUrl } from '../../../core/utils/image-url';
import { RestaurantAdmin, RestaurantAdminForm } from '../interfaces/restaurant-admin.interfaces';
import { RestaurantAdminService } from '../services/restaurant-admin.service';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  selector: 'app-restaurant-list',
  imports: [FormsModule],
  templateUrl: './restaurant-list.html',
  styleUrl: './restaurant-list.scss',
})
export class RestaurantList implements OnInit, OnDestroy {
  restaurants = signal<RestaurantAdmin[]>([]);
  loading = signal(false);
  error = signal('');

  editingId = signal<string | null>(null);
  creating = signal(false);
  editForm: RestaurantAdminForm = { name: '', slug: '', email: '', description: '' };
  saving = signal(false);

  imageFile = signal<File | null>(null);
  imagePreview = signal('');
  imageError = signal('');

  protected readonly resolveImageUrl = resolveImageUrl;

  constructor(private restaurantAdminService: RestaurantAdminService) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.clearImage();
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

  startCreate() {
    this.creating.set(true);
    this.editForm = { name: '', slug: '', email: '', description: '' };
    this.clearImage();
  }

  startEdit(restaurant: RestaurantAdmin) {
    this.editingId.set(restaurant.id);
    this.editForm = {
      name: restaurant.name,
      slug: restaurant.slug,
      email: restaurant.email,
      description: restaurant.description,
    };
    this.clearImage();
    this.imagePreview.set(resolveImageUrl(restaurant.imageUrl));
  }

  cancelForm() {
    this.editingId.set(null);
    this.creating.set(false);
    this.clearImage();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      this.imageError.set('Use uma imagem JPG, PNG ou WEBP.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      this.imageError.set('A imagem deve ter no máximo 5 MB.');
      return;
    }

    this.clearImage();
    this.imageFile.set(file);
    this.imagePreview.set(URL.createObjectURL(file));
  }

  // Libera a URL temporária da pré-visualização local
  private clearImage() {
    const preview = this.imagePreview();
    if (preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    this.imageFile.set(null);
    this.imagePreview.set('');
    this.imageError.set('');
  }

  // A imagem é enviada depois dos dados, pois no cadastro o restaurante ainda não tem id
  private uploadImage(id: string, onDone: () => void) {
    const file = this.imageFile();
    if (!file) {
      onDone();
      return;
    }

    this.restaurantAdminService.uploadImage(id, file).subscribe({
      next: (result) => {
        if (!result.isSuccess) {
          this.error.set(result.error || 'Não foi possível enviar a imagem.');
        }
        onDone();
      },
      error: (err) => {
        this.error.set(err?.error?.error || 'Não foi possível enviar a imagem.');
        onDone();
      },
    });
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
    this.restaurantAdminService.create(this.editForm).subscribe({
      next: (result) => {
        if (!result.isSuccess) {
          this.saving.set(false);
          this.error.set(result.error || 'Não foi possível criar o restaurante.');
          return;
        }

        this.uploadImage(result.value as string, () => {
          this.saving.set(false);
          this.cancelForm();
          this.load();
        });
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Não foi possível criar o restaurante.');
      },
    });
  }

  private saveEdit() {
    const id = this.editingId();
    if (!id) {
      return;
    }

    this.saving.set(true);
    this.restaurantAdminService.update(id, this.editForm).subscribe({
      next: (result) => {
        if (!result.isSuccess) {
          this.saving.set(false);
          this.error.set(result.error || 'Não foi possível salvar as alterações.');
          return;
        }

        const hasNewImage = !!this.imageFile();
        this.restaurants.update((list) =>
          list.map((r) => (r.id === id ? { ...r, ...this.editForm } : r)),
        );
        this.uploadImage(id, () => {
          this.saving.set(false);
          this.cancelForm();
          if (hasNewImage) {
            this.load();
          }
        });
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
