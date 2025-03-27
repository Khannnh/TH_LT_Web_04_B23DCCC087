import { BaseEntity, useBaseModel } from './base';
import type { GraduationDecision } from '@/types/diploma';

const STORAGE_KEY = 'graduation-decisions';

export function useGraduationDecisionModel() {
  const model = useBaseModel<GraduationDecision>(STORAGE_KEY);

  return {
    items: model.items,
    addDecision: model.add,
    updateDecision: model.update,
    deleteDecision: model.remove,
  };
}
