import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Diploma, DiplomaField, GraduationDecision, DiplomaBook } from '@/types/diploma';
import moment from 'moment';
import { useDiplomaModel } from '@/models/diploma';
import { useDiplomaFieldModel } from '@/models/diplomaField';
import { useGraduationDecisionModel } from '@/models/graduationDecision';
import { useLocation, useHistory } from 'react-router-dom';
import { useDiplomaBookModel } from '@/models/diplomaBook';

const { Option } = Select;

const Diplomas: React.FC = () => {
  const { items: diplomas, addDiploma, updateDiploma, deleteDiploma } = useDiplomaModel();
  const { items: fields } = useDiplomaFieldModel();
  const { items: decisions } = useGraduationDecisionModel();
  const { items: books, updateBook } = useDiplomaBookModel();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDiploma, setEditingDiploma] = useState<Diploma>();
  const [filterForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const location = useLocation();
  const history = useHistory();

  // Khởi tạo giá trị filter từ URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const year = params.get('year');
    const decisionNumber = params.get('decisionNumber');

    if (year || decisionNumber) {
      filterForm.setFieldsValue({
        year: year ? Number(year) : undefined,
        decisionNumber: decisionNumber || undefined
      });
    }
  }, [location.search]);

  // Xử lý khi thay đổi filter
  const handleFilterChange = (changedValues: any) => {
    const currentValues = filterForm.getFieldsValue();
    const params = new URLSearchParams();

    // Nếu có số quyết định, tự động lấy năm học tương ứng
    if (currentValues.decisionNumber) {
      const decision = decisions?.find(d => d.id === currentValues.decisionNumber);
      if (decision) {
        const book = books?.find(b => b.id === decision.diplomaBookId);
        if (book) {
          currentValues.year = book.year;
        }
      }
    }

    if (currentValues.year) {
      params.append('year', currentValues.year.toString());
    }
    if (currentValues.decisionNumber) {
      params.append('decisionNumber', currentValues.decisionNumber);
    }

    history.push(`/diploma-books/diplomas?${params.toString()}`);
  };

  // Lọc văn bằng theo điều kiện
  const getFilteredDiplomas = () => {
    const values = filterForm.getFieldsValue();

    return diplomas?.filter(diploma => {
      const decision = decisions?.find(d => d.id === diploma.graduationDecisionId);
      if (!decision) return false;

      // Lọc theo số quyết định
      if (values.decisionNumber && decision.decisionNumber !== values.decisionNumber) {
        return false;
      }

      // Lọc theo năm học
      if (values.year) {
        const book = books?.find(b => b.id === decision.diplomaBookId);
        if (!book || book.year !== Number(values.year)) {
          return false;
        }
      }

      return true;
    }) || [];
  };

  // Lấy danh sách sổ văn bằng theo trường và năm học
  const getFilteredBooks = () => {
    const values = filterForm.getFieldsValue();
    return books?.filter(book => {
      if (values.year && book.year !== Number(values.year)) {
        return false;
      }
      return true;
    }) || [];
  };

  // Hàm xác định số thứ tự văn bằng mới
  const determineBookNumber = (graduationDecisionId: string): number => {
    const decision = decisions?.find(d => d.id === graduationDecisionId);
    if (!decision) return 1;

    const book = books?.find(b => b.id === decision.diplomaBookId);
    if (!book) return 1;

    // Lấy danh sách văn bằng của cùng năm học
    const diplomasInSameYear = diplomas?.filter(diploma => {
      const diplomaDecision = decisions?.find(d => d.id === diploma.graduationDecisionId);
      if (!diplomaDecision) return false;
      const diplomaBook = books?.find(b => b.id === diplomaDecision.diplomaBookId);
      return diplomaBook?.year === book.year;
    }) || [];

    // Nếu không có văn bằng nào trong năm học này, bắt đầu từ 1
    if (diplomasInSameYear.length === 0) return 1;

    // Tìm số thứ tự lớn nhất và tăng thêm 1
    const maxBookNumber = Math.max(...diplomasInSameYear.map(d => d.bookNumber));
    return maxBookNumber + 1;
  };

  // Hàm xác định số hiệu văn bằng mới
  const determineDiplomaNumber = (graduationDecisionId: string): string => {
    const decision = decisions?.find(d => d.id === graduationDecisionId);
    if (!decision) return '1';

    const book = books?.find(b => b.id === decision.diplomaBookId);
    if (!book) return '1';

    // Lấy danh sách văn bằng của cùng năm học
    const diplomasInSameYear = diplomas?.filter(diploma => {
      const diplomaDecision = decisions?.find(d => d.id === diploma.graduationDecisionId);
      if (!diplomaDecision) return false;
      const diplomaBook = books?.find(b => b.id === diplomaDecision.diplomaBookId);
      return diplomaBook?.year === book.year;
    }) || [];

    // Nếu không có văn bằng nào trong năm học này, bắt đầu từ 1
    if (diplomasInSameYear.length === 0) return '1';

    // Tìm số hiệu văn bằng lớn nhất và tăng thêm 1
    const maxDiplomaNumber = Math.max(...diplomasInSameYear.map(d => parseInt(d.diplomaNumber)));
    return (maxDiplomaNumber + 1).toString();
  };

  const handleSubmit = async (values: any) => {
    try {
      // Xác định số thứ tự văn bằng mới
      const bookNumber = editingDiploma
        ? editingDiploma.bookNumber
        : determineBookNumber(values.graduationDecisionId);

      // Xác định số hiệu văn bằng mới
      const diplomaNumber = editingDiploma
        ? values.diplomaNumber
        : determineDiplomaNumber(values.graduationDecisionId);

      const diplomaData: Diploma = {
        id: editingDiploma?.id || Date.now().toString(),
        bookNumber,
        diplomaNumber,
        studentId: values.studentId,
        fullName: values.fullName,
        dateOfBirth: values.dateOfBirth.toDate(),
        graduationDecisionId: values.graduationDecisionId,
        fields: Object.entries(values.fields || {}).map(([fieldId, value]) => {
          const field = fields?.find(f => f.id === fieldId);
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
        // Thêm văn bằng mới
        addDiploma(diplomaData);

        // Cập nhật số lượng văn bằng trong sổ
        const decision = decisions?.find(d => d.id === values.graduationDecisionId);
        if (decision) {
          const book = books?.find(b => b.id === decision.diplomaBookId);
          if (book) {
            updateBook(book.id, {
              ...book,
              totalDiplomas: book.totalDiplomas + 1
            });
          }
        }

        message.success('Tạo văn bằng thành công');
      }
      setModalVisible(false);
      editForm.resetFields();
      setEditingDiploma(undefined);
    } catch (error) {
      message.error('Không thể lưu văn bằng');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const diploma = diplomas?.find(d => d.id === id);
      if (diploma) {
        const decision = decisions?.find(d => d.id === diploma.graduationDecisionId);
        if (decision) {
          const book = books?.find(b => b.id === decision.diplomaBookId);
          if (book) {
            // Cập nhật số lượng văn bằng trong sổ
            updateBook(book.id, {
              ...book,
              totalDiplomas: Math.max(0, book.totalDiplomas - 1)
            });
          }
        }
      }

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
        const decision = decisions?.find(d => d.id === graduationDecisionId);
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
              editForm.setFieldsValue({
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
            editForm.resetFields();
            setModalVisible(true);
          }}
        >
          Thêm văn bằng mới
        </Button>
      </div>

      <Form
        form={filterForm}
        layout="inline"
        style={{ marginBottom: 16 }}
        onValuesChange={handleFilterChange}
      >
        <Form.Item name="year" label="Năm học">
          <Select
            style={{ width: 120 }}
            allowClear
            disabled={!!filterForm.getFieldValue('decisionNumber')}
          >
            {books?.map(book => book.year)
              .filter((year, index, self) => self.indexOf(year) === index)
              .sort((a, b) => b - a)
              .map(year => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="decisionNumber" label="Số quyết định">
          <Select
            style={{ width: 200 }}
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {decisions?.filter(d => {
              const year = filterForm.getFieldValue('year');
              if (!year) return true;
              const book = books?.find(b => b.id === d.diplomaBookId);
              return book && book.year === year;
            })
            .map(d => (
              <Option key={d.id} value={d.decisionNumber}>
                {d.decisionNumber}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={getFilteredDiplomas()}
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
          form={editForm}
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
            rules={[
              { required: true, message: 'Vui lòng chọn quyết định tốt nghiệp' }
            ]}
          >
            <Select>
              {decisions?.map(decision => (
                <Option key={decision.id} value={decision.id}>
                  {decision.decisionNumber}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {fields?.map(field => (
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
