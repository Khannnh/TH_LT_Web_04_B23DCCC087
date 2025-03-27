import { BaseEntity, useBaseModel } from './base';
import type { DiplomaField } from '@/types/diploma';

const STORAGE_KEY = 'diploma-fields';

export function useDiplomaFieldModel() {
  const model = useBaseModel<DiplomaField>(STORAGE_KEY);

  return {
    items: model.items,
    add: model.add,
    update: model.update,
    remove: model.remove,
  };
}
