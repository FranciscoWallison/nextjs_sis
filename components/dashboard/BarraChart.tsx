import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import Title from "./Title";

// Generate Sales Data
function createData(
  time: string,
  amount?: number
): { time: string; amount: number | null } {
  return { time, amount: amount ?? null };
}

export const dataset = [
  {
    executadas: 59,
    pendentes: 57,
    concluidas: 86,
    month: "Jan",
  },
  {
    executadas: 50,
    pendentes: 52,
    concluidas: 78,
    month: "Feb",
  },
  {
    executadas: 47,
    pendentes: 53,
    concluidas: 106,
    month: "Mar",
  },
  {
    executadas: 54,
    pendentes: 56,
    concluidas: 92,
    month: "Apr",
  },
  {
    executadas: 57,
    pendentes: 69,
    concluidas: 92,
    month: "May",
  },
  {
    executadas: 60,
    pendentes: 63,
    concluidas: 103,
    month: "June",
  },
  {
    executadas: 59,
    pendentes: 60,
    concluidas: 105,
    month: "July",
  },
  {
    executadas: 65,
    pendentes: 60,
    concluidas: 106,
    month: "Aug",
  },
  {
    executadas: 51,
    pendentes: 51,
    concluidas: 95,
    month: "Sept",
  },
  {
    executadas: 60,
    pendentes: 65,
    concluidas: 97,
    month: "Oct",
  },
  {
    executadas: 67,
    pendentes: 64,
    concluidas: 76,
    month: "Nov",
  },
  {
    executadas: 61,
    pendentes: 70,
    concluidas: 103,
    month: "Dec",
  },
];

const chartSetting = {
  yAxis: [
    {
      label: "rainfall (mm)",
    },
  ],
  width: 500,
  height: 300,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: "translate(-20px, 0)",
    },
  },
};

const valueFormatter = (value: number | null) => `${value}`;

export default function BarraChart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Manutenções Período</Title>
      <div style={{ width: "100%", flexGrow: 1, overflow: "hidden" }}>
        <BarChart
          dataset={dataset}
          xAxis={[{ scaleType: "band", dataKey: "month" }]}
          series={[
            { dataKey: "executadas", label: "Executadas", valueFormatter },
            { dataKey: "pendentes", label: "Pendentes", valueFormatter },
            { dataKey: "concluidas", label: "Concluídas", valueFormatter },
          ]}
          // {...chartSetting}
        />
      </div>
    </React.Fragment>
  );
}
