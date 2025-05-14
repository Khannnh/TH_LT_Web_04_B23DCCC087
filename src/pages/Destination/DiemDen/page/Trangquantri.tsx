// src/pages/Admin/QuanLyDiemDen/index.tsx
import React, { useState } from 'react';
import { Button, Card, Col, Row, Rate, Modal, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Destination } from '@/services/Destination/typing';
import {ThemMoiDiemDenForm} from '@/pages/Destination/DiemDen/form/formThemMoi';
import useQuanLyDiemDen from '@/pages/Destination/DiemDen/hook/useQuanLyDiemDen';
import useDiemDenModel from '@/models/diemDenModel'; 

const QuanLyDiemDen: React.FC = () => {
  const { existingDiemDens, loading, error, handleCreateDiemDens, handleUpdateDiemDen, handleDeleteDiemDen } = useQuanLyDiemDen();
  const { startEditDiemDen, editingDiemDen, clearEditingDiemDen } = useDiemDenModel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    clearEditingDiemDen();
  };

  const handleCreateFormFinish = (values: Omit<Destination.DiemDen, 'id'>) => {
    handleCreateDiemDens(values);
    
    // Lưu thời gian tạo điểm đến mới
    const danhSachLichTrinh = JSON.parse(localStorage.getItem('danhSachLichTrinh') || '[]');
    danhSachLichTrinh.push({
      ngayTao: new Date().toISOString(),
      diaDiem: [values.ten]
    });
    localStorage.setItem('danhSachLichTrinh', JSON.stringify(danhSachLichTrinh));
    
    setIsModalOpen(false);
    form.resetFields();
};

  const handleEdit = (diemDen: Destination.DiemDen) => {
    startEditDiemDen(diemDen);
    setIsModalOpen(true);
    form.setFieldsValue(diemDen);
  };

  const handleUpdateFormFinish = (values: Destination.DiemDen) => {
    if (editingDiemDen) {
      handleUpdateDiemDen({ ...editingDiemDen, ...values });
      setIsModalOpen(false);
      clearEditingDiemDen();
      form.resetFields();
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div>
      <h2>Quản lý điểm đến</h2>
      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Thêm mới điểm đến
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {existingDiemDens.map((diemDen) => (
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
                <Button size="small" key =" edit" onClick={() => handleEdit(diemDen)}>Sửa</Button>,
                <Button size="small" key =" delete" danger onClick={() => handleDeleteDiemDen(diemDen.id)}>
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
                    <div style={{ fontSize: 12, color: 'gray', marginTop: 8 }}>
                      <strong>Loại:</strong> {diemDen.phanloai}
                    </div>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={editingDiemDen ? 'Chỉnh sửa điểm đến' : 'Thêm mới điểm đến'}
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <ThemMoiDiemDenForm
          onFinish={editingDiemDen ? handleUpdateFormFinish : handleCreateFormFinish}
          onCancel={handleCancel}
          form={form}
          initialValues={editingDiemDen || undefined}
        />
      </Modal>
    </div>
  );
};

export default QuanLyDiemDen;