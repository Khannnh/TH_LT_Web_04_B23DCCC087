import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import type { Order } from '@/models/orderModel';
import { mockCustomers, mockProducts } from '@/models/orderModel';

const { Option } = Select;

interface OrderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (order: Omit<Order, 'customerName' | 'totalAmount'>) => void;
  initialData?: Order | null;
}

const OrderModal: React.FC<OrderModalProps> = ({ visible, onClose, onSave, initialData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      // Chuyển đổi productList từ danh sách sản phẩm đầy đủ thành chỉ các productId
      const productIds = initialData.productList.map(product => product.productId);
      form.setFieldsValue({
        ...initialData,
        productList: productIds,  // Chỉ truyền productId vào form
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  return (
    <Modal
      title={initialData ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng'}
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        initialValues={initialData || {}}
        onFinish={(values) => {
          // ✅ Chuyển danh sách productId thành danh sách đầy đủ { productId, name, price }
          const selectedProducts = values.productList.map((productId: string) => {
            const product = mockProducts.find(p => p.productId === productId);
            return product ? { productId, name: product.name, price: product.price } : null;
          }).filter(Boolean);

          // Log để kiểm tra danh sách sản phẩm đã chọn
          console.log('🚀 Danh sách sản phẩm gửi lên:', selectedProducts);

          onSave({
            ...values,
            productList: selectedProducts,  // Đảm bảo lưu danh sách đầy đủ sản phẩm
          });
        }}
        layout="vertical"
      >
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
          <Select mode="multiple"> 
            {mockProducts.map(product => (
              <Option key={product.productId} value={product.productId}>
                {product.name} - {product.price.toLocaleString()}đ
              </Option>
            ))}
          </Select>
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
