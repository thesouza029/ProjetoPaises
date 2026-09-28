import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';
import { isFavorite, toggleFavorite } from '../services/favoritesStorage';

type Props = NativeStackScreenProps<HomeStackParamList, 'FavoritarModal'>;

export default function FavoritarModalScreen({ route, navigation }: Props) {
  const { id, name } = route.params;
  const [checking, setChecking] = useState(true);
  const [currentlyFavorite, setCurrentlyFavorite] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    isFavorite(id).then((value) => {
      setCurrentlyFavorite(value);
      setChecking(false);
    });
  }, [id]);

  const handleConfirm = async () => {
    setSaving(true);
    // Salva de fato no AsyncStorage ANTES de fechar o modal.
    await toggleFavorite(id);
    setSaving(false);
    navigation.goBack();
  };

  const handleCancel = () => navigation.goBack();

  return (
    <View style={styles.backdrop}>
      <TouchableOpacity style={styles.backdropTouchable} activeOpacity={1} onPress={handleCancel} />

      <View style={styles.card}>
        <View style={styles.handle} />

        {checking ? (
          <ActivityIndicator color="#1e3a8a" style={{ marginVertical: 12 }} />
        ) : (
          <>
            <Ionicons
              name={currentlyFavorite ? 'star' : 'star-outline'}
              size={28}
              color="#f59e0b"
              style={{ alignSelf: 'center', marginBottom: 8 }}
            />
            <Text style={styles.title}>
              {currentlyFavorite ? 'Remover dos favoritos?' : 'Adicionar aos favoritos?'}
            </Text>
            <Text style={styles.subtitle}>{name}</Text>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={saving}>
              <Text style={styles.confirmButtonText}>
                {saving ? 'Salvando...' : currentlyFavorite ? 'Remover' : 'Favoritar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={saving}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'flex-end' },
  backdropTouchable: { ...StyleSheet.absoluteFill },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#cbd5e1', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', color: '#0f172a', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#475569', marginTop: 6, marginBottom: 24 },
  confirmButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 12,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: { color: '#fff', fontWeight: '700' },
  cancelButton: { marginTop: 12, paddingVertical: 10 },
  cancelButtonText: { color: '#64748b' },
});
