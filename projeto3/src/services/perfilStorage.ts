import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = '@countries_app:profile';

export interface Profile {
  name: string;
  bio: string;
}

const EMPTY_PROFILE: Profile = { name: '', bio: '' };

export async function getProfile(): Promise<Profile> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    if (!raw) return EMPTY_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...EMPTY_PROFILE, ...parsed };
  } catch {
    return EMPTY_PROFILE;
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
