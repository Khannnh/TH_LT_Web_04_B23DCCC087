import { request } from 'umi';
import type { 
  DiplomaBook, 
  GraduationDecision,
  FormField,
  Diploma,
  SearchCriteria 
} from '@/models/diploma'; //gọi lại các interface

const STORAGE_KEYS = {
  BOOKS: 'diploma_books',
  DECISIONS: 'graduation_decisions',
  FIELDS: 'form_fields',
  DIPLOMAS: 'diplomas',
  SEARCH_HISTORY: 'search_history'
};

// Sổ văn bằng service
export const diplomaBookService = {
  getAll: (): DiplomaBook[] => {    //Interface DiplomaBook
    const data = localStorage.getItem(STORAGE_KEYS.BOOKS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): DiplomaBook | undefined => {
    const books = diplomaBookService.getAll();
    return books.find(book => book.id === id);
  },

  create: (book: Omit<DiplomaBook, 'id' | 'currentSequence' | 'createdAt' | 'updatedAt'>) => {
    const books = diplomaBookService.getAll();

    // Kiểm tra trùng tên sổ
    const isDuplicateName = books.some(existingBook => existingBook.name === book.name);
    if (isDuplicateName) {
      throw new Error('Tên sổ đã tồn tại');
    }

    // Kiểm tra trùng năm
    const isDuplicateYear = books.some(existingBook => existingBook.year === book.year);
    if (isDuplicateYear) {
      throw new Error('Năm của sổ đã tồn tại');
    }

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
  getAll: (): GraduationDecision[] => {       //Interface GraduationDecision
    const data = localStorage.getItem(STORAGE_KEYS.DECISIONS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): GraduationDecision | undefined => {
    const decisions = graduationDecisionService.getAll();
    return decisions.find(decision => decision.id === id);
  },

  create: (decision: Omit<GraduationDecision, 'id' | 'createdAt' 
    | 'updatedAt' | 'decisionNumber' | 'summary' | 'issueDate'> & {
    bookId: string;
    decisionNumber: string;
    summary: string;
    issueDate: string;

  }) => {
    const decisions = graduationDecisionService.getAll();
    const books = diplomaBookService.getAll();
    const book = books.find(b => b.id === decision.bookId);
    if (!book) throw new Error('Sổ văn bằng không tồn tại');

  // Lưu trữ năm của sổ văn bằng trong quyết định
  const bookYear = book.year;

   // Dùng giá trị decisionNumber từ người dùng
   const formattedDecisionNumber = `QĐ-${book.year}-${decision.decisionNumber}`;
    
  const newSequence = book.currentSequence ;
  book.currentSequence = newSequence;
  diplomaBookService.update(book.id, { currentSequence: newSequence });
    
    const newDecision: GraduationDecision = {   
      ...decision,
      id: Date.now().toString(), // Tạo id tự động bằng timestamp
      decisionNumber: formattedDecisionNumber,
      /*nhất định phải là decisionNumber : formattedDecisionNumber vì 
      decisionNumber cố định trong interface*/
      createdAt: new Date().toISOString(), // Ngày tạo quyết định
      updatedAt: new Date().toISOString(),// Ngày cập nhật quyết định
      year: bookYear, // Lưu trữ năm của sổ văn bằng
    };
    
    // Lưu quyết định mới vào localStorage
    localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify([...decisions, newDecision]));
    return newDecision;
  },

  update: (id: string, data: Partial<GraduationDecision>): GraduationDecision => {
    const decisions = graduationDecisionService.getAll();
    const index = decisions.findIndex(decision => decision.id === id);
    if (index === -1) throw new Error('Decision not found');
  
    const decisionToUpdate = decisions[index];
    const book = diplomaBookService.getAll().find(b => b.year === decisionToUpdate.year); // Lấy thông tin sổ văn bằng từ năm quyết định cũ
    if (!book) throw new Error('Sổ văn bằng không tồn tại');
  
    // Nếu số quyết định không thay đổi (hoặc không có trong data cập nhật), ta vẫn format lại nó
    const newDecisionNumber = data.decisionNumber
      ? `QĐ-${book.year}-${data.decisionNumber}`  // Dùng decisionNumber mới nếu có
      : `QĐ-${book.year}-${decisionToUpdate.decisionNumber}`;  // Giữ nguyên decisionNumber nếu không có gì thay đổi
  
    const updatedDecision = {
      ...decisionToUpdate,
      ...data,
      decisionNumber: newDecisionNumber,  // Cập nhật lại số quyết định
      updatedAt: new Date().toISOString(), // Ngày cập nhật quyết định
    };
  
    decisions[index] = updatedDecision;
  
    // Lưu quyết định đã cập nhật vào localStorage
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


// cấu hình phụ lục văn bằng
export const formFieldService = {
  getAll: (): FormField[] => {
    const data = localStorage.getItem(STORAGE_KEYS.FIELDS);
    return data ? JSON.parse(data) : [];
  },

  create: (field: Omit<FormField, 'id' >) => {
    const fields = formFieldService.getAll();
    const newField: FormField = {
      ...field,
      id: Date.now().toString(),
      // createdAt: new Date().toISOString(),
      // updatedAt: new Date().toISOString()
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
// danh sách văn bằng
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