import React from 'react';
import { Form, Input, InputNumber, TimePicker, Button, Select, Switch } from 'antd';
import type { Employee } from '@/models/employee';
import type { Service } from '@/models/service';
import { weekDays } from 'd:/code/basewebumiTH/src/components/EmployeeForm/constants';
import styles from './index.less';

const { Option } = Select;

interface EmployeeFormProps {
  initialValues?: Partial<Employee>;
  services: Service[];
  onFinish: (values: any) => void;
  loading?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialValues,
  services,
  onFinish,
  loading,
}) => {
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        active: true,
        maxCustomersPerDay: 10,
        ...initialValues,
      }}
    >
      <Form.Item
        name="name"
        label="Họ và tên"
        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Số điện thoại"
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Vui lòng nhập email' },
          { type: 'email', message: 'Email không hợp lệ' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="services"
        label="Dịch vụ đảm nhận"
        rules={[{ required: true, message: 'Vui lòng chọn ít nhất một dịch vụ' }]}
      >
        <Select mode="multiple" placeholder="Chọn dịch vụ">
          {services.map((service) => (
            <Option key={service.id} value={service.id}>
              {service.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="maxCustomersPerDay"
        label="Số khách tối đa/ngày"
        rules={[{ required: true, message: 'Vui lòng nhập số khách tối đa' }]}
      >
        <InputNumber min={1} max={50} style={{ width: '100%' }} />
      </Form.Item>

      <div className={styles.workingHours}>
        <h3>Lịch làm việc</h3>
        {weekDays.map((day: string, index: number) => (
          <div key={index} className={styles.workingHourRow}>
            <div className={styles.workingHourItem}>
              <Form.Item
                name={['workingHours', index, 'dayOfWeek']}
                initialValue={index}
                hidden
              >
                <Input />
              </Form.Item>
              <span>{day}</span>
              <Form.Item
                name={['workingHours', index, 'startTime']}
                className={styles.timeInput}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
              <span className={styles.timeSeparator}>-</span>
              <Form.Item
                name={['workingHours', index, 'endTime']}
                className={styles.timeInput}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
            </div>
          </div>
        ))}
      </div>

      <Form.Item name="active" valuePropName="checked" label="Trạng thái hoạt động">
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {initialValues ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmployeeForm;