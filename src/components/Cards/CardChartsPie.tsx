/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Card, Col, Row, Spinner } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { uRupiah } from '@utils/utils';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  labels?: string[];
  data?: number[];
  title?: string;
  colors?: string[];
  toRupiah?: boolean;
  loading?: boolean;
  headerRight?: React.ReactNode;
};

const defaultColors = [
  '#0d6efd',
  '#198754',
  '#ffc107',
  '#dc3545',
  '#6c757d',
  '#6610f2',
  '#fd7e14',
  '#20c997',
];

function CardChartsPie({
  labels = [],
  data = [],
  title = '',
  colors = defaultColors,
  toRupiah = false,
  loading = false,
  headerRight = null,
}: Props) {
  const chartLabels = labels;
  const chartData = data;
  const chartColors = colors;

  const pieData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartData,
        backgroundColor: chartColors.slice(0, chartData.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage =
              total > 0 ? Math.round((value / total) * 100) : 0;
            return toRupiah
              ? `${label}: ${uRupiah(value)} (${percentage}%)`
              : `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  let body: React.ReactNode;
  if (loading) {
    body = (
      <div className="d-flex align-items-center justify-content-center h-100 text-muted">
        <Spinner animation="border" />
      </div>
    );
  } else if (chartData.length > 0) {
    body = <Doughnut data={pieData} options={options} />;
  } else {
    body = (
      <div className="d-flex align-items-center justify-content-center h-100 text-muted">
        Tidak ada data
      </div>
    );
  }

  return (
    <Card className="flex-fill w-100">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center flex-wrap gap-2">
        <Row className="w-100">
          <Col>
            <Card.Title className="mb-0">{title || 'Distribusi'}</Card.Title>
          </Col>
          <Col className="d-flex pe-0 justify-content-end align-items-center">
            {headerRight}
          </Col>
        </Row>
      </Card.Header>
      <Card.Body className="py-3">
        <div className="chart chart-sm" style={{ height: 240 }}>
          {body}
        </div>
      </Card.Body>
    </Card>
  );
}

CardChartsPie.defaultProps = {
  labels: [],
  data: [],
  title: '',
  colors: defaultColors,
  loading: false,
  headerRight: null,
  toRupiah: false,
};

export default CardChartsPie;
