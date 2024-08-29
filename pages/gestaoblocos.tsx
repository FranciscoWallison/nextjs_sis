import React, { useState } from "react";
import {
  Container,
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MainLayout from "../components/layout/MainLayout";

const BlockManagementPage: React.FC = () => {
  const [blocks, setBlocks] = useState<string[]>([]); // Estado para armazenar a lista de blocos
  const [open, setOpen] = useState(false); // Estado para controle do modal
  const [currentBlock, setCurrentBlock] = useState<string | null>(null); // Estado para o bloco atual que está sendo editado ou visualizado
  const [isEditing, setIsEditing] = useState(false); // Estado para diferenciar entre adição e edição
  const [blockName, setBlockName] = useState<string>(""); // Estado para o nome do bloco

  // Função para abrir o modal para adicionar um novo bloco
  const handleAddBlockClick = () => {
    setIsEditing(false);
    setBlockName("");
    setOpen(true);
  };

  // Função para abrir o modal para editar um bloco existente
  const handleEditBlockClick = (block: string) => {
    setIsEditing(true);
    setBlockName(block);
    setCurrentBlock(block);
    setOpen(true);
  };

  // Função para abrir o modal para visualizar um bloco existente
  const handleViewBlockClick = (block: string) => {
    setIsEditing(false);
    setBlockName(block);
    setCurrentBlock(block);
    setOpen(true);
  };

  // Função para salvar (adicionar ou editar) um bloco
  const handleSaveBlock = () => {
    if (blockName.trim() === "") {
      alert("O nome do bloco não pode estar vazio.");
      return;
    }

    if (isEditing && currentBlock !== null) {
      setBlocks(
        blocks.map((block) => (block === currentBlock ? blockName : block))
      );
    } else if (!blocks.includes(blockName)) {
      setBlocks([...blocks, blockName]);
    } else {
      alert("Este bloco já existe.");
    }

    setOpen(false);
  };

  // Função para remover um bloco da lista
  const handleRemoveBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
  };

  return (
    <MainLayout title="Gestão de Blocos">
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Gestão de Blocos
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddBlockClick}
          >
            Cadastrar Bloco
          </Button>

          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              marginTop: 2,
            }}
          >
            {blocks.map((block, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      aria-label="view"
                      onClick={() => handleViewBlockClick(block)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEditBlockClick(block)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveBlock(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText primary={block} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Modal para adicionar/editar/ver blocos */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>
            {isEditing ? "Editar Bloco" : currentBlock ? "Visualizar Bloco" : "Adicionar Bloco"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="blockName"
              label="Nome do Bloco"
              type="text"
              fullWidth
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              disabled={!isEditing && currentBlock !== null} // Desabilita o campo se estiver visualizando
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              {isEditing || !currentBlock ? "Cancelar" : "Fechar"}
            </Button>
            {(isEditing || !currentBlock) && (
              <Button onClick={handleSaveBlock} color="primary">
                Salvar
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
};

export default BlockManagementPage;
