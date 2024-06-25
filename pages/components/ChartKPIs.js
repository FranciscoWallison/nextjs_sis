// components/ChartKPIs.js

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

export default function ChartKPIs({ data }) {
  const chartData = {
    labels: ["MTBF", "MTTR", "Disponibilidade"],
    datasets: [
      {
        label: "Indicadores de Desempenho",
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
        data: [
          data.reduce((acc, cur) => acc + cur.mtbf, 0) / data.length,
          data.reduce((acc, cur) => acc + cur.mttr, 0) / data.length,
          data.reduce((acc, cur) => acc + cur.disponibilidade, 0) / data.length,
        ],
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
      <h2>Indicadores de Desempenho (KPIs)</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
