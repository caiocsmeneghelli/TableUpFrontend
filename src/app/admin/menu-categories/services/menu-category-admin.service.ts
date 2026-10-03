import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MenuCategoryAdmin, MenuCategoryAdminForm } from '../interfaces/menu-category-admin.interfaces';

interface Result {
  isSuccess: boolean;
  error: string;
  value: unknown;
}

@Injectable({ providedIn: 'root' })
export class MenuCategoryAdminService {
  private readonly baseUrl = `${environment.apiUrl}/api/menucategory`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MenuCategoryAdmin[]> {
    return this.http.get<MenuCategoryAdmin[]>(this.baseUrl);
  }

  getByRestaurant(restaurantGuid: string): Observable<MenuCategoryAdmin[]> {
    return this.http.get<MenuCategoryAdmin[]>(`${this.baseUrl}/restaurant/${restaurantGuid}`);
  }

  create(form: MenuCategoryAdminForm): Observable<Result> {
    return this.http.post<Result>(this.baseUrl, form);
  }

  update(id: string, form: MenuCategoryAdminForm): Observable<Result> {
    return this.http.put<Result>(`${this.baseUrl}/${id}`, form);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
