// src/components/Step2.tsx
import React, { useContext } from 'react';
import { Box, Button, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { FormContext } from '../contexts/FormContext';

const Step2: React.FC<{ handleNext: () => void; handleBack: () => void }> = ({ handleNext, handleBack }) => {
  const { formData, setFormData } = useContext(FormContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  return (
    <Box>
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">
        Olá, {formData.sindicoName}! Precisamos que você preencha as informações iniciais referente ao prédio.
      </Typography>
      <TextField
        label="Nome do Prédio"
        name="buildingName"
        value={formData.buildingName || ''}
        onChange={handleChange}
        fullWidth
        sx={{ mt: 2 }}
      />
      <TextField
        label="Endereço"
        name="address"
        value={formData.address || ''}
        onChange={handleChange}
        fullWidth
        sx={{ mt: 2 }}
      />
      <TextField
        label="Idade do Prédio"
        name="buildingAge"
        value={formData.buildingAge || ''}
        onChange={handleChange}
        fullWidth
        sx={{ mt: 2 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.hasElevator || false}
            onChange={handleCheckboxChange}
            name="hasElevator"
          />
        }
        label="Possui Elevadores?"
      />
      {formData.hasElevator && (
        <TextField
          label="Quantos?"
          name="elevatorCount"
          value={formData.elevatorCount || ''}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
        />
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
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
