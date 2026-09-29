import { resolveFlagUrl } from '../utils/bandeira';

export interface RawPais {
  name: string;
  capital?: string;
  flag?: string;
  iso2?: string;
}

export interface Pais {
  id: string;
  name: string;
  capital: string;
  flag: string;
  iso2?: string;
}

export function normalizarPais(raw: RawPais): Pais {
  return {
    id: raw.name,
    name: raw.name,
    capital: raw.capital && raw.capital.trim().length > 0 ? raw.capital : 'Capital não informada',
    iso2: raw.iso2,
    flag: resolveFlagUrl({ iso2: raw.iso2, flag: raw.flag }),
  };
} 