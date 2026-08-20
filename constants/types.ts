export type UserRole = 'staff' | 'admin';

export type ResultSubmission = {
  id: string;
  pollingUnit: string;
  apc: number;
  pdp: number;
  adc: number;
  rejected: number;
  evidenceUri?: string;
  submittedBy: string;
  submittedAt: string;
  status: 'submitted' | 'approved';
};

export type StaffAccount = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  active: boolean;
};