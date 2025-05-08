export declare module Destination  {
// Enum cho các lựa chọn ăn uống
type BuaPhuLevel = 're' | 'daydu';
type BuaChinhLevel = 're' | 'trungbinh' | 'caocap';
type LuuTruLevel = 'tietkiem' | 'trungbinh' | 'caocap';

export interface DiemDen {
  id: string;
  ten: string;
  moTa: string;

  thoiGianThamQuan: number; // Giờ, step 0.01, ví dụ: 1.5 giờ

  anUong: {
    buaPhu: Record<BuaPhuLevel, number>; // { re: 20000, daydu: 40000 }
    buaChinh: Record<BuaChinhLevel, number>; // { re: 30000, trungbinh: 50000, caocap: 100000 }
  };

  luuTru: Record<LuuTruLevel, number>; // giá / người / giờ

  rating: number; // từ 1 đến 5

  hinhAnhUrl: string; // đường dẫn ảnh sau khi upload (hoặc base64 nếu lưu local)

  // Tùy chọn nâng cao: dùng để dự phòng khi chưa tích hợp Google Maps
  viTri?: {
    lat: number;
    lng: number;
  };
}
}
