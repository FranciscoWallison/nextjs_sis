import * as React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import Title from "./Title";
import { pegarUsuarioPeriodicidades, Activity } from "@/services/firebaseService";
import { getStatus } from "@/utils/statusHelper";

const groupByMonthAndStatus = async (activities: Activity[]) => {
  const months = [
    "Jan", "Feb", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];

  const dataByMonth = months.map((month) => ({
    month,
    vencido: 0,
    regular: 0,
    avencer: 0,
  }));

  for (const activity of activities) {
    const date = new Date(activity.data || Date.now());

    // Validação para verificar se a data é válida
    if (isNaN(date.getTime())) {
      console.warn(`Data inválida encontrada: ${activity.data}`);
      continue; // Ignorar atividades com datas inválidas
    }

    const monthIndex = date.getMonth();

    // Validar o índice do mês
    if (monthIndex < 0 || monthIndex > 11) {
      console.warn(`Índice do mês inválido: ${monthIndex}`);
      continue; // Ignorar se o índice do mês não for válido
    }

    const monthData = dataByMonth[monthIndex];

    const statusInfo = await getStatus(activity);

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
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [dataset, setDataset] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 300 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const responseP = await pegarUsuarioPeriodicidades();

    if (responseP === null) {
      setLoading(false);
      return;
    }

    const groupedData = await groupByMonthAndStatus(responseP.questions);
    setDataset(groupedData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setDimensions({
          width: width,
          height: width / 1.9, // Define uma proporção para o gráfico
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <React.Fragment>
      <Title>Manutenções por Período</Title>
      <div
        style={{
          width: "100%",
          maxWidth: "800px", // Limita o tamanho máximo do contêiner
          margin: "0 auto",
          overflowX: "auto", // Adiciona barra de rolagem horizontal
          padding: "16px", // Adiciona um pouco de espaçamento interno
        }}
      >
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div
            ref={containerRef}
            style={{
              minWidth: "600px", // Garante que o gráfico tenha largura mínima
              maxWidth: "100%", // Limita a largura do gráfico ao tamanho do contêiner
            }}
          >
            <BarChart
              dataset={dataset}
              xAxis={[
                {
                  scaleType: "band",
                  dataKey: "month",
                },
              ]}
              yAxis={[
                {
                  label: "Manutenções",
                },
              ]}
              series={[
                {
                  dataKey: "vencido",
                  label: "Vencido",
                  valueFormatter,
                  color: theme.palette.error.main,
                },
                {
                  dataKey: "regular",
                  label: "Regular",
                  valueFormatter,
                  color: theme.palette.success.main,
                },
                {
                  dataKey: "avencer",
                  label: "A vencer",
                  valueFormatter,
                  color: theme.palette.warning.main,
                },
              ]}
              width={dimensions.width}
              height={dimensions.height}
              margin={{
                top: 20,
                right: 30,
                bottom: 40,
                left: 50,
              }}
            />

          </div>
        )}
      </div>
    </React.Fragment>
  );
}
