import React, { useEffect, useState, useCallback } from "react";
import { Container, CircularProgress, Box, Grid, Button } from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br"; // Importa a localização para Português (Brasil)
import "react-big-calendar/lib/css/react-big-calendar.css";
import MainLayout from "../components/layout/MainLayout";
import {
  pegarUsuarioPeriodicidades,
  Activity,
  fetchBlockById,
} from "@/services/firebaseService";
import { getStatus } from "@/utils/statusHelper";

// Configuração do Localizer para moment no react-big-calendar
const localizer = momentLocalizer(moment);

// Mensagens traduzidas para o calendário
const messages = {
  allDay: "Dia todo",
  previous: "Anterior",
  next: "Próximo",
  today: "Hoje",
  month: "Mês",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  date: "Data",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Nenhum evento neste período.",
  showMore: (total: number) => `+ Ver mais (${total})`,
};

// Formatos de exibição para dias e meses usando moment.js
const formats = {
  agendaDateFormat: "DD/MM ddd", // Formato de data na agenda
  weekdayFormat: "dddd", // Dias da semana completos
  monthHeaderFormat: "MMMM YYYY", // Título do mês e ano
};

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
      const fetchEvents = async () => {
        const calendarEvents = await Promise.all(
          data
            .filter((activity) => activity.data) // Filtra atividades com a última data cadastrada
            .map(async (activity) => {
              const statusInfo = await getStatus(activity); // Obtém o status da atividade
              const nextMaintenanceDate = moment(activity.dueDate).add(
                activity.Periodicidade || 0,
                "days"
              ); // Calcula a próxima data de manutenção

              return {
                title: `${activity.titulo} - ${statusInfo.status} - Próx.: ${nextMaintenanceDate.format("DD/MM/YYYY")}`,
                start: new Date(activity.data), // Última data cadastrada
                end: new Date(activity.data),
                allDay: true,
                status: statusInfo.status,
              };
            })
        );
        setEvents(calendarEvents);
      };

      fetchEvents(); // Chama a função para buscar eventos
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
            {/* Cabeçalho do calendário */}
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

            {/* Calendário */}
            <Box sx={{ height: 600 }}>
              <Calendar
                localizer={localizer}
                messages={messages} // Passa as mensagens traduzidas
                formats={formats} // Define a formatação para dias e meses
                events={applyFilters(events)} // Aplicar filtros nos eventos
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%", margin: "50px 0" }}
                eventPropGetter={(event) => {
                  let backgroundColor = "";
                  switch (event.status) {
                    case "Regular":
                      backgroundColor = "green";
                      break;
                    case "A vencer":
                      backgroundColor = "orange";
                      break;
                    case "Vencido":
                      backgroundColor = "red";
                      break;
                    default:
                      backgroundColor = "gray"; // Cor padrão para outros tipos
                      break;
                  }
                  return {
                    style: {
                      backgroundColor,
                      color: "white", // Define a cor do texto para contraste
                      borderRadius: "5px",
                      border: "none",
                      padding: "5px",
                    },
                  };
                }}
              />
            </Box>
          </>
        )}
      </Container>
    </MainLayout>
  );
};

export default CalendarioManutencoes;
