import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ResultSubmission, StaffAccount } from '@/constants/types';

const SUBMISSIONS_KEY = '@civicballot/submissions';
const STAFF_KEY = '@civicballot/staff';

const starterSubmission: ResultSubmission = {
  id: 'CB-2401',
  pollingUnit: 'PU-04 / Central Primary School',
  apc: 218,
  pdp: 176,
  adc: 42,
  rejected: 6,
  submittedBy: 'Amina Yusuf',
  submittedAt: '2026-08-20T08:40:00.000Z',
  status: 'submitted',
};

export async function getSubmissions(): Promise<ResultSubmission[]> {
  const stored = await AsyncStorage.getItem(SUBMISSIONS_KEY);
  if (stored) return JSON.parse(stored) as ResultSubmission[];
  const seeded = [starterSubmission];
  await AsyncStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(seeded));
  return seeded;
}

export async function saveSubmission(submission: ResultSubmission) {
  const current = await getSubmissions();
  await AsyncStorage.setItem(
    SUBMISSIONS_KEY,
    JSON.stringify([submission, ...current]),
  );
}

export async function getStaffAccounts(): Promise<StaffAccount[]> {
  const stored = await AsyncStorage.getItem(STAFF_KEY);
  return stored ? (JSON.parse(stored) as StaffAccount[]) : [];
}

export async function saveStaffAccount(account: StaffAccount) {
  const current = await getStaffAccounts();
  await AsyncStorage.setItem(STAFF_KEY, JSON.stringify([account, ...current]));
}