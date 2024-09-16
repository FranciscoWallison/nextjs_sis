import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Button,
  Snackbar,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale"; // Define a localização para Português (Brasil)
import "react-big-calendar/lib/css/react-big-calendar.css";
import MainLayout from "../components/layout/MainLayout";
import {
  pegarUsuarioPeriodicidades,
  Activity,
  fetchBlockById,
} from "@/services/firebaseService";
import { getStatus } from "@/utils/statusHelper";

// Configuração do Localizer para date-fns no react-big-calendar
const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarioManutencoes: React.FC = () => {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilters, setStatusFilters] = useState({
    regular: false,
    aVencer: false,
    vencido: false,
  });
  const [events, setEvents] = useState<any[]>([]); // Estado para eventos do calendário

  const fetchData = useCallback(async () => {
    setLoading(true);
    const responseP = await pegarUsuarioPeriodicidades();

    if (responseP === null) {
      setLoading(false);
      return;
    }

    const activitiesWithBlocks = await Promise.all(
      responseP.questions.map(async (activity) => {
        if (activity.blocoIDs && activity.blocoIDs.length > 0) {
          try {
            const blocosPromises = activity.blocoIDs.map((blocoID) =>
              fetchBlockById(blocoID)
            );
            const blocosDocs = await Promise.all(blocosPromises);

            const blocos = blocosDocs.filter((blocoDoc) => blocoDoc !== null);

            if (blocos.length > 0) {
              return {
                ...activity,
                blocos: blocos.map((bloco, index) => ({
                  id: `generated-id-${index}`, // Gera um id se não existir
                  name: bloco.name,
                })),
              };
            }
          } catch (error) {
            console.error(
              `Erro ao buscar blocos para activity com IDs: ${activity.blocoIDs}:`,
              error
            );
          }
        }

        return activity;
      })
    );

    const sortedData = sortActivities(activitiesWithBlocks);
    setData(sortedData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data.length > 0) {
      const calendarEvents = data.map((activity) => {
        const statusInfo = getStatus(activity);
        return {
          title: `${activity.titulo} - ${statusInfo.status}`,
          start: activity.data ? new Date(activity.data) : new Date(), // Verifica se "activity.data" está definido
          end: activity.data ? new Date(activity.data) : new Date(), // Verifica se "activity.data" está definido
          allDay: true,
          status: statusInfo.status,
        };
      });

      setEvents(calendarEvents);
    }
  }, [data]);

  const sortActivities = (activities: Activity[]): Activity[] => {
    if (!activities) {
      return [];
    }

    return activities.sort((a, b) => {
      const aDone = !!a.data;
      const bDone = !!b.data;

      return aDone === bDone ? 0 : aDone ? 1 : -1;
    });
  };

  const handleStatusFilterChange = (status: keyof typeof statusFilters) => {
    setStatusFilters((prevFilters) => ({
      ...prevFilters,
      [status]: !prevFilters[status],
    }));
  };

  const applyFilters = (events: any[]): any[] => {
    return events.filter((event) => {
      const matchStatus =
        (statusFilters.regular && event.status === "Regular") ||
        (statusFilters.aVencer && event.status === "A vencer") ||
        (statusFilters.vencido && event.status === "Vencido");

      return (
        (!statusFilters.regular &&
          !statusFilters.aVencer &&
          !statusFilters.vencido) ||
        matchStatus
      );
    });
  };

  return (
    <MainLayout title="Calendário">
      <Container>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {/* <Typography variant="h5" gutterBottom>
              Calendário de Manutenções
            </Typography> */}

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant={statusFilters.regular ? "contained" : "outlined"}
                  color="success"
                  onClick={() => handleStatusFilterChange("regular")}
                >
                  Regular
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant={statusFilters.aVencer ? "contained" : "outlined"}
                  color="warning"
                  onClick={() => handleStatusFilterChange("aVencer")}
                >
                  A vencer
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant={statusFilters.vencido ? "contained" : "outlined"}
                  color="error"
                  onClick={() => handleStatusFilterChange("vencido")}
                >
                  Vencido
                </Button>
              </Grid>
            </Grid>

            <Box sx={{ height: 600 }}>
              <Calendar
                localizer={localizer}
                events={applyFilters(events)} // Aplicar filtros nos eventos
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%", margin: "50px 0" }}
              />
            </Box>
          </>
        )}
      </Container>
    </MainLayout>
  );
};

export default CalendarioManutencoes;
