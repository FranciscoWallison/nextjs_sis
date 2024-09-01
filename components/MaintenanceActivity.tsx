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
import { Activity, fetchBlocks } from "@/services/firebaseService"; // Supondo que fetchBlocks está no firebaseService
import ActivityStatus from "@/components/layout/ActivityStatus";
import { getStatus } from "@/utils/statusHelper"; // Supondo que a função getStatus está no utils

interface MaintenanceActivityProps {
  activity: Activity;
  onUpdate: (updatedActivity: Activity) => void;
  onRemove: (activityId: number) => void;
  removeValid: boolean;
  titleUpdate: string;
}

const periodicityOptions = [
  "A cada semana",
  "A cada duas semanas",
  "A cada mês",
  "A cada dois meses",
  "A cada três meses",
  "A cada seis meses",
  "A cada ano",
  "A cada dois anos",
  "A cada três anos",
  "A cada cinco anos",
];

const MaintenanceActivity: React.FC<MaintenanceActivityProps> = ({
  activity,
  onUpdate,
  onRemove,
  removeValid,
  titleUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [editedActivity, setEditedActivity] = useState<Activity | null>(null);
  const [blocks, setBlocks] = useState<{ id: string; name: string }[]>([]); // Estado para armazenar blocos

  useEffect(() => {
    const loadBlocks = async () => {
      const fetchedBlocks = await fetchBlocks();
      setBlocks(fetchedBlocks);
    };

    loadBlocks();
  }, []);

  const handleOpen = () => {
    setEditedActivity(activity);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditedActivity(null);
  };

  const handleRemoveOpen = () => setRemoveOpen(true);
  const handleRemoveClose = () => setRemoveOpen(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditedActivity((prevActivity) =>
      prevActivity
        ? { ...prevActivity, [name]: type === "checkbox" ? checked : value }
        : null
    );
  }, []);

  const handleSelectChange = useCallback((event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setEditedActivity((prevActivity) =>
      prevActivity ? { ...prevActivity, [name as string]: value } : null
    );
  }, []);

  const handleSave = () => {
    if (editedActivity) {
      onUpdate(editedActivity);
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

  const formatDateToDDMMYYYY = (
    activity: Activity
  ): string => {
    const dataStatus = getStatus(activity);

    if (!dataStatus.dueDate) {
      return "";
    }
    // Cria um objeto Date a partir da string de data
    const date = new Date(dataStatus.dueDate);

    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      throw new Error("Data inválida");
    }

    // Extrai o dia, mês e ano da data
    const day = date.getDate().toString().padStart(2, "0"); // Adiciona zero à esquerda se necessário
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Os meses são baseados em zero (janeiro = 0)
    const year = date.getFullYear().toString();

    // Retorna a data formatada como dd/mm/yyyy
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

          {activity.bloco && (
            <Typography variant="body2">
              <strong>Bloco:</strong> {activity.bloco.name}
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

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              {titleUpdate}
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
            disabled={true} // Ou apenas disabled se quiser desabilitar o campo
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Periodicidade</InputLabel>
            <Select
              label="Periodicidade"
              name="Periodicidade"
              value={editedActivity?.Periodicidade || ""}
              onChange={handleSelectChange}
              disabled={true} // Ou apenas disabled se quiser desabilitar o campo
            >
              {periodicityOptions.map((option, index) => (
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
                label="Bloco"
                name="blocoID"
                value={editedActivity?.blocoID || ""}
                onChange={handleSelectChange}
              >
                {blocks.map((block) => (
                  <MenuItem key={block.id} value={block.id}>
                    {block.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

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
    </>
  );
};

export default MaintenanceActivity;
