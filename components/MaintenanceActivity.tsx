import React, { useState } from "react";
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
import { Activity } from "@/services/firebaseService";

interface MaintenanceActivityProps {
  activity: Activity;
  onUpdate: (updatedActivity: Activity) => void;
  onRemove: (activityId: number) => void;
  removeValid: boolean;
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
}) => {
  // Add onRemove here
  const [open, setOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false); // Add state for remove confirmation modal
  const [editedActivity, setEditedActivity] = useState(activity);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRemoveOpen = () => setRemoveOpen(true); // Function to open remove confirmation modal
  const handleRemoveClose = () => setRemoveOpen(false); // Function to close remove confirmation modal

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditedActivity({
      ...editedActivity,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setEditedActivity({
      ...editedActivity,
      [name as string]: value,
    });
  };

  const handleSave = async () => {
    onUpdate(editedActivity); // Call the update function
    handleClose();
  };

  const handleRemove = () => {
    onRemove(activity.id); // Call the remove function
    handleRemoveClose();
  };

  function formatDate(input: string | undefined) {
    if (!input) return;
    const datePart = input.match(/\d+/g);
    if (!datePart) return;
    const year = datePart[0].substring(2),
      month = datePart[1],
      day = datePart[2];
    return `${day}/${month}/${year}`;
  }

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {activity.titulo}
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
          <Typography variant="body2">
            <strong>Obrigatório:</strong> {activity.obrigatorio}
          </Typography>
          <Typography variant="body2">
            <strong>Feitos:</strong>
          </Typography>
          <Typography variant="body2">
            Data: {formatDate(activity.data)}
          </Typography>
          {activity.nao_feito && (
            <Typography variant="body2">
              Não foi feito: {activity.nao_feito ? "sim" : "não"}
            </Typography>
          )}
          {activity.nao_lembro && (
            <Typography variant="body2">
              Não Lembro: {activity.nao_lembro ? "sim" : "não"}
            </Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Editar
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
            value={editedActivity.titulo}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Atividade"
            name="atividade"
            value={editedActivity.atividade}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Responsável"
            name="responsavel"
            value={editedActivity.responsavel}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Periodicidade</InputLabel>
            <Select
              label="Periodicidade"
              name="Periodicidade"
              value={editedActivity.Periodicidade}
              onChange={handleSelectChange}
            >
              {periodicityOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Obrigatório"
            name="obrigatorio"
            value={editedActivity.obrigatorio}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Data"
            name="data"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={editedActivity.data || ""}
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
