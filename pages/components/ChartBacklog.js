// components/ChartBacklog.js

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

export default function ChartBacklog({ data }) {
  const chartData = {
    labels: data.map((d) => d.mes),
    datasets: [
      {
        label: "Ordens de Serviço Pendentes",
        backgroundColor: "#FF6384",
        data: data.map((d) => d.pendentes),
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
      <h2>Gráfico de Backlog</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
