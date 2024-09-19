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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent 
} from "@mui/material";
import MaintenanceCategory from "../components/MaintenanceCategory";
import withAuth from "../hoc/withAuth";
import {
  pegarUsuarioPeriodicidades,
  Activity,
  usuarioPeriodicidadesAtualizar,
  salvarNovo,
  fetchBlockById,
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
    blocos: [] as string[], // Novo estado para blocos selecionados
  });
  const [blocks, setBlocks] = useState<{ id: string; name: string }[]>([]); // Estado para armazenar blocos carregados
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

    // Carregar blocos únicos para o filtro
    const uniqueBlocks = Array.from(
      new Map(
        activitiesWithBlocks.flatMap((activity) => {
          if ("blocos" in activity) {
            return activity.blocos?.map((bloco) => [bloco.id, bloco]); // Cria um array de pares [id, bloco]
          }
          return [];
        })
      ).values() // Retorna apenas os blocos (sem os IDs) como valores únicos
    );    

    setBlocks(uniqueBlocks);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const handleBlockFilterChange = (event: SelectChangeEvent<string[]>) => {
    setFilters({
      ...filters,
      blocos: event.target.value as string[],
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

      const dataStatus = getStatus(activity);

      const matchStatus =
        (statusFilters.regular && dataStatus.status === "Regular") ||
        (statusFilters.aVencer && dataStatus.status === "A vencer") ||
        (statusFilters.vencido && dataStatus.status === "Vencido");

      // Filtrar por blocos selecionados
      const matchBlock =
        filters.blocos.length === 0 ||
        (activity.blocoIDs &&
          activity.blocoIDs.some((blocoID) =>
            blocks.some(
              (block) =>
                block.id === blocoID && filters.blocos.includes(block.name)
            )
          ));

      return (
        matchTitle &&
        matchResponsavel &&
        matchData &&
        matchBlock &&
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
            <Grid item xs={12} sm={12}>
              {blocks.length > 0 && (
                <FormControl fullWidth>
                  <InputLabel>Filtrar por Bloco</InputLabel>
                  <Select
                    multiple
                    value={filters.blocos}
                    onChange={handleBlockFilterChange} // Função corrigida
                    renderValue={(selected) =>
                      (selected as string[]).join(", ")
                    } // Casting para string[]
                  >
                    {blocks.map((block) => (
                      <MenuItem key={block.id} value={block.name}>
                        {block.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
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
