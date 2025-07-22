
export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  examType: string;
  grade: number | null;
  coefficient: number;
  date: string;
  isLocked: boolean;
  isValidated: boolean;
  errors: string[];
}

export interface ValidationStats {
  total: number;
  validated: number;
  withErrors: number;
  missing: number;
}
