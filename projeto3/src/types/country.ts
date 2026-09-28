
export interface RawPais {
  name: string;
  capital?: string;
  flag?: string;

}

export interface Pais {
  id: string; 
  name: string;
  capital: string;
  flag: string;
}

export function normalizarPais(raw: RawPais): Pais {
  return {
    id: raw.name,
    name: raw.name,
    capital: raw.capital && raw.capital.trim().length > 0 ? raw.capital : 'Capital não informada',
    flag: raw.flag ?? '',
  };
}
