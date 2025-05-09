// src/pages/Admin/QuanLyDiemDen/index.tsx
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Rate, Modal, message, Form, Input, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Destination } from '@/services/Destination/typing';
import { buildUpLoadFile, EFileScope } from '@/services/uploadFile';
import FormItemUrlOrUpload from '@/components/Upload/FormItemUrlOrUpload';

// Giả định dữ liệu điểm đến được lưu trong localStorage với key này
const LOCAL_STORAGE_KEY = 'diemDens';

interface ThemMoiDiemDenFormProps {
  onFinish: (values: Omit<Destination.DiemDen, 'id'>) => void;
  onCancel: () => void;
  form: Form.FormInstance<any>;
}

const ThemMoiDiemDenForm: React.FC<ThemMoiDiemDenFormProps> = ({ onFinish, onCancel, form }) => {
  const handleFinish = async (values: any) => {
    console.log('Form values:', values);

    let hinhAnhUrl = values.hinhAnh;

    // Kiểm tra nếu người dùng đã chọn tải lên file (object có fileList)
    if (typeof values.hinhAnh !== 'string' && values.hinhAnh?.fileList?.length > 0) {
      try {
        const uploadedUrl = await buildUpLoadFile(values, 'hinhAnh', EFileScope.PUBLIC);
        if (uploadedUrl) {
          hinhAnhUrl = uploadedUrl;
        } else {
          message.error('Tải lên hình ảnh thất bại.');
          return;
        }
      } catch (error: any) {
        message.error(`Lỗi tải lên hình ảnh: ${error?.message || 'Có lỗi xảy ra'}`);
        return;
      }
    }
    // Nếu là URL (string), chúng ta sẽ sử dụng trực tiếp

    const finalValues = { ...values, hinhAnhUrl };
    onFinish(finalValues as Omit<Destination.DiemDen, 'id'>);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <Form.Item
            name="ten"
            label="Tên điểm đến"
            rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến!' }]}
          >
            <Input placeholder="Nhập tên điểm đến" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <Form.Item
            name="thoiGianThamQuan"
            label="Thời gian tham quan (giờ)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian tham quan!' }]}
          >
            <InputNumber min={0.01} step={0.01} placeholder="Ví dụ: 1.5" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <Form.Item
            name="rating"
            label="Đánh giá"
            rules={[{ required: true, message: 'Vui lòng chọn đánh giá!' }]}
          >
            <Rate count={5} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Form.Item
            name="moTa"
            label="Mô tả"
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả về điểm đến" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Form.Item name={['anUong', 'buaPhu', 're']} label="Ăn phụ (Rẻ)">
            <InputNumber min={0} placeholder="Giá (VNĐ)" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Form.Item name={['anUong', 'buaPhu', 'daydu']} label="Ăn phụ (Đầy đủ)">
            <InputNumber min={0} placeholder="Giá (VNĐ)" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Form.Item name={['anUong', 'buaChinh', 're']} label="Ăn chính (Rẻ)">
            <InputNumber min={0} placeholder="Giá (VNĐ)" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Form.Item name={['anUong', 'buaChinh', 'trungbinh']} label="Ăn chính (Trung bình)">
            <InputNumber min={0} placeholder="Giá (VNĐ)" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Form.Item name={['anUong', 'buaChinh', 'caocap']} label="Ăn chính (Cao cấp)">
            <InputNumber min={0} placeholder="Giá (VNĐ)" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Form.Item name={['luuTru', 'tietkiem']} label="Lưu trú (Tiết kiệm) / giờ">
            <InputNumber min={0} placeholder="Giá (VNĐ)" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Form.Item name={['luuTru', 'trungbinh']} label="Lưu trú (Trung bình) / giờ">
            <InputNumber min={0} placeholder="Giá (VNĐ)" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Form.Item name={['luuTru', 'caocap']} label="Lưu trú (Cao cấp) / giờ">
            <InputNumber min={0} placeholder="Giá (VNĐ)" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <FormItemUrlOrUpload
            form={form}
            field="hinhAnh"
            label="Hình ảnh"
            isRequired={true}
            accept="image/*"
          />
        </Col>
      </Row>

      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            Thêm mới
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const QuanLyDiemDen: React.FC = () => {
  const [diemDens, setDiemDens] = useState<Destination.DiemDen[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedDiemDens = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedDiemDens) {
      setDiemDens(JSON.parse(storedDiemDens));
    }
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleCreateDiemDens = (values: Omit<Destination.DiemDen, 'id'>) => {
    const newDiemDen: Destination.DiemDen = { id: Date.now().toString(), ...values };
    const updatedDiemDens = [...diemDens, newDiemDen];
    setDiemDens(updatedDiemDens);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedDiemDens));
    message.success('Thêm mới điểm đến thành công!');
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa điểm đến này?',
      onOk() {
        const updatedDiemDens = diemDens.filter((diemDen) => diemDen.id !== id);
        setDiemDens(updatedDiemDens);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedDiemDens));
        message.success('Xóa điểm đến thành công!');
      },
    });
  };

  return (
    <div>
      <h2>Quản lý điểm đến</h2>
      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Thêm mới điểm đến
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {diemDens.map((diemDen) => (
          <Col key={diemDen.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              cover={
                diemDen.hinhAnhUrl ? (
                  <img
                    alt={diemDen.ten}
                    src={diemDen.hinhAnhUrl}
                    style={{ height: 150, objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ height: 150, backgroundColor: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    Không có ảnh
                  </div>
                )
              }
              actions={[
                <Button size="small">Sửa</Button>,
                <Button size="small" danger onClick={() => handleDelete(diemDen.id)}>
                  Xóa
                </Button>,
              ]}
            >
              <Card.Meta
                title={diemDen.ten}
                description={
                  <>
                    <Rate disabled defaultValue={diemDen.rating} />
                    {diemDen.moTa && <div style={{ fontSize: 12, color: 'gray', marginTop: 8 }}>{diemDen.moTa.substring(0, 50)}...</div>}
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Thêm mới điểm đến"
        visible ={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <ThemMoiDiemDenForm onFinish={handleCreateDiemDens} onCancel={handleCancel} form={form} />
      </Modal>
    </div>
  );
};

export default QuanLyDiemDen;