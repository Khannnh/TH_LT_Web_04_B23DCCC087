
export interface DiplomaBook {
    id: string;
    year: number;
    name: string;
    currentSequence: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface GraduationDecision {
    id: string;
    decisionNumber: string; 
    issueDate: string;
    summary: string;
    bookId: string;
    searchCount: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface FormField {
    id: string;
    name: string;
    displayName: string;
    dataType: 'string' | 'number' | 'date';
    isRequired: boolean;
    orderIndex: number;
  }
  
  export interface Diploma {
    id: string;
    bookId: string;
    decisionId: string;
    sequenceNumber: number;
    diplomaNumber: string;
    studentId: string;
    fullName: string;
    birthDate: string;
    fieldValues: {
      [fieldId: string]: string | number | Date;
    };
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SearchCriteria {
    diplomaNumber?: string;
    sequenceNumber?: string;
    studentId?: string;
    fullName?: string;
    birthDate?: string;
  }