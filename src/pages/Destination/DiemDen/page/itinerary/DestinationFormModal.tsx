import { Modal, Form, Input, InputNumber } from 'antd';
import { useEffect } from 'react';
import { Destination } from './ItineraryEditor';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (destination: Destination) => void;
  initialData?: Destination | null;
}

export default function DestinationFormModal({ open, onClose, onSave, initialData }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const destination: Destination = {
      ...values,
      id: initialData?.id || uuidv4(),
    };
    onSave(destination);
  };

  return (
    <Modal open={open} onCancel={onClose} onOk={handleOk} title={initialData ? 'Sửa điểm đến' : 'Thêm điểm đến'}>
      <Form layout="vertical" form={form}>
        <Form.Item name="name" label="Tên điểm đến" rules={[{ required: true }]}> 
          <Input />
        </Form.Item>
        <Form.Item name="location" label="Địa điểm" rules={[{ required: true }]}> 
          <Input />
        </Form.Item>
        <Form.Item name="day" label="Ngày" rules={[{ required: true }]}> 
          <InputNumber min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
