import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const parties = [
  { id: 'apc', name: 'APC', fullName: 'All Progressives Congress', tone: '#14804d' },
  { id: 'pdp', name: 'PDP', fullName: 'Peoples Democratic Party', tone: '#1d5eaa' },
  { id: 'adc', name: 'ADC', fullName: 'African Democratic Congress', tone: '#b57b21' },
];

export default function VoteScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { registrationId } = useLocalSearchParams<{ registrationId?: string }>();
  const [selected, setSelected] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 28 },
      ]}
    >
      <Pressable testID="back-button" onPress={() => router.back()} style={styles.back}>
        <Feather name="arrow-left" size={20} color={colors.foreground} />
        <Text style={[styles.backText, { color: colors.foreground }]}>Back</Text>
      </Pressable>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>CITIZEN ACCESS</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Make your choice</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        Registration: {registrationId || 'Demo voter'}
      </Text>
      <View style={[styles.location, { backgroundColor: colors.secondary }]}>
        <Feather name="map-pin" size={18} color={colors.primary} />
        <View>
          <Text style={[styles.locationLabel, { color: colors.mutedForeground }]}>POLLING UNIT</Text>
          <Text style={[styles.locationValue, { color: colors.foreground }]}>Ward 04 • Central Primary School</Text>
        </View>
      </View>
      {submitted ? (
        <View style={[styles.success, { backgroundColor: colors.secondary }]}>
          <View style={[styles.successIcon, { backgroundColor: colors.primary }]}>
            <Feather name="check" size={24} color={colors.primaryForeground} />
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>Ballot recorded</Text>
          <Text style={[styles.successCopy, { color: colors.mutedForeground }]}>
            Your vote has been submitted privately. An official result notification will appear in your inbox after approval.
          </Text>
        </View>
      ) : (
        <>
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Select one party</Text>
          <View style={styles.partyList}>
            {parties.map((party) => {
              const isSelected = selected === party.id;
              return (
                <Pressable
                  key={party.id}
                  testID={`party-${party.id}`}
                  onPress={() => setSelected(party.id)}
                  style={({ pressed }) => [
                    styles.party,
                    {
                      backgroundColor: colors.card,
                      borderColor: isSelected ? party.tone : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      opacity: pressed ? 0.82 : 1,
                    },
                  ]}
                >
                  <View style={[styles.partyBadge, { backgroundColor: party.tone }]}>
                    <Text style={styles.partyBadgeText}>{party.name[0]}</Text>
                  </View>
                  <View style={styles.partyCopy}>
                    <Text style={[styles.partyName, { color: colors.foreground }]}>{party.name}</Text>
                    <Text style={[styles.partyFullName, { color: colors.mutedForeground }]}>{party.fullName}</Text>
                  </View>
                  <View style={[styles.radio, { borderColor: isSelected ? party.tone : colors.border }]}>
                    {isSelected ? <View style={[styles.radioDot, { backgroundColor: party.tone }]} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
          <Pressable
            testID="submit-vote"
            disabled={!selected}
            onPress={() => setSubmitted(true)}
            style={({ pressed }) => [
              styles.submit,
              {
                backgroundColor: selected ? colors.primary : colors.muted,
                opacity: pressed ? 0.82 : 1,
              },
            ]}
          >
            <Text style={[styles.submitText, { color: selected ? colors.primaryForeground : colors.mutedForeground }]}>Submit ballot</Text>
            <Feather name="check-circle" size={19} color={selected ? colors.primaryForeground : colors.mutedForeground} />
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 42 },
  backText: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.4, marginBottom: 12 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 32, letterSpacing: -1, lineHeight: 38 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 9 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 15, marginTop: 28, marginBottom: 30 },
  locationLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1, marginBottom: 4 },
  locationValue: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  sectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 15, marginBottom: 12 },
  partyList: { gap: 10 },
  party: { minHeight: 79, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center' },
  partyBadge: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  partyBadgeText: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 18 },
  partyCopy: { flex: 1 },
  partyName: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  partyFullName: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 4 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  submit: { height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 28 },
  submitText: { fontFamily: 'Inter_600SemiBold', fontSize: 16 },
  success: { marginTop: 36, padding: 24, borderRadius: 20, alignItems: 'center' },
  successIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successTitle: { fontFamily: 'Inter_700Bold', fontSize: 21 },
  successCopy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 10 },
});