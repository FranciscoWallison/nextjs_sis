import React, { useCallback, useState, useEffect } from "react";
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
import { Activity, fetchBlocks } from "@/services/firebaseService"; // Assumindo que fetchBlocks está no serviço
import { SelectChangeEvent } from "@mui/material/Select";

interface ActivityModalProps {
  open: boolean;
  onClose: () => void;
  activity: Activity;
  onSave: (updatedActivity: Activity) => void;
  disabled: boolean;
}

const ActivityModal: React.FC<ActivityModalProps> = ({
  open,
  onClose,
  activity,
  onSave,
  disabled,
}) => {
  const [editedActivity, setEditedActivity] = useState<Activity>(activity);
  const [periodicityOptions, setPeriodicityOptions] = useState<{ id: number; descricao: string }[]>([]);
  const [blocks, setBlocks] = useState<{ id: string; name: string }[]>([]); // Blocos disponíveis
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]); // Blocos selecionados

  // Fetch para carregar as opções de periodicidade
  useEffect(() => {
    const fetchPeriodicityOptions = async () => {
      try {
        const response = await fetch("/periodicidades/periodicidade.json");
        const items = await response.json();
        setPeriodicityOptions(items);
      } catch (error) {
        console.error("Erro ao carregar periodicidades:", error);
      }
    };

    fetchPeriodicityOptions();
  }, []);

  // Fetch para carregar os blocos
  useEffect(() => {
    const loadBlocks = async () => {
      try {
        const fetchedBlocks = await fetchBlocks();
        setBlocks(fetchedBlocks);
        // Preenche os blocos selecionados a partir da atividade (se houver)
        setSelectedBlocks(activity.blocoIDs || []);
      } catch (error) {
        console.error("Erro ao carregar blocos:", error);
      }
    };

    loadBlocks();
  }, [activity]);

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
        prevActivity ? { ...prevActivity, [name]: value } : prevActivity
      );
    },
    []
  );

  // Manipula a seleção de blocos
  const handleBlockSelectChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedBlocks(event.target.value as string[]);
  };

  const handleSave = () => {
    if (editedActivity) {
      const updatedActivity = {
        ...editedActivity,
        blocoIDs: selectedBlocks, // Adiciona os blocos selecionados
      };
      onSave(updatedActivity);
      onClose();
    }
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
            {periodicityOptions.map((option) => (
              <MenuItem key={option.id} value={option.descricao}>
                {option.descricao}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Adicionar seleção de blocos */}
        {blocks.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Blocos</InputLabel>
            <Select
              multiple
              label="Blocos"
              value={selectedBlocks}
              onChange={handleBlockSelectChange}
              renderValue={(selected) =>
                selected
                  .map(
                    (selectedId) =>
                      blocks.find((block) => block.id === selectedId)?.name
                  )
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
        )}

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
