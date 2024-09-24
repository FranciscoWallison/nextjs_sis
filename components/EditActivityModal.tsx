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
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { Activity, fetchBlocks } from "@/services/firebaseService";

interface EditActivityModalProps {
  open: boolean;
  activity: Activity | null;
  onClose: () => void;
  onSave: (updatedActivity: Activity) => void;
}

const EditActivityModal: React.FC<EditActivityModalProps> = ({
  open,
  activity,
  onClose,
  onSave,
}) => {
  const [editedActivity, setEditedActivity] = useState<Activity | null>(null);
  const [blocks, setBlocks] = useState<{ id: string; name: string }[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]); // Blocos selecionados
  const [periodicityOptions, setPeriodicityOptions] = useState<string[]>([]);

  useEffect(() => {
    const loadBlocks = async () => {
      const fetchedBlocks = await fetchBlocks();
      setBlocks(fetchedBlocks || []);
    };

    const fetchPeriodicityOptions = async () => {
      const response = await fetch("/periodicidades/periodicidade.json");
      const result = await response.json();
      const options = result.map(
        (item: { descricao: string }) => item.descricao
      );
      setPeriodicityOptions(options);
    };

    loadBlocks();
    fetchPeriodicityOptions();

    if (activity) {
      setEditedActivity(activity);
      setSelectedBlocks(activity.blocoIDs || []); // Preenche com os blocos atuais
    }
  }, [activity]);

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const value = Array.isArray(event.target.value) ? event.target.value : [];
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
      const finalActivity = { ...editedActivity, blocoIDs: selectedBlocks };
      onSave(finalActivity);
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
            value={editedActivity?.Periodicidade || ""}
            onChange={handleSelectChangePeriodicidade}
            disabled={
              editedActivity?.Periodicidade !==
              "Conforme indicação dos fornecedores"
            }
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

export default EditActivityModal;
