import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { OrderBillDetailAdmin, OrderItemAdminAction } from '../interfaces/order-item-admin.interfaces';

interface Result {
  isSuccess: boolean;
  error: string;
  value: unknown;
}

@Injectable({ providedIn: 'root' })
export class OrderItemAdminService {
  constructor(private http: HttpClient) {}

  // A conta já traz os itens com nome, valor e status
  getOrderBill(orderBillGuid: string): Observable<OrderBillDetailAdmin> {
    return this.http.get<OrderBillDetailAdmin>(`${environment.apiUrl}/api/order-bills/${orderBillGuid}`);
  }

  changeStatus(guid: string, action: OrderItemAdminAction): Observable<Result> {
    return this.http.put<Result>(`${environment.apiUrl}/api/order-items/${guid}/${action}`, {});
  }
}
