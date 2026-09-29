import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@countries_app:favorites';

export async function getFavoriteIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Erro lendo favoritos do AsyncStorage', err);
    return [];
  }
}

async function saveFavoriteIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export async function isFavorite(id: string): Promise<boolean> {
  const ids = await getFavoriteIds();
  return ids.includes(id);
}


export async function addFavorite(id: string): Promise<string[]> {
  const ids = await getFavoriteIds();
  if (!ids.includes(id)) {
    ids.push(id);
    await saveFavoriteIds(ids);
  }
  return ids;
}

export async function removeFavorite(id: string): Promise<string[]> {
  const ids = await getFavoriteIds();
  const next = ids.filter((favId) => favId !== id);
  await saveFavoriteIds(next);
  return next;
}

export async function toggleFavorite(id: string): Promise<string[]> {
  const already = await isFavorite(id);
  return already ? removeFavorite(id) : addFavorite(id);
}
