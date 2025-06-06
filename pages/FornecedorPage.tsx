import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  fetchSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  Supplier,
} from "@/services/firebaseService"; // Funções CRUD do Firebase
import SupplierForm from "@/components/SupplierForm";
import MainLayout from "@/components/layout/MainLayout";
import withAuth from "@/hoc/withAuth";

const FornecedorPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchParams, setSearchParams] = useState({
    area: "",
    state: "",
    city: "",
  });
  const [openForm, setOpenForm] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    area: "",
    estado: "",
    cidade: "",
    link: "",
  });

  useEffect(() => {
    const loadSuppliers = async () => {
      const suppliersList = await fetchSuppliers();
      setSuppliers(suppliersList || []);
      setFilteredSuppliers(suppliersList || []);
    };
    loadSuppliers();
  }, []);

  const handleSearch = () => {
    const filtered = suppliers.filter((supplier) => {
      return (
        (!searchParams.area || supplier.area === searchParams.area) &&
        (!searchParams.state || supplier.estado === searchParams.state) &&
        (!searchParams.city || supplier.cidade === searchParams.city)
      );
    });
    setFilteredSuppliers(filtered);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSupplier = async () => {
    setLoading(true);
    try {
      if (currentSupplier) {
        await updateSupplier(currentSupplier.id, formData);
      } else {
        await addSupplier(formData);
      }
      setOpenForm(false);
      const updatedSuppliers = await fetchSuppliers();
      setSuppliers(updatedSuppliers || []);
      setFilteredSuppliers(updatedSuppliers || []);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setFormData(supplier);
    setOpenForm(true);
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    await deleteSupplier(supplierId);
    const updatedSuppliers = await fetchSuppliers();
    setSuppliers(updatedSuppliers || []);
    setFilteredSuppliers(updatedSuppliers || []);
  };

  return (
    <MainLayout title="Fornecedores">
      <Container>
        <Typography variant="h4">Gestão de Fornecedores</Typography>

        {/* Filtros */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" }, // Alinha em coluna para telas pequenas e em linha para telas maiores
            gap: 2, // Espaçamento entre os elementos
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Área de Atuação"
                value={searchParams.area}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, area: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Estado"
                value={searchParams.state}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, state: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cidade"
                value={searchParams.city}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, city: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm="auto">
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                sx={{ height: "100%" }} // Ajusta a altura para se alinhar com os campos de entrada
              >
                Buscar
              </Button>
            </Grid>
            <Grid item xs={12} sm="auto">
              <Button
                fullWidth
                sx={{ height: "100%" }}
                variant="contained"
                onClick={() => {
                  setFormData({
                    nome: "",
                    cnpj: "",
                    email: "",
                    telefone: "",
                    area: "",
                    estado: "",
                    cidade: "",
                    link: "",
                  }); // Limpa os dados do formulário
                  setCurrentSupplier(null); // Garante que não seja um fornecedor existente
                  setOpenForm(true); // Abre o modal
                }}
              >
                Adicionar Fornecedor
              </Button>

            </Grid>
          </Grid>
        </Box>
        {/* Lista de Fornecedores */}
        {/* Lista de Fornecedores */}
        {filteredSuppliers.map((supplier) => (
          <Card
            key={supplier.id}
            sx={{
              marginTop: "1em",
              borderRadius: "8px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              padding: "1em",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                {/* Nome e Área de Atuação */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" component="div">
                    {supplier.nome}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Área: {supplier.area}
                  </Typography>
                </Grid>
                {/* Telefone e Ações */}
                <Grid item xs={12} sm={6} container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Telefone: {supplier.telefone}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      href={`https://wa.me/${supplier.telefone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        marginTop: "0.5em",
                        textTransform: "none",
                      }}
                    >
                      Abrir no WhatsApp
                    </Button>
                  </Grid>
                  {/* Botões de Ação */}
                  <Grid item xs={12} sm={6} container justifyContent="flex-end" spacing={1}>
                    <Grid item>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditSupplier(supplier)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteSupplier(supplier.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}



        <SupplierForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSave={handleSaveSupplier}
          formData={formData}
          onFormChange={handleFormChange}
          loading={loading}
        />
      </Container>
    </MainLayout>
  );
};
export default withAuth(FornecedorPage);
