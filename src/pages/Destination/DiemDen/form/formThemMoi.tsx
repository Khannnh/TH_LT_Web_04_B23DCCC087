import React from 'react';
import { Form, Input, InputNumber, Rate, Row, Col, Button, message, Select } from 'antd';
import type { FormInstance } from 'antd';
import type { Destination } from '@/services/Destination/typing';
import FormItemUrlOrUpload from '@/components/Upload/FormItemUrlOrUpload';
import { buildUpLoadFile, EFileScope } from '@/services/uploadFile';

interface ThemMoiDiemDenFormProps {
  onFinish: (values: Omit<Destination.DiemDen, 'id'>) => void;
  onCancel: () => void;
  form: FormInstance<any>;
}

export const ThemMoiDiemDenForm: React.FC<ThemMoiDiemDenFormProps> = ({ onFinish, onCancel, form }) => {
  const handleFinish = async (values: any) => {
    console.log('Giá trị của values.hinhAnh khi submit:', values.hinhAnh);

    let hinhAnhUrl = values.hinhAnh;

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

    const finalValues = { ...values, hinhAnhUrl };
    onFinish(finalValues as Omit<Destination.DiemDen, 'id'>);
    form.resetFields();
  };

    const phanLoaiOptions = [
    { label: 'Thành phố 🏙', value: 'thanhpho' },
    { label: 'Biển🌊', value: 'bien' },
    { label: 'Núi ⛰', value: 'nui' },
    { label: 'Hồ ', value: 'ho' },
    { label: 'Khu vực văn hóa', value: 'khuvucvanhoa' },
  ];

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
            name="phanloai"
            label="Phân loại"
            rules={[{ required: true, message: 'Vui lòng chọn phân loại!' }]}
          >
             <Select placeholder="Chọn phân loại" options={phanLoaiOptions} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <Form.Item
            name="thoiGianThamQuan"
            label="Thời gian tham quan (giờ)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian tham quan!' }]}
          >
            <InputNumber min={0.1} step={0.1} placeholder="Ví dụ: 1.5" />
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
            <Input.TextArea rows={5} placeholder="Nhập mô tả về điểm đến" />
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
          <Form.Item name={['luuTru', 'tietkiem']} label="Lưu trú (Tiết kiệm) /người/ giờ">
            <InputNumber min={0} placeholder="Giá (VNĐ)" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Form.Item name={['luuTru', 'trungbinh']} label="Lưu trú (Trung bình) /người/ giờ">
            <InputNumber min={0} placeholder="Giá (VNĐ)" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Form.Item name={['luuTru', 'caocap']} label="Lưu trú (Cao cấp) /người/ giờ">
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