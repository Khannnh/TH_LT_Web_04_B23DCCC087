
import { useState, useEffect } from 'react';
import useDiemDenModel from '@/models/diemDenModel';
import type { Destination } from '@/services/Destination/typing';
import { message } from 'antd';

const useQuanLyDiemDen = () => {
  const {
    existingDiemDens,
    addNewExistingDiemDen,
    updateExistingDiemDen,
    removeExistingDiemDen,
    resetNewDiemDens,
    clearEditingDiemDen,
  } = useDiemDenModel();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateDiemDens = async (newDiemDenData: Omit<Destination.DiemDen, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      addNewExistingDiemDen({ id: Date.now().toString(), ...newDiemDenData }); // Tạo ID tạm thời ở client
      message.success('Thêm mới điểm đến thành công!');
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
  };
};

export default useQuanLyDiemDen;