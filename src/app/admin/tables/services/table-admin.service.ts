import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TableAdmin, TableAdminCreateForm, TableAdminEditForm } from '../interfaces/table-admin.interfaces';

interface Result {
  isSuccess: boolean;
  error: string;
  value: unknown;
}

@Injectable({ providedIn: 'root' })
export class TableAdminService {
  private readonly baseUrl = `${environment.apiUrl}/api/table`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TableAdmin[]> {
    return this.http.get<TableAdmin[]>(this.baseUrl);
  }

  create(form: TableAdminCreateForm): Observable<Result> {
    return this.http.post<Result>(this.baseUrl, form);
  }

  update(id: string, form: TableAdminEditForm): Observable<Result> {
    return this.http.put<Result>(`${this.baseUrl}/${id}`, form);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
