import React from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { uRupiah } from '@utils/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  labels: string[];
  revenue: number[];
  expenses: number[];
  title: string;
  loading?: boolean;
  headerRight?: React.ReactNode;
};

function CardChartsBar({
  labels,
  revenue,
  expenses,
  title,
  loading = false,
  headerRight = null,
}: Props) {
  const hasData = labels && labels.length > 0;

  const barData = {
    labels,
    datasets: [
      {
        label: 'Pendapatan',
        data: revenue,
        backgroundColor: '#198754',
        borderRadius: 4,
      },
      {
        label: 'Pengeluaran',
        data: expenses,
        backgroundColor: '#dc3545',
        borderRadius: 4,
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
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${uRupiah(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
        ticks: {
          callback: (value: number | string) => uRupiah(Number(value)),
        },
      },
      x: {
        grid: {
          display: false,
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
  } else if (hasData) {
    body = <Bar data={barData} options={options} />;
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
          <Col className="">
            <Card.Title className="mb-0">{title || 'Statistik'}</Card.Title>
          </Col>
          <Col className="d-flex pe-0 justify-content-end align-items-center">
            {headerRight}
          </Col>
        </Row>
      </Card.Header>
      <Card.Body className="py-3">
        <div className="chart" style={{ height: 240 }}>
          {body}
        </div>
      </Card.Body>
    </Card>
  );
}

CardChartsBar.defaultProps = {
  loading: false,
  headerRight: null,
};

export default CardChartsBar;
