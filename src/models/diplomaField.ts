import { BaseEntity, useBaseModel } from './base';
import type { DiplomaField } from '@/types/diploma';

const STORAGE_KEY = 'diploma-fields';

export function useDiplomaFieldModel() {
  const model = useBaseModel<DiplomaField>(STORAGE_KEY);

  return {
    items: model.items,
    addField: model.add,
    updateField: model.update,
    deleteField: model.remove,
  };
}
