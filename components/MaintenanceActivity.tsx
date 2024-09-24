import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  Activity,
  fetchBlocks,
  getActivityHistory,
} from "@/services/firebaseService";
import ActivityStatus from "@/components/layout/ActivityStatus";
import { getStatus } from "@/utils/statusHelper";

interface MaintenanceActivityProps {
  activity: Activity;
  onUpdate: (updatedActivity: Activity) => void;
  onRemove: (activityId: number) => void;
  removeValid: boolean;
  titleUpdate: string;
}

const MaintenanceActivity: React.FC<MaintenanceActivityProps> = ({
  activity,
  onUpdate,
  onRemove,
  removeValid,
  titleUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [editedActivity, setEditedActivity] = useState<Activity | null>(null);
  const [blocks, setBlocks] = useState<{ id: string; name: string }[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]); // Estado para blocos selecionados
  const [history, setHistory] = useState<any[]>([]);
  const [activityRegular, setActivityRegular] = useState<boolean>(false);
  const [periodicityOptions, setPeriodicityOptions] = useState<string[]>([]);

  useEffect(() => {
    const loadBlocks = async () => {
      const fetchedBlocks = await fetchBlocks();
      setBlocks(fetchedBlocks || []);
    };
    fetchPeriodicityOptions();
    loadBlocks();
  }, []);

  const handleOpen = () => {
    setEditedActivity(activity);
    setActivityRegular(activity.activityRegular || false);
    setSelectedBlocks(activity.blocoIDs || []); // Preenche com os blocos atuais da atividade (se houver)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditedActivity(null);
    setSelectedBlocks([]); // Reseta os blocos selecionados ao fechar
  };

  const handleRemoveOpen = () => setRemoveOpen(true);
  const handleRemoveClose = () => setRemoveOpen(false);

  const handleHistoryOpen = async () => {
    const fetchedHistory = await getActivityHistory(activity.id);
    setHistory(fetchedHistory);
    setHistoryOpen(true);
  };

  const handleHistoryClose = () => setHistoryOpen(false);

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const value = Array.isArray(event.target.value) ? event.target.value : []; // Verifica se o valor é um array
      setSelectedBlocks(value); // Atualiza os blocos selecionados
    },
    []
  );

  const handleSelectChangePeriodicidade = useCallback(
    (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      setEditedActivity((prevActivity) =>
        prevActivity ? { ...prevActivity, Periodicidade: value } : null
      );
    },
    []
  );

  // Função para buscar as opções de periodicidade
  const fetchPeriodicityOptions = async () => {
    try {
      const response = await fetch("/periodicidades/periodicidade.json");
      const result = await response.json();

      // Mapeia o resultado para pegar apenas o campo 'descricao'
      const options = result.map(
        (item: { descricao: string }) => item.descricao
      );
      setPeriodicityOptions(options); // Atualiza o estado com as opções
    } catch (error) {
      console.error("Erro ao buscar as opções de periodicidade:", error);
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditedActivity((prevActivity) =>
      prevActivity
        ? { ...prevActivity, [name]: type === "checkbox" ? checked : value }
        : null
    );
  }, []);

  const handleSave = () => {
    if (editedActivity) {
      // Se nenhum bloco for selecionado, aplica a todos os blocos
      const finalBlocks =
        selectedBlocks.length === 0 ? blocks.map((b) => b.id) : selectedBlocks;

      // Atualiza a atividade com os blocos finais
      const updatedActivity = {
        ...editedActivity,
        blocoIDs: finalBlocks,
        activityRegular,
      };
      onUpdate(updatedActivity);
      handleClose();
    }
  };

  const handleRemove = () => {
    onRemove(activity.id);
    handleRemoveClose();
  };

  const formatDate = (input: string | undefined) => {
    if (!input) return "";
    const [year, month, day] = input.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatDateToDDMMYYYY = (activity: Activity): string => {
    const dataStatus = getStatus(activity);

    if (!dataStatus.dueDate) {
      return "";
    }
    const date = new Date(dataStatus.dueDate);
    if (isNaN(date.getTime())) {
      throw new Error("Data inválida");
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };
  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {activity.titulo}{" "}
            <ActivityStatus
              activity={{
                ...activity,
                data: activity.data || "",
                category_id: activity.category_id ?? 0,
              }}
            />
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {activity.atividade}
          </Typography>
          <Typography variant="body2">
            <strong>Responsável:</strong> {activity.responsavel}
          </Typography>
          <Typography variant="body2">
            <strong>Periodicidade:</strong> {activity.Periodicidade}
          </Typography>

          {Array.isArray(selectedBlocks) && selectedBlocks.length > 0 && (
            <Typography variant="body2">
              <strong>Blocos:</strong>{" "}
              {selectedBlocks
                .map(
                  (blockId) =>
                    blocks.find((block) => block.id === blockId)?.name
                )
                .filter((name) => name)
                .join(", ")}
            </Typography>
          )}

          {activity.data && (
            <>
              <Typography variant="body2">
                Última manutenção: {formatDate(activity.data)}
              </Typography>
              <Typography variant="body2">
                Vencimento: {formatDateToDDMMYYYY(activity)}
              </Typography>
            </>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              flexDirection: { xs: "column", sm: "row" }, // Flex direção para mobile
              gap: 2, // Adiciona espaçamento entre os botões
            }}
          >
            <Button variant="contained" color="primary" onClick={handleOpen}>
              {titleUpdate}
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={handleHistoryOpen}
            >
              Ver Histórico
            </Button>
            {removeValid && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleRemoveOpen}
              >
                Remover
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Editar Atividade
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Título"
            name="titulo"
            value={editedActivity?.titulo || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Atividade"
            name="atividade"
            value={editedActivity?.atividade || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Responsável"
            name="responsavel"
            value={editedActivity?.responsavel || ""}
            onChange={handleChange}
            disabled={true}
          />
          <FormControl
            fullWidth
            margin="normal"
            required={
              editedActivity?.Periodicidade ===
              "Conforme indicação dos fornecedores"
            }
          >
            <InputLabel>Periodicidade</InputLabel>
            <Select
              label="Periodicidade"
              name="Periodicidade"
              value={editedActivity?.Periodicidade || ""} // Use o valor de `editedActivity?.Periodicidade`
              onChange={handleSelectChangePeriodicidade} // Corrige para lidar com strings
            >
              {periodicityOptions
                .filter(
                  (option) =>
                    option !== "Conforme indicação dos fornecedores" &&
                    option !==
                      "A cada 5 anos para edifícios de até 10 anos de entrega, A cada 3 anos para edifícios entre 11 a 30 anos de entrega, A cada ano para edifícios com mais de 30 anos de entrega"
                )
                .map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {blocks.length > 0 && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Bloco</InputLabel>
              <Select
                multiple
                label="Bloco"
                value={Array.isArray(selectedBlocks) ? selectedBlocks : []} // Verifica se é um array
                onChange={handleSelectChange}
                renderValue={(selected) =>
                  Array.isArray(selected) // Verifica se 'selected' é um array
                    ? selected
                        .map(
                          (selectedId) =>
                            blocks.find((block) => block.id === selectedId)
                              ?.name
                        )
                        .join(", ")
                    : ""
                }
              >
                {blocks.map((block) => (
                  <MenuItem key={block.id} value={block.id}>
                    {block.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {editedActivity?.Periodicidade !== "Não aplicável" ? (
            <TextField
              fullWidth
              margin="normal"
              label="Data"
              name="data"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={editedActivity?.data || ""}
              onChange={handleChange}
            />
          ) : (
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
              <Button
                variant="contained"
                color={activityRegular ? "success" : "primary"}
                onClick={() => setActivityRegular(!activityRegular)}
              >
                {activityRegular ? "Feito" : "Marcar como Feito"}
              </Button>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Salvar
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={removeOpen} onClose={handleRemoveClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Confirmar Remoção
          </Typography>
          <Typography variant="body2" sx={{ my: 2 }}>
            Você tem certeza que deseja remover esta atividade?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleRemoveClose}
            >
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleRemove}>
              Remover
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={historyOpen} onClose={handleHistoryClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Histórico de Alterações
          </Typography>
          {history.length > 0 ? (
            history.map((entry, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Data:</strong>{" "}
                  {new Date(entry.timestamp.seconds * 1000).toLocaleString()}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2">
              Nenhum histórico disponível.
            </Typography>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleHistoryClose}
            >
              Fechar
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default MaintenanceActivity;
