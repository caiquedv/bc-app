
// Utility para normalizar texto removendo acentos e caracteres especiais
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
    .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
    .trim();
};

// Função para verificar se um texto contém outro (ignorando acentos)
export const textContains = (text: string, search: string): boolean => {
  if (!text || !search) return false;
  return normalizeText(text).includes(normalizeText(search));
};
