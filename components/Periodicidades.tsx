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
    titulo: "",
    responsavel: "",
    data: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const responseP = await pegarUsuarioPeriodicidades();

    if (responseP === null) {
      return;
    }

    const response = await fetch("/items/items.json");
    const result = await response.json();
    const addData = await HelpQuestions.filterItems(
      result,
      responseP.questions
    );

    const sortedData = sortActivities(addData);

    setData(sortedData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortActivities = (activities: Activity[]): Activity[] => {
    if (!Array.isArray(activities)) {
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleUpdate = async (updatedActivity: Activity) => {
    const responseP = await pegarUsuarioPeriodicidades();
    if (responseP === null) {
      return;
    }

    const response = await fetch("/items/items.json");
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
    if (!Array.isArray(activities)) {
      return [];
    }

    return activities.filter((activity) => {
      const matchTitle = activity.titulo
        .toLowerCase()
        .includes(filters.titulo.toLowerCase());
      const matchResponsavel = activity.responsavel
        .toLowerCase()
        .includes(filters.responsavel.toLowerCase());
      const matchData =
        !filters.data || activity.data === filters.data;

      return matchTitle && matchResponsavel && matchData;
    });
  };

  return (
    <>
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

          {data.map((category, index) => (
            <MaintenanceCategory
              key={index}
              category={category.titulo}
              activities={applyFilters([category])} // Certifique-se de que o category é um array ou transforme-o em um array
              onUpdate={handleUpdate}
              onRemove={()=>{}}
              removeValid={false}
              titleUpdate={"Adicionar"}
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
    </>
  );
};

export default withAuth(Periodicidades);