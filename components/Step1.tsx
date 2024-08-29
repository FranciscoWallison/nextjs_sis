// src/components/Step1.tsx
import React, { useContext, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { FormContext } from "@/contexts/FormContext";

const Step1: React.FC<{ handleNext: () => void }> = ({ handleNext }) => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("FormContext must be used within a FormProvider");
  }

  const { formData, setFormData } = context;
  
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, firstName: e.target.value });
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, lastName: e.target.value });
  };

  const handleNextStep = () => {
    if (!formData.firstName) {
      setFirstNameError(true);
    } else {
      setFirstNameError(false);
    }

    if (!formData.lastName) {
      setLastNameError(true);
    } else {
      setLastNameError(false);
    }

    if (formData.firstName && formData.lastName) {
      handleNext();
    }
  };

  return (
    <Box>
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">
        Olá, Síndico! Seja bem-vindo ao GMP+.
      </Typography>
      <TextField
        label="Nome"
        value={formData.firstName || ""}
        onChange={handleFirstNameChange}
        fullWidth
        required
        error={firstNameError}
        helperText={firstNameError ? "Nome é obrigatório" : ""}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Sobrenome"
        value={formData.lastName || ""}
        onChange={handleLastNameChange}
        fullWidth
        required
        error={lastNameError}
        helperText={lastNameError ? "Sobrenome é obrigatório" : ""}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleNextStep} sx={{ mt: 2 }}>
        Continuar
      </Button>
    </Box>
  );
};

export default Step1;
