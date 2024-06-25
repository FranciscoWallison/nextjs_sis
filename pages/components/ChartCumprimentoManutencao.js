// components/ChartCumprimentoManutencao.js

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ChartCumprimentoManutencao({ data }) {
  const chartData = {
    labels: data.map((d) => d.mes),
    datasets: [
      {
        label: "Executadas",
        backgroundColor: "#36A2EB",
        data: data.map((d) => d.executadas),
      },
      {
        label: "Pendentes",
        backgroundColor: "#FFCE56",
        data: data.map((d) => d.pendentes),
      },
      {
        label: "Concluídas",
        backgroundColor: "#FF6384",
        data: data.map((d) => d.concluidas),
      },
    ],
  };

  const options = {
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Gráfico de Cumprimento de Manutenção</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
