import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TableSummary } from '../interfaces/table.interfaces';

const STORAGE_KEY = 'currentTable';

@Injectable({ providedIn: 'root' })
export class TableService {
  private readonly baseUrl = `${environment.apiUrl}/api/table`;
  private current: TableSummary | null = this.readStorage();

  constructor(private http: HttpClient) {}

  // Reaproveita a mesa já carregada (memória ou sessionStorage) para evitar uma chamada extra
  // quando o cliente navega entre as telas da mesa ou recarrega a página.
  getByGuid(guid: string): Observable<TableSummary> {
    if (this.current && this.current.tableGuid.toLowerCase() === guid.toLowerCase()) {
      return of(this.current);
    }

    return this.http.get<TableSummary>(`${this.baseUrl}/${guid}`).pipe(
      tap((table) => {
        this.current = table;
        this.writeStorage(table);
      }),
    );
  }

  private readStorage(): TableSummary | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as TableSummary) : null;
    } catch {
      return null;
    }
  }

  private writeStorage(table: TableSummary) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(table));
    } catch {
      // sessionStorage indisponível (ex.: navegação privada); o cache em memória continua valendo
    }
  }
}
