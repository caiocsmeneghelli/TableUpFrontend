import { Component, OnInit } from '@angular/core';
import { MenuService } from './services/menu-service';
import { MenuItem } from './services/menu-item-model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu implements OnInit {
  menuItens: MenuItem[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.menuService.getMenuItens().subscribe(data => {
      this.menuItens = data;
      console.log(this.menuItens);
    });
  }
}