import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, message, Modal, Space, Table } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import OrderModal from '@/components/OrderForm';
import type { Order } from '@/models/orderModel';
import { OrderService } from '@/services/order'; // Đảm bảo đã import OrderService
import { mockProducts, mockCustomers } from '@/models/orderModel';

const { confirm } = Modal;

const OrderManagementPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
  }, []);

  const handleAddOrUpdate = async (values: any) => {
    setLoading(true);
    try {
      const { productList, customerId } = values;
      const product = productList[0];
      const totalAmount = product.price;
      const customerName = OrderService.getCustomers().find(customer => customer.customerId === customerId)?.name || 'Unknown Customer';

      const updatedOrders = [...orders];
      const orderData = {
        ...values,
        totalAmount,
        customerName,
        productList: [product],
      };

      if (editingOrder) {
        const index = updatedOrders.findIndex(order => order.orderId === editingOrder.orderId);
        if (index !== -1) {
          updatedOrders[index] = { ...updatedOrders[index], ...orderData };
        }
        message.success('Cập nhật đơn hàng thành công');
      } else {
        const newOrder: Order = {
          ...orderData,
          orderId: `OD-${Date.now()}`,
        };
        updatedOrders.push(newOrder);
        message.success('Thêm đơn hàng thành công');
      }

      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      setModalVisible(false);
      setEditingOrder(null);
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
    setLoading(false);
  };

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
          OrderService.cancelOrder(orderId);  // Gọi hàm hủy từ OrderService
          const updatedOrders = OrderService.getOrders();
          setOrders(updatedOrders);
          message.success('Hủy đơn hàng thành công');
        } catch (error: any) {
          message.error(error.message);  // Hiển thị thông báo lỗi nếu không thể hủy
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
      sorter: (a: Order, b: Order) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(), // Thêm sắp xếp theo ngày đặt hàng
      render: (orderDate: string) => new Date(orderDate).toLocaleString(),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount, // Thêm sắp xếp theo tổng tiền
      render: (totalAmount: number) => totalAmount.toLocaleString() + 'đ',
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
