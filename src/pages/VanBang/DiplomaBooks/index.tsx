import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { DiplomaBook, Diploma, GraduationDecision } from '@/types/diploma';
import { history } from 'umi';
import { useDiplomaBookModel } from '@/models/diplomaBook';
import { useGraduationDecisionModel } from '@/models/graduationDecision';
import { useDiplomaModel } from '@/models/diploma';
import moment from 'moment';

const DiplomaBooks: React.FC = () => {
  const { items: books, addBook, deleteBook } = useDiplomaBookModel();
  const { items: decisions, deleteDecision } = useGraduationDecisionModel();
  const { items: diplomas, deleteDiploma } = useDiplomaModel();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleCreateBook = async (values: { year: number }) => {
    try {
      await addBook({
        year: values.year,
        totalDiplomas: 0,
        name: `Sổ văn bằng ${values.year}`,
        fieldId: 'default',
        fieldName: 'Mặc định'
      });
      message.success('Tạo sổ văn bằng thành công');
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Không thể tạo sổ văn bằng');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Xóa tất cả văn bằng liên quan đến sổ văn bằng này
      const relatedDiplomas = diplomas.filter((d: Diploma) => {
        const decision = decisions.find((dec: GraduationDecision) => dec.id === d.graduationDecisionId);
        return decision && decision.diplomaBookId === id;
      });

      for (const diploma of relatedDiplomas) {
        await deleteDiploma(diploma.id);
      }

      // Xóa tất cả quyết định tốt nghiệp liên quan
      const relatedDecisions = decisions.filter((d: GraduationDecision) => d.diplomaBookId === id);
      for (const decision of relatedDecisions) {
        await deleteDecision(decision.id);
      }

      // Xóa sổ văn bằng
      await deleteBook(id);
      message.success('Xóa sổ văn bằng và dữ liệu liên quan thành công');
    } catch (error) {
      message.error('Không thể xóa sổ văn bằng và dữ liệu liên quan');
    }
  };

  const columns = [
    {
      title: 'Năm học',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Tổng số văn bằng',
      dataIndex: 'totalDiplomas',
      key: 'totalDiplomas',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: DiplomaBook) => (
        <>
          <Button
            type="link"
            onClick={() => {
              history.push(`/diploma-books/diplomas?year=${record.year}`);
            }}
          >
            Xem chi tiết
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </>
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
          Thêm sổ văn bằng mới
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
