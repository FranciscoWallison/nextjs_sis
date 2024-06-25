import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader } from '@mui/material';

// Register the elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ColumnChart = ({ data }) => {
  // Função para formatar os dados para o gráfico
  const formatDataForChart = (data) => {
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const formattedData = {
      labels: meses,
      datasets: [
        {
          label: 'Executadas',
          data: Array(12).fill(0),
          backgroundColor: '#4caf50',
        },
        {
          label: 'Pendentes',
          data: Array(12).fill(0),
          backgroundColor: '#ffeb3b',
        },
        {
          label: 'Concluídas',
          data: Array(12).fill(0),
          backgroundColor: '#f44336',
        },
      ],
    };

    data.forEach(item => {
      const monthIndex = new Date(item.data_abertura).getMonth(); // Obter o índice do mês (0-11)
      if (item.categoria === 'Executadas') {
        formattedData.datasets[0].data[monthIndex]++;
      } else if (item.categoria === 'Pendentes') {
        formattedData.datasets[1].data[monthIndex]++;
      } else if (item.categoria === 'Concluídas') {
        formattedData.datasets[2].data[monthIndex]++;
      }
    });

    return formattedData;
  };

  const chartData = formatDataForChart(data);

  return (
    <Card>
      <CardHeader title="Cumprimento de Manutenção (Período)" />
      <CardContent>
        <Bar data={chartData} />
      </CardContent>
    </Card>
  );
};

export default ColumnChart;
