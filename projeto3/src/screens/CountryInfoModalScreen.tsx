import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';
import { iniciais, corAvatar } from '../utils/avatar';

type Props = NativeStackScreenProps<HomeStackParamList, 'InfoModal'>;

export default function CountryInfoModalScreen({ route, navigation }: Props) {
  const { country } = route.params;
  const [loading, setLoading] = useState(true);
  console.log('FLAG URL:', country.flag);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      // Duas chamadas reais à API, em paralelo. Cada uma falha de forma
      // independente (nunca derruba a outra nem trava o modal).

      if (!active) return;
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [country.id, country.capital]);

  const colors = corAvatar(country.name);
  const close = () => navigation.goBack();

  return (
    <View style={styles.backdrop}>
      {/* Área transparente: tocar fora do card fecha o modal, sem que a
          tela de Detalhes de trás precise ser desmontada. */}
      <TouchableOpacity style={styles.backdropTouchable} activeOpacity={1} onPress={close} />

      <View style={styles.card}>
        <View style={styles.handle} />

        <View style={styles.header}>
          {country.flag ? (
            <View style={styles.flag}>
              <SvgUri uri={country.flag} width="100%" height="100%" />
            </View>
          ) : (
            <View style={[styles.flag, { backgroundColor: colors.background }]}>
              <Text style={[styles.flagFallbackText, { color: colors.text }]}>
                {iniciais(country.name)}
              </Text>
            </View>
          )}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.name}>{country.name}</Text>
            <Text style={styles.capital}>Capital: {country.capital}</Text>
          </View>
        </View>


        <TouchableOpacity style={styles.closeButton} onPress={close}>
          <Ionicons name="close" size={16} color="#fff" />
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
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
    padding: 20,
    paddingBottom: 32,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#cbd5e1', alignSelf: 'center', marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center' },
  flag: { width: 56, height: 40, borderRadius: 6, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  flagFallbackText: { fontWeight: '800', fontSize: 13 },
  name: { fontSize: 17, fontWeight: '700', color: '#0f172a' },
  capital: { fontSize: 13, color: '#64748b', marginTop: 2 },
  infoBox: { marginTop: 18 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  infoLabel: { color: '#64748b', fontWeight: '600', fontSize: 13 },
  infoValue: { color: '#0f172a', fontWeight: '700', fontSize: 13 },
  note: { fontSize: 11, color: '#94a3b8', marginTop: 14, lineHeight: 15 },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
    backgroundColor: '#0f766e',
    paddingVertical: 12,
    borderRadius: 24,
  },
  closeButtonText: { color: '#fff', fontWeight: '700' },
});
