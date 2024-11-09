import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import {
  getActivityHistory,
  Activity,
  updateActivity,
  deleteActivity,
  addActivity,
  fetchBlocks,
} from "@/services/firebaseService";
import MainLayout from "@/components/layout/MainLayout";
import EditActivityModal from "@/components/EditActivityModal"; // Importando o modal de atividades
import HelpActivity from "@/utils/HelpActivity"; // Importando o utilitário para formatação de datas
import ExportPdfButton from "@/components/ExportPdfButtonHistorico"; // Importa o botão de exportação de PDF

interface ActivityItem {
  titulo: string;
  atividade: string;
  responsavel: string;
  Periodicidade: string;
  obrigatorio: string;
  responsavel_info: {
    nome: string;
    telefone: string;
    email: string;
  };
  id_name: string;
  id: number;
  category_id: number;
  updatedFields: any;
}

const ActivityPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Estado para diferenciar criação e edição
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [pageTitle, setPageTitle] = useState<string>("");
  const [blocks, setBlocks] = useState<{ id: string; name: string }[]>([]); // Armazena os blocos
  const [formattedActivityDates, setFormattedActivityDates] = useState<{
    [key: number]: string;
  }>({}); // Estado para armazenar as datas formatadas das atividades

  useEffect(() => {
    if (id) {
      fetchPageTitle(Number(id));
      fetchActivityHistory(Number(id));
      loadBlocks(); // Carregar blocos disponíveis
    }
  }, [id]);

  useEffect(() => {
    const formatActivityDates = async () => {
      const formattedDates: { [key: number]: string } = {};

      for (const activity of activities) {
        const formattedDate = await HelpActivity.formatDate(activity.data); // Aqui acessamos diretamente "data" em "activity"
        formattedDates[activity.id] = formattedDate; // Acessa o "id" diretamente em "activity"
      }

      setFormattedActivityDates(formattedDates);
    };

    if (activities.length > 0) {
      formatActivityDates();
    }
  }, [activities]);

  // Função para buscar o título da página com base no id
  const fetchPageTitle = async (activityId: number) => {
    try {
      const response = await fetch("/items/items.json");
      const result = await response.json();

      const activity = result.find(
        (item: ActivityItem) => item.id === activityId
      );

      if (activity) {
        setPageTitle(activity.titulo);
      } else {
        setPageTitle("Atividade não encontrada");
      }
    } catch (error) {
      console.error("Erro ao buscar o título:", error);
      setPageTitle("Erro ao carregar título");
    }
  };

  // Função para buscar o histórico da atividade do Firebase
  const fetchActivityHistory = async (activityId: number) => {
    try {
      const response = await getActivityHistory(activityId);
      // Transforme o retorno para corresponder à interface Activity
      const transformedActivities: Activity[] = response.map((item: any) => ({
        id: item.id,
        titulo: item.titulo || "Título Padrão", // Adicione um valor padrão, se necessário
        atividade: item.atividade || "Atividade Padrão",
        responsavel: item.responsavel || "Responsável Padrão",
        Periodicidade: item.Periodicidade || "Sem Periodicidade",
        obrigatorio: item.obrigatorio || "Sim",
        responsavel_info: item.responsavel_info || {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: item.id_name || "ID Padrão",
        category_id: item.category_id || 0,
        updatedFields: item.updatedFields || {}, // Caso você esteja usando updatedFields
      }));

      setActivities(transformedActivities);
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
    }
  };

  // Função para carregar os blocos disponíveis
  const loadBlocks = async () => {
    try {
      const fetchedBlocks = await fetchBlocks();
      setBlocks(fetchedBlocks || []);
    } catch (error) {
      console.error("Erro ao carregar blocos:", error);
    }
  };

  const handleExpand =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleAddActivity = () => {
    setEditingActivity({
      titulo: "",
      data: new Date().toISOString().split("T")[0],
      responsavel: "",
      atividade: "",
      Periodicidade: "",
      id: 0,
      obrigatorio: "Sim",
      blocoIDs: [], // Novo campo para blocos selecionados
      activityRegular: false,
      responsavel_info: {
        nome: "", // Adicione um valor padrão
        telefone: "", // Adicione um valor padrão
        email: "", // Adicione um valor padrão
      },
      id_name: "", // Adicione um valor padrão
      category_id: 0, // Valor padrão, se necessário
      updatedFields: {}, // Valor padrão, se necessário
    });
    setIsEditing(false); // Definir como criação
    setModalOpen(true);
  };

  const handleSaveActivity = async () => {
    setSnackbarMessage("Atividade adicionada com sucesso!");
    setSnackbarOpen(true);
    fetchActivityHistory(Number(id));
    setModalOpen(false);
  };

  const handleDelete = async (activityId: number) => {
    try {
      await deleteActivity(activityId);
      setSnackbarMessage("Atividade removida com sucesso!");
      setSnackbarOpen(true);
      fetchActivityHistory(Number(id));
    } catch (error) {
      console.error("Erro ao remover atividade:", error);
    }
  };

  const handleEdit = (activity: Activity) => {
    // Garantir que a atividade está definida corretamente antes de abrir o modal
    setEditingActivity({
      ...activity.updatedFields, // Usar os valores de updatedFields para preencher os campos
      blocoIDs: activity.updatedFields.blocoIDs || [], // Garantir que os blocos estão definidos
    });
    setIsEditing(true); // Definir como edição
    setModalOpen(true);
  };

  const handleBack = () => {
    router.push("/ManutencoesDashboard");
  };

  return (
    <MainLayout title="Histórico de Alterações">
      <Box sx={{ padding: { xs: 2, md: 4 } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Voltar para Manutenções
        </Button>

        <Typography variant="h4" gutterBottom>
          {pageTitle}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" }, // Coluna para telas pequenas, linha para maiores
            gap: 2,
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddActivity}
            sx={{ width: { xs: "100%", sm: "auto" } }} // Largura total em telas pequenas
          >
            Adicionar Atividade
          </Button>

          <ExportPdfButton activities={activities} />
        </Box>


        {activities.map((activity, index) => (
          <Accordion
            key={`${activity.updatedFields.id}-${index}`} // Use o "id" diretamente em "activity"
            expanded={expanded === `panel${activity.updatedFields.id}-${index}`}
            onChange={handleExpand(
              `panel${activity.updatedFields.id}-${index}`
            )}
            sx={{ marginBottom: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${activity.updatedFields.id}-${index}-content`}
              id={`panel${activity.updatedFields.id}-${index}-header`}
            >
              <Typography>
                {activity.updatedFields.titulo} -  {" "}
                {activity.updatedFields.data
                  ? new Date(activity.updatedFields.data).toLocaleDateString(
                    "pt-BR"
                  )
                  : "Carregando..."}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <strong>Responsável:</strong>{" "}
                {activity.updatedFields.responsavel}
              </Typography>
              <Typography>
                <strong>Atividade:</strong> {activity.updatedFields.atividade}
              </Typography>
              <Typography>
                <strong>Periodicidade:</strong>{" "}
                {activity.updatedFields.Periodicidade}
              </Typography>
              <Typography>
                <strong>Blocos:</strong>
                {activity.updatedFields.blocoIDs
                  ?.map(
                    (blockId: string | number) =>
                      blocks.find((block) => block.id === blockId)?.name || ""
                  )
                  .join(", ")}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit(activity)}
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(activity.updatedFields.id)} // Usando "id" diretamente
                >
                  Remover
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}

        {/* Modal para Adicionar/Editar Atividade */}
        {modalOpen && (
          <EditActivityModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            activity={
              editingActivity || {
                titulo: "",
                atividade: "",
                responsavel: "",
                Periodicidade: "",
                id: 0,
                obrigatorio: "Sim",
                blocoIDs: [],
                activityRegular: false,
                responsavel_info: {
                  nome: "",
                  telefone: "",
                  email: "",
                },
                id_name: "",
                category_id: 0, // Valor padrão
              }
            }
            onActivityUpdated={handleSaveActivity}
            disabled={false}
            title={isEditing ? "Editar Atividade" : "Adicionar Atividade"}
          />
        )}

        {/* Snackbar para mensagens de sucesso */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
};

export default ActivityPage;
