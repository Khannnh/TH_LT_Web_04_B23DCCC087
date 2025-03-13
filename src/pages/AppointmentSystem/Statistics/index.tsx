import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, DatePicker, Statistic } from 'antd';
import { Line, Column } from '@ant-design/charts';
import moment from 'moment';
import { getStatistics } from '@/services/statistics';

const { RangePicker } = DatePicker;

const StatisticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
    moment().startOf('month'),
    moment().endOf('month'),
  ]);
  const [statistics, setStatistics] = useState<any>({});

  useEffect(() => {
    loadStatistics();
  }, [dateRange]);

  const loadStatistics = async () => {
    try {
      const response = await getStatistics({
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      });
      setStatistics(response);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  return (
    <PageContainer>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [moment.Moment, moment.Moment])}
              style={{ marginBottom: 24 }}
            />
          </Col>

          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng số lịch hẹn"
                value={statistics.totalAppointments}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <Statistic
                title="Doanh thu"
                value={statistics.totalRevenue}
                prefix="₫"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <Statistic
                title="Đánh giá trung bình"
                value={statistics.averageRating}
                precision={1}
                suffix="/5"
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <Statistic
                title="Tỷ lệ hoàn thành"
                value={statistics.completionRate}
                suffix="%"
                precision={1}
              />
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Doanh thu theo ngày">
              <Line
                data={statistics.revenueByDay || []}
                xField="date"
                yField="revenue"
                point={{
                  size: 5,
                  shape: 'diamond',
                }}
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Doanh thu theo dịch vụ">
              <Column
                data={statistics.revenueByService || []}
                xField="service"
                yField="revenue"
                label={{
                  position: 'middle',
                  style: {
                    fill: '#FFFFFF',
                    opacity: 0.6,
                  },
                }}
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Số lịch hẹn theo nhân viên">
              <Column
                data={statistics.appointmentsByEmployee || []}
                xField="employee"
                yField="appointments"
                label={{
                  position: 'middle',
                  style: {
                    fill: '#FFFFFF',
                    opacity: 0.6,
                  },
                }}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default StatisticsPage;