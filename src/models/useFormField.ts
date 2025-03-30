import { useState, useCallback } from 'react';
import type { FormField } from '@/models/diploma';
import { formFieldService } from '@/services/diploma';
import { message } from 'antd';

export default function useFormField() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFields = useCallback(async () => {
    setLoading(true);
    try {
      const data = await formFieldService.getAll();
      setFields(data);
    } catch (error) {
      message.error('Không thể tải danh sách trường thông tin');
    }
    setLoading(false);
  }, []);

  const addField = useCallback(async (field: Omit<FormField, 'id'>) => {
    setLoading(true);
    try {
      const newField = await formFieldService.create(field);
      setFields(prev => [...prev, newField]);
      message.success('Thêm trường thông tin thành công');
      return newField;
    } catch (error) {
      message.error('Thêm trường thông tin thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateField = useCallback(async (id: string, field: Partial<FormField>) => {
    setLoading(true);
    try {
      const updatedField = await formFieldService.update(id, field);
      setFields(prev => 
        prev.map(f => f.id === id ? updatedField : f)
      );
      message.success('Cập nhật trường thông tin thành công');
      return updatedField;
    } catch (error) {
      message.error('Cập nhật trường thông tin thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteField = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await formFieldService.delete(id);
      setFields(prev => prev.filter(f => f.id !== id));
      message.success('Xóa trường thông tin thành công');
    } catch (error) {
      message.error('Xóa trường thông tin thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fields,
    loading,
    loadFields,
    addField,
    updateField,
    deleteField,
  };
}