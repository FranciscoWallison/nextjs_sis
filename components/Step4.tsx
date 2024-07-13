// src/components/Step4.tsx
import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Paper,
} from "@mui/material";
import { FormContext } from "@/contexts/FormContext";

const Step4: React.FC<{ handleNext: () => void; handleBack: () => void }> = ({
  handleNext,
  handleBack,
}) => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("FormContext must be used within a FormProvider");
  }

  const { formData, setFormData } = context;
  const [fillNow, setFillNow] = useState<"yes" | "no">("no");

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFillNow((e.target as HTMLInputElement).value as "yes" | "no");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("=======handleFormChange============");
    console.log(e.target.name, e.target.value);
    console.log("====================================");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const maintenanceQuestions = [
    { name: "sauna_umida", label: "Saúna úmida - data da última drenagem?" },
    {
      name: "grupo_gerador",
      label: "Grupo gerador - data da última checagem do nível do óleo?",
    },
    {
      name: "grupo_gerador",
      label: "Grupo gerador - último teste de funcionamento?",
    },
    {
      name: "sistema_seguranca",
      label: "Iluminação de emergência - último teste de funcionamento?",
    },
    {
      name: "banheira_hidromassagem",
      label: "Banheira de hidromassagem - último teste de funcionamento?",
    },
  ];

  const trueAttributes = Object.keys(formData).filter(
    (key) => formData[key] === true
  );

  const filteredQuestions = maintenanceQuestions.filter((question) =>
    trueAttributes.includes(question.name)
  );

  return (
    <Box>
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">
        Parabéns! Você avançou mais uma etapa. Você ainda não preencheu as datas
        das últimas manutenções, precisamos delas para gerar sua gestão de
        manutenções. Deseja preencher agora?{" "}
      </Typography>{" "}
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">
        {" "}
        Se você não preencher agora, o sistema irá gerar alertas para os itens
        prioritários.
      </Typography>
      <RadioGroup value={fillNow} onChange={handleRadioChange}>
        <FormControlLabel
          value="yes"
          control={<Radio />}
          label="Sim, cadastrar agora"
        />
        <FormControlLabel
          value="no"
          control={<Radio />}
          label="Não, irei cadastrar no futuro"
        />
      </RadioGroup>
      {fillNow === "yes" && (
        <Paper
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {filteredQuestions.map((question, index) => (
            <Box key={index}>
              <Typography sx={{ mt: 3, mb: 2 }} component="h5" variant="h6">
                {question.label}
              </Typography>
              <TextField
                label="Data"
                name={`${question.name}_date`}
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData[`${question.name}_date`] || ""}
                onChange={handleFormChange}
                fullWidth
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={
                  <RadioGroup
                    row
                    name={question.name}
                    value={formData[question.name] || ""}
                    onChange={handleFormChange}
                  >
                    <FormControlLabel
                      value="nao_feito"
                      control={<Radio />}
                      label="Não foi feito"
                    />
                    <FormControlLabel
                      value="nao_lembro"
                      control={<Radio />}
                      label="Não lembro"
                    />
                  </RadioGroup>
                }
                label=""
              />
            </Box>
          ))}
        </Paper>
      )}
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

export default Step4;
