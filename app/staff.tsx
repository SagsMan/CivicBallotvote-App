import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { saveSubmission } from '@/lib/store';
import type { ResultSubmission } from '@/constants/types';

const numberFields = [
  { key: 'apc', label: 'APC', hint: 'All Progressives Congress' },
  { key: 'pdp', label: 'PDP', hint: 'Peoples Democratic Party' },
  { key: 'adc', label: 'ADC', hint: 'African Democratic Congress' },
  { key: 'rejected', label: 'Rejected ballots', hint: 'Invalid or rejected papers' },
] as const;

export default function StaffScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { staffId } = useLocalSearchParams<{ staffId?: string }>();
  const [pollingUnit, setPollingUnit] = useState('');
  const [counts, setCounts] = useState<Record<(typeof numberFields)[number]['key'], string>>({ apc: '', pdp: '', adc: '', rejected: '' });
  const [evidenceUri, setEvidenceUri] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const total = useMemo(() => Object.values(counts).reduce((sum, value) => sum + (Number(value) || 0), 0), [counts]);

  const chooseEvidence = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to attach the signed result sheet.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 });
    if (!result.canceled) setEvidenceUri(result.assets[0].uri);
  };

  const submit = async () => {
    if (!pollingUnit.trim()) return Alert.alert('Polling unit required', 'Enter the polling unit code or name from the paper form.');
    if (total === 0) return Alert.alert('Add vote counts', 'Enter at least one numeric count before submitting.');
    const submission: ResultSubmission = {
      id: `CB-${Date.now().toString().slice(-6)}`,
      pollingUnit: pollingUnit.trim(),
      apc: Number(counts.apc) || 0,
      pdp: Number(counts.pdp) || 0,
      adc: Number(counts.adc) || 0,
      rejected: Number(counts.rejected) || 0,
      evidenceUri,
      submittedBy: staffId || 'STF-DEMO01',
      submittedAt: new Date().toISOString(),
      status: 'submitted',
    };
    await saveSubmission(submission);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={[styles.successScreen, { backgroundColor: colors.background, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <View style={[styles.successIcon, { backgroundColor: colors.secondary }]}><Feather name="check" size={32} color={colors.primary} /></View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>Result submitted</Text>
        <Text style={[styles.successCopy, { color: colors.mutedForeground }]}>The polling-unit result is now available to an administrator for review.</Text>
        <View style={[styles.receipt, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.receiptLabel, { color: colors.mutedForeground }]}>REFERENCE</Text>
          <Text style={[styles.receiptValue, { color: colors.foreground }]}>Submission saved securely</Text>
          <Text style={[styles.receiptLabel, { color: colors.mutedForeground, marginTop: 15 }]}>TOTAL PAPERS</Text>
          <Text style={[styles.receiptValue, { color: colors.foreground }]}>{total}</Text>
        </View>
        <Pressable onPress={() => router.replace('/')} style={[styles.secondaryButton, { borderColor: colors.border }]}><Text style={[styles.secondaryButtonText, { color: colors.foreground }]}>Sign out</Text></Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 28 }]} keyboardShouldPersistTaps="handled">
      <View style={styles.headerRow}>
        <View><Text style={[styles.kicker, { color: colors.primary }]}>STAFF SUBMISSION</Text><Text style={[styles.title, { color: colors.foreground }]}>Enter counted results</Text></View>
        <Pressable onPress={() => router.replace('/')} hitSlop={12}><Feather name="log-out" size={20} color={colors.mutedForeground} /></Pressable>
      </View>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Match the paper result sheet exactly. The unit can include letters, numbers, slashes, or hyphens.</Text>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.foreground }]}>Polling unit</Text>
        <TextInput testID="polling-unit-input" value={pollingUnit} onChangeText={setPollingUnit} placeholder="e.g. PU-04 / Central Primary School" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.input, color: colors.foreground }]} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}><Text style={[styles.label, { color: colors.foreground, marginBottom: 0 }]}>Party counts</Text><Text style={[styles.countHint, { color: colors.mutedForeground }]}>Numbers only</Text></View>
        <View style={[styles.countCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {numberFields.map((field, index) => (
            <View key={field.key} style={[styles.countRow, index < numberFields.length - 1 ? { borderBottomColor: colors.border, borderBottomWidth: 1 } : null]}>
              <View style={styles.countCopy}><Text style={[styles.partyLabel, { color: colors.foreground }]}>{field.label}</Text><Text style={[styles.partyHint, { color: colors.mutedForeground }]}>{field.hint}</Text></View>
              <TextInput testID={`count-${field.key}`} value={counts[field.key]} onChangeText={(value) => setCounts((current) => ({ ...current, [field.key]: value.replace(/[^0-9]/g, '') }))} keyboardType="number-pad" placeholder="0" placeholderTextColor={colors.mutedForeground} style={[styles.numberInput, { backgroundColor: colors.background, borderColor: colors.input, color: colors.foreground }]} />
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.totalBar, { backgroundColor: colors.secondary }]}><Text style={[styles.totalLabel, { color: colors.secondaryForeground }]}>Total papers</Text><Text style={[styles.totalValue, { color: colors.secondaryForeground }]}>{total}</Text></View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.foreground }]}>Signed result sheet</Text>
        <Pressable testID="upload-evidence" onPress={chooseEvidence} style={({ pressed }) => [styles.upload, { backgroundColor: colors.card, borderColor: evidenceUri ? colors.primary : colors.border, opacity: pressed ? 0.8 : 1 }]}>
          {evidenceUri ? <Image source={{ uri: evidenceUri }} style={styles.preview} /> : <View style={[styles.uploadIcon, { backgroundColor: colors.secondary }]}><Feather name="image" size={22} color={colors.primary} /></View>}
          <View style={styles.uploadCopy}><Text style={[styles.uploadTitle, { color: colors.foreground }]}>{evidenceUri ? 'Evidence attached' : 'Upload paper result'}</Text><Text style={[styles.uploadHint, { color: colors.mutedForeground }]}>{evidenceUri ? 'Tap to replace image' : 'JPG, JPEG, or PNG'}</Text></View>
          <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
        </Pressable>
      </View>

      <Pressable testID="submit-result" onPress={submit} style={({ pressed }) => [styles.button, { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 }]}><Text style={styles.buttonText}>Submit result</Text><Feather name="send" size={18} color={colors.primaryForeground} /></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  kicker: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.3, marginBottom: 10 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 28, lineHeight: 34, letterSpacing: -0.7 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, marginTop: 10 },
  section: { marginTop: 28 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 14, marginBottom: 11 },
  input: { height: 54, borderWidth: 1, borderRadius: 14, paddingHorizontal: 15, fontFamily: 'Inter_500Medium', fontSize: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 },
  countHint: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  countCard: { borderRadius: 17, borderWidth: 1, paddingHorizontal: 15 },
  countRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  countCopy: { flex: 1 },
  partyLabel: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  partyHint: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  numberInput: { width: 72, height: 44, borderWidth: 1, borderRadius: 12, textAlign: 'center', fontFamily: 'Inter_700Bold', fontSize: 18 },
  totalBar: { marginTop: 14, minHeight: 55, borderRadius: 15, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  totalValue: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  upload: { minHeight: 78, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  uploadIcon: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  preview: { width: 46, height: 46, borderRadius: 12 },
  uploadCopy: { flex: 1 },
  uploadTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  uploadHint: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 4 },
  button: { height: 56, borderRadius: 16, marginTop: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  buttonText: { color: '#ffffff', fontFamily: 'Inter_600SemiBold', fontSize: 16 },
  successScreen: { flex: 1, paddingHorizontal: 22, alignItems: 'center', justifyContent: 'center' },
  successIcon: { width: 76, height: 76, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontFamily: 'Inter_700Bold', fontSize: 28, marginTop: 24 },
  successCopy: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 310, marginTop: 10 },
  receipt: { width: '100%', borderWidth: 1, borderRadius: 17, padding: 18, marginTop: 28 },
  receiptLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.2 },
  receiptValue: { fontFamily: 'Inter_600SemiBold', fontSize: 16, marginTop: 5 },
  secondaryButton: { width: '100%', height: 54, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  secondaryButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
});