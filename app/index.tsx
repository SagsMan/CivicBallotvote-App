import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

type Role = 'staff' | 'admin';

export default function AccessScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<Role>('staff');
  const [busy, setBusy] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const onboardingSlides = [
    { image: require('@/assets/images/onboarding-welcome.png'), eyebrow: 'WELCOME TO CIVICBALLOT', title: 'Your work starts here.', copy: 'A clear, accountable workspace for election staff and administrators.' },
    { image: require('@/assets/images/onboarding-community.png'), eyebrow: 'CONNECTED COMMUNITIES', title: 'Every polling unit matters.', copy: 'Capture the unit exactly as it appears on the official paper result sheet.' },
    { image: require('@/assets/images/onboarding-teamwork.png'), eyebrow: 'BUILT TOGETHER', title: 'Work with confidence.', copy: 'Staff submit counted results while administrators review the full picture.' },
    { image: require('@/assets/images/onboarding-voting.png'), eyebrow: 'MADE FOR OFFICIALS', title: 'Results stay clear.', copy: 'Use numeric party counts and attach the signed result sheet as evidence.' },
    { image: require('@/assets/images/onboarding-ballot.png'), eyebrow: 'ACCOUNTABILITY FIRST', title: 'Keep every detail.', copy: 'Each submission is recorded with its polling unit, staff ID, totals, and evidence.' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const continueToRole = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      router.push({ pathname: role === 'staff' ? '/staff' : '/admin', params: { staffId: role === 'staff' ? 'STF-DEMO01' : 'admin' } });
    }, 250);
  };

  if (showSplash) {
    return (
      <View style={[styles.splashScreen, { backgroundColor: '#ffffff' }]}>
        <Image source={require('@/assets/images/inec-splash.jpeg')} style={styles.splashImage} resizeMode="contain" />
      </View>
    );
  }

  if (onboardingStep < onboardingSlides.length) {
    const slide = onboardingSlides[onboardingStep];
    const isLast = onboardingStep === onboardingSlides.length - 1;
    return (
      <View style={[styles.onboardingScreen, { backgroundColor: colors.background }]}>
        <View style={[styles.onboardingTop, { paddingTop: insets.top + 18 }]}>
          <View style={styles.brandRow}><View style={[styles.mark, { backgroundColor: colors.primary }]}><Feather name="check" size={19} color={colors.primaryForeground} /></View><Text style={[styles.brand, { color: colors.foreground }]}>CivicBallot</Text></View>
          <Pressable onPress={() => setOnboardingStep(onboardingSlides.length)} hitSlop={12}><Text style={[styles.skip, { color: colors.mutedForeground }]}>Skip</Text></Pressable>
        </View>
        <View style={styles.onboardingBody}>
          <Image source={slide.image} style={styles.onboardingImage} resizeMode="contain" />
          <Text style={[styles.onboardingEyebrow, { color: colors.primary }]}>{slide.eyebrow}</Text>
          <Text style={[styles.onboardingTitle, { color: colors.foreground }]}>{slide.title}</Text>
          <Text style={[styles.onboardingCopy, { color: colors.mutedForeground }]}>{slide.copy}</Text>
        </View>
        <View style={[styles.onboardingBottom, { paddingBottom: insets.bottom + 22 }]}>
          <View style={styles.progressRow}>{onboardingSlides.map((item, index) => <View key={item.eyebrow} style={[styles.progressDot, { backgroundColor: index === onboardingStep ? colors.primary : colors.border }, index === onboardingStep ? styles.progressDotActive : null]} />)}</View>
          <Pressable onPress={() => setOnboardingStep((current) => current + 1)} style={({ pressed }) => [styles.button, { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 }]}><Text style={styles.buttonText}>{isLast ? 'Get started' : 'Next'}</Text><Feather name="arrow-right" size={19} color={colors.primaryForeground} /></Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top + 26, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.brandRow}>
        <View style={[styles.mark, { backgroundColor: colors.primary }]}>
          <Feather name="check" size={19} color={colors.primaryForeground} />
        </View>
        <Text style={[styles.brand, { color: colors.foreground }]}>CivicBallot</Text>
      </View>

      <View style={styles.hero}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>AUTHORIZED ACCESS</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Keep every result accountable.</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Sign in as election staff to submit a polling-unit result, or as an administrator to review submissions.
        </Text>
      </View>

      <Text style={[styles.label, { color: colors.foreground }]}>I am signing in as</Text>
      <View style={styles.roleRow}>
        {(['staff', 'admin'] as Role[]).map((item) => {
          const selected = item === role;
          return (
            <Pressable
              key={item}
              testID={`role-${item}`}
              onPress={() => setRole(item)}
              style={({ pressed }) => [
                styles.roleCard,
                {
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: selected ? colors.secondary : colors.card,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Feather name={item === 'staff' ? 'clipboard' : 'shield'} size={22} color={selected ? colors.primary : colors.mutedForeground} />
              <Text style={[styles.roleTitle, { color: selected ? colors.secondaryForeground : colors.foreground }]}>
                {item === 'staff' ? 'Election staff' : 'Administrator'}
              </Text>
              {selected ? <Feather name="check-circle" size={17} color={colors.primary} /> : null}
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.formNotice, { backgroundColor: colors.secondary }]}>
        <Feather name={role === 'staff' ? 'key' : 'shield'} size={18} color={colors.primary} />
        <View style={styles.formNoticeCopy}>
          <Text style={[styles.formNoticeTitle, { color: colors.secondaryForeground }]}>{role === 'staff' ? 'Staff login ID required' : 'Administrator access'}</Text>
          <Text style={[styles.formNoticeText, { color: colors.mutedForeground }]}>{role === 'staff' ? 'Use the ID generated for you by an administrator.' : 'Admin access opens the results and staff management workspace.'}</Text>
        </View>
      </View>

      <Pressable
        testID="continue-button"
        onPress={continueToRole}
        style={({ pressed }) => [styles.button, { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 }]}
      >
        {busy ? <ActivityIndicator color={colors.primaryForeground} /> : <><Text style={styles.buttonText}>Continue securely</Text><Feather name="arrow-right" size={19} color={colors.primaryForeground} /></>}
      </Pressable>

      <View style={[styles.notice, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="lock" size={15} color={colors.primary} />
        <Text style={[styles.noticeText, { color: colors.mutedForeground }]}>Staff can only submit. Admins can review and approve.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 22 },
  onboardingScreen: { flex: 1, paddingHorizontal: 22 },
  splashScreen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  splashImage: { width: '100%', height: '100%' },
  onboardingTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  skip: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  onboardingBody: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 10 },
  onboardingImage: { width: '100%', height: 300, marginBottom: 18 },
  onboardingEyebrow: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.3, marginBottom: 12, textAlign: 'center' },
  onboardingTitle: { fontFamily: 'Inter_700Bold', fontSize: 31, lineHeight: 37, letterSpacing: -1, textAlign: 'center' },
  onboardingCopy: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 23, textAlign: 'center', maxWidth: 330, marginTop: 12 },
  onboardingBottom: {},
  progressRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 18 },
  progressDot: { height: 6, width: 6, borderRadius: 3 },
  progressDotActive: { width: 24 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  mark: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  brand: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  hero: { marginTop: 58, marginBottom: 34 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.3, marginBottom: 12 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 34, lineHeight: 40, letterSpacing: -1.1 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 23, marginTop: 14 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 14, marginBottom: 11 },
  roleRow: { gap: 10 },
  roleCard: { minHeight: 60, borderWidth: 1.5, borderRadius: 16, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 11 },
  roleTitle: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  formNotice: { marginTop: 28, borderRadius: 16, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 11 },
  formNoticeCopy: { flex: 1 },
  formNoticeTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  formNoticeText: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17, marginTop: 4 },
  button: { height: 56, borderRadius: 16, marginTop: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  buttonText: { color: '#ffffff', fontFamily: 'Inter_600SemiBold', fontSize: 16 },
  notice: { borderWidth: 1, borderRadius: 14, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 17 },
  noticeText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17 },
});