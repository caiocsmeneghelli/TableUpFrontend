import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    if (!payload.exp) {
      return true;
    }
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('token');

  if (token && !isTokenExpired(token)) {
    return true;
  }

  localStorage.removeItem('token');
  return inject(Router).parseUrl('/login');
};
