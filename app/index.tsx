import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

type Role = 'citizen' | 'staff' | 'admin';

const onboardingSlides = [
  {
    image: require('@/assets/images/onboarding-welcome.png'),
    eyebrow: 'WELCOME TO CIVICBALLOT',
    title: 'Your voice starts here.',
    copy: 'A simple, transparent way to participate in your community election.',
  },
  {
    image: require('@/assets/images/onboarding-community.png'),
    eyebrow: 'CONNECTED COMMUNITIES',
    title: 'Every community matters.',
    copy: 'Find your ward and polling unit, then take part with confidence.',
  },
  {
    image: require('@/assets/images/onboarding-teamwork.png'),
    eyebrow: 'BUILT TOGETHER',
    title: 'Better elections, together.',
    copy: 'Citizens, election staff, and administrators each have a clear role.',
  },
  {
    image: require('@/assets/images/onboarding-voting.png'),
    eyebrow: 'MADE FOR EVERYONE',
    title: 'Voting should feel clear.',
    copy: 'Follow a focused journey from voter verification to ballot submission.',
  },
  {
    image: require('@/assets/images/onboarding-ballot.png'),
    eyebrow: 'YOUR VOTE MATTERS',
    title: 'Make an informed choice.',
    copy: 'Your ballot is private, while official results remain transparent and accountable.',
  },
];

const roles: Array<{
  id: Role;
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
}> = [
  {
    id: 'citizen',
    title: 'I am a voter',
    description: 'Verify your voter registration and cast your ballot.',
    icon: 'check-square',
  },
  {
    id: 'staff',
    title: 'I am election staff',
    description: 'Report polling-unit activity and submit counted results.',
    icon: 'clipboard',
  },
  {
    id: 'admin',
    title: 'I am an administrator',
    description: 'Review reports, resolve issues, and approve final results.',
    icon: 'shield',
  },
];

export default function WelcomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<Role>('citizen');
  const [registrationId, setRegistrationId] = useState('');
  const [onboardingStep, setOnboardingStep] = useState(0);

  if (onboardingStep < onboardingSlides.length) {
    const slide = onboardingSlides[onboardingStep];
    const isLastSlide = onboardingStep === onboardingSlides.length - 1;
    return (
      <View style={[styles.onboardingScreen, { backgroundColor: colors.background }]}>
        <View style={[styles.onboardingTop, { paddingTop: insets.top + 18 }]}>
          <View style={styles.brandRow}>
            <View style={[styles.mark, { backgroundColor: colors.primary }]}>
              <Feather name="check" size={20} color={colors.primaryForeground} />
            </View>
            <Text style={[styles.brand, { color: colors.foreground }]}>CivicBallot</Text>
          </View>
          <Pressable
            testID="skip-onboarding"
            onPress={() => setOnboardingStep(onboardingSlides.length)}
            hitSlop={12}
          >
            <Text style={[styles.skip, { color: colors.mutedForeground }]}>Skip</Text>
          </Pressable>
        </View>
        <View style={styles.onboardingBody}>
          <Image source={slide.image} style={styles.onboardingImage} resizeMode="contain" />
          <Text style={[styles.onboardingEyebrow, { color: colors.primary }]}>{slide.eyebrow}</Text>
          <Text style={[styles.onboardingTitle, { color: colors.foreground }]}>{slide.title}</Text>
          <Text style={[styles.onboardingCopy, { color: colors.mutedForeground }]}>{slide.copy}</Text>
        </View>
        <View style={[styles.onboardingBottom, { paddingBottom: insets.bottom + 22 }]}>
          <View style={styles.progressRow}>
            {onboardingSlides.map((item, index) => (
              <View
                key={item.eyebrow}
                style={[
                  styles.progressDot,
                  { backgroundColor: index === onboardingStep ? colors.primary : colors.border },
                  index === onboardingStep ? styles.progressDotActive : null,
                ]}
              />
            ))}
          </View>
          <Pressable
            testID="onboarding-next"
            onPress={() => setOnboardingStep((current) => current + 1)}
            style={({ pressed }) => [
              styles.continueButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 },
            ]}
          >
            <Text style={styles.continueText}>{isLastSlide ? 'Get started' : 'Next'}</Text>
            <Feather name="arrow-right" size={19} color={colors.primaryForeground} />
          </Pressable>
        </View>
      </View>
    );
  }

  const handleContinue = () => {
    if (role === 'citizen') {
      router.push({
        pathname: '/vote',
        params: { registrationId: registrationId.trim() || 'Demo voter' },
      });
      return;
    }
    router.push({ pathname: '/role-preview', params: { role } });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 28 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          <View style={[styles.mark, { backgroundColor: colors.primary }]}>
            <Feather name="check" size={20} color={colors.primaryForeground} />
          </View>
          <Text style={[styles.brand, { color: colors.foreground }]}>
            CivicBallot
          </Text>
        </View>

        <View style={styles.hero}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>
            YOUR VOICE COUNTS
          </Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            A simple, transparent way to vote.
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Select your access type to get started. Your ballot choice stays
            private.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
            Choose how you are accessing CivicBallot
          </Text>
          <View style={styles.roleList}>
            {roles.map((item) => {
              const selected = role === item.id;
              return (
                <Pressable
                  key={item.id}
                  testID={`role-${item.id}`}
                  onPress={() => setRole(item.id)}
                  style={({ pressed }) => [
                    styles.roleCard,
                    {
                      backgroundColor: selected
                        ? colors.secondary
                        : colors.card,
                      borderColor: selected ? colors.primary : colors.border,
                      opacity: pressed ? 0.82 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.roleIcon,
                      {
                        backgroundColor: selected
                          ? colors.primary
                          : colors.muted,
                      },
                    ]}
                  >
                    <Feather
                      name={item.icon}
                      size={19}
                      color={
                        selected
                          ? colors.primaryForeground
                          : colors.mutedForeground
                      }
                    />
                  </View>
                  <View style={styles.roleCopy}>
                    <Text
                      style={[
                        styles.roleTitle,
                        { color: colors.foreground },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.roleDescription,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.radio,
                      { borderColor: selected ? colors.primary : colors.border },
                    ]}
                  >
                    {selected ? (
                      <View
                        style={[
                          styles.radioDot,
                          { backgroundColor: colors.primary },
                        ]}
                      />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {role === 'citizen' ? (
          <View style={styles.inputSection}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
              Voter registration number
            </Text>
            <TextInput
              testID="registration-id"
              value={registrationId}
              onChangeText={setRegistrationId}
              placeholder="Enter your voter ID"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="characters"
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.input,
                  color: colors.foreground,
                },
              ]}
            />
            <View style={styles.helperRow}>
              <Feather name="lock" size={13} color={colors.mutedForeground} />
              <Text style={[styles.helper, { color: colors.mutedForeground }]}>
                Only your registration number is needed to continue.
              </Text>
            </View>
          </View>
        ) : null}

        <Pressable
          testID="continue-button"
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.continueButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 },
          ]}
        >
          <Text style={styles.continueText}>Continue</Text>
          <Feather name="arrow-right" size={19} color={colors.primaryForeground} />
        </Pressable>

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>
          CivicBallot prototype • Secure participation starts here
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  onboardingScreen: { flex: 1, paddingHorizontal: 22 },
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
  screen: { flex: 1 },
  content: { paddingHorizontal: 22 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { fontFamily: 'Inter_700Bold', fontSize: 18, letterSpacing: -0.3 },
  hero: { marginTop: 48, marginBottom: 34 },
  eyebrow: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -1.2,
    maxWidth: 350,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 14,
    maxWidth: 350,
  },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginBottom: 12,
  },
  roleList: { gap: 10 },
  roleCard: {
    minHeight: 83,
    borderWidth: 1,
    borderRadius: 17,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  roleCopy: { flex: 1, paddingRight: 6 },
  roleTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  roleDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  inputSection: { marginBottom: 22 },
  input: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
  },
  helperRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginTop: 9,
  },
  helper: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  continueButton: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 2,
  },
  continueText: {
    color: '#ffffff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  footer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 20,
  },
});