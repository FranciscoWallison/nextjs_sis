import React, { useContext, useState, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import InputMask from "react-input-mask";
import { FormContext } from "../contexts/FormContext";

const Step2: React.FC<{ handleNext: () => void; handleBack: () => void }> = ({
  handleNext,
  handleBack,
}) => {
  const context = useContext(FormContext);
  const [loadingCEP, setLoadingCEP] = useState(false);

  // Estados de erro para cada campo
  const [errors, setErrors] = useState({
    buildingName: false,
    buildingAge: false,
    cep: false,
    address: false,
    bairro: false,
    cidade: false,
  });

  if (!context) {
    throw new Error("FormContext must be used within a FormProvider");
  }

  const { formData, setFormData } = context;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCEPBlur = useCallback(
    async (e: React.FocusEvent<HTMLInputElement>) => {
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
            setErrors((prev) => ({ ...prev, cep: false }));
          } else {
            alert("CEP não encontrado.");
            setErrors((prev) => ({ ...prev, cep: true }));
          }
        } catch (error) {
          console.error("Erro ao buscar o CEP:", error);
          setErrors((prev) => ({ ...prev, cep: true }));
        } finally {
          setLoadingCEP(false);
        }
      }
    },
    [formData, setFormData]
  );

  // Função para converter de YYYY-MM-DD para DD/MM/YYYY
  const formatDateToDisplay = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  // Função para converter de DD/MM/YYYY para YYYY-MM-DD
  const formatDateToISO = (date: string) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value; // Formato YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0]; // Data atual no formato YYYY-MM-DD

    if (selectedDate > today) {
      setErrors((prev) => ({ ...prev, buildingAge: true }));
    } else {
      setFormData({ ...formData, buildingAge: selectedDate });
      setErrors((prev) => ({ ...prev, buildingAge: false }));
    }
  };

  const handleNextStep = () => {
    // Verificação dos campos obrigatórios
    setErrors({
      buildingName: !formData.buildingName,
      buildingAge: !formData.buildingAge,
      cep: !formData.cep,
      address: !formData.address,
      bairro: !formData.bairro,
      cidade: !formData.cidade,
    });

    const isValid =
      formData.buildingName &&
      formData.buildingAge &&
      formData.cep &&
      formData.address &&
      formData.bairro &&
      formData.cidade;

    if (isValid) {
      handleNext();
    }
  };

  return (
    <Box>
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">
        Olá, {formData.lastName}! Precisamos que você preencha as informações
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
            required
            error={errors.buildingName}
            helperText={
              errors.buildingName ? "Nome do condomínio é obrigatório" : ""
            }
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
            required
            error={errors.buildingAge}
            helperText={
              errors.buildingAge
                ? "Data de entrega é obrigatória e não pode ser no futuro"
                : ""
            }
            sx={{ mt: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputMask
            mask="99.999.999/9999-99"
            value={formData.cnpj || ""}
            onChange={handleChange}
            disabled={loadingCEP}
          >
            {/* @ts-ignore */}
            {(inputProps) => (
              <TextField
                {...inputProps}
                label="CNPJ"
                name="cnpj"
                fullWidth
                sx={{ mt: 2 }}
                inputProps={{
                  ...inputProps.inputProps,
                }}
              />
            )}
          </InputMask>
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputMask
            mask="99999-999"
            value={formData.cep || ""}
            onChange={handleChange}
            onBlur={handleCEPBlur}
            disabled={loadingCEP}
          >
            {/* @ts-ignore */}
            {(inputProps) => (
              <TextField
                {...inputProps}
                label="CEP"
                name="cep"
                fullWidth
                required
                error={errors.cep}
                helperText={errors.cep ? "CEP é obrigatório" : ""}
                sx={{ mt: 2 }}
                InputProps={{
                  endAdornment: loadingCEP ? (
                    <CircularProgress size={20} />
                  ) : null,
                  ...inputProps.inputProps,
                }}
              />
            )}
          </InputMask>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Rua/Endereço"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            fullWidth
            required
            error={errors.address}
            helperText={errors.address ? "Endereço é obrigatório" : ""}
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
            error={errors.bairro}
            helperText={errors.bairro ? "Bairro é obrigatório" : ""}
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
            error={errors.cidade}
            helperText={errors.cidade ? "Cidade é obrigatória" : ""}
            sx={{ mt: 2 }}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="contained" onClick={handleBack}>
          Voltar
        </Button>
        <Button variant="contained" onClick={handleNextStep}>
          Continuar
        </Button>
      </Box>
    </Box>
  );
};

export default Step2;
