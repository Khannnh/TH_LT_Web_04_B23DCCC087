import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { GraduationDecision, DiplomaBook } from '@/types/diploma';
import moment from 'moment';
import { useGraduationDecisionModel } from '@/models/graduationDecision';
import { useDiplomaBookModel } from '@/models/diplomaBook';
import { useHistory } from 'react-router-dom';

const { Option } = Select;

const GraduationDecisions: React.FC = () => {
  const { decisions, addDecision, updateDecision, deleteDecision } = useGraduationDecisionModel();
  const { books } = useDiplomaBookModel();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDecision, setEditingDecision] = useState<GraduationDecision>();
  const [form] = Form.useForm();
  const history = useHistory();

  const handleSubmit = async (values: any) => {
    try {
      const decisionData: GraduationDecision = {
        id: editingDecision?.id || Date.now().toString(),
        decisionNumber: values.decisionNumber,
        decisionDate: values.decisionDate.toDate(),
        diplomaBookId: values.diplomaBookId,
        createdAt: editingDecision?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      if (editingDecision) {
        updateDecision(editingDecision.id, decisionData);
        message.success('Cập nhật quyết định thành công');
      } else {
        addDecision(decisionData);
        message.success('Tạo quyết định thành công');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingDecision(undefined);
    } catch (error: any) {
      if (error.message === 'Số quyết định đã tồn tại') {
        message.error('Số quyết định đã tồn tại');
      } else {
        message.error('Không thể lưu quyết định');
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      deleteDecision(id);
      message.success('Xóa quyết định thành công');
    } catch (error) {
      message.error('Không thể xóa quyết định');
    }
  };

  const columns = [
    {
      title: 'Số QĐ',
      dataIndex: 'decisionNumber',
      key: 'decisionNumber',
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'decisionDate',
      key: 'decisionDate',
      render: (date: Date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Sổ văn bằng',
      dataIndex: 'diplomaBookId',
      key: 'diplomaBook',
      render: (diplomaBookId: string) => {
        const book = books.find(b => b.id === diplomaBookId);
        return book ? book.year : '';
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: GraduationDecision) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingDecision(record);
              form.setFieldsValue({
                ...record,
                decisionDate: moment(record.decisionDate),
              });
              setModalVisible(true);
            }}
          >
            Sửa
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
          onClick={() => {
            setEditingDecision(undefined);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Thêm quyết định mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={decisions}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingDecision ? 'Sửa quyết định' : 'Thêm quyết định mới'}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingDecision(undefined);
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="decisionNumber"
            label="Số QĐ"
            rules={[{ required: true, message: 'Vui lòng nhập số QĐ' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="decisionDate"
            label="Ngày ban hành"
            rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="diplomaBookId"
            label="Sổ văn bằng"
            rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
          >
            <Select>
              {books.map(book => (
                <Option key={book.id} value={book.id}>
                  {book.year}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingDecision ? 'Cập nhật' : 'Tạo'}
            </Button>
            <Button
              onClick={() => {
                setModalVisible(false);
                setEditingDecision(undefined);
              }}
              style={{ marginLeft: 8 }}
            >
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GraduationDecisions;
