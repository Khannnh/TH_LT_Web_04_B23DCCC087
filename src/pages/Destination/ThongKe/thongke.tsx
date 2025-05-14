import React, { useEffect } from 'react';
import BieuDoThongKe from '@/components/BieuDoThongKe';
import useModel from '@/models/thongkeModel';

const ThongKePage: React.FC = () => {
  const { dataTheoThang, diaDiemPhoBien, layDuLieuThongKe, capNhatThongKe } = useModel();

  useEffect(() => {
    layDuLieuThongKe();
    capNhatThongKe();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Thống kê lịch trình du lịch</h1>
      <BieuDoThongKe
        dataTheoThang={dataTheoThang}
        diaDiemPhoBien={diaDiemPhoBien}
      />
    </div>
  );
};

export default ThongKePage;
