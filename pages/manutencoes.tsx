import React, { useEffect, useState } from "react";
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
import MainLayout from "../components/layout/MainLayout";
import { pegarUsuarioPeriodicidades } from "@/services/firebaseService";

interface ResponsibleInfo {
  nome: string;
  telefone: string;
  email: string;
}

interface Activity {
  titulo: string;
  atividade: string;
  responsavel: string;
  Periodicidade: string;
  obrigatorio: string;
  responsavel_info: ResponsibleInfo;
  data?: string;
  nao_feito?: boolean;
  nao_lembro?: boolean;
  id_name: string;
  id: number;
}

interface CategoryData {
  title: string;
  data: Activity[];
}

const Manutencoes: React.FC = () => {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState({ title: "", responsavel: "", data: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const responseP = await pegarUsuarioPeriodicidades();
    console.log("====================================");
    console.log(responseP.questions);
    console.log("====================================");

    const sortedData = sortActivities(responseP.questions);
    setData(sortedData);
    setLoading(false);
  };

  const sortActivities = (data: CategoryData[]): CategoryData[] => {
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

  const handleUpdate = () => {
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
      const matchTitle = activity.titulo.toLowerCase().includes(filters.title.toLowerCase());
      const matchResponsavel = activity.responsavel.toLowerCase().includes(filters.responsavel.toLowerCase());
      const matchData = !filters.data || (activity.data && activity.data.includes(filters.data));
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
            />
          ))}

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
