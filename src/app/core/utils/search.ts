// Normaliza para busca: sem acentos e sem diferenciar maiúsculas/minúsculas
export function normalizeSearch(text: string | null | undefined): string {
  return (text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export function matchesSearch(term: string, ...fields: (string | null | undefined)[]): boolean {
  const normalizedTerm = normalizeSearch(term);
  if (!normalizedTerm) {
    return true;
  }

  return fields.some((field) => normalizeSearch(field).includes(normalizedTerm));
}
