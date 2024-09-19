import React, { useState, useEffect } from "react";
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
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { BlockDialogProps } from "@/interface/BlockDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MainLayout from "../components/layout/MainLayout";
import {
  fetchBlocks,
  addBlock,
  updateBlock,
  deleteBlock,
  Block,
} from "@/services/firebaseService";

const BlockManagementPage: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [open, setOpen] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [blockName, setBlockName] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for save operation

  useEffect(() => {
    const loadBlocks = async () => {
      try {
        const blocksList = await fetchBlocks();
        setBlocks(blocksList || []);
      } catch (error) {
        console.error("Erro ao buscar blocos:", error);
        setSnackbarMessage("Erro ao buscar blocos.");
        setSnackbarOpen(true);
      }
    };

    loadBlocks();
  }, []);

  const handleAddBlockClick = () => {
    setIsEditing(false);
    setBlockName("");
    setCurrentBlock(null);
    setOpen(true);
  };

  const handleEditBlockClick = (block: Block) => {
    setIsEditing(true);
    setBlockName(block.name);
    setCurrentBlock(block);
    setOpen(true);
  };

  const handleViewBlockClick = (block: Block) => {
    setIsEditing(false);
    setBlockName(block.name);
    setCurrentBlock(block);
    setOpen(true);
  };

  const handleSaveBlock = async () => {
    if (blockName.trim() === "") {
      setSnackbarMessage("O nome do bloco não pode estar vazio.");
      setSnackbarOpen(true);
      return;
    }

    // Verificar se já existe um bloco com o mesmo nome
    const blockExists = blocks.some(
      (block) => block.name.toLowerCase() === blockName.trim().toLowerCase() && (!isEditing || block.id !== currentBlock?.id)
    );

    if (blockExists) {
      setSnackbarMessage("Já existe um bloco com este nome.");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      if (isEditing && currentBlock) {
        await updateBlock(currentBlock.id, blockName);
      } else {
        await addBlock(blockName);
      }

      const updatedBlocks = await fetchBlocks();
      setBlocks(updatedBlocks || []);
      setOpen(false);
    } catch (error) {
      console.error("Erro ao salvar bloco:", error);
      setSnackbarMessage("Erro ao salvar bloco.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBlock = async (blockId: string) => {
    try {
      await deleteBlock(blockId);
      setBlocks(blocks.filter((block) => block.id !== blockId));
    } catch (error) {
      console.error("Erro ao deletar bloco:", error);
      setSnackbarMessage("Erro ao deletar bloco.");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
              maxWidth: 480, // Altere o tamanho máximo para melhorar a responsividade
              bgcolor: "background.paper",
              marginTop: 2,
            }}
          >
            {blocks.map((block) => (
              <ListItem
                key={block.id}
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      aria-label="visualizar bloco"
                      onClick={() => handleViewBlockClick(block)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="editar bloco"
                      onClick={() => handleEditBlockClick(block)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="deletar bloco"
                      onClick={() => handleRemoveBlock(block.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText primary={block.name} />
              </ListItem>
            ))}
          </List>
        </Box>

        <BlockDialog
          open={open}
          isEditing={isEditing}
          blockName={blockName}
          onClose={() => setOpen(false)}
          onSave={handleSaveBlock}
          setBlockName={setBlockName}
          isViewing={currentBlock !== null && !isEditing}
          loading={loading} // Pass loading state to dialog
        />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Container>
    </MainLayout>
  );
};

const BlockDialog: React.FC<BlockDialogProps> = ({
  open,
  isEditing,
  blockName,
  onClose,
  onSave,
  setBlockName,
  isViewing,
  loading, // Recebe o estado de carregamento
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>
      {isEditing
        ? "Editar Bloco"
        : isViewing
        ? "Visualizar Bloco"
        : "Adicionar Bloco"}
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
        disabled={isViewing || loading} // Desabilita se estiver visualizando ou carregando
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        {isEditing || !isViewing ? "Cancelar" : "Fechar"}
      </Button>
      {(isEditing || !isViewing) && (
        <Button onClick={onSave} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Salvar"}
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

export default BlockManagementPage;
