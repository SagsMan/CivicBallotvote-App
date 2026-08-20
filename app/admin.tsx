import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { getStaffAccounts, getSubmissions, saveStaffAccount } from '@/lib/store';
import type { ResultSubmission, StaffAccount } from '@/constants/types';

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [submissions, setSubmissions] = useState<ResultSubmission[]>([]);
  const [staff, setStaff] = useState<StaffAccount[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [staffEmail, setStaffEmail] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    const [nextSubmissions, nextStaff] = await Promise.all([getSubmissions(), getStaffAccounts()]);
    setSubmissions(nextSubmissions);
    setStaff(nextStaff);
    setRefreshing(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const totals = useMemo(() => submissions.reduce((acc, item) => ({ apc: acc.apc + item.apc, pdp: acc.pdp + item.pdp, adc: acc.adc + item.adc, rejected: acc.rejected + item.rejected }), { apc: 0, pdp: 0, adc: 0, rejected: 0 }), [submissions]);
  const totalPapers = totals.apc + totals.pdp + totals.adc + totals.rejected;

  const generateLogin = async () => {
    if (!staffEmail.includes('@')) return Alert.alert('Email required', 'Enter a valid staff email to generate access.');
    const account: StaffAccount = { id: `STF-${Date.now().toString().slice(-6)}`, email: staffEmail.trim().toLowerCase(), name: staffEmail.split('@')[0], createdAt: new Date().toISOString(), active: true };
    await saveStaffAccount(account);
    setStaff((current) => [account, ...current]);
    setStaffEmail('');
    setShowInvite(false);
    Alert.alert('Login ID generated', `${account.id} is ready for ${account.email}. Email delivery can be connected when the mail service is enabled.`);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 30 }]} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} tintColor={colors.primary} />}>
      <View style={styles.headerRow}>
        <View><Text style={[styles.kicker, { color: colors.primary }]}>ADMIN CONSOLE</Text><Text style={[styles.title, { color: colors.foreground }]}>Results overview</Text></View>
        <Pressable onPress={() => router.replace('/')} hitSlop={12}><Feather name="log-out" size={20} color={colors.mutedForeground} /></Pressable>
      </View>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Review every staff submission and verify the totals before approval.</Text>

      <View style={styles.statsGrid}>
        <View style={[styles.stat, { backgroundColor: colors.secondary }]}><Text style={[styles.statValue, { color: colors.secondaryForeground }]}>{submissions.length}</Text><Text style={[styles.statLabel, { color: colors.secondaryForeground }]}>Submissions</Text></View>
        <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}><Text style={[styles.statValue, { color: colors.foreground }]}>{totalPapers}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Total papers</Text></View>
      </View>

      <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Calculated totals</Text><Text style={[styles.live, { color: colors.primary }]}>LIVE</Text></View>
      <View style={[styles.totalsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {[['APC', totals.apc], ['PDP', totals.pdp], ['ADC', totals.adc], ['Rejected', totals.rejected]].map(([label, value], index) => (
          <View key={String(label)} style={[styles.totalRow, index < 3 ? { borderBottomColor: colors.border, borderBottomWidth: 1 } : null]}><Text style={[styles.totalName, { color: colors.mutedForeground }]}>{label}</Text><Text style={[styles.totalNumber, { color: colors.foreground }]}>{value}</Text></View>
        ))}
      </View>

      <View style={[styles.sectionHeader, { marginTop: 29 }]}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Staff submissions</Text><Text style={[styles.count, { color: colors.mutedForeground }]}>{submissions.length} records</Text></View>
      {submissions.map((submission) => (
        <View key={submission.id} style={[styles.submission, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.submissionTop}><View style={[styles.submissionIcon, { backgroundColor: colors.secondary }]}><Feather name="file-text" size={18} color={colors.primary} /></View><View style={styles.submissionCopy}><Text style={[styles.unit, { color: colors.foreground }]}>{submission.pollingUnit}</Text><Text style={[styles.meta, { color: colors.mutedForeground }]}>{submission.id} · {submission.submittedBy}</Text></View><View style={[styles.status, { backgroundColor: submission.status === 'approved' ? colors.secondary : colors.accent }]}><Text style={[styles.statusText, { color: submission.status === 'approved' ? colors.secondaryForeground : colors.accentForeground }]}>{submission.status === 'approved' ? 'Approved' : 'Review'}</Text></View></View>
          <View style={styles.miniCounts}><Text style={[styles.mini, { color: colors.mutedForeground }]}>APC <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold' }}>{submission.apc}</Text></Text><Text style={[styles.mini, { color: colors.mutedForeground }]}>PDP <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold' }}>{submission.pdp}</Text></Text><Text style={[styles.mini, { color: colors.mutedForeground }]}>ADC <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold' }}>{submission.adc}</Text></Text><Text style={[styles.mini, { color: colors.mutedForeground }]}>Total <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold' }}>{submission.apc + submission.pdp + submission.adc + submission.rejected}</Text></Text></View>
          <View style={styles.evidenceRow}><Feather name={submission.evidenceUri ? 'paperclip' : 'alert-circle'} size={14} color={submission.evidenceUri ? colors.primary : colors.mutedForeground} /><Text style={[styles.evidenceText, { color: colors.mutedForeground }]}>{submission.evidenceUri ? 'Evidence attached' : 'No image attached'}</Text></View>
        </View>
      ))}

      <View style={[styles.sectionHeader, { marginTop: 29 }]}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Staff access</Text><Pressable onPress={() => setShowInvite((value) => !value)}><Text style={[styles.actionText, { color: colors.primary }]}>{showInvite ? 'Close' : 'Generate login'}</Text></Pressable></View>
      {showInvite ? <View style={[styles.invite, { backgroundColor: colors.card, borderColor: colors.border }]}><TextInput testID="staff-email-input" value={staffEmail} onChangeText={setStaffEmail} autoCapitalize="none" keyboardType="email-address" placeholder="staff email address" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.background }]} /><Pressable testID="generate-login" onPress={generateLogin} style={[styles.smallButton, { backgroundColor: colors.primary }]}><Text style={styles.smallButtonText}>Generate ID</Text></Pressable></View> : null}
      {staff.length === 0 ? <Text style={[styles.empty, { color: colors.mutedForeground }]}>No custom staff IDs yet. Generate one to activate an email-based staff account.</Text> : staff.map((account) => <View key={account.id} style={[styles.staffRow, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.staffAvatar, { backgroundColor: colors.secondary }]}><Feather name="user" size={17} color={colors.primary} /></View><View style={styles.staffCopy}><Text style={[styles.staffId, { color: colors.foreground }]}>{account.id}</Text><Text style={[styles.meta, { color: colors.mutedForeground }]}>{account.email}</Text></View><Text style={[styles.active, { color: colors.primary }]}>Active</Text></View>)}
      <Text style={[styles.footer, { color: colors.mutedForeground }]}>Signed in as {email || 'admin@civicballot.org'}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  kicker: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.3, marginBottom: 10 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 28, lineHeight: 34, letterSpacing: -0.7 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, marginTop: 10 },
  statsGrid: { flexDirection: 'row', gap: 10, marginTop: 25 },
  stat: { flex: 1, minHeight: 96, borderRadius: 17, padding: 15, justifyContent: 'center' },
  statValue: { fontFamily: 'Inter_700Bold', fontSize: 29 },
  statLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 27, marginBottom: 11 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  live: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.1 },
  count: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  totalsCard: { borderWidth: 1, borderRadius: 17, paddingHorizontal: 15 },
  totalRow: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalName: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  totalNumber: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  submission: { borderWidth: 1, borderRadius: 17, padding: 14, marginBottom: 10 },
  submissionTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  submissionIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  submissionCopy: { flex: 1 },
  unit: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  meta: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  status: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  statusText: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  miniCounts: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#edf2ef' },
  mini: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  evidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  evidenceText: { fontFamily: 'Inter_400Regular', fontSize: 11 },
  actionText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  invite: { borderWidth: 1, borderRadius: 17, padding: 12, flexDirection: 'row', gap: 9 },
  input: { flex: 1, height: 46, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, fontFamily: 'Inter_400Regular', fontSize: 13 },
  smallButton: { borderRadius: 12, paddingHorizontal: 13, alignItems: 'center', justifyContent: 'center' },
  smallButtonText: { color: '#ffffff', fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  empty: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18 },
  staffRow: { borderWidth: 1, borderRadius: 15, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  staffAvatar: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  staffCopy: { flex: 1 },
  staffId: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  active: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  footer: { fontFamily: 'Inter_400Regular', fontSize: 11, textAlign: 'center', marginTop: 25 },
});