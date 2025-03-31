
import { useState, useCallback } from 'react';
import { message } from 'antd';
import type { GraduationDecision } from './type';
import { graduationDecisionService } from '@/services/diploma';

export default function useDecision() {
  const [decisions, setDecisions] = useState<GraduationDecision[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<GraduationDecision>();

  const loadDecisions = useCallback(async () => {
    setLoading(true);
    try {
      const data = graduationDecisionService.getAll();
      setDecisions(data);
    } catch (error) {
      message.error('Không thể tải danh sách quyết định');
    }
    setLoading(false);
  }, []);

  const createDecision = useCallback(async (values: Partial<GraduationDecision>) => {
    setLoading(true);
    try {
      const newDecision = await graduationDecisionService.create(values);
      setDecisions(prev => [...prev, newDecision]);
      message.success('Tạo quyết định thành công');
      return newDecision;
    } catch (error) {
      message.error('Tạo quyết định thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDecision = useCallback(async (id: string, values: Partial<GraduationDecision>) => {
    setLoading(true);
    try {
      const updatedDecision = await graduationDecisionService.update(id, values);
      setDecisions(prev => 
        prev.map(decision => decision.id === id ? updatedDecision : decision)
      );
      message.success('Cập nhật quyết định thành công');
      return updatedDecision;
    } catch (error) {
      message.error('Cập nhật quyết định thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const incrementSearchCount = useCallback(async (id: string) => {
    try {
      await graduationDecisionService.incrementSearchCount(id);
      setDecisions(prev =>
        prev.map(decision =>
          decision.id === id
            ? { ...decision, searchCount: (decision.searchCount || 0) + 1 }
            : decision
        )
      );
    } catch (error) {
      console.error('Error incrementing search count:', error);
    }
  }, []);

  return {
    decisions,
    loading,
    selectedDecision,
    setSelectedDecision,
    loadDecisions,
    createDecision,
    updateDecision,
    incrementSearchCount
  };
}