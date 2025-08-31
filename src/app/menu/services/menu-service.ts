import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem } from './menu-item-model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:5253/api/MenuItem';

  constructor(private http: HttpClient) {}

  getMenuItens(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl);
  }
}