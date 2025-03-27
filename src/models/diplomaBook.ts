import { BaseEntity, useBaseModel } from './base';
import type { DiplomaBook } from '@/types/diploma';

const STORAGE_KEY = 'diploma-books';

export function useDiplomaBookModel() {
  const model = useBaseModel<DiplomaBook>(STORAGE_KEY);

  return {
    items: model.items,
    addBook: model.add,
    updateBook: model.update,
    deleteBook: model.remove,
  };
}
