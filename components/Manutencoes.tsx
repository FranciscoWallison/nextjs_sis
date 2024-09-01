import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  LinearProgress,
  Box,
  Snackbar,
  Alert,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import MaintenanceCategory from "../components/MaintenanceCategory";
import withAuth from "../hoc/withAuth";
import {
  pegarUsuarioPeriodicidades,
  PeriodicidadeResponse,
  Activity,
  usuarioPeriodicidadesAtualizar,
  salvarNovo,
  usuarioPeriodicidadesAdicionar,
  fetchBlockById
} from "@/services/firebaseService";
import HelpQuestions from "@/utils/HelpQuestions";
import { getStatus } from "@/utils/statusHelper"; // Supondo que a função getStatus está no utils

const Manutencoes: React.FC = () => {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [titleUpdate, setTitleUpdate] = useState<string>("Última Manutenção");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    titulo: "",
    responsavel: "",
    data: "",
  });
  const [statusFilters, setStatusFilters] = useState({
    regular: false,
    aVencer: false,
    vencido: false,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const responseP = await pegarUsuarioPeriodicidades();

    if (responseP === null) {
      setLoading(false);
      // Lidar com o caso onde responseP é null, por exemplo, exibir uma mensagem de erro
      return;
    }
    // Cria um array de promessas para buscar blocos do Firestore
    const activitiesWithBlocks = await Promise.all(
      responseP.questions.map(async (activity) => {
        if (activity.blocoID) {
          try {
            const blocoDoc = await fetchBlockById(activity.blocoID);
            if (blocoDoc) {
              // Adiciona o bloco ao objeto activity
              return {
                ...activity,
                bloco: { name: blocoDoc.name },
              };
            }
          } catch (error) {
            console.error(
              `Erro ao buscar bloco com ID ${activity.blocoID}:`,
              error
            );
          }
        }
        // Retorna a atividade original se blocoID não existir ou bloco não encontrado
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

  const sortActivities = (activities: Activity[]): Activity[] => {
    if (!activities) {
      return [];
    }

    // Ordena as atividades com base na presença do campo 'data'
    return activities.sort((a, b) => {
      const aDone = !!a.data; // Verifica se 'a.data' está preenchido
      const bDone = !!b.data; // Verifica se 'b.data' está preenchido

      // Ordena com base na presença do campo 'data'
      return aDone === bDone ? 0 : aDone ? 1 : -1;
    });
  };

  const calculateProgress = (): number => {
    let totalActivities = 0;
    let completedActivities = 0;
    if (data.length === 0) {
      return 0;
    }
    totalActivities = data.length;
    data.forEach((activity) => {
      if (activity.data) {
        completedActivities++;
      }
    });

    if (totalActivities === 0) return 0;

    return (completedActivities / totalActivities) * 100;
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleUpdate = async (updatedActivity: Activity) => {
    await usuarioPeriodicidadesAtualizar(updatedActivity);
    fetchData();
    setSnackbarOpen(true);
  };

  const handleRemove = async (activityId: number) => {
    const responseP = await pegarUsuarioPeriodicidades();
    if (responseP === null) {
      return;
    }

    const new_question = await HelpQuestions.removeActivityById(
      responseP.questions,
      activityId
    );

    responseP.questions = new_question;
    await salvarNovo(responseP);
    fetchData();
    setSnackbarOpen(true);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleStatusFilterChange = (status: keyof typeof statusFilters) => {
    setStatusFilters((prevFilters) => ({
      ...prevFilters,
      [status]: !prevFilters[status],
    }));
  };

  const applyFilters = (activities: Activity[]): Activity[] => {
    return activities.filter((activity) => {
      const matchTitle = activity.titulo
        .toLowerCase()
        .includes(filters.titulo.toLowerCase());
      const matchResponsavel = activity.responsavel
        .toLowerCase()
        .includes(filters.responsavel.toLowerCase());
      const matchData =
        !filters.data ||
        (activity.data && activity.data.includes(filters.data));

      const dataStatus = getStatus(activity); // Supondo que a função getStatus existe

      const matchStatus =
        (statusFilters.regular && dataStatus.status === "Regular") ||
        (statusFilters.aVencer && dataStatus.status === "A vencer") ||
        (statusFilters.vencido && dataStatus.status === "Vencido");

      return (
        matchTitle &&
        matchResponsavel &&
        matchData &&
        ((!statusFilters.regular &&
          !statusFilters.aVencer &&
          !statusFilters.vencido) ||
          matchStatus)
      );
    });
  };

  const progress = calculateProgress();

  return (
    <>
      {loading ? (
        <Container>
          <CircularProgress />
        </Container>
      ) : (
        <>
          <Box sx={{ width: "100%", mb: 2 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" color="text.secondary">{`${Math.round(
              progress
            )}% completado`}</Typography>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Filtrar por Título"
                name="titulo"
                value={filters.titulo}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Filtrar por Responsável"
                name="responsavel"
                value={filters.responsavel}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Filtrar por Data"
                name="data"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={filters.data}
                onChange={handleFilterChange}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth={true}
                variant={statusFilters.regular ? "contained" : "outlined"}
                color="success"
                onClick={() => handleStatusFilterChange("regular")}
              >
                Regular
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth={true}
                variant={statusFilters.aVencer ? "contained" : "outlined"}
                color="warning"
                onClick={() => handleStatusFilterChange("aVencer")}
              >
                A vencer
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth={true}
                variant={statusFilters.vencido ? "contained" : "outlined"}
                color="error"
                onClick={() => handleStatusFilterChange("vencido")}
              >
                Vencido
              </Button>
            </Grid>
          </Grid>

          <MaintenanceCategory
            category="Manutenção"
            activities={applyFilters(data)}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
            removeValid={true}
            titleUpdate={titleUpdate}
          />

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              Atividade atualizada com sucesso!
            </Alert>
          </Snackbar>
        </>
      )}
    </>
  );
};

export default withAuth(Manutencoes);
