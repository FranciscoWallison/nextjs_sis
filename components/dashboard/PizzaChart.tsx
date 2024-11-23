import * as React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTheme } from "@mui/material/styles";
import Title from "./Title";
import {
  Activity,
  pegarUsuarioPeriodicidades,
} from "@/services/firebaseService";
import { getStatus } from "@/utils/statusHelper";

export default function PizzaChart() {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [data, setData] = useState([
    { id: 0, value: 0, label: "Vencido", color: theme.palette.error.main },
    { id: 1, value: 0, label: "Regular", color: theme.palette.success.main },
    { id: 2, value: 0, label: "A vencer", color: theme.palette.warning.main },
  ]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 200 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const responseP = await pegarUsuarioPeriodicidades();

    if (responseP === null) {
      setLoading(false);
      return;
    }

    const activitiesWithStatus = await Promise.all(
      responseP.questions.map(async (activity: Activity) => {
        const dataStatus = await getStatus(activity);
        return { ...activity, status: dataStatus.status };
      })
    );

    setActivities(activitiesWithStatus);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (activities.length > 0) {
      const vencidoCount = activities.filter(
        (a) => a.status === "Vencido"
      ).length;
      const regularCount = activities.filter(
        (a) => a.status === "Regular"
      ).length;
      const aVencerCount = activities.filter(
        (a) => a.status === "A vencer"
      ).length;

      setData([
        {
          id: 0,
          value: vencidoCount,
          label: "Vencido",
          color: theme.palette.error.main,
        },
        {
          id: 1,
          value: regularCount,
          label: "Regular",
          color: theme.palette.success.main,
        },
        {
          id: 2,
          value: aVencerCount,
          label: "A vencer",
          color: theme.palette.warning.main,
        },
      ]);
    }
  }, [
    activities,
    theme.palette.error.main,
    theme.palette.success.main,
    theme.palette.warning.main,
  ]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setDimensions({
          width: width,
          height: width / 2, // Define uma proporção para o gráfico
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
      <Title>Manutenções Programadas</Title>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: "600px", // Limita o tamanho máximo do gráfico
          margin: "0 auto", // Centraliza o gráfico
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <PieChart
            series={[
              {
                data: data.map((item) => ({
                  id: item.id,
                  value: item.value,
                  label: item.label,
                  color: item.color,
                })),
              },
            ]}
            width={dimensions.width}
            height={dimensions.height}
          />
        )}
      </div>
    </React.Fragment>
  );
}
