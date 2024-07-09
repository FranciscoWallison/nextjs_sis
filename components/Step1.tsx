// src/components/Step1.tsx
import React, { useContext } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { FormContext } from '../contexts/FormContext';

const Step1: React.FC<{ handleNext: () => void }> = ({ handleNext }) => {
  const { formData, setFormData } = useContext(FormContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, sindicoName: e.target.value });
  };

  return (
    <Box>
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">Olá, Síndico! Seja bem-vindo ao GMP+.</Typography>
      <TextField
        label="Nome do Síndico"
        value={formData.sindicoName || ''}
        onChange={handleChange}
        fullWidth
      />
      <Button variant="contained" onClick={handleNext} sx={{ mt: 2 }}>
        Continuar
      </Button>
    </Box>
  );
};

export default Step1;
