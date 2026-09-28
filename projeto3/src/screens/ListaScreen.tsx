import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { HomeStackParamList } from '../navigation/types';
import type { Pais } from '../types/country';
import { fetchCountries, getCachedCountries } from '../services/api';
import { iniciais, corAvatar } from '../utils/avatar';

type Props = NativeStackScreenProps<HomeStackParamList, 'Lista'>;


function normalizarText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export default function ListaScreen({ navigation }: Props) {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [loading, setLoading] = useState(true);
  const [recarre, setRecarre] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [consulta, setConsulta] = useState('');

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchCountries();
      setPaises(data);
      setOffline(false);
    } catch (err) {

      const cached = await getCachedCountries();
      if (cached && cached.length > 0) {
        setPaises(cached);
        setOffline(true);
      } else {
        setError('Não foi possível carregar os países. Verifique sua internet e tente novamente.');
      }
    } finally {
      setLoading(false);
      setRecarre(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRecarre(true);
    load();
  };



  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Carregando países...</Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={16} color="#64748b" style={{ marginRight: 8 }} />
        <TextInput
          value={consulta}
          onChangeText={setConsulta}
          placeholder="Pesquisar"
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {consulta.length > 0 && (
          <TouchableOpacity onPress={() => setConsulta('')} hitSlop={8}>
            <Ionicons name="close" size={16} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      {offline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={14} color="#92400e" />
          <Text style={styles.offlineBannerText}>
            Sem conexão — mostrando os últimos países salvos localmente
          </Text>
        </View>
      )}

      <FlatList
        data={paises.filter((c) => normalizarText(c.name).includes(normalizarText(consulta)))}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={recarre} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Nenhum país encontrado para "{consulta}".</Text>
          </View>
        }
        renderItem={({ item }) => {
          const colors = corAvatar(item.name);
          return (
            <View style={styles.card}>
              <View style={[styles.badge, { backgroundColor: colors.background }]}>
                <Text style={[styles.badgeText, { color: colors.text }]}>
                  {iniciais(item.name)}
                </Text>
              </View>
              <View style={styles.cardText}>
                <Text style={styles.name}>{item.name}</Text>

              </View>

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => navigation.navigate('Detalhes', { id: item.id })}
              >
                <Text style={styles.detailsButtonText}>Detalhes</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f9ff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: '#475569' },
  errorText: { textAlign: 'center', color: '#b91c1c', marginBottom: 16, fontSize: 15 },
  retryButton: { backgroundColor: '#2563eb', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24 },
  retryButtonText: { color: '#fff', fontWeight: '600' },
  emptyText: { color: '#64748b', textAlign: 'center' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: { flex: 1, fontSize: 15, color: '#0f172a', padding: 0 },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef3c7',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
  },
  offlineBannerText: { flex: 1, color: '#92400e', fontSize: 12 },
  listContent: { padding: 16, paddingBottom: 24, flexGrow: 1, gap: 12 },
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
