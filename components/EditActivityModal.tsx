import React, { useState, useCallback, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // Import do DatePicker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"; // Import de LocalizationProvider
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Import do adaptador para Dayjs
import dayjs, { Dayjs } from "dayjs"; // Utilizando dayjs para formatação de datas
import { SelectChangeEvent } from "@mui/material/Select";
import {
  Activity,
  fetchBlocks,
  usuarioPeriodicidadesAtualizar,
  usuarioPeriodicidadesAdicionar,
} from "@/services/firebaseService";
import HelpActivity from "@/utils/HelpActivity";

interface EditActivityModalProps {
  open: boolean;
  activity: Activity | null;
  onClose: () => void;
  onActivityUpdated?: () => void;
  title?: string; // Título dinâmico opcional
  isEdit?: boolean; // Indica se o modal está em modo de edição ou criação
  showNotApplicable?: boolean; // Novo parâmetro: Se deve mostrar a opção "Não aplicável"
  onSave?: (updatedActivity: Activity) => Promise<void>;
  disabled?: boolean;
}

const EditActivityModal: React.FC<EditActivityModalProps> = ({
  open,
  activity,
  onClose,
  onActivityUpdated,
  title = "Atividade", // Título padrão
  isEdit = false, // Indica se está editando ou criando uma nova atividade
  showNotApplicable = false, // Novo parâmetro: controla a exibição de "Não aplicável"
  onSave,
  disabled = false,
}) => {
  const [editedActivity, setEditedActivity] = useState<Activity | null>(null);
  const [blocks, setBlocks] = useState<{ id: string; name: string }[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [periodicityOptions, setPeriodicityOptions] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null); // Estado para a data selecionada
  const [activityRegular, setActivityRegular] = useState<boolean>(false); // Estado para "Marcar como Feito"

  useEffect(() => {
    const loadBlocks = async () => {
      const fetchedBlocks = await fetchBlocks();
      setBlocks(fetchedBlocks || []);
    };

    const fetchPeriodicityOptions = async () => {
      try {
        const response = await fetch("/periodicidades/periodicidade.json");
        const result = await response.json();
        let options = result.map(
          (item: { descricao: string }) => item.descricao
        );

        // Verifica se "Não aplicável" já está presente
        const notApplicableIndex = options.indexOf("Não aplicável");

        if (showNotApplicable) {
          // Se showNotApplicable for true e "Não aplicável" não estiver na lista, adiciona
          if (notApplicableIndex === -1) {
            options = ["Não aplicável", ...options];
          }
        } else {
          // Se showNotApplicable for false e "Não aplicável" estiver na lista, remove
          if (notApplicableIndex !== -1) {
            options = options.filter(
              (option: any) => option !== "Não aplicável"
            );
          }
        }

        setPeriodicityOptions(options);
      } catch (error) {
        console.error("Erro ao buscar as opções de periodicidade:", error);
      }
    };

    loadBlocks();
    fetchPeriodicityOptions();

    if (activity) {
      setEditedActivity(activity);
      setSelectedBlocks(activity.blocoIDs || []);
      if (activity.data) {
        setSelectedDate(dayjs(activity.data)); // Define a data selecionada
      }
      // Define o estado de "Feito" baseado em activityRegular já existente
      setActivityRegular(activity.activityRegular || false);
    }
  }, [activity, showNotApplicable]);

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const value = Array.isArray(event.target.value) ? event.target.value : [];
      setSelectedBlocks(value);
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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedActivity((prevActivity) =>
      prevActivity ? { ...prevActivity, [name]: value } : null
    );
  }, []);

  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
    if (newDate) {
      setEditedActivity((prevActivity) =>
        prevActivity
          ? { ...prevActivity, data: newDate.format("YYYY-MM-DD") }
          : null
      );
    }
  };

  const handleSave = async () => {
    if (editedActivity) {
      const finalActivity = {
        ...editedActivity,
        blocoIDs:
          selectedBlocks.length === 0
            ? blocks.map((b) => b.id)
            : selectedBlocks,
        activityRegular, // Inclui o estado de "Feito" na atividade
      };

      // formata data
      // const date_format = await HelpActivity.formatDate(finalActivity.data);
      // finalActivity.data = date_format;

      try {
        if (isEdit) {
          await usuarioPeriodicidadesAtualizar(finalActivity); // Atualiza a atividade existente
        } else {
          finalActivity.id_name = "hasCriado";
          finalActivity.category_id = 200;
          await usuarioPeriodicidadesAdicionar([finalActivity]); // Adiciona uma nova atividade
        }

        setSnackbarOpen(true); // Mostra o Snackbar de sucesso
        if (onActivityUpdated) {
          onActivityUpdated(); // Chama a função do pai para atualizar os dados
        }
        onClose(); // Fecha o modal
      } catch (error) {
        console.error("Erro ao salvar a atividade:", error);
      }
    }
  };

  const handleMarkAsDone = () => {
    const newValue = !activityRegular;
    setActivityRegular(newValue);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* Adicionando LocalizationProvider para o DatePicker */}
      <Modal open={open} onClose={onClose}>
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
            {isEdit ? `Editar ${title}` : `Nova ${title}`}
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
            disabled={disabled}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Periodicidade</InputLabel>
            <Select
              label="Periodicidade"
              name="Periodicidade"
              value={editedActivity?.Periodicidade || ""}
              onChange={handleSelectChangePeriodicidade}
            >
              {periodicityOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Blocos</InputLabel>
            <Select
              multiple
              label="Blocos"
              value={Array.isArray(selectedBlocks) ? selectedBlocks : []}
              onChange={handleSelectChange}
              renderValue={(selected) =>
                Array.isArray(selected)
                  ? selected
                      .map(
                        (selectedId) =>
                          blocks.find((block) => block.id === selectedId)?.name
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

          {/* O campo de data só é exibido se "Não aplicável" NÃO for selecionado */}
          {editedActivity?.Periodicidade !== "Não aplicável" ? (
            <DatePicker
              label="Data"
              value={selectedDate}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                },
              }}
            />
          ) : (
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
              <Button
                variant="contained"
                color={activityRegular ? "success" : "primary"}
                onClick={handleMarkAsDone}
              >
                {activityRegular ? "Feito" : "Marcar como Feito"}
              </Button>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="contained" color="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              {isEdit ? "Salvar Alterações" : "Criar Atividade"}
            </Button>
          </Box>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert onClose={handleSnackbarClose} severity="success">
              Atividade {isEdit ? "atualizada" : "criada"} com sucesso!
            </Alert>
          </Snackbar>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default EditActivityModal;
