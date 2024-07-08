import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTheme } from '@mui/material/styles';
import Title from "./Title";

// Generate Sales Data
function createData(
  time: string,
  amount?: number
): { time: string; amount: number | null } {
  return { time, amount: amount ?? null };
}

const data = [
  { id: 0, value: 10, label: "Executadas" },
  { id: 1, value: 15, label: "Pendentes" },
  { id: 2, value: 20, label: "Concluídas" },
];

export default function PizzaChart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Manutenções Programadas</Title>
      <div style={{ width: "100%", flexGrow: 1, overflow: "hidden" }}>
        <PieChart
          series={[
            {
              data: data,
            },
          ]}
          width={400}
          height={200}
        />
      </div>
    </React.Fragment>
  );
}
