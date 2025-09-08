import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { MenuCategory } from '../services/menu-item-model';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [
    CardModule,
    TagModule
  ],
  templateUrl: './category-card.html',
  styleUrls: ['./category-card.css']
})
export class CategoryCardComponent {
  @Input() category!: MenuCategory;
  @Output() selectCategory = new EventEmitter<MenuCategory>();

  onClick(): void {
    this.selectCategory.emit(this.category);
  }
}


