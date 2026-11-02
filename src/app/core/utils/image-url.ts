import { environment } from '../../../environments/environment';

// A API devolve a URL relativa em dev (/images/...) e pode devolver absoluta em prd
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) {
    return '';
  }

  return /^https?:\/\//i.test(url) ? url : `${environment.apiUrl}${url}`;
}
