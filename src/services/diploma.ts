import { request } from 'umi';
import type { 
  DiplomaBook, 
  GraduationDecision,
  FormField,
  Diploma,
  SearchCriteria 
} from '@/models/diploma';

const STORAGE_KEYS = {
  BOOKS: 'diploma_books',
  DECISIONS: 'graduation_decisions',
  FIELDS: 'form_fields',
  DIPLOMAS: 'diplomas',
  SEARCH_HISTORY: 'search_history'
};

// Sổ văn bằng service
export const diplomaBookService = {
  getAll: (): DiplomaBook[] => {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): DiplomaBook | undefined => {
    const books = diplomaBookService.getAll();
    return books.find(book => book.id === id);
  },

  create: (book: Omit<DiplomaBook, 'id' | 'currentSequence' | 'createdAt' | 'updatedAt'>) => {
    const books = diplomaBookService.getAll();
    const newBook: DiplomaBook = {
      ...book,
      id: Date.now().toString(),
      currentSequence: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify([...books, newBook]));
    return newBook;
  },

  update: (id: string, data: Partial<DiplomaBook>): DiplomaBook => {
    const books = diplomaBookService.getAll();
    const index = books.findIndex(book => book.id === id);
    if (index === -1) throw new Error('Book not found');

    const updatedBook = {
      ...books[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    books[index] = updatedBook;
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    return updatedBook;
  },

  delete: (id: string): void => {
    const books = diplomaBookService.getAll();
    localStorage.setItem(
      STORAGE_KEYS.BOOKS,
      JSON.stringify(books.filter(book => book.id !== id))
    );
  },

  incrementSequence: (id: string): number => {
    const book = diplomaBookService.getById(id);
    if (!book) throw new Error('Book not found');
    
    const updatedBook = diplomaBookService.update(id, {
      currentSequence: book.currentSequence + 1
    });
    return updatedBook.currentSequence;
  }
};

// Quyết định tốt nghiệp service
export const graduationDecisionService = {
  getAll: (): GraduationDecision[] => {
    const data = localStorage.getItem(STORAGE_KEYS.DECISIONS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): GraduationDecision | undefined => {
    const decisions = graduationDecisionService.getAll();
    return decisions.find(decision => decision.id === id);
  },

  create: (decision: Omit<GraduationDecision, 'id' | 'searchCount' | 'createdAt' | 'updatedAt'>) => {
    const decisions = graduationDecisionService.getAll();
    const newDecision: GraduationDecision = {
      ...decision,
      id: Date.now().toString(),
      searchCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify([...decisions, newDecision]));
    return newDecision;
  },

  update: (id: string, data: Partial<GraduationDecision>): GraduationDecision => {
    const decisions = graduationDecisionService.getAll();
    const index = decisions.findIndex(decision => decision.id === id);
    if (index === -1) throw new Error('Decision not found');

    const updatedDecision = {
      ...decisions[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    decisions[index] = updatedDecision;
    localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(decisions));
    return updatedDecision;
  },

  delete: (id: string): void => {
    const decisions = graduationDecisionService.getAll();
    localStorage.setItem(
      STORAGE_KEYS.DECISIONS,
      JSON.stringify(decisions.filter(decision => decision.id !== id))
    );
  },

  incrementSearchCount: (id: string): void => {
    const decision = graduationDecisionService.getById(id);
    if (decision) {
      graduationDecisionService.update(id, {
        searchCount: decision.searchCount + 1
      });
    }
  }
};

// Form field service
export const formFieldService = {
  getAll: (): FormField[] => {
    const data = localStorage.getItem(STORAGE_KEYS.FIELDS);
    return data ? JSON.parse(data) : [];
  },

  create: (field: Omit<FormField, 'id' | 'createdAt' | 'updatedAt'>) => {
    const fields = formFieldService.getAll();
    const newField: FormField = {
      ...field,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify([...fields, newField]));
    return newField;
  },

  update: (id: string, data: Partial<FormField>): FormField => {
    const fields = formFieldService.getAll();
    const index = fields.findIndex(field => field.id === id);
    if (index === -1) throw new Error('Field not found');

    const updatedField = {
      ...fields[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    fields[index] = updatedField;
    localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(fields));
    return updatedField;
  },

  delete: (id: string): void => {
    const fields = formFieldService.getAll();
    localStorage.setItem(
      STORAGE_KEYS.FIELDS,
      JSON.stringify(fields.filter(field => field.id !== id))
    );
  }
};
// Diploma service
export const diplomaService = {
  getAll: (): Diploma[] => {
    const data = localStorage.getItem(STORAGE_KEYS.DIPLOMAS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Diploma | undefined => {
    const diplomas = diplomaService.getAll();
    return diplomas.find(diploma => diploma.id === id);
  },
  create: async (diploma: Omit<Diploma, 'id' | 'sequenceNumber' | 'createdAt' | 'updatedAt'>) => {
    const diplomas = diplomaService.getAll();
    const book = await diplomaBookService.getById(diploma.bookId);
    if (!book) throw new Error('Book not found');

    const sequenceNumber = await diplomaBookService.incrementSequence(diploma.bookId);
    
    const newDiploma: Diploma = {
      ...diploma,
      id: Date.now().toString(),
      sequenceNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.DIPLOMAS, JSON.stringify([...diplomas, newDiploma]));
    return newDiploma;
  },

  update: (id: string, data: Partial<Diploma>): Diploma => {
    const diplomas = diplomaService.getAll();
    const index = diplomas.findIndex(diploma => diploma.id === id);
    if (index === -1) throw new Error('Diploma not found');

    const updatedDiploma = {
      ...diplomas[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    diplomas[index] = updatedDiploma;
    localStorage.setItem(STORAGE_KEYS.DIPLOMAS, JSON.stringify(diplomas));
    return updatedDiploma;
  },

  delete: (id: string): void => {
    const diplomas = diplomaService.getAll();
    localStorage.setItem(
      STORAGE_KEYS.DIPLOMAS,
      JSON.stringify(diplomas.filter(diploma => diploma.id !== id))
    );
  },

  search: (criteria: SearchCriteria): Diploma | undefined => {
    const diplomas = diplomaService.getAll();
    return diplomas.find(diploma => {
      const matches = [];
      
      if (criteria.diplomaNumber) {
        matches.push(diploma.diplomaNumber === criteria.diplomaNumber);
      }
      if (criteria.sequenceNumber) {
        matches.push(diploma.sequenceNumber.toString() === criteria.sequenceNumber);
      }
      if (criteria.studentId) {
        matches.push(diploma.studentId === criteria.studentId);
      }
      if (criteria.fullName) {
        matches.push(diploma.fullName.toLowerCase().includes(criteria.fullName.toLowerCase()));
      }
      if (criteria.birthDate) {
        matches.push(diploma.birthDate === criteria.birthDate);
      }

      return matches.filter(Boolean).length >= 2; // Yêu cầu ít nhất 2 điều kiện match
    });
  }
};