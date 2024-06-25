import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Card, CardContent, CardHeader } from '@mui/material';

// Registrar os componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PizzaChart = () => {
  const [chartData, setChartData] = useState({ datasets: [], labels: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/manutencoes_teste?periodoInicio=2024-01-01&periodoFim=2024-12-31');
        const dataFromAPI = response.data;

        // Certifique-se de que dataFromAPI não é undefined
        if (!dataFromAPI) {
          console.error('dataFromAPI is undefined');
          return;
        }

        // Transforma os dados do JSON
        const aggregatedData = dataFromAPI.reduce((acc, item) => {
          const responsavel = item.nome_responsavel || 'Não atribuído';
          if (!acc[responsavel]) {
            acc[responsavel] = 0;
          }
          acc[responsavel] += 1; // Conta o número de manutenções por responsável
          return acc;
        }, {});

        // Converte os dados agregados para o formato esperado pelo Chart.js
        const labels = Object.keys(aggregatedData);
        const data = Object.values(aggregatedData);

        const config = {
          labels,
          datasets: [
            {
              label: 'Quantidade por Responsável',
              data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        };

        setChartData(config);
      } catch (error) {
        console.error('Erro ao buscar dados da API', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader title="Manutenções Programadas" />
      <CardContent>
        <Pie data={chartData} width={400} height={200} />
      </CardContent>
    </Card>
  );
};

export default PizzaChart;
