import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  CircularProgress,
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MainLayout from "../components/layout/MainLayout";
import {
  pegarUsuarioPeriodicidades,
  Activity,
  fetchBlockById,
} from "@/services/firebaseService";
import { getStatus } from "@/utils/statusHelper";
import EditActivityModal from "@/components/EditActivityModal"; // Importa o novo modal
import HelpActivity from "@/utils/HelpActivity";
import { log } from "console";

const localizer = momentLocalizer(moment);

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

const formats = {
  agendaDateFormat: "DD/MM ddd",
  weekdayFormat: "dddd",
  monthHeaderFormat: "MMMM YYYY",
};

const CalendarioManutencoes: React.FC = () => {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilters, setStatusFilters] = useState({
    regular: false,
    aVencer: false,
    vencido: false,
  });
  const [events, setEvents] = useState<any[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false); // Controle do modal

  const handleCloseEditActivity = () => {
    setModalOpen(false);
    setSelectedActivity(null);
  };
  const onActivityUpdated = () => {
    fetchData(); // Recarrega os dados após uma atualização
  };

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
                  id: `generated-id-${index}`,
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
            .filter((activity) => activity.data) // Filtra apenas atividades com data válida
            .flatMap(async (activity) => {
              const dueDateFormatted = await HelpActivity.formatDateToDDMMYYYY(activity);
              const statusInfo = await getStatus(activity);

              const events = [];

              // 🔹 Start date (data da manutenção)
              if (activity.data) {
                const startDate = moment(activity.data, "YYYY-MM-DD").toDate();

                events.push({
                  title: `${activity.titulo} - Início (${statusInfo.status})`,
                  start: startDate,
                  end: new Date(startDate.getTime() + 60 * 60 * 1000), // 1h depois
                  allDay: false,
                  status: statusInfo.status,
                  details: activity,
                });
              }

              // 🔹 End date (dueDate formatada)
              if (dueDateFormatted) {
                const [day, month, year] = dueDateFormatted.split("/").map(Number);
                const dueDateObj = new Date(year, month - 1, day, 12, 0, 0);

                events.push({
                  title: `${activity.titulo} - Fim (${statusInfo.status})`,
                  start: dueDateObj,
                  end: new Date(dueDateObj.getTime() + 60 * 60 * 1000), // 1h depois
                  allDay: false,
                  status: statusInfo.status,
                  details: activity,
                });
              }

              return events;
            })
        );

        // flatMap dentro do map → precisamos de um `flat`
        setEvents(calendarEvents.flat());
      };

      fetchEvents();
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

  const handleEventClick = (event: any) => {
    // Mapear o evento para a interface Activity
    const mappedActivity: Activity = {
      titulo: event.title || "Título não definido",
      atividade: event.details?.atividade || "",
      responsavel: event.details?.responsavel || "",
      Periodicidade: event.details?.Periodicidade || "",
      obrigatorio: event.details?.obrigatorio || "",
      responsavel_info: event.details?.responsavel_info || {
        name: "",
        email: "",
      },
      data: event.start ? moment(event.start).format("YYYY-MM-DD") : undefined,
      nao_feito: event.details?.nao_feito || false,
      nao_lembro: event.details?.nao_lembro || false,
      id_name: event.details?.id_name || "",
      id: event.details?.id || 0,
      category_id: event.details?.category_id,
      blocoIDs: event.details?.blocoIDs || [],
      activityRegular: event.details?.activityRegular || false,
      status: event.status || "",
      dueDate: event.details?.dueDate || "",
      updatedFields: event.details?.updatedFields || null,
      blocos: event.details?.blocos || [],
      suppliers: event.details?.suppliers || [],
      blocks: event.details?.blocks || [],
      neverDone: event.details?.neverDone || false,
    };

    setSelectedActivity(mappedActivity); // Passa o objeto no formato esperado
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedActivity(null);
  };

  return (
    <MainLayout title="Calendário">
      <Container>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
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
                messages={messages}
                formats={formats}
                events={applyFilters(events)}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%", margin: "50px 0" }}
                onSelectEvent={handleEventClick} // Abre o modal ao clicar
                eventPropGetter={(event) => {
                  const backgroundColors: Record<string, string> = {
                    Regular: "green",
                    "A vencer": "orange",
                    Vencido: "red",
                  };

                  const backgroundColor =
                    backgroundColors[
                    event.status as keyof typeof backgroundColors
                    ] || "gray";

                  return {
                    style: {
                      backgroundColor,
                      color: "white",
                      borderRadius: "5px",
                      padding: "5px",
                    },
                  };
                }}
              />
            </Box>

            {modalOpen && selectedActivity && (
              <EditActivityModal
                isEdit={true}
                open={modalOpen}
                activity={selectedActivity}
                onClose={handleCloseEditActivity}
                onActivityUpdated={onActivityUpdated}
              />
            )}
          </>
        )}
      </Container>
    </MainLayout>
  );
};

export default CalendarioManutencoes;
