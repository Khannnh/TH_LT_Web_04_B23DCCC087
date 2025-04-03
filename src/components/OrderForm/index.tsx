import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, InputNumber } from 'antd';
import type { Order } from '@/models/orderModel';

const { Option } = Select;

interface OrderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
  initialData?: Order;
}

const OrderModal: React.FC<OrderModalProps> = ({ visible, onClose, onSave, initialData }) => {
  const [form] = Form.useForm();
  const [totalAmount, setTotalAmount] = useState<number>(initialData?.totalAmount || 0);

  const handleCalculateTotal = () => {
    const productList = form.getFieldValue('productList') || [];
    const total = productList.reduce((sum: number, product: any) => sum + (product.price * product.quantity), 0);
    setTotalAmount(total);
  };

  return (
    <Modal
      title={initialData ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng'}
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        initialValues={initialData}
        onFinish={onSave}
        layout="vertical"
      >
        <Form.Item name="orderId" label="Mã đơn hàng" rules={[{ required: true }]}> 
          <Input />
        </Form.Item>
        
        <Form.Item name="customerId" label="Khách hàng" rules={[{ required: true }]}> 
          <Select>
            <Option value="1">Khách hàng 1</Option>
            <Option value="2">Khách hàng 2</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="orderDate" label="Ngày đặt hàng" rules={[{ required: true }]}> 
          <Input type="datetime-local" />
        </Form.Item>
        
        <Form.Item name="productList" label="Sản phẩm" rules={[{ required: true }]}> 
          <Select mode="multiple" onChange={handleCalculateTotal}>
            <Option value="p1">Sản phẩm 1 - 100.000đ</Option>
            <Option value="p2">Sản phẩm 2 - 200.000đ</Option>
          </Select>
        </Form.Item>
        
        <Form.Item label="Tổng tiền">
          <InputNumber value={totalAmount} disabled />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái đơn hàng" rules={[{ required: true }]}> 
          <Select>
            <Option value="Pending">Chờ xác nhận</Option>
            <Option value="Shipping">Đang giao</Option>
            <Option value="Completed">Hoàn thành</Option>
            <Option value="Cancelled">Hủy</Option>
          </Select>
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit">Lưu</Button>
          <Button onClick={onClose} style={{ marginLeft: 8 }}>Hủy</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderModal;
