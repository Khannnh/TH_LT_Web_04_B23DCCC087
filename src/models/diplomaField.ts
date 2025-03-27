import { BaseEntity, useBaseModel } from './base';

export type FieldDataType = 'String' | 'Number' | 'Date';

export interface DiplomaField extends BaseEntity {
  name: string;
  dataType: FieldDataType;
  isRequired: boolean;
}

export function useDiplomaFieldModel() {
  const model = useBaseModel<DiplomaField>('diplomaFields');

  return {
    fields: model.items,
    addField: model.add,
    updateField: model.update,
    deleteField: model.remove,
  };
}
