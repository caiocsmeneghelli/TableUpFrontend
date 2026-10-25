import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartItem } from '../interfaces/table.interfaces';

@Injectable({ providedIn: 'root' })
export class OrderBillService {
  private readonly baseUrl = `${environment.apiUrl}/api/tables`;

  constructor(private http: HttpClient) {}

  // Adiciona os itens à comanda ativa da mesa; o backend abre uma comanda nova se não houver
  addItems(tableNumber: string, restaurantGuid: string, items: CartItem[]): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/${encodeURIComponent(tableNumber)}/order-bills/items`, {
      restaurantGuid,
      items: items.map((item) => ({ menuItemGuid: item.menuItemGuid, quantity: item.quantity })),
    });
  }
}
