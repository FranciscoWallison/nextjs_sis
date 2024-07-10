// src/components/Step5.tsx
import React, { useContext, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FormContext } from "@/contexts/FormContext";
import AuthStorage from "@/utils/AuthStorage";
import { pegarTodos, salvarNovo } from "@/services/firebaseService";

const Step5: React.FC = () => {
  const { formData, setFormData } = useContext(FormContext);
  const router = useRouter();

  const handleRedirect = async () => {
    // TODO:: salvar as informações
    // router.push("/");


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
