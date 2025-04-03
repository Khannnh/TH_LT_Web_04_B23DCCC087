import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, message, Modal, Space, Table, Input } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import OrderModal from '@/components/OrderForm';
import type { Order } from '@/models/orderModel';
import { OrderService } from '@/services/order';  // Import OrderService

const { confirm } = Modal;

const OrderManagementPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');  // Từ khóa tìm kiếm

  useEffect(() => {
    const storedOrders = OrderService.getOrders();
    setOrders(storedOrders);
    setFilteredOrders(storedOrders);  // Mặc định hiển thị tất cả đơn hàng
  }, []);

  const handleAddOrUpdate = async (values: any) => {
    setLoading(true);
    try {
      const { productList, customerId } = values;
      const totalAmount = OrderService.calculateTotalAmount(productList);
      const customerName = OrderService.getCustomers().find(customer => customer.customerId === customerId)?.name || 'Unknown Customer';

      const orderData = { ...values, totalAmount, customerName, productList };

      if (editingOrder) {
        // Cập nhật đơn hàng
        OrderService.saveOrders(orders.map(order => 
          order.orderId === editingOrder.orderId ? { ...order, ...orderData } : order
        ));
        message.success('Cập nhật đơn hàng thành công');
      } else {
        // Thêm đơn hàng mới
        const newOrder: Order = {
          ...orderData,
          orderId: `OD-${Date.now()}`,
        };
        OrderService.saveOrders([...orders, newOrder]);
        message.success('Thêm đơn hàng thành công');
      }

      // Cập nhật lại danh sách đơn hàng
      const updatedOrders = OrderService.getOrders();
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
      setModalVisible(false);
      setEditingOrder(null);
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra');
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
          OrderService.cancelOrder(orderId);
          const updatedOrders = OrderService.getOrders();
          setOrders(updatedOrders);
          setFilteredOrders(updatedOrders);
          message.success('Hủy đơn hàng thành công');
        } catch (error: any) {
          message.error(error.message);
        }
      },
    });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const filtered = OrderService.searchOrders(value);
    setFilteredOrders(filtered);
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
      sorter: (a: Order, b: Order) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
      render: (orderDate: string) => new Date(orderDate).toLocaleString(),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
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
        <Input
          placeholder="Tìm kiếm theo mã đơn hàng hoặc khách hàng"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 16, width: 500 }}
        />
                <Button
          key="add"
          type="primary"
          onClick={() => {
            setEditingOrder(null);
            setModalVisible(true);
          }}
          icon={<PlusOutlined />}
          style={{ marginTop: 16 , marginLeft : 40}}
        >
          Thêm đơn hàng
        </Button>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="orderId"
          pagination={false}
        />

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
