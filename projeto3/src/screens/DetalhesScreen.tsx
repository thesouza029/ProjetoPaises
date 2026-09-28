import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import type { HomeStackParamList, MainTabParamList } from '../navigation/types';
import type { Pais } from '../types/country';
import { fetchCountries } from '../services/api';
import { isFavorite } from '../services/favoritesStorage';
import { iniciais, corAvatar } from '../utils/avatar';
import { SvgUri } from 'react-native-svg';

type Props = NativeStackScreenProps<HomeStackParamList, 'Detalhes'>;

type IoniconName = keyof typeof Ionicons.glyphMap;

function aleatorio(all: Pais[], currentId: string): Pais | null {
  const others = all.filter((c) => c.id !== currentId);
  if (others.length === 0) return null;
  return others[Math.floor(Math.random() * others.length)];
}

// Botão em formato de pílula com ícone (sem emoji) + texto.
function PillButton({
  icon,
  label,
  onPress,
  variant = 'neutral',
}: {
  icon: IoniconName;
  label: string;
  onPress: () => void;
  variant?: 'favorite' | 'neutral';
}) {
  const isFavoriteVariant = variant === 'favorite';
  return (
    <TouchableOpacity
      style={[styles.pill, isFavoriteVariant ? styles.pillFavorite : styles.pillNeutral]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={18} color={isFavoriteVariant ? '#92400e' : '#3730a3'} />
      <Text style={[styles.pillText, { color: isFavoriteVariant ? '#92400e' : '#3730a3' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function DetalhesScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [country, setCountry] = useState<Pais | null>(null);
  const [related, setRelated] = useState<Pais | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorite, setFavorite] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      // Reaproveita a mesma lista para achar o país atual e sortear
      // "o item relacionado" que o botão de baixo vai empilhar com push().
      const all = await fetchCountries();
      const found = all.find((c) => c.id === id);
      if (!found) {
        setError('País não encontrado.');
      } else {
        setCountry(found);
        setRelated((prev) => prev ?? aleatorio(all, id));
        // Título do header passa a ser o nome do país.
        navigation.setOptions({ title: found.name });
      }
    } catch (err) {
      setError('Não foi possível carregar os detalhes deste país.');
    } finally {
      setLoading(false);
    }
  }, [id, navigation]);

  useEffect(() => {
    load();
  }, [load]);

  // Reconsulta o status de favorito toda vez que a tela ganha foco de novo
  // (ex.: ao voltar do modal de confirmação).
  useFocusEffect(
    useCallback(() => {
      isFavorite(id).then(setFavorite);
    }, [id])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error || !country) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? 'País não encontrado.'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={load}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const colors = corAvatar(country.name);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {country.flag ? (
        <View style={styles.flagImage}>
          <SvgUri uri={country.flag} width="100%" height="100%" />
        </View>
      ) : (
        <View style={[styles.badge, { backgroundColor: colors.background }]}>
          <Text style={[styles.badgeText, { color: colors.text }]}>{iniciais(country.name)}</Text>
        </View>
      )}

      <Text style={styles.name}>{country.name}</Text>
      <Text style={styles.capital}>Capital: {country.capital}</Text>

      {/* MODAL — abre FavoritarModal por cima da tela atual (presentation:
          'transparentModal') para confirmar a ação antes de salvar no
          AsyncStorage. */}
      <PillButton
        icon={favorite ? 'star' : 'star-outline'}
        label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        variant="favorite"
        onPress={() => navigation.navigate('FavoritarModal', { id: country.id, name: country.name })}
      />

      {/* PUSH() — sempre empilha uma tela NOVA de Detalhes, mesmo que aquele
          país já tenha aparecido antes na pilha. É assim que criamos uma
          trilha "país A -> item relacionado -> item relacionado -> ...":
          cada toque aqui soma mais uma tela por cima. */}
      {related && (
        <PillButton
          icon="shuffle-outline"
          label="Ver item relacionado"
          onPress={() => navigation.push('Detalhes', { id: related.id })}
        />
      )}

      {/* NAVIGATE() — "Lista" já existe no fundo da pilha (é a tela raiz da
          Stack). Chamar navigate('Lista') não empilha nada novo: o React
          Navigation percebe que a rota já existe e DESEMPILHA tudo que tem
          por cima dela de uma vez só — diferente do "←" do header, que
          desempilha só um nível por vez. */}
      <PillButton icon="home-outline" label="Voltar para a lista" onPress={() => navigation.navigate('Lista')} />

      <View style={styles.extrasBox}>
        <Text style={styles.extrasTitle}>Mais opções</Text>

        {/* Mais um exemplo de NAVIGATE(): abre o modal de informações,
            também reaproveitando a rota se ela já estiver no topo. */}
        <TouchableOpacity
          style={styles.extraButton}
          onPress={() => navigation.navigate('InfoModal', { country })}
        >
          <Ionicons name="information-circle-outline" size={16} color="#0f766e" />
          <Text style={styles.extraButtonText}>Mais informações</Text>
        </TouchableOpacity>

        {/* getParent() — bônus: sai da Stack e fala direto com o Tab
            Navigator "avô", trocando de aba sem usar goBack(). */}
        <TouchableOpacity
          style={styles.extraButton}
          onPress={() =>
            navigation.getParent<BottomTabNavigationProp<MainTabParamList>>()?.navigate('Favoritos')
          }
        >
          <Ionicons name="arrow-redo-outline" size={16} color="#0f766e" />
          <Text style={styles.extraButtonText}>Ir direto para Favoritos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, alignItems: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { textAlign: 'center', color: '#b91c1c', marginBottom: 16 },
  retryButton: { backgroundColor: '#2563eb', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24 },
  retryButtonText: { color: '#fff', fontWeight: '600' },
  badge: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  badgeText: { fontWeight: '800', fontSize: 30 },
  flagImage: { width: 110, height: 72, borderRadius: 10, marginTop: 12, resizeMode: 'cover' },
  name: { fontSize: 24, fontWeight: '700', color: '#0f172a', marginTop: 18 },
  capital: { fontSize: 15, color: '#06080a', marginTop: 4, marginBottom: 24 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    borderRadius: 24,
    paddingVertical: 14,
    marginBottom: 12,
  },
  pillFavorite: { backgroundColor: '#fef3c7' },
  pillNeutral: { backgroundColor: '#eef2ff' },
  pillText: { fontWeight: '700', fontSize: 15 },
  extrasBox: { width: '100%', marginTop: 16, padding: 16, borderRadius: 14, backgroundColor: '#f1f5f9' },
  extrasTitle: { fontWeight: '700', color: '#0f172a', marginBottom: 10, fontSize: 13 },
  extraButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
  extraButtonText: { color: '#0f766e', fontWeight: '600', fontSize: 13 },
});
