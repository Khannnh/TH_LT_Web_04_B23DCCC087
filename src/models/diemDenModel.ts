// src/models/diemDenModel.ts
import { useState, useEffect } from 'react';       // Nhập hook useState và useEffect để quản lý state và side effects
import type { Destination } from '@/services/Destination/typing';

interface DiemDenModelState { // Interface (giao diện) định nghĩa cấu trúc của state mà hook useDiemDenModel sẽ quản lý.
  newDiemDens: Omit<Destination.DiemDen, 'id'>[]; // Danh sách các điểm đến mới đang được tạo (chưa có ID từ server/localStorage)
  editingDiemDen: Destination.DiemDen | null; // Điểm đến đang được chỉnh sửa
  existingDiemDens: Destination.DiemDen[]; // Danh sách các điểm đến đã tồn tại (có ID)
  setInitialExistingDiemDens: (data: Destination.DiemDen[]) => void; // Hàm để thiết lập danh sách điểm đến ban đầu (ví dụ: từ localStorage)
  addNewExistingDiemDen: (diemDen: Destination.DiemDen) => void; // Hàm để thêm một điểm đến mới vào danh sách đã tồn tại
  updateExistingDiemDen: (updatedDiemDen: Destination.DiemDen) => void; // Hàm để cập nhật thông tin một điểm đến đã tồn tại
  removeExistingDiemDen: (id: string) => void; // Hàm để xóa một điểm đến đã tồn tại
  addNewDiemDen: () => void; // Hàm để thêm một form thêm mới (một đối tượng nháp vào newDiemDens)
  updateNewDiemDen: (index: number, payload: Partial<Omit<Destination.DiemDen, 'id'>>) => void; // Hàm để cập nhật thông tin của một điểm đến mới đang được tạo
  removeNewDiemDen: (index: number) => void; // Hàm để xóa một điểm đến mới đang được tạo (ví dụ: hủy form)
  resetNewDiemDens: () => void; // Hàm để đặt lại danh sách điểm đến mới về mảng rỗng
  startEditDiemDen: (diemDen: Destination.DiemDen) => void; // Hàm để bắt đầu quá trình chỉnh sửa một điểm đến đã tồn tại
  updateEditingDiemDen: (payload: Partial<Destination.DiemDen>) => void; // Hàm để cập nhật thông tin của điểm đến đang được chỉnh sửa
  clearEditingDiemDen: () => void; // Hàm để kết thúc quá trình chỉnh sửa
  prepareDiemDensDataForSubmit: (diemDens: Omit<Destination.DiemDen, 'id'>[]) => Omit<Destination.DiemDen, 'id' | 'id'>[]; // Hàm để chuẩn bị dữ liệu điểm đến mới trước khi gửi lên server (loại bỏ ID client tự tạo)
  prepareDiemDenDataForUpdate: (diemDen: Destination.DiemDen) => Destination.DiemDen; // Hàm để chuẩn bị dữ liệu điểm đến đã tồn tại trước khi gửi lên server để cập nhật
}

const LOCAL_STORAGE_KEY = 'diemDens'; // Key để lưu trữ dữ liệu điểm đến trong localStorage

const useDiemDenModel = (): DiemDenModelState => {
  const [newDiemDens, setNewDiemDens] = useState<Omit<Destination.DiemDen, 'id'>[]>([]);
  const [editingDiemDen, setEditingDiemDen] = useState<Destination.DiemDen | null>(null);
  const [existingDiemDens, setExistingDiemDens] = useState<Destination.DiemDen[]>([]);

  // Load dữ liệu từ localStorage khi hook được tạo (tương đương component mount lần đầu)
  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      setExistingDiemDens(JSON.parse(storedData));
    }
  }, []);

  // Lưu dữ liệu vào localStorage mỗi khi danh sách existingDiemDens thay đổi
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existingDiemDens));
  }, [existingDiemDens]);

  const generateId = () => {
    const prefix = Date.now().toString(36); // Chuyển timestamp về base 36
    const suffix = Math.random().toString(36).substring(2, 15); // Tạo chuỗi ngẫu nhiên base 36
    return `${prefix}-${suffix}`; // Kết hợp prefix và suffix để tạo ID tương đối duy nhất ở client
  };

  // Thêm một điểm đến mới (form thêm mới) vào state newDiemDens
  const addNewDiemDen = () => {
    setNewDiemDens((prev) => [
      ...prev,
      {
        id: generateId(), // Sử dụng hàm tự tạo ID cho các điểm đến mới ở client
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

  // Cập nhật thông tin của một điểm đến đang được tạo trong newDiemDens
  const updateNewDiemDen = (index: number, payload: Partial<Omit<Destination.DiemDen, 'id'>>) => {
    setNewDiemDens((prev) =>
      prev.map((diemDen, i) => (i === index ? { ...diemDen, ...payload } : diemDen))
    );
  };

  // Xóa một điểm đến đang được tạo (hủy form thêm mới) khỏi newDiemDens
  const removeNewDiemDen = (index: number) => {
    setNewDiemDens((prev) => prev.filter((_, i) => i !== index)); // Chỉ giữ lại các điểm đến có index khác với index cần xóa
  };

  // Đặt lại state newDiemDens về mảng rỗng (ví dụ: sau khi thêm mới thành công hoặc hủy toàn bộ quá trình thêm)
  const resetNewDiemDens = () => {
    setNewDiemDens([]);
  };

  // Thiết lập danh sách điểm đến ban đầu (thường được gọi sau khi tải dữ liệu từ server hoặc localStorage)
  const setInitialExistingDiemDens = (data: Destination.DiemDen[]) => {
    setExistingDiemDens(data);
  };

  // Thêm một điểm đến đã tồn tại (có ID từ server/localStorage) vào state existingDiemDens
  const addNewExistingDiemDen = (diemDen: Destination.DiemDen) => {
    setExistingDiemDens((prev) => [...prev, diemDen]);
  };

  // Cập nhật thông tin của một điểm đến đã tồn tại trong state existingDiemDens
  const updateExistingDiemDen = (updatedDiemDen: Destination.DiemDen) => {
    setExistingDiemDens((prev) =>
      prev.map((diemDen) => (diemDen.id === updatedDiemDen.id ? updatedDiemDen : diemDen))
    );
  };

  // Xóa một điểm đến đã tồn tại khỏi state existingDiemDens
  const removeExistingDiemDen = (id: string) => {
    setExistingDiemDens((prev) => prev.filter((diemDen) => diemDen.id !== id));
    console.log(`Sever-side removal requested for DiemDen with ID: ${id}`); // Log để theo dõi hành động xóa (có thể là xóa ở client trước khi gọi API)
  };

  // Bắt đầu quá trình chỉnh sửa một điểm đến đã tồn tại bằng cách gán nó vào state editingDiemDen
  const startEditDiemDen = (diemDen: Destination.DiemDen) => {
    setEditingDiemDen({ ...diemDen });
  };

  // Cập nhật thông tin của điểm đến đang được chỉnh sửa trong state editingDiemDen dựa trên input từ form
  const updateEditingDiemDen = (payload: Partial<Destination.DiemDen>) => {
    setEditingDiemDen((prev) => (prev ? { ...prev, ...payload } : prev));
  };

  // Xóa thông tin của điểm đến đang được chỉnh sửa (sau khi hoàn thành hoặc hủy bỏ việc chỉnh sửa)
  const clearEditingDiemDen = () => {
    setEditingDiemDen(null);
  };

  // Chuẩn bị dữ liệu điểm đến mới trước khi gửi lên server (loại bỏ ID client tự tạo vì server sẽ cấp ID mới)
  const prepareDiemDensDataForSubmit = (diemDens: Omit<Destination.DiemDen, 'id'>[]) => {
    return diemDens.map(item => ({ ...item, id: undefined }));
  };

  // Chuẩn bị dữ liệu điểm đến đã tồn tại trước khi gửi lên server để cập nhật (gửi toàn bộ đối tượng hoặc chỉ các trường đã thay đổi)
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