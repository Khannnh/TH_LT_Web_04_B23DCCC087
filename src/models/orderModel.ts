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
  