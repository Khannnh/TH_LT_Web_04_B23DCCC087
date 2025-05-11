import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Rate, Select } from 'antd';
import useDiemDenModel from '@/models/diemDenModel';
import type { Destination } from '@/services/Destination/typing';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  .ant-card-cover img {
    height: 200px;
    object-fit: cover;
  }
`;

const DestinationCard = ({ destination }: { destination: Destination.DiemDen }) => {
  const averagePrice = useMemo(() => {
    const buaChinhPrices = Object.values(destination.anUong.buaChinh || {});
    const luuTruPrices = Object.values(destination.luuTru || {});
    const allPrices = [...buaChinhPrices, ...luuTruPrices].filter(price => typeof price === 'number' && !isNaN(price));
    if (allPrices.length === 0) return 0;
    return allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length;
  }, [destination]);

  return (
    <StyledCard
      hoverable
      cover={<img alt={destination.ten} src={destination.hinhAnhUrl} />}
    >
      <Card.Meta
        title={destination.ten}
        description={destination.moTa}
      />
      <div>Loại hình: {destination.phanloai}</div>
      <div>Giá tham khảo (ước tính): {averagePrice.toFixed(0)} VNĐ</div>
      <div>Đánh giá: <Rate disabled defaultValue={destination.rating} /> ({destination.rating}/5)</div>
    </StyledCard>
  );
};

const HomePage = () => {
  const { existingDiemDens } = useDiemDenModel();
  const [filters, setFilters] = useState({
    phanloai: null as Destination.PhanLoai | null,
    priceRange: null as 're' | 'trungbinh' | 'cao' | null,
    ratingToiThieu: null as number | null,
  });
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating_asc' | 'rating_desc' | null>(null);

  const filteredDestinations = useMemo(() => {
    return existingDiemDens.filter(destination => {
      const phanloaiFilter = filters.phanloai ? destination.phanloai === filters.phanloai : true;
      const averagePrice = (() => {
        const buaChinhPrices = Object.values(destination.anUong.buaChinh || {});
        const luuTruPrices = Object.values(destination.luuTru || {});
        const allPrices = [...buaChinhPrices, ...luuTruPrices].filter(price => typeof price === 'number' && !isNaN(price));
        if (allPrices.length === 0) return 0;
        return allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length;
      })();

      const priceRangeFilter = (() => {
        if (!filters.priceRange) return true;
        if (filters.priceRange === 're' && averagePrice <= 100000) return true;
        if (filters.priceRange === 'trungbinh' && averagePrice > 100000 && averagePrice <= 300000) return true;
        if (filters.priceRange === 'cao' && averagePrice > 300000) return true;
        return false;
      })();

      const ratingFilter = filters.ratingToiThieu !== null ? destination.rating >= filters.ratingToiThieu : true;
      return phanloaiFilter && priceRangeFilter && ratingFilter;
    });
  }, [existingDiemDens, filters]);

  const sortedDestinations = useMemo(() => {
    return [...filteredDestinations].sort((a, b) => {
      const priceA = (() => {
        const buaChinhPricesA = Object.values(a.anUong.buaChinh || {});
        const luuTruPricesA = Object.values(a.luuTru || {});
        const allPricesA = [...buaChinhPricesA, ...luuTruPricesA].filter(price => typeof price === 'number' && !isNaN(price));
        return allPricesA.length === 0 ? 0 : allPricesA.reduce((sum, price) => sum + price, 0) / allPricesA.length;
      })();
      const priceB = (() => {
        const buaChinhPricesB = Object.values(b.anUong.buaChinh || {});
        const luuTruPricesB = Object.values(b.luuTru || {});
        const allPricesB = [...buaChinhPricesB, ...luuTruPricesB].filter(price => typeof price === 'number' && !isNaN(price));
        return allPricesB.length === 0 ? 0 : allPricesB.reduce((sum, price) => sum + price, 0) / allPricesB.length;
      })();

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'rating_asc') return a.rating - b.rating;
      if (sortBy === 'rating_desc') return b.rating - a.rating;
      return 0;
    });
  }, [filteredDestinations, sortBy]);

  const handleFilterChange = (name: keyof typeof filters, value: any) => {
    setFilters({ ...filters, [name]: value });
  };

  const handleSortChange = (value: 'price_asc' | 'price_desc' | 'rating_asc' | 'rating_desc' | null) => {
    setSortBy(value);
  };

  return (
    <div>
      <h1>Khám phá điểm đến</h1>
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="Lọc theo loại hình"
          onChange={(value) => handleFilterChange('phanloai', value)}
          style={{ width: 180, marginRight: 16 }}
          allowClear
        >
          <Select.Option value="thanhpho">Thành phố</Select.Option>
          <Select.Option value="bien">Biển</Select.Option>
          <Select.Option value="nui">Núi</Select.Option>
          <Select.Option value="ho">Hồ</Select.Option>
          <Select.Option value="khuvucvanhoa">Khu vực văn hóa</Select.Option>
        </Select>

        <Select
          placeholder="Lọc theo giá"
          onChange={(value) => handleFilterChange('priceRange', value)}
          style={{ width: 180, marginRight: 16 }}
          allowClear
        >
          <Select.Option value="re">Giá rẻ</Select.Option>
          <Select.Option value="trungbinh">Giá trung bình</Select.Option>
          <Select.Option value="cao">Giá cao</Select.Option>
        </Select>

        <Select
          placeholder="Đánh giá tối thiểu"
          onChange={(value) => handleFilterChange('ratingToiThieu', value)}
          style={{ width: 180, marginRight: 16 }}
          allowClear
        >
          <Select.Option value={1}>1 sao trở lên</Select.Option>
          <Select.Option value={2}>2 sao trở lên</Select.Option>
          <Select.Option value={3}>3 sao trở lên</Select.Option>
          <Select.Option value={4}>4 sao trở lên</Select.Option>
          <Select.Option value={5}>5 sao</Select.Option>
        </Select>

        <Select
          placeholder="Sắp xếp theo"
          onChange={handleSortChange}
          style={{ width: 180 }}
          allowClear
        >
          <Select.Option value="price_asc">Giá tăng dần</Select.Option>
          <Select.Option value="price_desc">Giá giảm dần</Select.Option>
          <Select.Option value="rating_asc">Đánh giá tăng dần</Select.Option>
          <Select.Option value="rating_desc">Đánh giá giảm dần</Select.Option>
        </Select>
      </div>
      <Row gutter={[16, 16]}>
        {sortedDestinations.map((destination) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={destination.id}>
            <DestinationCard destination={destination} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomePage;