import { CurrencyPipe } from '@angular/common';
import { Component, computed, ElementRef, input, OnInit, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { resolveImageUrl } from '../core/utils/image-url';
import { Restaurant } from '../home/interfaces/restaurant.interfaces';
import { RestaurantService } from '../home/services/restaurant.service';
import { MenuCategoryWithItems } from '../table/interfaces/table.interfaces';
import { MenuCategoryService } from '../table/services/menu-category.service';

@Component({
  selector: 'app-restaurant',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './restaurant.html',
  styleUrl: './restaurant.scss',
})
export class RestaurantPage implements OnInit {
  id = input.required<string>();

  restaurant = signal<Restaurant | null>(null);
  loading = signal(true);
  error = signal('');

  categories = signal<MenuCategoryWithItems[]>([]);
  menuOpen = signal(false);
  menuLoading = signal(false);
  menuError = signal('');
  activeCategory = signal<string | null>(null);

  itemCount = computed(() =>
    this.categories().reduce((total, category) => total + category.items.length, 0),
  );
  imageUrl = computed(() => resolveImageUrl(this.restaurant()?.imageUrl));
  initial = computed(() => this.restaurant()?.name.charAt(0).toUpperCase() ?? '');

  private menuSection = viewChild<ElementRef<HTMLElement>>('menuSection');

  constructor(
    private restaurantService: RestaurantService,
    private menuCategoryService: MenuCategoryService,
  ) {}

  ngOnInit() {
    this.restaurantService.getById(this.id()).subscribe({
      next: (restaurant) => {
        if (restaurant) {
          this.restaurant.set(restaurant);
        } else {
          this.error.set('Restaurante não encontrado.');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar o restaurante.');
        this.loading.set(false);
      },
    });
  }

  // O cardápio só é buscado no primeiro clique; depois o botão apenas mostra/oculta
  toggleMenu() {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
      return;
    }

    this.menuOpen.set(true);
    this.scrollToMenu();

    if (this.categories().length || this.menuLoading()) {
      return;
    }

    this.menuLoading.set(true);
    this.menuError.set('');
    this.menuCategoryService.getMenuByRestaurant(this.id()).subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.activeCategory.set(categories[0]?.guid ?? null);
        this.menuLoading.set(false);
      },
      error: () => {
        this.menuError.set('Não foi possível carregar o cardápio.');
        this.menuLoading.set(false);
      },
    });
  }

  goToCategory(categoryGuid: string) {
    this.activeCategory.set(categoryGuid);
    document.getElementById(`category-${categoryGuid}`)?.scrollIntoView({ behavior: 'smooth' });
  }

  private scrollToMenu() {
    // Espera o @if renderizar a seção antes de rolar
    setTimeout(() => this.menuSection()?.nativeElement.scrollIntoView({ behavior: 'smooth' }));
  }
}
