import type { Order, Product, Customer } from '@/models/orderModel';
//khai báo lại các interface đã được định nghĩa trong orderModel.ts

const STORAGE_KEYS = {
  ORDERS: 'orders',
  PRODUCTS: 'products',
  CUSTOMERS: 'customers',
};

export const OrderService = {
  // Lấy danh sách đơn hàng từ localStorage
  getOrders: (): Order[] => {
    const orders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return orders ? JSON.parse(orders) : [];
  },

  // Lưu danh sách đơn hàng vào localStorage
  saveOrders: (orders: Order[]) => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  // Kiểm tra mã đơn hàng có trùng không
  isDuplicateOrderId: (orderId: string): boolean => {
    return OrderService.getOrders().some(order => order.orderId === orderId);
  },

  // Tính tổng tiền dựa trên danh sách sản phẩm
// Tính tổng tiền dựa trên danh sách sản phẩm
calculateTotalAmount: (productList: Order['productList']): number => {
    return productList.reduce((total, product) => total + product.price * product.quantity, 0);
  },
  

  // Thêm đơn hàng
  addOrder: (order: Omit<Order, 'totalAmount'>) => {
    if (!order.orderId || !order.customerId || !order.orderDate || order.productList.length === 0) {
      throw new Error('Vui lòng nhập đầy đủ thông tin đơn hàng.');
    }
  
    if (OrderService.isDuplicateOrderId(order.orderId)) {
      throw new Error('Mã đơn hàng đã tồn tại.');
    }
  
    // Sử dụng hàm tính tổng tiền
    const totalAmount = OrderService.calculateTotalAmount(order.productList);
  
    const newOrder: Order = { ...order, totalAmount };
  
    const orders = OrderService.getOrders();
    orders.push(newOrder);
    OrderService.saveOrders(orders);
  },
  
  

  // Cập nhật đơn hàng
  updateOrder: (updatedOrder: Omit<Order, 'totalAmount'>) => {
    if (!updatedOrder.orderId || !updatedOrder.customerId || !updatedOrder.orderDate || updatedOrder.productList.length === 0) {
      throw new Error('Vui lòng nhập đầy đủ thông tin đơn hàng.');
    }
  
    // Sử dụng hàm tính tổng tiền
    const totalAmount = OrderService.calculateTotalAmount(updatedOrder.productList);
  
    const orders = OrderService.getOrders().map(order =>
      order.orderId === updatedOrder.orderId ? { ...updatedOrder, totalAmount } : order
    );
  
    OrderService.saveOrders(orders);
  },
  
  // Hủy đơn hàng (Chỉ cho phép hủy nếu trạng thái là "Pending")
  cancelOrder: (orderId: string) => {
    const orders = OrderService.getOrders();
    const orderIndex = orders.findIndex(order => order.orderId === orderId);
  
    if (orderIndex === -1) {
      throw new Error('Không tìm thấy đơn hàng.');
    }
  
    if (orders[orderIndex].status !== 'Pending') {
      throw new Error('Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận".');
    }
  
    orders[orderIndex].status = 'Cancelled';
    OrderService.saveOrders(orders);
  },
  

  // Xóa đơn hàng (Chỉ dùng cho mục đích quản lý dữ liệu)
  deleteOrder: (orderId: string) => {
    const orders = OrderService.getOrders().filter(order => order.orderId !== orderId);
    OrderService.saveOrders(orders);
  },
};
