import React, { useContext, useState, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // Import do DatePicker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"; // Import de LocalizationProvider
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Import do adaptador para Dayjs
import dayjs, { Dayjs } from "dayjs"; // Utilizando dayjs para formatação de datas
import "dayjs/locale/pt-br"; // Importa o idioma português para o dayjs
dayjs.locale("pt-br"); // Define o idioma padrão como português
import InputMask from "react-input-mask";
import { FormContext } from "../contexts/FormContext";

const Step2: React.FC<{ handleNext: () => void; handleBack: () => void }> = ({
  handleNext,
  handleBack,
}) => {
  const context = useContext(FormContext);
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

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

  const handleDateChange = (newDate: Dayjs | null) => {
    const today = dayjs(); // Data atual

    if (newDate && newDate.isAfter(today)) {
      setErrors((prev) => ({ ...prev, buildingAge: true })); // Definir erro se a data for no futuro
    } else {
      setSelectedDate(newDate);
      setErrors((prev) => ({ ...prev, buildingAge: false })); // Remover erro se a data for válida

      if (newDate) {
        setFormData({ ...formData, buildingAge: newDate.format("YYYY-MM-DD") });
      }
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ padding: { xs: 2, sm: 4 }, maxWidth: "800px", margin: "0 auto" }}>
        <Typography component="h1" sx={{ mt: 2, mb: 4 }} variant="h6" textAlign="center">
          Olá, {formData.lastName}! Precisamos que você preencha as informações
          iniciais referentes ao condomínio.
        </Typography>

        <Grid container spacing={3}>
          {/* Nome do Condomínio */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nome do Condomínio"
              name="buildingName"
              value={formData.buildingName || ""}
              onChange={handleChange}
              fullWidth
              required
              error={errors.buildingName}
              helperText={errors.buildingName ? "Nome do condomínio é obrigatório" : ""}
            />
          </Grid>

          {/* Data de Entrega */}
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Data de Entrega"
              value={selectedDate}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: errors.buildingAge,
                  helperText: errors.buildingAge
                    ? "Data de entrega é obrigatória e não pode ser no futuro"
                    : "",
                },
              }}
            />
          </Grid>

          {/* CNPJ */}
          <Grid item xs={12} sm={6}>
            <InputMask
              mask="99.999.999/9999-99"
              value={formData.cnpj || ""}
              onChange={handleChange}
            >
              <TextField
                label="CNPJ"
                name="cnpj"
                fullWidth
              />
            </InputMask>
          </Grid>

          {/* CEP */}
          <Grid item xs={12} sm={6}>
            <InputMask
              mask="99999-999"
              value={formData.cep || ""}
              onChange={handleChange}
              onBlur={handleCEPBlur}
            >
              <TextField
                label="CEP"
                name="cep"
                fullWidth
                required
                error={errors.cep}
                helperText={errors.cep ? "CEP é obrigatório" : ""}
                InputProps={{
                  endAdornment: loadingCEP ? <CircularProgress size={20} /> : null,
                }}
              />
            </InputMask>
          </Grid>

          {/* Endereço */}
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
            />
          </Grid>

          {/* Bairro */}
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
            />
          </Grid>

          {/* Cidade */}
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
            />
          </Grid>
        </Grid>

        {/* Botões de Navegação */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button variant="contained" onClick={handleBack}>
            Voltar
          </Button>
          <Button variant="contained" onClick={handleNextStep}>
            Continuar
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>

  );
};

export default Step2;
