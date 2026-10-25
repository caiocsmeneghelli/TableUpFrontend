import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadComponent: () => import('./home/home').then(m => m.Home)},
  {path: 'login', loadComponent: () => import('./login/login').then(m => m.Login)},
  {path: 'admin', loadComponent: () => import('./admin/admin').then(m => m.Admin), canActivate: [authGuard]},
  {path: 'menu', loadComponent: () => import('./menu/menu').then(m => m.Menu)},
  {path: 'table/:tableToken', loadComponent: () => import('./table/table').then(m => m.Table)},
  {path: 'table/:tableToken/menu', loadComponent: () => import('./table/table-menu/table-menu').then(m => m.TableMenu)},
  {path: '**', redirectTo: 'home'},
];
