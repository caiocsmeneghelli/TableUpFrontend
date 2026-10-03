import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RestaurantAdmin, RestaurantAdminForm } from '../interfaces/restaurant-admin.interfaces';

interface Result {
  isSuccess: boolean;
  error: string;
  value: unknown;
}

@Injectable({ providedIn: 'root' })
export class RestaurantAdminService {
  private readonly baseUrl = `${environment.apiUrl}/api/restaurant`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RestaurantAdmin[]> {
    return this.http.get<RestaurantAdmin[]>(`${this.baseUrl}/active`);
  }

  create(form: RestaurantAdminForm): Observable<Result> {
    return this.http.post<Result>(this.baseUrl, form);
  }

  update(id: string, form: RestaurantAdminForm): Observable<Result> {
    return this.http.put<Result>(`${this.baseUrl}/${id}`, form);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
