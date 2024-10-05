import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTheme } from '@mui/material/styles';
import Title from "./Title";
import { Activity, pegarUsuarioPeriodicidades } from "@/services/firebaseService";
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    const responseP = await pegarUsuarioPeriodicidades();

    if (responseP === null) {
      setLoading(false);
      return;
    }

    const activitiesWithStatus = await Promise.all(
      responseP.questions.map(async (activity) => {
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
      const vencidoCount = activities.filter(a => a.status === "Vencido").length;
      const regularCount = activities.filter(a => a.status === "Regular").length;
      const aVencerCount = activities.filter(a => a.status === "A vencer").length;

      setData([
        { id: 0, value: vencidoCount, label: "Vencido", color: theme.palette.error.main },
        { id: 1, value: regularCount, label: "Regular", color: theme.palette.success.main },
        { id: 2, value: aVencerCount, label: "A vencer", color: theme.palette.warning.main },
      ]);
    }
  }, [activities, theme.palette.error.main, theme.palette.success.main, theme.palette.warning.main]);

  return (
    <React.Fragment>
      <Title>Manutenções Programadas</Title>
      <div style={{ width: "100%", flexGrow: 1, overflow: "hidden" }}>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <PieChart
            series={[
              {
                data: data,
                colorField: 'color', // Usa o campo 'color' para definir as cores de cada segmento
              },
            ]}
            width={400}
            height={200}
          />
        )}
      </div>
    </React.Fragment>
  );
}
