import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import Title from "./Title";
import { pegarUsuarioPeriodicidades, Activity } from "@/services/firebaseService";
import { getStatus } from "@/utils/statusHelper";

// Função assíncrona para agrupar as atividades por mês e status
const groupByMonthAndStatus = async (activities: Activity[]) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

  // Inicializa um objeto para armazenar os dados por mês
  const dataByMonth = months.map(month => ({
    month,
    vencido: 0,
    regular: 0,
    avencer: 0,
  }));

  // Itera sobre as atividades e agrupa-as por mês e status
  for (const activity of activities) {
    const date = new Date(activity.data || Date.now()); // Usa a data atual se não houver data
    const monthIndex = date.getMonth(); // Obtém o índice do mês (0 = Jan, 11 = Dec)
    const monthData = dataByMonth[monthIndex];

    const statusInfo = await getStatus(activity); // Aguarda a função assíncrona

    if (statusInfo.status === "Vencido") {
      monthData.vencido += 1;
    } else if (statusInfo.status === "Regular") {
      monthData.regular += 1;
    } else if (statusInfo.status === "A vencer") {
      monthData.avencer += 1;
    }
  }

  return dataByMonth;
};

const valueFormatter = (value: number | null) => `${value}`;

export default function BarraChart() {
  const [loading, setLoading] = useState<boolean>(true);
  const [dataset, setDataset] = useState<any[]>([]); // Dataset para o gráfico

  const fetchData = useCallback(async () => {
    setLoading(true);
    const responseP = await pegarUsuarioPeriodicidades();

    if (responseP === null) {
      setLoading(false);
      return;
    }

    // Calcula o status de cada atividade e agrupa os dados
    const groupedData = await groupByMonthAndStatus(responseP.questions);
    setDataset(groupedData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Manutenções por Período</Title>
      <div style={{ width: "100%", flexGrow: 1, overflow: "hidden" }}>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <BarChart
            dataset={dataset}
            xAxis={[{ scaleType: "band", dataKey: "month" }]}
            series={[
              { 
                dataKey: "vencido", 
                label: "Vencido", 
                valueFormatter, 
                color: theme.palette.error.main // Define cor de 'error' para 'Vencido'
              },
              { 
                dataKey: "regular", 
                label: "Regular", 
                valueFormatter, 
                color: theme.palette.success.main // Define cor de 'success' para 'Regular'
              },
              { 
                dataKey: "avencer", 
                label: "A vencer", 
                valueFormatter, 
                color: theme.palette.warning.main // Define cor de 'warning' para 'A vencer'
              },
            ]}
            width={500}
            height={300}
          />
        )}
      </div>
    </React.Fragment>
  );
}
