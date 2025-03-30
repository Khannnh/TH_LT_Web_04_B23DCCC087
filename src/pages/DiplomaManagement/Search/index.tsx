import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Empty, message } from 'antd';
import DiplomaSearchForm from '@/components/DiplomaSearchForm';
import DiplomaDetail from '@/components/DiplomaDetail';
import type { Diploma, SearchCriteria } from '@/models/diploma';
import { diplomaService } from '@/services/diploma';

const DiplomaSearchPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<Diploma | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (criteria: SearchCriteria) => {
    setLoading(true);
    try {
      const result = await diplomaService.search(criteria);
      setSearchResult(result || null);
      setSearched(true);
      
      // Update search count if found
      if (result?.decisionId) {
        await diplomaService.incrementSearchCount(result.decisionId);
      }
    } catch (error) {
      message.error('Không tìm thấy thông tin văn bằng');
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Card>
        <Alert
          message="Tra cứu thông tin văn bằng"
          description="Vui lòng nhập ít nhất 2 thông tin để tra cứu văn bằng"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <DiplomaSearchForm 
          onSearch={handleSearch}
          loading={loading}
        />

        {searched && (
          <div style={{ marginTop: 24 }}>
            {searchResult ? (
              <DiplomaDetail diploma={searchResult} />
            ) : (
              <Empty description="Không tìm thấy thông tin văn bằng" />
            )}
          </div>
        )}
      </Card>
    </PageContainer>
  );
};

export default DiplomaSearchPage;