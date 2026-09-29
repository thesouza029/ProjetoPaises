import React, { useCallback, useState } from 'react';
import { View,Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getProfile, saveProfile, Profile } from '../services/perfilStorage';
import { getFavoriteIds } from '../services/favoritesStorage';

export default function TelaPerfil() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const [profile, favoriteIds] = await Promise.all([getProfile(), getFavoriteIds()]);
        if (!active) return;
        setName(profile.name);
        setBio(profile.bio);
        setFavoritesCount(favoriteIds.length);
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const handleSave = async () => {
    setSaving(true);
    setSavedFeedback(false);
    const profile: Profile = { name: name.trim(), bio: bio.trim() };
    await saveProfile(profile);
    setSaving(false);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const initial = name.trim().length > 0 ? name.trim()[0].toUpperCase() : '?';

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        <View style={styles.statBadge}>
          <Text style={styles.statNumber}>{favoritesCount}</Text>
          <Text style={styles.statLabel}>
            {favoritesCount === 1 ? 'país favoritado' : 'países favoritados'}
          </Text>
        </View>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Como podemos te chamar?"
          placeholderTextColor="#94a3b8"
          style={styles.input}
        />

        <Text style={styles.label}>Sobre você</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Ex.: apaixonado(a) por geografia e viagens"
          placeholderTextColor="#94a3b8"
          style={[styles.input, styles.inputMultiline]}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? 'Salvando...' : 'Salvar perfil'}</Text>
        </TouchableOpacity>

        {savedFeedback && (
          <View style={styles.savedRow}>
            <Ionicons name="checkmark-circle" size={16} color="#15803d" />
            <Text style={styles.savedText}>Perfil salvo localmente</Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#1e3a8a',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '700' },
  statBadge: { alignItems: 'center', marginTop: 12, marginBottom: 20 },
  statNumber: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  statLabel: { fontSize: 12, color: '#64748b' },
  label: { alignSelf: 'flex-start', fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6, marginTop: 12 },
  input: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f172a',
  },
  inputMultiline: { height: 80, textAlignVertical: 'top' },
  saveButton: {
    marginTop: 24,
    backgroundColor: '#1e3a8a',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: '700' },
  savedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  savedText: { color: '#15803d', fontWeight: '600' },
});
