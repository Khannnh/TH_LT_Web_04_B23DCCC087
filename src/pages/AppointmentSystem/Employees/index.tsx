import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Space, Modal, message, Tag, Rate } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { Employee } from '@/models/employee';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '@/services/employee';
import EmployeeForm from '@/components/EmployeeForm';
import { weekDays } from 'd:/code/basewebumiTH/src/components/EmployeeForm/constants';
import styles from './index.less';

const EmployeesPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>();
  const [loading, setLoading] = useState(false);
  const actionRef = useRef<ActionType>();

  const handleAdd = () => {
    setSelectedEmployee(undefined);
    setModalVisible(true);
  };

  const handleEdit = (record: Employee) => {
    setSelectedEmployee(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee(id);
      message.success('Xóa nhân viên thành công');
      actionRef.current?.reload();
    } catch (error) {
      message.error('Xóa nhân viên thất bại');
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (selectedEmployee) {
        await updateEmployee(selectedEmployee.id, values);
        message.success('Cập nhật nhân viên thành công');
      } else {
        await createEmployee(values);
        message.success('Thêm nhân viên thành công');
      }
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error('Thao tác thất bại');
    }
    setLoading(false);
  };

  const columns: ProColumns<Employee>[] = [
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      width: 120,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      width: 150,
      render: (dom: any, entity: Employee) => (
        <Space>
          <Rate disabled defaultValue={entity.rating} allowHalf />
          <span>({entity.rating.toFixed(1)})</span>
        </Space>
      ),
    },
    {
      title: 'Số khách tối đa/ngày',
      dataIndex: 'maxCustomersPerDay',
      width: 150,
    },
    {
      title: 'Lịch làm việc',
      dataIndex: 'workingHours',
      width: 300,
      render: (_: any, entity: Employee) => (
        <div className={styles.workingHours}>
          {entity.workingHours?.map((wh) => (
            <div key={wh.dayOfWeek}>
              {weekDays[wh.dayOfWeek]}: {wh.startTime} - {wh.endTime}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      width: 100,
      render: (_, record: Employee) => (
        <Tag color={record.active ? 'success' : 'error'}>
          {record.active ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Xác nhận xóa',
                content: 'Bạn có chắc chắn muốn xóa nhân viên này?',
                onOk: () => handleDelete(record.id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <div className={styles.tableToolbar}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm nhân viên
          </Button>
        </div>

        <ProTable<Employee>
          actionRef={actionRef}
          columns={columns}
          request={async (params) => {
            const response = await getEmployees(params);
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
          title={selectedEmployee ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          <EmployeeForm
            initialValues={selectedEmployee}
            onFinish={handleSubmit}
            loading={loading}
            services={[]} // Cần truyền danh sách dịch vụ vào đây
          />
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default EmployeesPage;