import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export default function RolePreviewScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const isAdmin = role === 'admin';
  const title = isAdmin ? 'Administrator access' : 'Staff access';
  const copy = isAdmin
    ? 'The admin dashboard will show ward activity, reported issues, result submissions, and approval controls.'
    : 'The staff workspace will show assigned wards and polling units, plus a secure way to transfer counted results.';
  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Feather name="arrow-left" size={20} color={colors.foreground} />
        <Text style={[styles.backText, { color: colors.foreground }]}>Back</Text>
      </Pressable>
      <View style={styles.center}>
        <View style={[styles.icon, { backgroundColor: colors.secondary }]}>
          <Feather name={isAdmin ? 'shield' : 'clipboard'} size={34} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.copy, { color: colors.mutedForeground }]}>{copy}</Text>
        <View style={[styles.note, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Feather name="info" size={16} color={colors.primary} />
          <Text style={[styles.noteText, { color: colors.mutedForeground }]}>This role flow is ready for the next step.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 22 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
  icon: { width: 84, height: 84, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 28, letterSpacing: -0.8, textAlign: 'center' },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 23, textAlign: 'center', maxWidth: 320, marginTop: 12 },
  note: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 26 },
  noteText: { fontFamily: 'Inter_500Medium', fontSize: 12 },
});