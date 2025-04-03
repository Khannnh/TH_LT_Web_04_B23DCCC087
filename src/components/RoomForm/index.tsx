import React from 'react';
import { Form, Input, InputNumber, Select, Button } from 'antd';
import { Room, RoomType, Staff } from '@/types/classroom/room';
import { ROOM_VALIDATION } from '@/constants/classroom/room';

interface RoomFormProps {
  initialValues?: Partial<Room>;
  staffs: Staff[];
  onFinish: (values: any) => Promise<void>;
  loading?: boolean;
}

const RoomForm: React.FC<RoomFormProps> = ({
  initialValues,
  staffs,
  onFinish,
  loading
}) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
      className="room-form"
    >
      <Form.Item
        name="code"
        label="Mã phòng"
        rules={[
          { required: true, message: 'Vui lòng nhập mã phòng' },
          { max: ROOM_VALIDATION.CODE_MAX_LENGTH, message: `Mã phòng tối đa ${ROOM_VALIDATION.CODE_MAX_LENGTH} ký tự` }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="name"
        label="Tên phòng"
        rules={[
          { required: true, message: 'Vui lòng nhập tên phòng' },
          { max: ROOM_VALIDATION.NAME_MAX_LENGTH, message: `Tên phòng tối đa ${ROOM_VALIDATION.NAME_MAX_LENGTH} ký tự` }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="capacity"
        label="Số chỗ ngồi"
        rules={[
          { required: true, message: 'Vui lòng nhập số chỗ ngồi' },
          { type: 'number', min: ROOM_VALIDATION.MIN_CAPACITY, message: `Tối thiểu ${ROOM_VALIDATION.MIN_CAPACITY} chỗ ngồi` },
          { type: 'number', max: ROOM_VALIDATION.MAX_CAPACITY, message: `Tối đa ${ROOM_VALIDATION.MAX_CAPACITY} chỗ ngồi` }
        ]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="type"
        label="Loại phòng"
        rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
      >
        <Select>
          {Object.values(RoomType).map(type => (
            <Select.Option key={type} value={type}>
              {type}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="managerId"
        label="Người phụ trách"
        rules={[{ required: true, message: 'Vui lòng chọn người phụ trách' }]}
      >
        <Select>
          {staffs.map(staff => (
            <Select.Option key={staff.id} value={staff.id}>
              {staff.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item className="form-actions">
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RoomForm;