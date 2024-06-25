import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader } from '@mui/material';

// Register the elements
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const BacklogChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => `${item.mes}/${item.ano}`),
    datasets: [
      {
        label: 'Ordens de Serviço Pendentes',
        data: data.map(item => item.quantidade),
        fill: false,
        borderColor: '#f44336',
      },
    ],
  };

  return (
    <Card>
      <CardHeader title="Backlog" />
      <CardContent>
        <Line data={chartData} />
      </CardContent>
    </Card>
  );
};

export default BacklogChart;
