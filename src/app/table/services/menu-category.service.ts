import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuCategory } from '../interfaces/table.interfaces';

@Injectable({ providedIn: 'root' })
export class MenuCategoryService {
  private readonly baseUrl = `${environment.apiUrl}/api/menucategory`;

  constructor(private http: HttpClient) {}

  getByRestaurant(restaurantGuid: string): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(`${this.baseUrl}/restaurant/${restaurantGuid}`);
  }
}
