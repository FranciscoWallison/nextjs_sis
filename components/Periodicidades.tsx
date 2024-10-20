import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  CircularProgress,
  TextField,
  Grid,
  Button,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import MaintenanceCategory from "../components/MaintenanceCategory";
import withAuth from "../hoc/withAuth";
import {
  pegarUsuarioPeriodicidades,
  CategoryData,
  Activity,
  usuarioPeriodicidadesAdicionar,
} from "@/services/firebaseService";
import HelpQuestions from "@/utils/HelpQuestions";
import EditActivityModal from "./EditActivityModal"; // Substituído o antigo modal

const Periodicidades: React.FC = () => {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    titulo: "",
    responsavel: "",
    data: "",
  });
  const [selectedResponsaveis, setSelectedResponsaveis] = useState<string[]>([]);
  const [responsaveis, setResponsaveis] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );

  const fetchResponsaveis = useCallback(async () => {
    const response = await fetch("/items/items.json");
    const result = await response.json();

    // Extrai todos os responsáveis e remove duplicados
    const responsaveisUnicos = [
      ...new Set(result.map((item: { responsavel: string }) => item.responsavel)),
    ];

    setResponsaveis(responsaveisUnicos);
  }, []);

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
    fetchResponsaveis();
    fetchData();
  }, [fetchResponsaveis, fetchData]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedActivity(null);
  };

  const handleOpenModal = (activity?: Activity) => {
    setSelectedActivity(activity || null); // Se não houver atividade, estará criando uma nova
    setModalOpen(true);
  };

  const handleRemove = async (activity: Activity) => {
    try {
      console.log("Atividade a ser removida:", activity);
    } catch (error) {
      console.error("Erro ao remover atividade:", error);
    }
  };

  const initialActivity: Activity = {
    id: 0,
    titulo: "",
    atividade: "",
    responsavel: "",
    Periodicidade: "",
    obrigatorio: "",
    data: "",
    id_name: "",
    responsavel_info: {
      nome: "",
      telefone: "",
      email: "",
    },
  };

  const onSave = async (item: Activity) => {
    try {
      const new_object = [...data];
      item.id = new_object.length + 200;

      item.responsavel_info = {
        nome: "",
        telefone: "",
        email: "",
      };

      item.id_name = "hasCriado";
      item.category_id = 200;

      const arrayItenNew = [];

      arrayItenNew.push(item);

      await usuarioPeriodicidadesAdicionar(arrayItenNew);
      fetchData();
      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const sortActivities = (activities: Activity[]): Activity[] => {
    if (!Array.isArray(activities)) {
      return [];
    }

    return activities.sort((a, b) => {
      const aDone = !!a.data;
      const bDone = !!b.data;

      return aDone === bDone ? 0 : aDone ? 1 : -1;
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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

      const matchResponsavel =
        selectedResponsaveis.length === 0 ||
        selectedResponsaveis.includes(activity.responsavel);

      const matchData = !filters.data || activity.data === filters.data;

      return matchTitle && matchResponsavel && matchData;
    });
  };

  const handleUpdate = async (updatedActivity: Activity) => {
    fetchData();
    setSnackbarOpen(true);
  };

  return (
    <>
      {loading ? (
        <Container>
          <CircularProgress />
        </Container>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Filtrar por Título"
                name="titulo"
                value={filters.titulo}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Filtrar por Responsáveis"
                name="responsavel"
                SelectProps={{
                  multiple: true,
                  value: selectedResponsaveis,
                  onChange: (event) =>
                    setSelectedResponsaveis(event.target.value as string[]),
                }}
              >
                {responsaveis.map((responsavel) => (
                  <MenuItem key={responsavel} value={responsavel}>
                    {responsavel}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            sx={{ mb: 2, justifyContent: "flex-start", alignItems: "center" }}
          >
            <Grid item xs={12} sm={4}>
              <Button variant="contained" onClick={() => handleOpenModal()}>
                Nova Manutenção
              </Button>
            </Grid>
          </Grid>

          {data.map((category, index) => (
            <MaintenanceCategory
              key={index}
              category={category.titulo}
              activities={applyFilters([category])}
              onUpdate={(activity) => handleUpdate(activity)} // Abre o modal para edição
              titleUpdate="Adicionar"
              onRemove={(activityId) => console.log(activityId)}
              removeValid={false} // Ou uma lógica para validar a remoção
            />
          ))}

          <EditActivityModal
            open={modalOpen}
            activity={selectedActivity || initialActivity} // Define se está editando ou criando
            onClose={handleCloseModal}
            onSave={onSave}
            isEdit={!!selectedActivity} // Define se está editando ou criando
            showNotApplicable={true}
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
              Atividade {selectedActivity ? "atualizada" : "criada"} com
              sucesso!
            </Alert>
          </Snackbar>
        </>
      )}
    </>
  );
};

export default withAuth(Periodicidades);
