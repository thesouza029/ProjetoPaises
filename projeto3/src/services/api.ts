import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pais, RawPais, normalizarPais } from '../types/pais';

const LIST_URL = 'https://countriesnow.space/api/v0.1/countries/info?returns=flag,capital';
const ISO_URL = 'https://countriesnow.space/api/v0.1/countries/iso';

const CACHE_KEY = '@countries_app:countries_cache';

interface Tipopais {
  error: boolean;
  msg: string;
  data: RawPais[];
}

interface IsoItem {
  name: string;
  Iso2?: string;
  Iso3?: string;
}

interface IsoResponse {
  error: boolean;
  msg: string;
  data: IsoItem[];
}

async function fetchIsoMap(): Promise<Record<string, string>> {
  try {
    const response = await fetch(ISO_URL);
    if (!response.ok) return {};
    const json: IsoResponse = await response.json();
    if (json.error || !Array.isArray(json.data)) return {};

    const map: Record<string, string> = {};
    for (const item of json.data) {
      if (!item?.name || !item?.Iso2) continue;
      map[item.name.trim().toLowerCase()] = item.Iso2.trim().toLowerCase();
    }
    return map;
  } catch {
    return {};
  }
}

export async function fetchCountries(): Promise<Pais[]> {
  const [response, isoMap] = await Promise.all([fetch(LIST_URL), fetchIsoMap()]);

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

  const countries = json.data
    .filter((item) => !!item.name)
    .map((item) => {
      const iso2 = isoMap[item.name.trim().toLowerCase()];
      return normalizarPais({ ...item, iso2 });
    })
    .sort((a, b) => a.name.localeCompare(b.name));

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