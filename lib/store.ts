import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ElectionType, ResultSubmission, StaffAccount } from '@/constants/types';

const SUBMISSIONS_KEY = '@civicballot/submissions';
const STAFF_KEY = '@civicballot/staff';
const ELECTION_KEY = '@civicballot/election-type';

const starterSubmission: ResultSubmission = {
  id: 'CB-2401',
  electionType: 'Senatorial',
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

export async function updateSubmissionStatus(id: string, status: ResultSubmission['status']) {
  const current = await getSubmissions();
  await AsyncStorage.setItem(
    SUBMISSIONS_KEY,
    JSON.stringify(current.map((item) => item.id === id ? { ...item, status } : item)),
  );
}

export async function getActiveElectionType(): Promise<ElectionType> {
  const stored = await AsyncStorage.getItem(ELECTION_KEY);
  return (stored as ElectionType | null) ?? 'Senatorial';
}

export async function setActiveElectionType(type: ElectionType) {
  await AsyncStorage.setItem(ELECTION_KEY, type);
}

export async function getStaffAccounts(): Promise<StaffAccount[]> {
  const stored = await AsyncStorage.getItem(STAFF_KEY);
  return stored ? (JSON.parse(stored) as StaffAccount[]) : [];
}

export async function saveStaffAccount(account: StaffAccount) {
  const current = await getStaffAccounts();
  await AsyncStorage.setItem(STAFF_KEY, JSON.stringify([account, ...current]));
}

export async function updateStaffAccount(id: string, active: boolean) {
  const current = await getStaffAccounts();
  await AsyncStorage.setItem(STAFF_KEY, JSON.stringify(current.map((account) => account.id === id ? { ...account, active } : account)));
}