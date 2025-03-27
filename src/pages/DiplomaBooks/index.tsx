import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { DiplomaBook } from '@/models/diplomaBook';
import { history } from 'umi';
import { useDiplomaBookModel } from '@/models/diplomaBook';
import moment from 'moment';

const DiplomaBooks: React.FC = () => {
  const { books, addBook } = useDiplomaBookModel();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleCreateBook = async (values: { year: number }) => {
    try {
      const newBook = {
        year: values.year,
        totalDiplomas: 0,
      };
      addBook(newBook);
      message.success('Tạo sổ văn bằng thành công');
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Không thể tạo sổ văn bằng');
    }
  };

  const columns = [
    {
      title: 'Năm học',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Số văn bằng',
      dataIndex: 'totalDiplomas',
      key: 'totalDiplomas',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: DiplomaBook) => (
        <Button type="link" onClick={() => history.push(`/diploma-books/${record.id}`)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Mở sổ mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={books}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title="Tạo sổ văn bằng mới"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreateBook}
          layout="vertical"
        >
          <Form.Item
            name="year"
            label="Năm học"
            rules={[{ required: true, message: 'Vui lòng nhập năm học' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo
            </Button>
            <Button onClick={() => setModalVisible(false)} style={{ marginLeft: 8 }}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiplomaBooks;
