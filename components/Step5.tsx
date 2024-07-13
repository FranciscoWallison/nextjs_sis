// src/components/Step5.tsx
import React, { useContext, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FormContext } from "@/contexts/FormContext";
import { salvarNovo } from "@/services/firebaseService";

const Step5: React.FC = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("FormContext must be used within a FormProvider");
  }

  const { formData, setFormData } = context;
  const router = useRouter();

  const handleRedirect = async () => {
    await salvarNovo(formData);

    if (await salvarNovo(formData)) {
      router.push("/");
    } else {
      // modal de aviso de erro
    }
  };

  return (
    <Box>
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">
        Parabéns! Você cadastrou o seu prédio, e todas as manutenções
        obrigatórias já estão cadastradas.
      </Typography>
      <Button variant="contained" onClick={handleRedirect} sx={{ mt: 2 }}>
        Seguir para o Painel Principal
      </Button>
    </Box>
  );
};

export default Step5;
