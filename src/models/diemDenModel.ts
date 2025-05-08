// src/models/diemDenModel.ts
import { useState } from 'react';       //nhập hook usestate
import type { Destination } from '@/services/Destination/typing';

interface DiemDenModelState { //interface (giao diện) định nghĩa cấu trúc của state mà hook useDiemDenModel sẽ quản lý.
  newDiemDens: Omit<Destination.DiemDen, 'id'>[];
  editingDiemDen: Destination.DiemDen | null;
  existingDiemDens: Destination.DiemDen[];
}

const useDiemDenModel = () => {
  const [newDiemDens, setNewDiemDens] = useState<Omit<Destination.DiemDen, 'id'>[]>([]);
  const [editingDiemDen, setEditingDiemDen] = useState<Destination.DiemDen | null>(null);
  const [existingDiemDens, setExistingDiemDens] = useState<Destination.DiemDen[]>([]);

  const generateId = () => {
    const prefix = Date.now().toString(36); //chuyển về hệ 36 / hệ thập phân , nhị phân ,..
    const suffix = Math.random().toString(36).substring(2, 15);
    return `${prefix}-${suffix}`;
  };
//thêm một điểm đến mới mà người dùng đang tạo thông qua form thêm mới vào state newDiemDens
  const addNewDiemDen = () => {
    setNewDiemDens((prev) => [
      ...prev,
      {
        id: generateId(), // Sử dụng hàm tự tạo ID
        ten: '',
        moTa: '',
        thoiGianThamQuan: 1,
        anUong: { buaPhu: { re: 0, daydu: 0 }, buaChinh: { re: 0, trungbinh: 0, caocap: 0 } },
        luuTru: { tietkiem: 0, trungbinh: 0, caocap: 0 },
        rating: 1,
        hinhAnhUrl: '',
      },
    ]);
  };

  const updateNewDiemDen = (index: number, payload: Partial<Omit<Destination.DiemDen, 'id'>>) => {
    setNewDiemDens((prev) =>
      prev.map((diemDen, i) => (i === index ? { ...diemDen, ...payload } : diemDen))
    );
  };

  const removeNewDiemDen = (index: number) => {
    setNewDiemDens((prev) => prev.filter((diemDen, i) => i !== index));
  };//chỉ giữ lại các điểm khác index đc truyền vào

  // đặt lại state newDiemDens về một mảng rỗng , ví dụ thêm mới rồi thêm mói tiếp , thêm mới nửa chừng bỏ dở
  const resetNewDiemDens = () => {
    setNewDiemDens([]);
  };

  // Logic cho quản lý danh sách điểm đến đã tồn tại
  const setInitialExistingDiemDens = (data: Destination.DiemDen[]) => {
    setExistingDiemDens(data);
  };
//thêm một điểm đến đã được lưu thành công trên server vào state existingDiemDens
  const addNewExistingDiemDen = (diemDen: Destination.DiemDen) => {
    setExistingDiemDens((prev) => [...prev, diemDen]);
  };

  const updateExistingDiemDen = (updatedDiemDen: Destination.DiemDen) => {
    setExistingDiemDens((prev) =>
      prev.map((diemDen) => (diemDen.id === updatedDiemDen.id ? updatedDiemDen : diemDen))
    );
  };

  const removeExistingDiemDen = (id: string) => {
    setExistingDiemDens((prev) => prev.filter((diemDen) => diemDen.id !== id));
    console.log(`Client-side removal requested for DiemDen with ID: ${id}`);
  };

  // Logic cho sửa điểm đến
  const startEditDiemDen = (diemDen: Destination.DiemDen) => {
    setEditingDiemDen({ ...diemDen });
  };

  const updateEditingDiemDen = (payload: Partial<Destination.DiemDen>) => {
    setEditingDiemDen((prev) => (prev ? { ...prev, ...payload } : prev));
  };

  const clearEditingDiemDen = () => {
    setEditingDiemDen(null);
  };

  const prepareDiemDensDataForSubmit = (diemDens: Omit<Destination.DiemDen, 'id'>[]) => {
    return diemDens.map(item => ({ ...item, id: undefined }));
  };

  const prepareDiemDenDataForUpdate = (diemDen: Destination.DiemDen) => {
    return diemDen;
  };

  return {
    newDiemDens,
    editingDiemDen,
    existingDiemDens,
    addNewDiemDen,
    updateNewDiemDen,
    removeNewDiemDen,
    resetNewDiemDens,
    startEditDiemDen,
    updateEditingDiemDen,
    clearEditingDiemDen,
    setInitialExistingDiemDens,
    addNewExistingDiemDen,
    updateExistingDiemDen,
    removeExistingDiemDen,
    prepareDiemDensDataForSubmit,
    prepareDiemDenDataForUpdate,
  };
};

export default useDiemDenModel;