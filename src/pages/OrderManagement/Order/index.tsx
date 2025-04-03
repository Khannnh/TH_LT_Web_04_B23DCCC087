import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, message, Modal, Space } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import OrderModal from '@/components/OrderForm'; 
import type { Order } from '@/models/orderModel';
import type { OrderService } from '@/services/order';
import { ProColumns } from '@ant-design/pro-table';


const { confirm } = Modal;

const OrderManagementPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]); // Lưu danh sách đơn hàng
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    // Lấy danh sách đơn hàng từ localStorage khi component được render
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
  }, []);

  const handleAddOrUpdate = async (values: any) => {
    setLoading(true);
    try {
      const updatedOrders = [...orders];
      if (editingOrder) {
        // Cập nhật đơn hàng
        const index = updatedOrders.findIndex(order => order.orderId === editingOrder.orderId);
        if (index !== -1) {
          updatedOrders[index] = { ...updatedOrders[index], ...values };
        }
        message.success('Cập nhật đơn hàng thành công');
      } else {
        // Thêm mới đơn hàng
        const newOrder: Order = { ...values, orderId: `OD-${Date.now()}` }; // Tạo mã đơn hàng tự động
        updatedOrders.push(newOrder);
        message.success('Thêm đơn hàng thành công');
      }
      // Lưu lại danh sách đơn hàng vào localStorage
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
          // Xóa đơn hàng khỏi localStorage
          const updatedOrders = orders.filter(order => order.orderId !== orderId);
          localStorage.setItem('orders', JSON.stringify(updatedOrders));
          setOrders(updatedOrders);
          message.success('Hủy đơn hàng thành công');
        } catch (error) {
          message.error('Hủy đơn hàng thất bại');
        }
      },
    });
  };


  const columns: ProColumns<Order>[] = [
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
      render: (dom, entity, index, action, schema) => {
        const status = entity.status;
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
  ];
  

  return (
    <PageContainer>
      <Card>
        <ProTable<Order>
          actionRef={actionRef}
          columns={columns}
          dataSource={orders}
          rowKey="orderId"
          search={false}
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
