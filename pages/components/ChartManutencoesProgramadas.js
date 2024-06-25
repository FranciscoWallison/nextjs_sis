// components/ChartManutencoesProgramadas.js

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChartManutencoesProgramadas({ data }) {
    console.log('==========ChartManutencoesProgramadas=============');
    console.log(data);
    console.log('====================================');
  const chartData = {
    labels: ["Executadas", "Pendentes", "Concluídas"],
    datasets: [
      {
        data: [
          data.reduce((acc, cur) => acc + cur.executadas, 0),
          data.reduce((acc, cur) => acc + cur.pendentes, 0),
          data.reduce((acc, cur) => acc + cur.concluidas, 0),
        ],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  return (
    <div>
      <h2>Gráfico de Manutenções Programadas</h2>
      <Pie data={chartData} />
    </div>
  );
}
