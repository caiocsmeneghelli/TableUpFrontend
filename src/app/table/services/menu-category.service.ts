import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuCategoryWithItems } from '../interfaces/table.interfaces';

@Injectable({ providedIn: 'root' })
export class MenuCategoryService {
  private readonly baseUrl = `${environment.apiUrl}/api/menucategory`;

  constructor(private http: HttpClient) {}

  getMenuByRestaurant(restaurantGuid: string): Observable<MenuCategoryWithItems[]> {
    return this.http.get<MenuCategoryWithItems[]>(`${this.baseUrl}/restaurant/${restaurantGuid}/menu`);
  }
}
