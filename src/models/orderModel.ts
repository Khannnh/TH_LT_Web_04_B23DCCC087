export interface Customer {
    customerId: string;   // ID khách hàng
    name: string;         // Tên khách hàng
    phone: string;        // Số điện thoại
  }

  //mỗi interface cần được export để được coi là 1 module riêng biệt
  
export interface Product {
    productId: string;    // ID sản phẩm
    name: string;         // Tên sản phẩm
    price: number;        // Giá sản phẩm
  }
  
export interface Order {
    orderId: string;        // Mã đơn hàng
    customerId: string;     // ID khách hàng (để tham chiếu)
    customerName: string;   // Lưu tên khách hàng để hiển thị nhanh
    orderDate: string;      // Ngày đặt hàng (ISO 8601)
    totalAmount: number;    // Tổng tiền đơn hàng
    status: 'Pending' | 'Shipping' | 'Completed' | 'Cancelled';
    productList: {          // Lưu chi tiết sản phẩm (thay vì chỉ lưu ID)
      productId: string;
      name: string;
      price: number;
      quantity: number;
    }[];
  }
  // Mock data
export const mockProducts: Product[] = [
  { productId: 'P1', name: 'Bánh mì pate chả', price: 23000 },
  { productId: 'P2', name: 'Bánh mì pate trứng', price: 23000 },
  { productId: 'P3', name: 'Bánh mì pate phô mai', price: 31000 },
  { productId: 'P4', name: 'Bánh mì Hội An đặc biệt', price: 35000 },
  { productId: 'P5', name: 'Bánh mì xíu mại', price: 28000 },
  { productId: 'P6', name: 'Bánh mì xíu mại chả', price: 28000 },
  { productId: 'P7', name: 'Bánh mì xíu mại trứng', price: 35000 },
  { productId: 'P8', name: 'Bánh mì xíu mại phô mai', price: 39000 },
  { productId: 'P9', name: 'Bánh mì gà nướng xả', price: 37000 },
];

export const mockCustomers: Customer[] = [
  { customerId: 'KH1', name: 'Nguyễn Văn A', phone: '0123456789' },
  { customerId: 'KH2', name: 'Trần Thị B', phone: '0987654321' },
  { customerId: 'KH3', name: 'Lương Văn C', phone: '0912345678' },
  { customerId: 'KH4', name: 'Phạm Văn D', phone: '0934567890' },
  { customerId: 'KH5', name: 'Lê Thị M', phone: '0945678901' },
];