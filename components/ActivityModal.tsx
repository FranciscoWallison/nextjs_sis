import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { Activity } from "@/services/firebaseService";
import { SelectChangeEvent } from "@mui/material/Select";

interface ActivityModalProps {
  open: boolean;
  onClose: () => void;
  activity: Activity;
  onSave: (updatedActivity: Activity) => void;
  disabled: boolean;
}

const periodicityOptions = [
  "Não aplicável",
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

const ActivityModal: React.FC<ActivityModalProps> = ({
  open,
  onClose,
  activity,
  onSave,
  disabled,
}) => {
  const [editedActivity, setEditedActivity] = useState<Activity>(activity);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedActivity((prevActivity) =>
      prevActivity ? { ...prevActivity, [name]: value } : prevActivity
    );
  }, []);

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const { name, value } = event.target;
      setEditedActivity((prevActivity) =>
        prevActivity ? { ...prevActivity, [name as string]: value } : prevActivity
      );
    },
    []
  );

  const handleSave = () => {
    onSave(editedActivity);
    onClose();
  };

  return (
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
          Nova Manutenção
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Título"
          name="titulo"
          value={editedActivity.titulo || ""}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Atividade"
          name="atividade"
          value={editedActivity.atividade || ""}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Responsável"
          name="responsavel"
          value={editedActivity.responsavel || ""}
          onChange={handleChange}
          disabled={disabled}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Periodicidade</InputLabel>
          <Select
            label="Periodicidade"
            name="Periodicidade"
            value={editedActivity.Periodicidade || ""}
            onChange={handleSelectChange}
            disabled={disabled}
          >
            {periodicityOptions.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* <TextField
          fullWidth
          margin="normal"
          label="Obrigatório"
          name="obrigatorio"
          value={editedActivity.obrigatorio || ""}
          onChange={handleChange}
        /> */}
        {/* <TextField
          fullWidth
          margin="normal"
          label="Data"
          name="data"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={editedActivity.data || ""}
          onChange={handleChange}
        /> */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ActivityModal;
