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
    if (await salvarNovo(formData)) {
      router.push("/ManutencoesDashboard");
    } else {
      // modal de aviso de erro
    }
  };

  return (
    <Box sx={{ padding: { xs: 2, sm: 4 }, maxWidth: "800px", margin: "0 auto" }}>
      <Typography
        component="h1"
        sx={{ mt: 2, mb: 4 }}
        variant="h6"
        textAlign="center"
      >
        🎉 Parabéns! Você cadastrou o seu condomínio, e todas as manutenções selecionadas já estão cadastradas.
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 4,
          gap: 2, // Adiciona espaçamento entre os botões
          flexDirection: { xs: "column", sm: "row" }, // Empilha no mobile e alinha horizontalmente no desktop
        }}
      >
        <Button
          fullWidth  // Define fullWidth como true para comportamento padrão
          sx={{ width: { xs: "100%", sm: "auto" } }}  // Controla a largura responsivamente
          variant="contained"
          onClick={handleBack}
        >
          Voltar
        </Button>

        <Button
          fullWidth
          sx={{ width: { xs: "100%", sm: "auto" } }}  // Controla a largura responsivamente
          variant="contained"
          onClick={handleRedirect}
          sx={{
            backgroundColor: "green",
            ":hover": { backgroundColor: "darkgreen" },
          }}
        >
          Seguir para o Painel Principal
        </Button>

      </Box>

    </Box>

  );
};

export default Step4;
