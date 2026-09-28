import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SobreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre este app</Text>
      <Text style={styles.text}>
        Trabalho prático de Arquitetura de Aplicativos Móveis (IFSP) — contexto "Países do
        mundo".{'\n\n'}
        Consome a API pública CountriesNow (sem necessidade de chave), navega com Drawer + Tab +
        Stack + Modal, tem busca, cache offline e guarda os favoritos e o perfil localmente com
        AsyncStorage.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  text: { fontSize: 14, color: '#475569', lineHeight: 21 },
});
