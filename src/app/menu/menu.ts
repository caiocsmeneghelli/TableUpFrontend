import { Component, OnInit } from '@angular/core';
import { MenuService } from './services/menu-service';
import { MenuItem, MenuCategory } from './services/menu-item-model';

// PrimeNG Components
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CategoryCardComponent } from './category-card/category-card';
import { MenuItemCardComponent } from './menu-item-card/menu-item-card';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    PanelModule,
    TagModule,
    DividerModule,
    ScrollPanelModule,
    CategoryCardComponent,
    MenuItemCardComponent
  ],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu implements OnInit {
  menuCategories: MenuCategory[] = [];
  selectedCategory: MenuCategory | null = null;

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.menuService.getMenuItens().subscribe(data => {
      console.log(data);
      this.groupItemsByCategory(data);
    });
  }

  private groupItemsByCategory(items: MenuItem[]): void {
    const categoryMap = new Map<string, MenuCategory>();
    
    items.forEach(item => {
      if (!categoryMap.has(item.categoryGuid)) {
        categoryMap.set(item.categoryGuid, {
          categoryGuid: item.categoryGuid,
          categoryName: item.categoryName,
          items: []
        });
      }
      
      categoryMap.get(item.categoryGuid)!.items.push(item);
    });
    
    this.menuCategories = Array.from(categoryMap.values());
    console.log('Categorias agrupadas:', this.menuCategories);
  }

  onCategoryClick(category: MenuCategory): void {
    this.selectedCategory = category;
    console.log('Categoria selecionada:', category);
  }

  onBackClick(): void {
    this.selectedCategory = null;
  }
}