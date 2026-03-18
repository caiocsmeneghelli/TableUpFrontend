import { Component } from '@angular/core';
import { DUMMY_MENU } from '../dummy-menu';

interface MenuCategory {
  idCategory: string;
  nameCategory: string;
  items: Array<{
    id: string;
    name: string;
    idCategory: string;
    nameCategory: string;
  }>;
}

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  menu = DUMMY_MENU;

  private expandedCategories = new Set<string>();

  toggleCategory(categoryId: string) {
    if (this.expandedCategories.has(categoryId)) {
      this.expandedCategories.delete(categoryId);
    } else {
      this.expandedCategories.add(categoryId);
    }
  }

  isCategoryExpanded(categoryId: string) {
    return this.expandedCategories.has(categoryId);
  }

  get categories(): MenuCategory[] {
    const map = new Map<string, MenuCategory>();

    for (const item of this.menu) {
      const existing = map.get(item.idCategory);
      if (existing) {
        existing.items.push(item);
      } else {
        map.set(item.idCategory, {
          idCategory: item.idCategory,
          nameCategory: item.nameCategory,
          items: [item],
        });
      }
    }

    return Array.from(map.values());
  }
}
