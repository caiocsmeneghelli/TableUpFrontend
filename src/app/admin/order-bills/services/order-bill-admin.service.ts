import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { OrderBillAdmin, OrderBillAdminAction } from '../interfaces/order-bill-admin.interfaces';

interface Result {
  isSuccess: boolean;
  error: string;
  value: unknown;
}

@Injectable({ providedIn: 'root' })
export class OrderBillAdminService {
  private readonly baseUrl = `${environment.apiUrl}/api/order-bills`;

  constructor(private http: HttpClient) {}

  getToday(): Observable<OrderBillAdmin[]> {
    return this.http.get<OrderBillAdmin[]>(`${this.baseUrl}/today`);
  }

  // close: fecha a conta; cancel: cancela; pay: confirma o pagamento de uma conta fechada
  changeStatus(guid: string, action: OrderBillAdminAction): Observable<Result> {
    return this.http.put<Result>(`${this.baseUrl}/${guid}/${action}`, {});
  }
}
