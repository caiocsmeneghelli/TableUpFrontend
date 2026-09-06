import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadComponent: () => import('./home/home').then(m => m.Home)},
  {path: 'admin', loadComponent: () => import('./login/login').then(m => m.Login)},
  {path: 'menu', loadComponent: () => import('./menu/menu').then(m => m.Menu)},
  {path: '**', redirectTo: 'home'},
];
