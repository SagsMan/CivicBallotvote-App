export type UserRole = 'staff' | 'admin';

export const electionTypes = [
  'Presidential',
  'Governorship',
  'Senatorial',
  'House of Representatives',
  'State House of Assembly',
  'Chairmanship',
  'Councillorship',
] as const;

export type ElectionType = (typeof electionTypes)[number];

export type ResultSubmission = {
  id: string;
  electionType: ElectionType;
  pollingUnit: string;
  apc: number;
  pdp: number;
  adc: number;
  rejected: number;
  evidenceUri?: string;
  submittedBy: string;
  submittedAt: string;
  status: 'submitted' | 'approved' | 'rejected';
};

export type StaffAccount = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  active: boolean;
};