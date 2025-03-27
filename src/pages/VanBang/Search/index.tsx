import React from 'react';
import { Form, Input, DatePicker, Button, Table, Card, message, Modal, Descriptions, Empty } from 'antd';
import type { Diploma, GraduationDecision, DiplomaBook } from '@/types/diploma';
import moment from 'moment';
import { useGraduationDecisionModel } from '@/models/graduationDecision';
import { useDiplomaBookModel } from '@/models/diplomaBook';
import { useDiplomaModel } from '@/models/diploma';

const STORAGE_KEY = 'search-history';

const Search: React.FC = () => {
  const [form] = Form.useForm();

  // Khởi tạo state
  const [loading, setLoading] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<Diploma[]>([]);
  const [selectedDiploma, setSelectedDiploma] = React.useState<Diploma | null>(null);
  const [detailModalVisible, setDetailModalVisible] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [searchHistory, setSearchHistory] = React.useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // Lấy dữ liệu từ models
  const { items: diplomas } = useDiplomaModel();
  const { items: decisions } = useGraduationDecisionModel();
  const { items: books } = useDiplomaBookModel();

  const recordSearch = React.useCallback((graduationDecisionIds: string[]) => {
    setSearchHistory(prev => {
      const newHistory = { ...prev };
      graduationDecisionIds.forEach(id => {
        newHistory[id] = (prev[id] || 0) + 1;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const handleSearch = React.useCallback(async (values: any) => {
    setLoading(true);
    try {
      const filledFields = Object.entries(values).filter(([_, value]) => {
        if (value === undefined || value === '') return false;
        if (value instanceof moment) return true;
        return true;
      });

      if (filledFields.length < 2) {
        message.warning('Vui lòng nhập ít nhất 2 thông tin để tìm kiếm');
        setLoading(false);
        return;
      }

      const results = diplomas.filter(diploma => {
        const matchDiplomaNumber = !values.diplomaNumber || diploma.diplomaNumber === values.diplomaNumber;
        const matchBookNumber = !values.bookNumber || diploma.bookNumber === Number(values.bookNumber);
        const matchStudentId = !values.studentId || diploma.studentId === values.studentId;
        const matchFullName = !values.fullName || diploma.fullName.toLowerCase().includes(values.fullName.toLowerCase());
        const matchDateOfBirth = !values.dateOfBirth || moment(diploma.dateOfBirth).isSame(values.dateOfBirth, 'day');

        return matchDiplomaNumber && matchBookNumber && matchStudentId && matchFullName && matchDateOfBirth;
      });

      // Ghi nhận lượt tìm kiếm cho các kết quả trùng khớp
      if (results.length > 0) {
        const matchedDecisionIds = results.map(r => r.graduationDecisionId);
        recordSearch(matchedDecisionIds);
      }

      setSearchResults(results);
      setHasSearched(true);
      if (results.length === 0) {
        message.info('Không tìm thấy kết quả phù hợp');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  }, [diplomas, recordSearch]);

  const handleReset = React.useCallback(() => {
    form.resetFields();
    setSearchResults([]);
    setHasSearched(false);
  }, [form]);

  const handleViewDetail = React.useCallback((record: Diploma) => {
    setSelectedDiploma(record);
    setDetailModalVisible(true);
  }, []);

  const columns = React.useMemo(() => [
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
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Quyết định',
      dataIndex: 'graduationDecisionId',
      key: 'graduationDecision',
      render: (decisionId: string) => {
        const decision = decisions?.find((d: GraduationDecision) => d.id === decisionId);
        return decision?.decisionNumber || '';
      }
    },
    {
      title: 'Số lượt tra cứu',
      dataIndex: 'graduationDecisionId',
      key: 'searchCount',
      render: (decisionId: string) => {
        const count = searchHistory[decisionId] || 0;
        return <span style={{ color: count > 0 ? '#1890ff' : undefined }}>{count}</span>;
      }
    },
    {
      title: 'Chi tiết',
      key: 'action',
      render: (_: any, record: Diploma) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ], [decisions, searchHistory, handleViewDetail]);

  const renderDetailModal = React.useCallback(() => {
    if (!selectedDiploma) return null;

    const decision = decisions?.find((d: GraduationDecision) => d.id === selectedDiploma.graduationDecisionId);
    const book = books?.find((b: DiplomaBook) => b.id === decision?.diplomaBookId);

    return (
      <Modal
        title="Chi tiết văn bằng"
        visible={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedDiploma(null);
        }}
        footer={null}
        width={800}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Số hiệu văn bằng" span={2}>
            {selectedDiploma.diplomaNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Số vào sổ" span={2}>
            {selectedDiploma.bookNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Mã sinh viên">
            {selectedDiploma.studentId}
          </Descriptions.Item>
          <Descriptions.Item label="Họ tên">
            {selectedDiploma.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {moment(selectedDiploma.dateOfBirth).format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Năm học">
            {book?.year}
          </Descriptions.Item>
          <Descriptions.Item label="Số quyết định" span={2}>
            {decision?.decisionNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày quyết định" span={2}>
            {decision ? moment(decision.decisionDate).format('DD/MM/YYYY') : ''}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    );
  }, [selectedDiploma, decisions, books, detailModalVisible]);

  return (
    <div>
      <Card title="Tra cứu văn bằng" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          onFinish={handleSearch}
          layout="vertical"
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <Form.Item
              name="diplomaNumber"
              label="Số hiệu văn bằng"
            >
              <Input placeholder="Nhập số hiệu văn bằng" />
            </Form.Item>
            <Form.Item
              name="bookNumber"
              label="Số vào sổ"
            >
              <Input type="number" placeholder="Nhập số vào sổ" />
            </Form.Item>
            <Form.Item
              name="studentId"
              label="Mã sinh viên"
            >
              <Input placeholder="Nhập mã sinh viên" />
            </Form.Item>
            <Form.Item
              name="fullName"
              label="Họ tên"
            >
              <Input placeholder="Nhập họ tên" />
            </Form.Item>
            <Form.Item
              name="dateOfBirth"
              label="Ngày sinh"
            >
              <DatePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày sinh"
              />
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Tìm kiếm
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleReset}>
              Làm mới
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {hasSearched && (
        <Table
          columns={columns}
          dataSource={searchResults}
          rowKey="id"
          loading={loading}
          locale={{
            emptyText: <Empty description="Không tìm thấy kết quả phù hợp" />
          }}
        />
      )}

      {renderDetailModal()}
    </div>
  );
};

export default Search;
