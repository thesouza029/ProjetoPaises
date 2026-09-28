import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pais, RawPais, normalizarPais } from '../types/country';

const LIST_URL = 'https://countriesnow.space/api/v0.1/countries/info?returns=flag,capital';
const CITY_POPULATION_URL = 'https://countriesnow.space/api/v0.1/countries/population/cities';

const CACHE_KEY = '@countries_app:countries_cache';

interface Tipopais {
  error: boolean;
  msg: string;
  data: RawPais[];
}

export async function fetchCountries(): Promise<Pais[]> {
  const response = await fetch(LIST_URL);

  if (!response.ok) {
    throw new Error(`Falha ao buscar países (status ${response.status})`);
  }

  const json: Tipopais = await response.json();

  if (json.error) {
    throw new Error(json.msg || 'A API retornou um erro.');
  }

  if (!Array.isArray(json.data)) {
    throw new Error('Resposta da API em formato inesperado.');
  }
  //tratar
  const countries = json.data
    .filter((item) => !!item.name)
    .map(normalizarPais)
    .sort((a, b) => a.name.localeCompare(b.name));

 
  // Salva aqui o cache
  AsyncStorage.setItem(CACHE_KEY, JSON.stringify(countries)).catch(() => {});

  return countries;
}


export async function getCachedCountries(): Promise<Pais[] | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}





