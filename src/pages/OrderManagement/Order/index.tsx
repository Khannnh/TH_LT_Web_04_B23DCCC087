import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Space, Modal, message, Input, Select } from 'antd';
import PlusOutlined from '@ant-design/icons/PlusOutlined'; 
import ProTable from '@ant-design/pro-table';
import { OrderService } from '@/services/order';
import type { Order } from '@/models/orderModel';
import OrderForm from '@/components/OrderForm'; // Sử dụng form mới

const { Search } = Input;

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [visible, setVisible] = useState<boolean>(false); // Modal hiển thị thêm đơn hàng
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | undefined>('descend');
  const [sortField, setSortField] = useState<'orderDate' | 'totalAmount'>('orderDate');

  useEffect(() => {
    setOrders(OrderService.getOrders());
  }, []);

  useEffect(() => {
    let filteredOrders = OrderService.getOrders();

    // Tìm kiếm theo mã đơn hàng hoặc tên khách hàng
    if (searchTerm) {
      filteredOrders = filteredOrders.filter(order => 
        order.orderId.includes(searchTerm) || order.customerName.includes(searchTerm)
      );
    }

    // Lọc theo trạng thái đơn hàng
    if (statusFilter) {
      filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }

    // Sắp xếp theo ngày đặt hàng hoặc tổng tiền
    filteredOrders = filteredOrders.sort((a, b) => {
      if (sortField === 'orderDate') {
        return sortOrder === 'descend'
          ? new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          : new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
      } else {
        return sortOrder === 'descend' 
          ? b.totalAmount - a.totalAmount 
          : a.totalAmount - b.totalAmount;
      }
    });

    setOrders(filteredOrders);
  }, [searchTerm, statusFilter, sortOrder, sortField]);

  const handleAddOrder = () => {
    setCurrentOrder(null);
    setVisible(true);
  };

  const handleEditOrder = (order: Order) => {
    setCurrentOrder(order);
    setVisible(true);
  };

  const handleDeleteOrder = (orderId: string) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa đơn hàng này?',
      onOk() {
        OrderService.deleteOrder(orderId);
        setOrders(OrderService.getOrders());
        message.success('Xóa đơn hàng thành công!');
      },
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = (order: Order) => {
    if (currentOrder) {
      // Cập nhật đơn hàng
      OrderService.updateOrder(order);
      message.success('Cập nhật đơn hàng thành công!');
    } else {
      // Thêm mới đơn hàng
      OrderService.addOrder(order);
      message.success('Thêm mới đơn hàng thành công!');
    }
    setOrders(OrderService.getOrders());
    setVisible(false);
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
      sorter: true,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: true,
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
      title: 'Hành động',
      key: 'action',
      render: (text: any, record: Order) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEditOrder(record)}>Sửa</Button>
          <Button type="link" danger onClick={() => handleDeleteOrder(record.orderId)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddOrder}
          >
            Thêm đơn hàng
          </Button>

          <Search
            placeholder="Tìm kiếm đơn hàng"
            enterButton="Tìm"
            onSearch={setSearchTerm}
            style={{ width: 300 }}
          />

          <Select
            placeholder="Lọc trạng thái"
            style={{ width: 200 }}
            onChange={setStatusFilter}
            allowClear
          >
            <Select.Option value="Pending">Chờ xác nhận</Select.Option>
            <Select.Option value="Shipping">Đang giao</Select.Option>
            <Select.Option value="Completed">Hoàn thành</Select.Option>
            <Select.Option value="Cancelled">Hủy</Select.Option>
          </Select>

          <Select
            placeholder="Sắp xếp theo"
            style={{ width: 200 }}
            onChange={(value) => setSortField(value as 'orderDate' | 'totalAmount')}
            value={sortField}
          >
            <Select.Option value="orderDate">Ngày đặt hàng</Select.Option>
            <Select.Option value="totalAmount">Tổng tiền</Select.Option>
          </Select>

          <Select
            placeholder="Thứ tự sắp xếp"
            style={{ width: 150 }}
            onChange={setSortOrder}
            value={sortOrder}
          >
            <Select.Option value="ascend">Tăng dần</Select.Option>
            <Select.Option value="descend">Giảm dần</Select.Option>
          </Select>
        </Space>

        <ProTable
          columns={columns}
          dataSource={orders}
          rowKey="orderId"
          search={false}
          pagination={false}
        />
      </Card>

      <Modal
        title={currentOrder ? 'Sửa đơn hàng' : 'Thêm mới đơn hàng'}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <OrderForm order={currentOrder} onSubmit={handleSubmit} />
      </Modal>
    </PageContainer>
  );
};

export default OrderList;
