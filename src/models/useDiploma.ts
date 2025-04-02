import { useState, useCallback } from 'react';
import { message } from 'antd';
import type { Diploma } from '@/models/diploma';
import { diplomaService } from '@/services/diploma';

export default function useDiploma() {
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDiplomas = useCallback(() => {
    setLoading(true);
    try {
      const data = diplomaService.getAll();
      setDiplomas(data);
    } catch (error) {
      message.error('Không thể tải danh sách văn bằng');
    }
    setLoading(false);
  }, []);

  const createDiploma = useCallback(async (values: Omit<Diploma, 'id' | 'sequenceNumber' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const newDiploma = await diplomaService.create(values);
      setDiplomas(prev => [...prev, newDiploma]);
      message.success('Thêm văn bằng thành công');
      return newDiploma;
    } catch (error) {
      message.error('Thêm văn bằng thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    diplomas,
    loading,
    loadDiplomas,
    createDiploma
  };
}
