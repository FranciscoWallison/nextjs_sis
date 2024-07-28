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
  usuarioPeriodicidadesAdicionar,
} from "@/services/firebaseService";
import MainLayout from "../components/layout/MainLayout";
import HelpQuestions from "@/utils/HelpQuestions";

const Periodicidades: React.FC = () => {
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
    const response = await fetch("/data.json");
    const result = await response.json();
    const addData = await HelpQuestions.filterItems(
      result,
      responseP.questions
    );

    console.log("====================================");
    console.log(responseP.questions, result, addData);
    console.log("====================================");

    const sortedData = sortActivities(addData);
    setData(sortedData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortActivities = (data: any[]): CategoryData[] => {
    if (data === undefined) {
      return [];
    }

    return data.map((category) => {
      const sortedData = category.data.sort((a: any, b: any) => {
        const aDone = !!a.data || a.nao_lembro || a.nao_feito;
        const bDone = !!b.data || b.nao_lembro || b.nao_feito;
        return aDone === bDone ? 0 : aDone ? 1 : -1;
      });
      return { ...category, data: sortedData };
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleUpdate = async (updatedActivity: Activity) => {
    const responseP: PeriodicidadeResponse = await pegarUsuarioPeriodicidades();
    const response = await fetch("/data.json");
    const result = await response.json();
    const addData = await HelpQuestions.filterItems(
      result,
      responseP.questions
    );

    const add_new = await HelpQuestions.addItem(
      result,
      responseP.questions,
      updatedActivity
    );

    await usuarioPeriodicidadesAdicionar(add_new);
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

  return (
    <MainLayout title={"Periodicidades"}>
      {loading ? (
        <Container>
          <CircularProgress />
        </Container>
      ) : (
        <Container>
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
              onRemove={()=>{}}
              removeValid={false}
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
              Atividade adicionado em Manutenções!
            </Alert>
          </Snackbar>
        </Container>
      )}
    </MainLayout>
  );
};

export default withAuth(Periodicidades);
