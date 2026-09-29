import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../navigation/types';
import type { Pais } from '../types/pais';
import { fetchCountries } from '../services/api';
import { getFavoriteIds } from '../services/favoritesStorage';
import { iniciais, corAvatar } from '../utils/avatar';

type Props = BottomTabScreenProps<MainTabParamList, 'Favoritos'>;

export default function TelaFavoritos({ navigation }: Props) {
  const [favorites, setFavorites] = useState<Pais[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const [ids, allCountries] = await Promise.all([getFavoriteIds(), fetchCountries()]);
      setFavorites(allCountries.filter((c) => ids.includes(c.id)));
    } catch (err) {
      setError('Não foi possível carregar seus favoritos agora.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarrega sempre que a aba ganha foco (ex.: depois de favoritar no modal).
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const openDetails = (id: string) => {
    // A tela de Detalhes vive na Stack de dentro da OUTRA aba ("InicioStack").
    // Como estamos "fora" dessa Stack, navegamos entre navegadores passando
    // o nome da tela de destino + seus params.
    navigation.navigate('InicioStack', { screen: 'Detalhes', params: { id } });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={load}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="star-outline" size={40} color="#cbd5e1" style={{ marginBottom: 10 }} />
        <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
        <Text style={styles.emptySubtitle}>
          Abra um país na aba Início e toque em "Adicionar aos favoritos" para ele aparecer aqui.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => {
        const colors = corAvatar(item.name);
        return (
          <View style={styles.card}>
            <View style={[styles.badge, { backgroundColor: colors.background }]}>
              <Text style={[styles.badgeText, { color: colors.text }]}>{iniciais(item.name)}</Text>
            </View>
            <View style={styles.cardText}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.capital}>Capital: {item.capital}</Text>
            </View>
            <TouchableOpacity style={styles.detailsButton} onPress={() => openDetails(item.id)}>
              <Text style={styles.detailsButtonText}>Detalhes</Text>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { textAlign: 'center', color: '#b91c1c', marginBottom: 16 },
  retryButton: { backgroundColor: '#2563eb', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24 },
  retryButtonText: { color: '#fff', fontWeight: '600' },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#0f172a', marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 18 },
  listContent: { padding: 16, gap: 12, backgroundColor: '#f8fafc', flexGrow: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
  },
  badge: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontWeight: '800', fontSize: 15 },
  cardText: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  capital: { fontSize: 13, color: '#64748b', marginTop: 2 },
  detailsButton: { backgroundColor: '#006823', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24 },
  detailsButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
