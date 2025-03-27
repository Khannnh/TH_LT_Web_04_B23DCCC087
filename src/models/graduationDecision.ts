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
    const decisionData = {
      ...data,
      decisionDate: moment(data.decisionDate).toDate()
    };
    return model.add(decisionData);
  };

  const updateDecision = (id: string, data: Partial<Omit<GraduationDecision, keyof BaseEntity>>) => {
    const updateData = {
      ...data,
      decisionDate: data.decisionDate ? moment(data.decisionDate).toDate() : undefined
    };
    model.update(id, updateData);
  };

  return {
    decisions: model.items,
    addDecision,
    updateDecision,
    deleteDecision: model.remove,
  };
}
