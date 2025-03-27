import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Diploma, DiplomaField, GraduationDecision } from '@/types/diploma';
import moment from 'moment';
import { useDiplomaModel } from '@/models/diploma';
import { useDiplomaFieldModel } from '@/models/diplomaField';
import { useGraduationDecisionModel } from '@/models/graduationDecision';

const { Option } = Select;

const Diplomas: React.FC = () => {
  const { diplomas, addDiploma, updateDiploma, deleteDiploma } = useDiplomaModel();
  const { fields } = useDiplomaFieldModel();
  const { decisions } = useGraduationDecisionModel();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDiploma, setEditingDiploma] = useState<Diploma>();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      const diplomaData: Diploma = {
        id: editingDiploma?.id || Date.now().toString(),
        bookNumber: editingDiploma?.bookNumber || diplomas.length + 1,
        diplomaNumber: values.diplomaNumber,
        studentId: values.studentId,
        fullName: values.fullName,
        dateOfBirth: values.dateOfBirth.toDate(),
        graduationDecisionId: values.graduationDecisionId,
        fields: Object.entries(values.fields || {}).map(([fieldId, value]) => {
          const field = fields.find(f => f.id === fieldId);
          let typedValue: string | number | Date = value as string;

          if (field) {
            switch (field.dataType) {
              case 'Number':
                typedValue = Number(value);
                break;
              case 'Date':
                typedValue = (value as moment.Moment).toDate();
                break;
              default:
                typedValue = String(value);
            }
          }

          return {
            fieldId,
            value: typedValue,
          };
        }),
        createdAt: editingDiploma?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      if (editingDiploma) {
        updateDiploma(editingDiploma.id, diplomaData);
        message.success('Cập nhật văn bằng thành công');
      } else {
        addDiploma(diplomaData);
        message.success('Tạo văn bằng thành công');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingDiploma(undefined);
    } catch (error) {
      message.error('Không thể lưu văn bằng');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      deleteDiploma(id);
      message.success('Xóa văn bằng thành công');
    } catch (error) {
      message.error('Không thể xóa văn bằng');
    }
  };

  const columns = [
    {
      title: 'Số vào sổ',
      dataIndex: 'bookNumber',
      key: 'bookNumber',
    },
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'diplomaNumber',
      key: 'diplomaNumber',
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (date: Date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Quyết định',
      dataIndex: 'graduationDecisionId',
      key: 'graduationDecision',
      render: (graduationDecisionId: string) => {
        const decision = decisions.find(d => d.id === graduationDecisionId);
        return decision ? decision.decisionNumber : '';
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Diploma) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingDiploma(record);
              form.setFieldsValue({
                ...record,
                dateOfBirth: moment(record.dateOfBirth),
                fields: record.fields.reduce((acc, field) => ({
                  ...acc,
                  [field.fieldId]: field.value,
                }), {}),
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

  const renderFieldInput = (field: DiplomaField) => {
    switch (field.dataType) {
      case 'String':
        return <Input />;
      case 'Number':
        return <Input type="number" />;
      case 'Date':
        return <DatePicker style={{ width: '100%' }} />;
      default:
        return <Input />;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingDiploma(undefined);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Thêm văn bằng mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={diplomas}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingDiploma ? 'Sửa văn bằng' : 'Thêm văn bằng mới'}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingDiploma(undefined);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="diplomaNumber"
            label="Số hiệu văn bằng"
            rules={[{ required: true, message: 'Vui lòng nhập số hiệu văn bằng' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="studentId"
            label="Mã sinh viên"
            rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="graduationDecisionId"
            label="Quyết định tốt nghiệp"
            rules={[{ required: true, message: 'Vui lòng chọn quyết định tốt nghiệp' }]}
          >
            <Select>
              {decisions.map(decision => (
                <Option key={decision.id} value={decision.id}>
                  {decision.decisionNumber}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {fields.map(field => (
            <Form.Item
              key={field.id}
              name={['fields', field.id]}
              label={field.name}
              rules={field.isRequired ? [{ required: true, message: `Vui lòng nhập ${field.name}` }] : []}
            >
              {renderFieldInput(field)}
            </Form.Item>
          ))}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingDiploma ? 'Cập nhật' : 'Tạo'}
            </Button>
            <Button
              onClick={() => {
                setModalVisible(false);
                setEditingDiploma(undefined);
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

export default Diplomas;
