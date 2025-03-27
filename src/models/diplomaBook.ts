import { BaseEntity, useBaseModel } from './base';

export interface DiplomaBook extends BaseEntity {
  year: number;
  totalDiplomas: number;
}

export function useDiplomaBookModel() {
  const model = useBaseModel<DiplomaBook>('diplomaBooks');

  return {
    books: model.items,
    addBook: model.add,
    updateBook: model.update,
    deleteBook: model.remove,
  };
}
