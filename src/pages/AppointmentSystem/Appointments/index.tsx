import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Space, Modal, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import type { Appointment, AppointmentStatus } from '@/models/appointment';
import { getAppointments, updateAppointment } from '@/services/appointment';
import AppointmentForm from '@/components/AppointmentForm';
import { appointmentStatusLabels, appointmentStatusColors } from 'D:/code/basewebumiTH/src/pages/AppointmentSystem/Appointments/constants';
import styles from './index.less';

const AppointmentsPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();
  const [loading, setLoading] = useState(false);
  const actionRef = useRef<ActionType>();

  const handleAdd = () => {
    setSelectedAppointment(undefined);
    setModalVisible(true);
  };

  const handleEdit = (record: Appointment) => {
    setSelectedAppointment(record);
    setModalVisible(true);
  };

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    try {
      await updateAppointment(id, { status });
      message.success('Cập nhật trạng thái thành công');
      actionRef.current?.reload();
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (selectedAppointment) {
        await updateAppointment(selectedAppointment.id, values);
        message.success('Cập nhật lịch hẹn thành công');
      }
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error('Thao tác thất bại');
    }
    setLoading(false);
  };

  const columns: ProColumns<Appointment>[] = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      width: 200,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'customerPhone',
      width: 120,
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      width: 120,
      render: (text: any, record: Appointment) => moment(record.date).format('DD/MM/YYYY'),
    },
    {
      title: 'Giờ',
      dataIndex: 'startTime',
      width: 100,
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceId',
      width: 200,
      // Cần join với bảng Service để lấy tên dịch vụ
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employeeId',
      width: 200,
      // Cần join với bảng Employee để lấy tên nhân viên
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      render: (dom: React.ReactNode, record: Appointment) => (
        <Space>
          <Tag color={appointmentStatusColors[record.status]}>
            {appointmentStatusLabels[status]}
          </Tag>
          {status === 'PENDING' && (
            <Space size="small">
              <Button
                type="link"
                size="small"
                onClick={() => handleStatusChange(record.id, 'CONFIRMED')}
              >
                Xác nhận
              </Button>
              <Button
                type="link"
                danger
                size="small"
                onClick={() => handleStatusChange(record.id, 'CANCELLED')}
              >
                Hủy
              </Button>
            </Space>
          )}
          {status === 'CONFIRMED' && (
            <Button
              type="link"
              size="small"
              onClick={() => handleStatusChange(record.id, 'COMPLETED')}
            >
              Hoàn thành
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <div className={styles.tableToolbar}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm lịch hẹn
          </Button>
        </div>

        <ProTable<Appointment>
          actionRef={actionRef}
          columns={columns}
          request={async (params) => {
            const response = await getAppointments(params);
            return {
              data: response.data,
              success: true,
              total: response.total,
            };
          }}
          rowKey="id"
          pagination={{
            pageSize: 10,
          }}
          scroll={{ x: 1500 }}
        />

        <Modal
          title={selectedAppointment ? 'Cập nhật lịch hẹn' : 'Thêm lịch hẹn mới'}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          <AppointmentForm
            initialValues={selectedAppointment}
            onFinish={handleSubmit}
            loading={loading}
            employees={[]} // Cần truyền danh sách nhân viên vào đây
            services={[]} // Cần truyền danh sách dịch vụ vào đây
          />
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default AppointmentsPage;