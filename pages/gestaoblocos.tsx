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
} from "@mui/material";
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
} from "@/services/firebaseService"; // Importar funções de serviço

const BlockManagementPage: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]); // Estado para armazenar a lista de blocos
  const [open, setOpen] = useState(false); // Estado para controle do modal
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null); // Estado para o bloco atual que está sendo editado ou visualizado
  const [isEditing, setIsEditing] = useState(false); // Estado para diferenciar entre adição e edição
  const [blockName, setBlockName] = useState<string>(""); // Estado para o nome do bloco
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para controle do Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Mensagem do Snackbar

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

    try {
      if (isEditing && currentBlock) {
        await updateBlock(currentBlock.id, blockName);
        setBlocks(
          blocks.map((block) =>
            block.id === currentBlock.id ? { ...block, name: blockName } : block
          )
        );
      } else {
        const newBlock = await addBlock(blockName);
        if (newBlock) {
          // Verifica se o newBlock não é null
          setBlocks([...blocks, newBlock]);
        } else {
          setSnackbarMessage("Erro ao adicionar novo bloco.");
          setSnackbarOpen(true);
        }
      }

      setOpen(false);
    } catch (error) {
      console.error("Erro ao salvar bloco:", error);
      setSnackbarMessage("Erro ao salvar bloco.");
      setSnackbarOpen(true);
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
              maxWidth: 360,
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

        {/* Modal para adicionar/editar/ver blocos */}
        <BlockDialog
          open={open}
          isEditing={isEditing}
          blockName={blockName}
          onClose={() => setOpen(false)}
          onSave={handleSaveBlock}
          setBlockName={setBlockName}
          isViewing={currentBlock !== null && !isEditing}
        />

        {/* Snackbar para feedback do usuário */}
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

interface BlockDialogProps {
  open: boolean;
  isEditing: boolean;
  blockName: string;
  onClose: () => void;
  onSave: () => void;
  setBlockName: (name: string) => void;
  isViewing: boolean;
}

// Componentização do Dialog para reutilização e clareza
const BlockDialog: React.FC<BlockDialogProps> = ({
  open,
  isEditing,
  blockName,
  onClose,
  onSave,
  setBlockName,
  isViewing,
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
        disabled={isViewing} // Desabilita o campo se estiver visualizando
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        {isEditing || !isViewing ? "Cancelar" : "Fechar"}
      </Button>
      {(isEditing || !isViewing) && (
        <Button onClick={onSave} color="primary">
          Salvar
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

export default BlockManagementPage;
