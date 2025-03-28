import React from 'react';
import { Descriptions, Tag } from 'antd';
import type { Diploma } from '@/models/diploma';
import moment from 'moment';

interface DiplomaDetailProps {
  diploma: Diploma;
  fields?: any[];  // Trường động từ cấu hình
}

const DiplomaDetail: React.FC<DiplomaDetailProps> = ({ diploma, fields = [] }) => {
  return (
    <Descriptions 
      title="Thông tin văn bằng" 
      bordered
      column={2}
    >
      {/* Các trường mặc định */}
      <Descriptions.Item label="Số hiệu văn bằng">
        {diploma.diplomaNumber}
      </Descriptions.Item>

      <Descriptions.Item label="Số vào sổ">
        {diploma.sequenceNumber}
      </Descriptions.Item>

      <Descriptions.Item label="Mã sinh viên">
        {diploma.studentId}
      </Descriptions.Item>

      <Descriptions.Item label="Họ và tên">
        {diploma.fullName}
      </Descriptions.Item>

      <Descriptions.Item label="Ngày sinh">
        {moment(diploma.birthDate).format('DD/MM/YYYY')}
      </Descriptions.Item>

      <Descriptions.Item label="Quyết định tốt nghiệp">
        {diploma.decisionId}
      </Descriptions.Item>

      {/* Các trường động từ cấu hình */}
      {fields.map(field => (
        <Descriptions.Item 
          key={field.id} 
          label={field.displayName}
        >
          {field.dataType === 'date' 
            ? moment(diploma.fieldValues[field.id]).format('DD/MM/YYYY')
            : field.dataType === 'number'
            ? parseFloat(diploma.fieldValues[field.id].toString()).toLocaleString()
            : diploma.fieldValues[field.id]
          }
        </Descriptions.Item>
      ))}

    </Descriptions>
  );
};

export default DiplomaDetail;