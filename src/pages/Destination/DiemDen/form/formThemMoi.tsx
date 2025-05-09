// src/components/ThemMoiDiemDenForm.tsx
import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Rate, Upload, Row, Col, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { Destination } from '@/services/Destination/typing';

interface ThemMoiDiemDenFormProps {
  onFinish: (values: Omit<Destination.DiemDen, 'id'>) => void;
  onCancel: () => void;
}

const { Option } = Select;

const ThemMoiDiemDenForm: React.FC<ThemMoiDiemDenFormProps> = ({ onFinish, onCancel }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: Omit<Destination.DiemDen, 'id'>) => {
    onFinish(values);
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
          <Form.Item
            name="hinhAnhUrl"
            label="URL hình ảnh"
          >
            <Input placeholder="Nhập URL hình ảnh" />
            {/* Hoặc bạn có thể sử dụng component Upload của Ant Design */}
            {/* <Form.Item name="hinhAnh" label="Hình ảnh">
              <Upload listType="picture">
                <Button icon={<UploadOutlined />}>Tải lên</Button>
              </Upload>
            </Form.Item> */}
          </Form.Item>
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

export default ThemMoiDiemDenForm;