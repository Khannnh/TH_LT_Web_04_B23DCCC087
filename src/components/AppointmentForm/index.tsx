import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Button, message } from 'antd';
import moment from 'moment';
import type { Appointment } from 'D:/code/basewebumiTH/src/models/appointment';
import type { Employee } from 'D:/code/basewebumiTH/src/models/employee';
import type { Service } from 'D:/code/basewebumiTH/src/models/service';
import { getEmployeeSchedule } from 'D:/code/basewebumiTH/src/services/employee';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;

interface AppointmentFormProps {
  initialValues?: Partial<Appointment>;
  employees: Employee[];
  services: Service[];
  onFinish: (values: any) => void;
  loading?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialValues,
  employees,
  services,
  onFinish,
  loading,
}) => {
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState<moment.Moment>();
  const [selectedService, setSelectedService] = useState<string>();
  const [selectedEmployee, setSelectedEmployee] = useState<string>();
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    if (selectedDate && selectedEmployee && selectedService) {
      loadAvailableTimeSlots();
    }
  }, [selectedDate, selectedEmployee, selectedService]);

  const loadAvailableTimeSlots = async () => {
    try {
      const schedule = await getEmployeeSchedule(selectedEmployee!, selectedDate!.format('YYYY-MM-DD'));
      const service = services.find((s) => s.id === selectedService);
      
      if (!service) return;

      const slots = schedule.availableSlots.map((slot: { startTime: string }) => slot.startTime);
      setAvailableTimeSlots(slots);
    } catch (error) {
      message.error('Không thể tải danh sách khung giờ trống');
    }
  };

  const handleDateChange = (date: moment.Moment | null) => {
    if (date) {
      setSelectedDate(date);
      form.setFieldsValue({ startTime: undefined });
    }
  };

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
    form.setFieldsValue({ employeeId: undefined, startTime: undefined });
    setSelectedEmployee(undefined);
  };

  const handleEmployeeChange = (value: string) => {
    setSelectedEmployee(value);
    form.setFieldsValue({ startTime: undefined });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        date: initialValues?.date ? moment(initialValues.date) : undefined,
      }}
      className={styles.appointmentForm}
    >
      <Form.Item
        name="customerName"
        label="Họ và tên"
        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="customerPhone"
        label="Số điện thoại"
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="serviceId"
        label="Dịch vụ"
        rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
      >
        <Select placeholder="Chọn dịch vụ" onChange={handleServiceChange}>
          {services.map((service) => (
            <Option key={service.id} value={service.id}>
              {service.name} - {service.price.toLocaleString('vi-VN')}đ ({service.duration} phút)
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="employeeId"
        label="Nhân viên"
        rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
      >
        <Select
          placeholder="Chọn nhân viên"
          onChange={handleEmployeeChange}
          disabled={!selectedService}
        >
          {employees
            .filter((emp) => !selectedService || emp.services.includes(selectedService))
            .map((employee) => (
              <Option key={employee.id} value={employee.id}>
                {employee.name} - {employee.rating.toFixed(1)}⭐
              </Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="date"
        label="Ngày"
        rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
      >
        <DatePicker
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
          disabledDate={(current) => current && current < moment().startOf('day')}
          onChange={handleDateChange}
        />
      </Form.Item>

      <Form.Item
        name="startTime"
        label="Giờ"
        rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
      >
        <Select placeholder="Chọn giờ" disabled={!selectedDate || !selectedEmployee}>
          {availableTimeSlots.map((time) => (
            <Option key={time} value={time}>
              {time}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="notes" label="Ghi chú">
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {initialValues ? 'Cập nhật lịch hẹn' : 'Đặt lịch hẹn'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AppointmentForm;