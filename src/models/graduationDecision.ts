import { BaseEntity, useBaseModel } from './base';
import moment from 'moment';

export interface GraduationDecision extends BaseEntity {
  decisionNumber: string;
  decisionDate: Date;
  diplomaBookId: string;
}

export function useGraduationDecisionModel() {
  const model = useBaseModel<GraduationDecision>('graduationDecisions');

  const addDecision = (data: Omit<GraduationDecision, keyof BaseEntity>) => {
    const isDuplicate = model.items.some(
      item => item.decisionNumber === data.decisionNumber
    );

    if (isDuplicate) {
      throw new Error('Số quyết định đã tồn tại');
    }

    return model.add(data);
  };

  const updateDecision = (id: string, data: Partial<Omit<GraduationDecision, keyof BaseEntity>>) => {
    const isDuplicate = model.items.some(
      item => item.decisionNumber === data.decisionNumber && item.id !== id
    );

    if (isDuplicate) {
      throw new Error('Số quyết định đã tồn tại');
    }

    model.update(id, data);
  };

  return {
    decisions: model.items,
    addDecision,
    updateDecision,
    deleteDecision: model.remove,
  };
}
