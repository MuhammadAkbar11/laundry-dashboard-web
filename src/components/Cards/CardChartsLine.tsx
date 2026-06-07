import React from 'react';
import { Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import themeConfigs from '@configs/themeConfigs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type Props = {};

const labels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function CardChartsLine({}: Props) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Penjualan',
        fill: true,
        backgroundColor: (ctx: {
          chart: { ctx: CanvasRenderingContext2D };
        }) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 225);
          gradient.addColorStop(0, 'rgba(215, 227, 244, 1)');
          gradient.addColorStop(1, 'rgba(215, 227, 244, 0)');
          return gradient;
        },
        borderColor: themeConfigs.primary,
        data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79],
        pointBackgroundColor: themeConfigs.primary,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
        ticks: {
          stepSize: 20,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card className="flex-fill w-100">
      <Card.Header>
        <Card.Title className="mb-0">Statistik</Card.Title>
      </Card.Header>
      <Card.Body className="py-3">
        <div className="chart chart-sm" style={{ height: 225 }}>
          <Line data={data} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardChartsLine;
