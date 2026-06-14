import React from 'react';
import { Card } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  labels?: string[];
  data?: number[];
  title?: string;
  colors?: string[];
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

function CardChartsPie({ labels, data, title, colors }: Props) {
  const chartLabels = labels || [];
  const chartData = data || [];
  const chartColors = colors || defaultColors;

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
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Card className="flex-fill w-100">
      <Card.Header className="bg-light">
        <Card.Title className="mb-0">{title || 'Distribusi'}</Card.Title>
      </Card.Header>
      <Card.Body className="py-3">
        <div className="chart chart-sm" style={{ height: 240 }}>
          {chartData.length > 0 ? (
            <Doughnut data={pieData} options={options} />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              Tidak ada data
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardChartsPie;
