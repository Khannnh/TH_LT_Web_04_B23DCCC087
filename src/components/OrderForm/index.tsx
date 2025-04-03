import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, InputNumber } from 'antd';
import type { Order } from '@/models/orderModel';
import { mockCustomers, mockProducts } from '@/models/orderModel';

const { Option } = Select;

interface OrderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
  initialData?: Order | null;
}

const OrderModal: React.FC<OrderModalProps> = ({ visible, onClose, onSave, initialData }) => {
  const [form] = Form.useForm();
  const [totalAmount, setTotalAmount] = useState<number>(initialData?.totalAmount || 0);

  const handleCalculateTotal = () => {
    const selectedProductIds = form.getFieldValue('productList') || [];
    const total = selectedProductIds.reduce((sum: number, productId: string) => {
      const product = mockProducts.find(p => p.productId === productId);
      return product ? sum + product.price : sum;
    }, 0);
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
      initialValues={initialData || {}}  // Nếu initialData là null, truyền một object rỗng
      onFinish={onSave}
      layout="vertical"
    >

        {/* <Form.Item name="orderId" label="Mã đơn hàng" rules={[{ required: true }]}> 
          <Input />
        </Form.Item> */}
        
        <Form.Item name="customerId" label="Khách hàng" rules={[{ required: true }]}> 
          <Select>
            {mockCustomers.map(customer => (
              <Option key={customer.customerId} value={customer.customerId}>{customer.name}</Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item name="orderDate" label="Ngày đặt hàng" rules={[{ required: true }]}> 
          <Input type="datetime-local" />
        </Form.Item>
        
        <Form.Item name="productList" label="Sản phẩm" rules={[{ required: true }]}> 
          <Select mode="multiple" onChange={handleCalculateTotal}>
            {mockProducts.map(product => (
              <Option key={product.productId} value={product.productId}>
                {product.name} - {product.price.toLocaleString()}đ
              </Option>
            ))}
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
