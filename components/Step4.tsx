import React, { useContext } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FormContext } from "@/contexts/FormContext";
import { salvarNovo } from "@/services/firebaseService";
import {
  Building,
  SelectQuestions,
  Activity,
  Category,
  PrimeiroAcesso,
} from "@/interface/Questions";
import HelpQuestions from "@/utils/HelpQuestions";


const Step4: React.FC<{ handleNext: () => void; handleBack: () => void }> = ({
  handleNext,
  handleBack,
}) => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("FormContext must be used within a FormProvider");
  }

  const { formData, setFormData } = context;
  const router = useRouter();

  const handleRedirect = async () => {
    console.log("====================================");
    console.log(formData);
    console.log("====================================");

    if (await salvarNovo(formData)) {
      router.push("/");
    } else {
      // modal de aviso de erro
    }
  };

  return (
    <Box>
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">
        Parabéns! Você cadastrou o seu condomínio, e todas as manutenções selecionadas já estão cadastradas.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="contained" onClick={handleBack}>
          Voltar
        </Button>

        <Button variant="contained" onClick={handleRedirect} sx={{ mt: 2 }}>
          Seguir para o Painel Principal
        </Button>
      </Box>
    </Box>
  );
};

export default Step4;
