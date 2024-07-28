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
} from "@mui/material";
import MaintenanceCategory from "../components/MaintenanceCategory";
import withAuth from "../hoc/withAuth";
import {
  pegarUsuarioPeriodicidades,
  PeriodicidadeResponse,
  CategoryData,
  Activity,
  usuarioPeriodicidadesAtualizar,
  salvarNovo,
} from "@/services/firebaseService";
import MainLayout from "../components/layout/MainLayout";
import HelpQuestions from "@/utils/HelpQuestions";

const Manutencoes: React.FC = () => {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    title: "",
    responsavel: "",
    data: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const responseP: PeriodicidadeResponse = await pegarUsuarioPeriodicidades();
    console.log("====================================");
    console.log(responseP.questions);
    console.log("====================================");

    const sortedData = sortActivities(responseP.questions);
    setData(sortedData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortActivities = (data: CategoryData[]): CategoryData[] => {
    if (data === undefined) {
      return [];
    }

    return data.map((category) => {
      const sortedData = category.data.sort((a, b) => {
        const aDone = !!a.data || a.nao_lembro || a.nao_feito;
        const bDone = !!b.data || b.nao_lembro || b.nao_feito;
        return aDone === bDone ? 0 : aDone ? 1 : -1;
      });
      return { ...category, data: sortedData };
    });
  };

  const calculateProgress = (): number => {
    let totalActivities = 0;
    let completedActivities = 0;
    if (data.length === 0) {
      return 0;
    }
    data.forEach((category) => {
      totalActivities += category.data.length;
      category.data.forEach((activity) => {
        if (activity.data || activity.nao_lembro || activity.nao_feito) {
          completedActivities++;
        }
      });
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
    const responseP: PeriodicidadeResponse = await pegarUsuarioPeriodicidades();
    console.log("========handleRemove================");
    console.log(responseP.questions);

    const new_question = await HelpQuestions.removeActivityById(
      responseP.questions,
      activityId
    );
    // removeActivityById
    console.log(new_question, activityId, responseP.questions);

    responseP.questions = new_question;
    console.log("====================================");
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

  const applyFilters = (activities: Activity[]): Activity[] => {
    return activities.filter((activity) => {
      const matchTitle = activity.titulo
        .toLowerCase()
        .includes(filters.title.toLowerCase());
      const matchResponsavel = activity.responsavel
        .toLowerCase()
        .includes(filters.responsavel.toLowerCase());
      const matchData =
        !filters.data ||
        (activity.data && activity.data.includes(filters.data));
      return matchTitle && matchResponsavel && matchData;
    });
  };

  const progress = calculateProgress();

  return (
    <MainLayout title={"Manutenção"}>
      {loading ? (
        <Container>
          <CircularProgress />
        </Container>
      ) : (
        <Container>
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
                name="title"
                value={filters.title}
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

          {data.map((category, index) => (
            <MaintenanceCategory
              key={index}
              category={category.title}
              activities={applyFilters(category.data)}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              removeValid={true}
            />
          ))}

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
        </Container>
      )}
    </MainLayout>
  );
};

export default withAuth(Manutencoes);
