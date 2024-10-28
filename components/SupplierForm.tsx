import React from "react";
import InputMask from "react-input-mask";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

const SupplierForm: React.FC<{
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: any;
  onFormChange: (field: string, value: string) => void;
  loading: boolean;
}> = ({ open, onClose, onSave, formData, onFormChange, loading }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>
      {formData.id ? "Editar Fornecedor" : "Novo Fornecedor"}
    </DialogTitle>
    <DialogContent>
      <TextField
        margin="dense"
        label="Nome"
        fullWidth
        value={formData.nome}
        onChange={(e) => onFormChange("nome", e.target.value)}
      />

      {/* Máscara para CNPJ */}
      <TextField
        margin="dense"
        label="CNPJ"
        fullWidth
        variant="outlined"
        placeholder="00.000.000/0000-00"
        InputLabelProps={{ shrink: true }}
        value={formData.cnpj}
        onChange={(e) => onFormChange("cnpj", e.target.value)}
        InputProps={{
          inputComponent: (props) => (
            <InputMask
              {...props}
              mask="99.999.999/9999-99"
              value={formData.cnpj}
              onChange={(e) => onFormChange("cnpj", e.target.value)}
            />
          ),
        }}
      />

      <TextField
        margin="dense"
        label="Email"
        type="email"
        fullWidth
        value={formData.email}
        onChange={(e) => onFormChange("email", e.target.value)}
      />

      {/* Máscara para Telefone */}
      <TextField
        margin="dense"
        label="Telefone"
        fullWidth
        variant="outlined"
        placeholder="(00) 00000-0000"
        InputLabelProps={{ shrink: true }}
        value={formData.telefone}
        onChange={(e) => onFormChange("telefone", e.target.value)}
        InputProps={{
          inputComponent: (props) => (
            <InputMask
              {...props}
              mask="(99) 99999-9999"
              value={formData.telefone}
              onChange={(e) => onFormChange("telefone", e.target.value)}
            />
          ),
        }}
      />

      <TextField
        margin="dense"
        label="Área de Atuação"
        fullWidth
        value={formData.area}
        onChange={(e) => onFormChange("area", e.target.value)}
      />

      <TextField
        margin="dense"
        label="Estado"
        fullWidth
        value={formData.estado}
        onChange={(e) => onFormChange("estado", e.target.value)}
      />

      <TextField
        margin="dense"
        label="Cidade"
        fullWidth
        value={formData.cidade}
        onChange={(e) => onFormChange("cidade", e.target.value)}
      />

      <TextField
        margin="dense"
        label="Link"
        fullWidth
        value={formData.link}
        onChange={(e) => onFormChange("link", e.target.value)}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onSave} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Salvar"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default SupplierForm;
