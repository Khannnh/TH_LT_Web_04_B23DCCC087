export interface DiplomaBook {
  id: string;
  year: number;
  totalDiplomas: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GraduationDecision {
  id: string;
  decisionNumber: string;
  decisionDate: Date;
  diplomaBookId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiplomaField {
  id: string;
  name: string;
  dataType: 'String' | 'Number' | 'Date';
  isRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiplomaFieldValue {
  fieldId: string;
  value: string | number | Date;
}

export interface Diploma {
  id: string;
  bookNumber: number;
  diplomaNumber: string;
  studentId: string;
  fullName: string;
  dateOfBirth: Date;
  graduationDecisionId: string;
  fields: DiplomaFieldValue[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DiplomaSearchParams {
  diplomaNumber?: string;
  bookNumber?: number;
  studentId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  graduationDecisionId?: string;
}
