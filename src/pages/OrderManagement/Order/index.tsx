import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, message, Modal, Space, Table } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import OrderModal from '@/components/OrderForm';
import type { Order } from '@/models/orderModel';
import {OrderService} from '@/services/order'; 
import { mockProducts, mockCustomers } from '@/models/orderModel';
import type { Product } from '@/models/orderModel';

const { confirm } = Modal;

const OrderManagementPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]); // Lưu danh sách đơn hàng

  useEffect(() => {
    // Lấy danh sách đơn hàng từ localStorage khi component được render
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    console.log('Dữ liệu từ localStorage:', storedOrders);  // Kiểm tra dữ liệu từ localStorage
    setOrders(storedOrders);
  }, []);

  const handleAddOrUpdate = async (values: any) => {
    setLoading(true);
    try {
      const { productList, customerId } = values;
      const product = productList[0];
      const totalAmount = product.price;  // Tổng tiền chỉ bằng giá sản phẩm
      const customerName = OrderService.getCustomers().find(customer => customer.customerId === customerId)?.name || 'Unknown Customer';
  
      const updatedOrders = [...orders];
      const orderData = {
        ...values,
        totalAmount,
        customerName,
        productList: [product],  // Chỉ thêm một sản phẩm vào danh sách
      };
  
      if (editingOrder) {
        // Cập nhật đơn hàng
        const index = updatedOrders.findIndex(order => order.orderId === editingOrder.orderId);
        if (index !== -1) {
          updatedOrders[index] = { ...updatedOrders[index], ...orderData };
        }
        message.success('Cập nhật đơn hàng thành công');
      } else {
        // Thêm mới đơn hàng
        const newOrder: Order = { 
          ...orderData,
          orderId: `OD-${Date.now()}`,  // Tạo mã đơn hàng tự động
        };
        updatedOrders.push(newOrder);
        message.success('Thêm đơn hàng thành công');
      }
  
      // Lưu lại danh sách đơn hàng vào localStorage
      localStorage.setItem('orders', JSON.stringify(updatedOrders));  // Đảm bảo lưu danh sách vào localStorage
      setOrders(updatedOrders);  // Cập nhật lại state orders trong UI
      setModalVisible(false);
      setEditingOrder(null);
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
    setLoading(false);
  };
  
  // Hàm này sẽ được gọi khi người dùng nhấn nút "Hủy" trong bảng
  const handleDelete = (orderId: string) => {
    confirm({
      title: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác!',
      okText: 'Xác nhận hủy',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        try {
          // Xóa đơn hàng khỏi localStorage
          const updatedOrders = orders.filter(order => order.orderId !== orderId);
          console.log('Danh sách đơn hàng sau khi xóa:', updatedOrders);  // Kiểm tra danh sách sau khi xóa
          localStorage.setItem('orders', JSON.stringify(updatedOrders));
          setOrders(updatedOrders);
          message.success('Hủy đơn hàng thành công');
        } catch (error) {
          message.error('Hủy đơn hàng thất bại');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        return (
          <span>
            {status === 'Pending' && 'Chờ xác nhận'}
            {status === 'Shipping' && 'Đang giao'}
            {status === 'Completed' && 'Hoàn thành'}
            {status === 'Cancelled' && 'Hủy'}
          </span>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Order) => (
        <Space size="middle">
          <Button onClick={() => handleDelete(record.orderId)} danger>
            Hủy
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="orderId"
          pagination={false}
        />
        {/* Nút Thêm Đơn Hàng */}
        <Button
          key="add"
          type="primary"
          onClick={() => {
            setEditingOrder(null);
            setModalVisible(true);
          }}
          icon={<PlusOutlined />}
          style={{ marginTop: 16 }}
        >
          Thêm đơn hàng
        </Button>

        {/* Modal Form để Thêm/Sửa đơn hàng */}
        <OrderModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleAddOrUpdate}
          initialData={editingOrder}
        />
      </Card>
    </PageContainer>
  );
};

export default OrderManagementPage;
