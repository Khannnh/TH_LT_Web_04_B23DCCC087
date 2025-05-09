// src/pages/Admin/QuanLyDiemDen/hooks/useQuanLyDiemDen.ts

import { useState } from 'react';
import useDiemDenModel from '@/models/diemDenModel';
import type { Destination } from '@/services/Destination/typing';
import { message } from 'antd';

const useQuanLyDiemDen = () => {
  const {
    existingDiemDens,
    addNewExistingDiemDen,
    updateExistingDiemDen,
    removeExistingDiemDen,
    newDiemDens,
    resetNewDiemDens,
    editingDiemDen,
    clearEditingDiemDen,
  } = useDiemDenModel();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateDiemDens = async () => {
    setLoading(true);
    setError(null);
    try {
      newDiemDens.forEach((newDiemDen) => {
        addNewExistingDiemDen({ ...newDiemDen, id: new Date().getTime().toString() });
      });
      message.success('Thêm mới các điểm đến thành công!');
      resetNewDiemDens();
    } catch (catchError: any) {
      setError('Lỗi khi thêm mới điểm đến.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDiemDen = async (updatedDiemDen: Destination.DiemDen) => {
    setLoading(true);
    setError(null);
    try {
      updateExistingDiemDen(updatedDiemDen);
      message.success(`Cập nhật điểm đến "${updatedDiemDen.ten}" thành công!`);
      clearEditingDiemDen();
    } catch (catchError: any) {
      setError('Lỗi khi cập nhật điểm đến.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiemDen = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      removeExistingDiemDen(id);
      message.success('Xóa điểm đến thành công!');
    } catch (deleteError: any) {
      setError('Lỗi khi xóa điểm đến.');
    } finally {
      setLoading(false);
    }
  };

  return {
    existingDiemDens,
    loading,
    error,
    handleCreateDiemDens,
    handleUpdateDiemDen,
    handleDeleteDiemDen,
    editingDiemDen,
  };
};

export default useQuanLyDiemDen;