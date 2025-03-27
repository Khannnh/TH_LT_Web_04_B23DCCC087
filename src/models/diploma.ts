import { BaseEntity, useBaseModel } from './base';
import moment from 'moment';

export interface DiplomaFieldValue {
  fieldId: string;
  value: string | number | Date;
}

export interface Diploma extends BaseEntity {
  bookNumber: number;
  diplomaNumber: string;
  studentId: string;
  fullName: string;
  dateOfBirth: Date;
  graduationDecisionId: string;
  fields: DiplomaFieldValue[];
}

// Helper để parse field values
const parseFieldValue = (value: any, type: string) => {
  switch (type) {
    case 'Date':
      return new Date(value);
    case 'Number':
      return Number(value);
    default:
      return String(value);
  }
};

export function useDiplomaModel() {
  const model = useBaseModel<Diploma>('diplomas');

  const addDiploma = (data: Omit<Diploma, keyof BaseEntity>) => {
    // Ensure dateOfBirth is a Date object
    const diplomaData = {
      ...data,
      dateOfBirth: moment(data.dateOfBirth).toDate(),
      fields: data.fields.map(field => ({
        ...field,
        value: field.value instanceof Date ? field.value : parseFieldValue(field.value, typeof field.value)
      }))
    };
    return model.add(diplomaData);
  };

  const updateDiploma = (id: string, data: Partial<Omit<Diploma, keyof BaseEntity>>) => {
    const updateData = {
      ...data,
      dateOfBirth: data.dateOfBirth ? moment(data.dateOfBirth).toDate() : undefined,
      fields: data.fields?.map(field => ({
        ...field,
        value: field.value instanceof Date ? field.value : parseFieldValue(field.value, typeof field.value)
      }))
    };
    model.update(id, updateData);
  };

  return {
    items: model.items,
    addDiploma,
    updateDiploma,
    deleteDiploma: model.remove,
  };
}
