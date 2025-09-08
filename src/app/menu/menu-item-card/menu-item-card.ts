import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { MenuItem } from '../services/menu-item-model';

@Component({
  selector: 'app-menu-item-card',
  standalone: true,
  imports: [
    CardModule,
    DividerModule,
    TagModule
  ],
  templateUrl: './menu-item-card.html',
  styleUrls: ['./menu-item-card.css']
})
export class MenuItemCardComponent {
  @Input() item!: MenuItem;
}


