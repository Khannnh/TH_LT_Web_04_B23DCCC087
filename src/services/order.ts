import type { Order, Product, Customer } from '@/models/orderModel';
import { mockCustomers, mockProducts } from '@/models/orderModel';

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

  // Lấy danh sách khách hàng từ localStorage (nếu chưa có thì lưu mockData vào)
  getCustomers: (): Customer[] => {
    let customers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!customers) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(mockCustomers));
      customers = JSON.stringify(mockCustomers);
    }
    return JSON.parse(customers);
  },

  // Lấy danh sách sản phẩm từ localStorage (nếu chưa có thì lưu mockData vào)
  getProducts: (): Product[] => {
    let products = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!products) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts));
      products = JSON.stringify(mockProducts);
    }
    return JSON.parse(products);
  },

  // Kiểm tra mã đơn hàng có trùng không
  isDuplicateOrderId: (orderId: string): boolean => {
    return OrderService.getOrders().some(order => order.orderId === orderId);
  },

  // Tính tổng tiền đơn hàng
  calculateTotalAmount: (productList: Order['productList']): number => {
    return productList.reduce((total, product) => total + product.price, 0);
  },

  // Thêm đơn hàng
  addOrder: (order: Omit<Order, 'totalAmount' | 'customerName'>) => {
    if (!order.orderId || !order.customerId || !order.orderDate || order.productList.length === 0) {
      throw new Error('Vui lòng nhập đầy đủ thông tin đơn hàng.');
    }

    if (OrderService.isDuplicateOrderId(order.orderId)) {
      throw new Error('Mã đơn hàng đã tồn tại.');
    }

    // Lấy danh sách khách hàng và sản phẩm
    const customers = OrderService.getCustomers();
    const products = OrderService.getProducts();

    // Tính tổng tiền đơn hàng
    const totalAmount = OrderService.calculateTotalAmount(order.productList);

    // Lấy tên khách hàng
    const customerName = customers.find(c => c.customerId === order.customerId)?.name || 'Unknown Customer';

    // Tạo đơn hàng mới
    const newOrder: Order = { ...order, totalAmount, customerName };

    // Lưu vào danh sách
    const orders = OrderService.getOrders();
    orders.push(newOrder);
    console.log('🚀 Đơn hàng mới:', newOrder);  // Kiểm tra đơn hàng mới

    // Lưu đơn hàng vào localStorage
    OrderService.saveOrders(orders);
  },
};