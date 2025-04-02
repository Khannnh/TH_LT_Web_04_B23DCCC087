import { useState, useCallback, useEffect } from 'react';
import type { FormField } from '@/models/diploma';
import { message } from 'antd';

export default function useFormField() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(false);

  // Load dữ liệu từ localStorage khi component mount
  useEffect(() => {
    const savedFields = localStorage.getItem('fields');
    if (savedFields) {
      setFields(JSON.parse(savedFields));
    }
  }, []);

  const saveToLocalStorage = (newFields: FormField[]) => {
    localStorage.setItem('fields', JSON.stringify(newFields));
  };

  const loadFields = useCallback(() => {
    setLoading(true);
    try {
      const savedFields = localStorage.getItem('fields');
      if (savedFields) {
        setFields(JSON.parse(savedFields));
      }
    } catch (error) {
      message.error('Không thể tải danh sách trường thông tin');
    } finally {
      setLoading(false);
    }
  }, []);

  const addField = useCallback(async (field: Omit<FormField, 'id'>) => {
    setLoading(true);
    try {
      const newField = { ...field, id: Date.now().toString() }; // Tạo ID mới
      const updatedFields = [...fields, newField];
      setFields(updatedFields);
      saveToLocalStorage(updatedFields);
      message.success('Thêm trường thông tin thành công');
      return newField;
    } catch (error) {
      message.error('Thêm trường thông tin thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fields]);

  const updateField = useCallback(async (id: string, field: Partial<FormField>) => {
    setLoading(true);
    try {
      const updatedFields = fields.map(f => f.id === id ? { ...f, ...field } : f);
      setFields(updatedFields);
      saveToLocalStorage(updatedFields);
      message.success('Cập nhật trường thông tin thành công');
      return updatedFields;
    } catch (error) {
      message.error('Cập nhật trường thông tin thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fields]);

  const deleteField = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const updatedFields = fields.filter(f => f.id !== id);
      setFields(updatedFields);
      saveToLocalStorage(updatedFields);
      message.success('Xóa trường thông tin thành công');
    } catch (error) {
      message.error('Xóa trường thông tin thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fields]);

  return {
    fields,
    loading,
    loadFields,
    addField,
    updateField,
    deleteField,
  };
}
