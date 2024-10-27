import React, { useEffect, useState, useCallback } from "react";
import InputMask from "react-input-mask";
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
  SelectChangeEvent,
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
import { getStatus } from "@/utils/statusHelper";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"; // Import do LocalizationProvider
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Adaptador para Day.js
import dayjs, { Dayjs } from "dayjs"; // Import para trabalhar com datas
import "dayjs/locale/pt-br"; // Importa o idioma português para o dayjs
dayjs.locale("pt-br"); // Define o idioma padrão como português
interface Bloco {
  id: string;
  name: string;
}

const Manutencoes: React.FC = () => {
  const [data, setData] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]); // Novo estado para armazenar as atividades filtradas
  const [loading, setLoading] = useState<boolean>(true);
  const [titleUpdate, setTitleUpdate] = useState<string>("Última Manutenção");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState({
    titulo: "",
    responsavel: "",
    data: null as Dayjs | null, // Use Dayjs como tipo para a data
    blocos: [] as string[],
  });
  const [blocks, setBlocks] = useState<{ id: string; name: string }[]>([]);
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
      responseP.questions.map(async (activity: Activity) => {
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

    const uniqueBlocks = Array.from(
      new Map(
        activitiesWithBlocks.flatMap((activity: Activity) => {
          if (Array.isArray(activity.blocos)) {
            return activity.blocos.map((bloco) => [bloco.id, bloco]);
          }
          return [];
        })
      ).values()
    ).map((bloco) => bloco as Bloco); // Converta `bloco` explicitamente para o tipo `Bloco`

    setBlocks(uniqueBlocks);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // UseEffect para aplicar os filtros e atualizar as atividades filtradas
  useEffect(() => {
    const filterData = async () => {
      const filteredData = await applyFilters(data);
      setFilteredActivities(filteredData); // Armazena o resultado das atividades filtradas
    };

    filterData();
  }, [data, filters, statusFilters]);

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

  const handleDateChange = (newDate: Dayjs | null) => {
    setFilters({
      ...filters,
      data: newDate,
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

  const applyFilters = async (activities: Activity[]): Promise<Activity[]> => {
    const filteredActivities = await Promise.all(
      activities.map(async (activity) => {
        const dataStatus = await getStatus(activity);

        const matchTitle = activity.titulo
          .toLowerCase()
          .includes(filters.titulo.toLowerCase());
        const matchResponsavel = activity.responsavel
          .toLowerCase()
          .includes(filters.responsavel.toLowerCase());
        const matchData =
          !filters.data ||
          (activity.data && dayjs(activity.data).isSame(filters.data, "day"));

        const matchStatus =
          (statusFilters.regular && dataStatus.status === "Regular") ||
          (statusFilters.aVencer && dataStatus.status === "A vencer") ||
          (statusFilters.vencido && dataStatus.status === "Vencido");

        const matchBlock =
          filters.blocos.length === 0 ||
          (activity.blocos &&
            activity.blocos.some((block) =>
              filters.blocos.includes(block.name)
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
      })
    );

    return activities.filter((_, index) => filteredActivities[index]);
  };

  const progress = calculateProgress();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                <DatePicker
                  sx={{ width: "100%" }}
                  label="Filtrar por Data"
                  value={filters.data}
                  onChange={handleDateChange}
                  format="DD/MM/YYYY" // Novo formato desejado
                  slotProps={{
                    textField: { fullWidth: true }, // Define largura total para o TextField
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={12}>
                {blocks.length > 0 && (
                  <FormControl fullWidth>
                    <InputLabel>Filtrar por Bloco</InputLabel>
                    <Select
                      multiple
                      value={filters.blocos}
                      onChange={handleBlockFilterChange}
                      renderValue={(selected) =>
                        (selected as string[]).join(", ")
                      }
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
              activities={filteredActivities} // Passa as atividades filtradas
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
    </LocalizationProvider>
  );
};

export default withAuth(Manutencoes);
