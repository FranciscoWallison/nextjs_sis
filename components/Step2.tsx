import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { FormContext } from "../contexts/FormContext";

const Step2: React.FC<{ handleNext: () => void; handleBack: () => void }> = ({
  handleNext,
  handleBack,
}) => {
  const context = useContext(FormContext);
  const [loadingCEP, setLoadingCEP] = useState(false);

  if (!context) {
    throw new Error("FormContext must be used within a FormProvider");
  }

  const { formData, setFormData } = context;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCEPBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (cep.length === 8) {
      setLoadingCEP(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setFormData({
            ...formData,
            cep: data.cep,
            address: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf,
          });
        } else {
          alert("CEP não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
      } finally {
        setLoadingCEP(false);
      }
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0]; // Data atual no formato YYYY-MM-DD

    if (selectedDate > today) {
      alert("A data de entrega não pode ser no futuro.");
    } else {
      setFormData({ ...formData, [e.target.name]: selectedDate });
    }
  };

  return (
    <Box>
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">
        Olá, {formData.sindicoName}! Precisamos que você preencha as informações
        iniciais referentes ao condomínio.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nome do Condomínio"
            name="buildingName"
            value={formData.buildingName || ""}
            onChange={handleChange}
            fullWidth
            sx={{ mt: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Data de Entrega"
            name="buildingAge"
            type="date"
            value={formData.buildingAge || ""}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              max: new Date().toISOString().split("T")[0], // Define a data máxima como hoje
            }}
            sx={{ mt: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="CNPJ"
            name="cnpj"
            value={formData.cnpj || ""}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mt: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="CEP"
            name="cep"
            value={formData.cep || ""}
            onChange={handleChange}
            onBlur={handleCEPBlur}
            fullWidth
            required
            sx={{ mt: 2 }}
            disabled={loadingCEP}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Rua/Endereço"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mt: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Bairro"
            name="bairro"
            value={formData.bairro || ""}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mt: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Cidade"
            name="cidade"
            value={formData.cidade || ""}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mt: 2 }}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="contained" onClick={handleBack}>
          Voltar
        </Button>
        <Button variant="contained" onClick={handleNext}>
          Continuar
        </Button>
      </Box>
    </Box>
  );
};

export default Step2;
