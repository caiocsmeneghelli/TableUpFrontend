import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MenuItemAdmin, MenuItemAdminForm } from '../interfaces/menu-item-admin.interfaces';

interface Result {
  isSuccess: boolean;
  error: string;
  value: unknown;
}

@Injectable({ providedIn: 'root' })
export class MenuItemAdminService {
  private readonly baseUrl = `${environment.apiUrl}/api/menuitem`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MenuItemAdmin[]> {
    return this.http.get<MenuItemAdmin[]>(`${this.baseUrl}/active`);
  }

  create(form: MenuItemAdminForm): Observable<Result> {
    return this.http.post<Result>(this.baseUrl, this.toPayload(form));
  }

  update(id: string, form: MenuItemAdminForm): Observable<Result> {
    return this.http.put<Result>(`${this.baseUrl}/${id}`, this.toPayload(form));
  }

  delete(id: string): Observable<Result> {
    return this.http.delete<Result>(`${this.baseUrl}/${id}`);
  }

  // restaurantGuid só é usado no front para filtrar as categorias
  private toPayload(form: MenuItemAdminForm) {
    return {
      name: form.name,
      description: form.description,
      value: form.value,
      categoryGuid: form.categoryGuid,
    };
  }
}
