import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResult } from '../interfaces/auth.interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResult> {
    return this.http.post<LoginResult>(`${this.baseUrl}/login`, request);
  }
}
