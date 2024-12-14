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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");

import { SelectChangeEvent } from "@mui/material/Select";
import {
  Activity,
  fetchBlocks,
  usuarioPeriodicidadesAtualizar,
  usuarioPeriodicidadesAdicionar,
  fetchSuppliers,
} from "@/services/firebaseService";
import { useNotification } from "@/contexts/NotificationContext";

interface EditActivityModalProps {
  open: boolean;
  activity: Activity | null;
  onClose: () => void;
  onActivityUpdated?: () => void;
  title?: string;
  isEdit?: boolean;
  showNotApplicable?: boolean;
  disabled?: boolean;
}

const EditActivityModal: React.FC<EditActivityModalProps> = ({
  open,
  activity,
  onClose,
  onActivityUpdated,
  title = "Atividade",
  isEdit = false,
  showNotApplicable = false,
  disabled = false,
}) => {
  const { fetchNotifications } = useNotification();
  const [editedActivity, setEditedActivity] = useState<Activity | null>(null);
  const [blocks, setBlocks] = useState<{ id: string; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; nome: string }[]>(
    []
  );
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [periodicityOptions, setPeriodicityOptions] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [activityRegular, setActivityRegular] = useState<boolean>(false);

  useEffect(() => {
    const loadInitialData = async () => {
      const fetchedBlocks = await fetchBlocks();
      const fetchedSuppliers = await fetchSuppliers();
      setBlocks(fetchedBlocks || []);
      setSuppliers(fetchedSuppliers || []);

      const response = await fetch("/periodicidades/periodicidade.json");
      const result = await response.json();
      const options = result.map(
        (item: { descricao: string }) => item.descricao
      );
      if (showNotApplicable && !options.includes("Não aplicável")) {
        options.unshift("Não aplicável");
      }
      setPeriodicityOptions(options);

      if (activity) {
        setEditedActivity(activity);
        setSelectedBlocks(activity.blocoIDs || []);
        setSelectedDate(activity.data ? dayjs(activity.data) : null);
        setActivityRegular(activity.activityRegular || false);
        setSelectedSuppliers(activity.suppliers || []);
      }
    };

    loadInitialData();
  }, [activity, showNotApplicable]);

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedBlocks(event.target.value as string[]);
  };

  const handleSupplierChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedSuppliers(event.target.value as string[]);
  };

  const handleSelectChangePeriodicidade = (
    event: SelectChangeEvent<string>
  ) => {
    setEditedActivity((prev) =>
      prev ? { ...prev, Periodicidade: event.target.value } : null
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedActivity((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
    setEditedActivity((prev) =>
      prev ? { ...prev, data: newDate ? newDate.toISOString() : "" } : null
    );
  };

  const handleSave = async () => {
    if (!editedActivity) return;

    const finalActivity = {
      ...editedActivity,
      blocoIDs: selectedBlocks.length
        ? selectedBlocks
        : blocks.map((b) => b.id),
      suppliers: selectedSuppliers,
      activityRegular,
    };

    try {
      if (isEdit) {
        await usuarioPeriodicidadesAtualizar(finalActivity);
      } else {
        finalActivity.id_name = "hasCriado";
        finalActivity.category_id = 200;
        await usuarioPeriodicidadesAdicionar([finalActivity]);
      }

      setSnackbarOpen(true);
      onActivityUpdated?.();
      onClose();
      await fetchNotifications();
    } catch (error) {
      console.error("Erro ao salvar a atividade:", error);
    }
  };

  const handleMarkAsDone = () => setActivityRegular(!activityRegular);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          <Typography variant="h6">
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
              value={selectedBlocks}
              onChange={handleSelectChange}
              renderValue={(selected) =>
                selected
                  .map((id) => blocks.find((block) => block.id === id)?.name)
                  .join(", ")
              }
            >
              {blocks.map((block) => (
                <MenuItem key={block.id} value={block.id}>
                  {block.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Fornecedores</InputLabel>
            <Select
              multiple
              label="Fornecedores"
              value={selectedSuppliers}
              onChange={handleSupplierChange}
              renderValue={(selected) =>
                selected
                  .map(
                    (id) =>
                      suppliers.find((supplier) => supplier.id === id)?.nome
                  )
                  .join(", ")
              }
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
