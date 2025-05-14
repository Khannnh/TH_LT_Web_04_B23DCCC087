import { useState } from 'react';

export interface ThongKeData {
  thangNam: string;
  soLuotTao: number;
}

export interface DiaDiemPhoBien {
  tenDiaDiem: string;
  rating: number;
}

export interface ThongKeState {
  dataTheoThang: ThongKeData[];
  diaDiemPhoBien: DiaDiemPhoBien[];
  loading: boolean;
  error: string | null;
}

const useThongKeModel = () => {
  const [state, setState] = useState<ThongKeState>({
    dataTheoThang: [],
    diaDiemPhoBien: [],
    loading: false,
    error: null
  });

  const luuDuLieuThongKe = (data: Partial<ThongKeState>) => {
    try {
      localStorage.setItem('thongKeData', JSON.stringify({
        ...data,
        ngayCapNhat: new Date().toISOString()
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Lỗi khi lưu dữ liệu' }));
    }
  };

  const layDuLieuThongKe = () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const duLieuDaLuu = localStorage.getItem('thongKeData');
      if (duLieuDaLuu) {
        const data = JSON.parse(duLieuDaLuu);
        setState(prev => ({
          ...prev,
          dataTheoThang: data.dataTheoThang || [],
          diaDiemPhoBien: data.diaDiemPhoBien || [],
          loading: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Lỗi khi đọc dữ liệu'
      }));
    }
  };

  const capNhatThongKe = () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const lichTrinhStr = localStorage.getItem('danhSachLichTrinh');
      const diemDenStr = localStorage.getItem('danhSachDiemDen');

      if (!lichTrinhStr || !diemDenStr) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Không có dữ liệu lịch trình hoặc điểm đến'
        }));
        return;
      }

      const lichTrinh = JSON.parse(lichTrinhStr);
      const danhSachDiemDen = JSON.parse(diemDenStr);

      const thongKeTheoThang = lichTrinh.reduce((acc: Record<string, number>, item: any) => {
        const thangNam = new Date(item.ngayTao).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
        acc[thangNam] = (acc[thangNam] || 0) + 1;
        return acc;
      }, {});

      const dataTheoThang = Object.entries(thongKeTheoThang).map(([thangNam, soLuotTao]) => ({
        thangNam,
        soLuotTao: Number(soLuotTao)
      }));

      const diaDiemPhoBien = danhSachDiemDen
        .map((diemDen: any) => ({
          tenDiaDiem: diemDen.ten,
          rating: diemDen.rating
        }))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);

      const newState = {
        dataTheoThang,
        diaDiemPhoBien,
        loading: false,
        error: null
      };

      setState(prev => ({
        ...prev,
        ...newState
      }));

      try {
        luuDuLieuThongKe(newState);
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Lỗi khi lưu dữ liệu thống kê'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Lỗi khi cập nhật thống kê'
      }));
    }
  };

  return {
    ...state,
    layDuLieuThongKe,
    capNhatThongKe
  };
};

export default useThongKeModel;
